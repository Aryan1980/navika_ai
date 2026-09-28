"""Predictive Marine Trajectory Engine.

Calculates dead-reckoning vessel track combined with physical wind leeway drift,
evaluating forward intersection and proximity to maritime boundaries (IMBL)
and restricted zones over configurable time horizons.
"""
import math
from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field

from app.schemas.marine import Coordinates
from app.geo.calculations import haversine_distance, calculate_bearing, destination_point, point_to_segment_distance
from app.geo.geofence import is_point_in_polygon, distance_to_polygon, segments_intersect
from app.geo.boundaries import IMBL_BOUNDARIES, MARINE_PROTECTED_AREAS, RESTRICTED_ZONES

class TrajectoryWaypoint(BaseModel):
    time_min: float = Field(..., description="Minutes from trajectory start")
    latitude: float
    longitude: float
    ground_speed_knots: float
    course_deg: float
    distance_traveled_km: float

class TrajectoryPrediction(BaseModel):
    origin: Coordinates
    boat_speed_knots: float
    heading_deg: float
    time_horizon_min: float
    wind_leeway_applied: bool
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    waypoints: List[TrajectoryWaypoint]
    closest_boundary_name: str
    min_distance_to_boundary_km: float
    is_approaching: bool
    is_crossing: bool
    estimated_time_to_boundary_min: Optional[float] = None
    trajectory_risk_score: float = Field(..., description="Normalized risk contribution between 0.0 and 1.0")
    warning_message: str
    model_disclaimer: str = "MODEL PREDICTION: Based on nautical dead reckoning and physical surface wind leeway. Not a substitute for onboard radar and watchkeeping."


class PredictiveTrajectoryEngine:
    """Simulates vessel forward motion with environmental drift and restricted boundary intersection."""

    @staticmethod
    def predict_trajectory(
        origin: Coordinates,
        boat_speed_knots: float,
        heading_deg: float,
        time_horizon_min: float = 60.0,
        wind_speed_kmh: Optional[float] = None,
        wind_direction_deg: Optional[float] = None,
        time_step_min: float = 5.0
    ) -> TrajectoryPrediction:
        """Projects forward vessel track and computes boundary risk."""
        lat = origin.latitude
        lon = origin.longitude
        speed_kts = max(0.0, float(boat_speed_knots))
        heading = float(heading_deg) % 360.0

        # 1. Boat forward velocity vector (in knots)
        # x = East, y = North
        v_bx = speed_kts * math.sin(math.radians(heading))
        v_by = speed_kts * math.cos(math.radians(heading))

        # 2. Environmental wind leeway drift (if wind available)
        # Maritime standard: Leeway drift speed is typically ~2.0% - 3.0% of surface wind
        # Direction is pushed downwind (towards wind_dir + 180)
        v_lx = 0.0
        v_ly = 0.0
        leeway_applied = False

        if wind_speed_kmh is not None and wind_speed_kmh > 3.0 and wind_direction_deg is not None:
            leeway_applied = True
            downwind_deg = (float(wind_direction_deg) + 180.0) % 360.0
            leeway_speed_kts = (float(wind_speed_kmh) / 1.852) * 0.025
            v_lx = leeway_speed_kts * math.sin(math.radians(downwind_deg))
            v_ly = leeway_speed_kts * math.cos(math.radians(downwind_deg))

        # Combined ground velocity vector
        v_gx = v_bx + v_lx
        v_gy = v_by + v_ly
        ground_speed_kts = round(math.sqrt(v_gx**2 + v_gy**2), 2)
        ground_course = round((math.degrees(math.atan2(v_gx, v_gy)) + 360.0) % 360.0, 1)

        # 3. Generate waypoints
        waypoints: List[TrajectoryWaypoint] = []
        cur_lat = lat
        cur_lon = lon
        cum_dist = 0.0

        waypoints.append(TrajectoryWaypoint(
            time_min=0.0,
            latitude=round(cur_lat, 5),
            longitude=round(cur_lon, 5),
            ground_speed_knots=ground_speed_kts,
            course_deg=ground_course,
            distance_traveled_km=0.0
        ))

        steps = max(1, int(time_horizon_min / time_step_min))
        # Distance per step in km: speed_kts * 1.852 km/hr * (time_step_min / 60 hr)
        step_dist_km = (ground_speed_kts * 1.852) * (time_step_min / 60.0)

        for i in range(1, steps + 1):
            if step_dist_km > 0.001:
                cur_lat, cur_lon = destination_point(cur_lat, cur_lon, step_dist_km, ground_course)
            cum_dist += step_dist_km
            waypoints.append(TrajectoryWaypoint(
                time_min=round(i * time_step_min, 1),
                latitude=round(cur_lat, 5),
                longitude=round(cur_lon, 5),
                ground_speed_knots=ground_speed_kts,
                course_deg=ground_course,
                distance_traveled_km=round(cum_dist, 2)
            ))

        # 4. Check boundaries for intersection and closest approach
        min_boundary_dist = float("inf")
        closest_b_name = "Open Ocean"
        is_approaching = False
        is_crossing = False
        eta_to_boundary: Optional[float] = None

        # Collect candidate boundaries: IMBL, MPAs, Restricted Zones
        all_boundaries = []
        for b in IMBL_BOUNDARIES:
            all_boundaries.append({"name": b["name"], "points": b["coordinates"], "type": "IMBL"})
        for m in MARINE_PROTECTED_AREAS:
            all_boundaries.append({"name": m["name"], "points": m["polygon"], "type": "MPA"})
        for r in RESTRICTED_ZONES:
            all_boundaries.append({"name": r["name"], "points": r["polygon"], "type": "RESTRICTED"})

        # Check waypoint proximity and segment intersections
        for boundary in all_boundaries:
            b_points = boundary["points"]
            b_name = boundary["name"]
            is_poly = boundary["type"] in ["MPA", "RESTRICTED"]

            # Check distance from each predicted waypoint
            for wp in waypoints:
                if is_poly:
                    dist = distance_to_polygon(wp.latitude, wp.longitude, b_points)
                else:
                    # Line segment chain (IMBL)
                    dists = []
                    for k in range(len(b_points) - 1):
                        p1 = b_points[k]
                        p2 = b_points[k + 1]
                        dists.append(point_to_segment_distance(wp.latitude, wp.longitude, p1[0], p1[1], p2[0], p2[1]))
                    dist = min(dists) if dists else 999.0

                if dist < min_boundary_dist:
                    min_boundary_dist = dist
                    closest_b_name = b_name

            # Check segment intersection between successive waypoints and boundary segments
            num_b_segs = len(b_points) if is_poly else (len(b_points) - 1)
            for w_idx in range(len(waypoints) - 1):
                w1 = (waypoints[w_idx].latitude, waypoints[w_idx].longitude)
                w2 = (waypoints[w_idx + 1].latitude, waypoints[w_idx + 1].longitude)

                for b_idx in range(num_b_segs):
                    bp1 = b_points[b_idx]
                    bp2 = b_points[(b_idx + 1) % len(b_points)] if is_poly else b_points[b_idx + 1]
                    q1 = (bp1[0], bp1[1])
                    q2 = (bp2[0], bp2[1])

                    if segments_intersect(w1, w2, q1, q2):
                        is_crossing = True
                        if eta_to_boundary is None:
                            eta_to_boundary = round(waypoints[w_idx].time_min + time_step_min * 0.5, 1)
                        closest_b_name = b_name
                        break
                if is_crossing and eta_to_boundary is not None:
                    break

        # Approach thresholds: < 15 km is approaching, < 5 km is critical approach
        if min_boundary_dist <= 15.0:
            is_approaching = True
            if eta_to_boundary is None and ground_speed_kts > 0.5:
                # Approximate ETA to reach 5 km critical line
                dist_to_crit = max(0.0, min_boundary_dist - 5.0)
                speed_kmh = ground_speed_kts * 1.852
                eta_to_boundary = round((dist_to_crit / speed_kmh) * 60.0, 1) if speed_kmh > 0 else None

        # 5. Normalized Risk Score (0.0 to 1.0)
        if is_crossing or min_boundary_dist <= 2.0:
            trajectory_risk = 1.0
        elif min_boundary_dist <= 5.0:
            trajectory_risk = round(0.70 + 0.30 * ((5.0 - min_boundary_dist) / 3.0), 2)
        elif min_boundary_dist <= 15.0:
            trajectory_risk = round(0.30 + 0.40 * ((15.0 - min_boundary_dist) / 10.0), 2)
        elif min_boundary_dist <= 30.0:
            trajectory_risk = round(0.10 + 0.20 * ((30.0 - min_boundary_dist) / 15.0), 2)
        else:
            trajectory_risk = 0.05

        # 6. Craft synthesized warning message
        if is_crossing:
            warning_msg = f"Projected trajectory will INTERSECT restricted perimeter ({closest_b_name}) in approximately {int(eta_to_boundary or 15)} minutes. Alter course immediately."
        elif is_approaching:
            eta_str = f"in approximately {int(eta_to_boundary)} minutes" if eta_to_boundary and eta_to_boundary > 0 else "at closest point of approach"
            warning_msg = f"Projected trajectory may approach restricted zone ({closest_b_name}) {eta_str}. Minimum clearance: {round(min_boundary_dist, 1)} km."
        else:
            warning_msg = f"Projected trajectory maintains safe navigation clearance ({round(min_boundary_dist, 1)} km to nearest boundary: {closest_b_name})."

        return TrajectoryPrediction(
            origin=origin,
            boat_speed_knots=speed_kts,
            heading_deg=heading,
            time_horizon_min=time_horizon_min,
            wind_leeway_applied=leeway_applied,
            wind_speed_kmh=wind_speed_kmh,
            wind_direction_deg=wind_direction_deg,
            waypoints=waypoints,
            closest_boundary_name=closest_b_name,
            min_distance_to_boundary_km=round(min_boundary_dist, 2),
            is_approaching=is_approaching,
            is_crossing=is_crossing,
            estimated_time_to_boundary_min=eta_to_boundary,
            trajectory_risk_score=trajectory_risk,
            warning_message=warning_msg
        )
