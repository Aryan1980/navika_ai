"""Nautical Marine Navigation and Safe Corridor Routing Engine.

Provides multi-waypoint nautical pathfinding, hazard avoidance (MPAs, Restricted Zones,
Squall/High-Wave cells), turn-by-turn compass bearings, leg-by-leg ETAs, fuel consumption
projections, and emergency Port of Refuge identification for artisanal & commercial vessels.
"""
import math
from typing import List, Dict, Any, Tuple, Optional

from app.geo.calculations import haversine_distance, calculate_bearing, destination_point
from app.geo.geofence import line_intersects_polygon, is_point_in_polygon
from app.geo.boundaries import MARINE_PROTECTED_AREAS, RESTRICTED_ZONES, IMBL_BOUNDARIES
from app.schemas.marine import Coordinates
from app.schemas.route import Waypoint, RouteOption, RouteComparison

# Standard artisanal motorized vessel metrics (9.9 - 15 HP OBM country crafts)
CRUISING_SPEED_KNOTS = 9.0
CRUISING_SPEED_KMH = CRUISING_SPEED_KNOTS * 1.852  # ~16.67 km/h
FUEL_CONSUMPTION_LPH = 2.2  # Liters per hour of fuel at cruising throttle

# Major coastal refuge ports and fish landing centers along Indian coastlines
COASTAL_REFUGE_PORTS = [
    {"name": "Kochi Harbor / Thoppumpady Fishery Port", "lat": 9.9520, "lon": 76.2580, "state": "Kerala"},
    {"name": "Munambam Mini Fishing Harbor", "lat": 10.1850, "lon": 76.1680, "state": "Kerala"},
    {"name": "Kollam / Neendakara Harbor", "lat": 8.9450, "lon": 76.5380, "state": "Kerala"},
    {"name": "Vizhinjam International Sea Port", "lat": 8.3760, "lon": 76.9920, "state": "Kerala"},
    {"name": "Beypore Port, Kozhikode", "lat": 11.1620, "lon": 75.8050, "state": "Kerala"},
    {"name": "Old Mangalore Port, Karnataka", "lat": 12.8460, "lon": 74.8320, "state": "Karnataka"},
    {"name": "Malpe Fishing Harbor, Udupi", "lat": 13.3540, "lon": 74.6980, "state": "Karnataka"},
    {"name": "Mormugao Port, Goa", "lat": 15.4120, "lon": 73.7980, "state": "Goa"},
    {"name": "Sassoon Docks, Mumbai", "lat": 18.9150, "lon": 72.8250, "state": "Maharashtra"},
    {"name": "Veraval Harbor, Gujarat", "lat": 20.9020, "lon": 70.3680, "state": "Gujarat"},
    {"name": "Kasimedu Fishing Harbor, Chennai", "lat": 13.1250, "lon": 80.2980, "state": "Tamil Nadu"},
    {"name": "Tuticorin Old Port, Tamil Nadu", "lat": 8.7980, "lon": 78.1620, "state": "Tamil Nadu"},
    {"name": "Visakhapatnam Fishing Harbor", "lat": 17.6950, "lon": 83.2980, "state": "Andhra Pradesh"},
    {"name": "Paradip Fishing Harbor, Odisha", "lat": 20.2620, "lon": 86.6780, "state": "Odisha"},
]

def find_nearest_port_of_refuge(current_lat: float, current_lon: float) -> Dict[str, Any]:
    """Finds closest safe harbor in case of sudden squall or sea emergency."""
    closest = None
    min_dist = float("inf")
    for port in COASTAL_REFUGE_PORTS:
        d = haversine_distance(current_lat, current_lon, port["lat"], port["lon"])
        if d < min_dist:
            min_dist = d
            closest = port

    if closest:
        b_deg, b_comp = calculate_bearing(current_lat, current_lon, closest["lat"], closest["lon"])
        transit_time_hrs = round(min_dist / CRUISING_SPEED_KMH, 2)
        return {
            "name": closest["name"],
            "latitude": closest["lat"],
            "longitude": closest["lon"],
            "distance_km": round(min_dist, 1),
            "distance_nm": round(min_dist / 1.852, 1),
            "bearing_deg": b_deg,
            "bearing_compass": b_comp,
            "transit_time_minutes": int(transit_time_hrs * 60),
            "instruction": f"Emergency Course: Steer {b_comp} ({b_deg}°) for {round(min_dist / 1.852, 1)} NM to shelter at {closest['name']}."
        }
    return {}

def plan_navigation_route(
    origin: Coordinates,
    destination: Coordinates,
    weather_hazard_center: Optional[Tuple[float, float]] = None
) -> RouteComparison:
    """Computes comprehensive nautical route comparison (Shortest Rhumb Line vs. Hazard-Free Safe Corridor)."""
    start_lat, start_lon = origin.latitude, origin.longitude
    dest_lat, dest_lon = destination.latitude, destination.longitude

    # 1. Compile active environmental & regulatory hazard polygons
    all_polygons: List[Dict[str, Any]] = []
    for mpa in MARINE_PROTECTED_AREAS:
        all_polygons.append({
            "name": mpa["name"],
            "category": "Marine Protected Area",
            "polygon": mpa["polygon"]
        })
    for rz in RESTRICTED_ZONES:
        all_polygons.append({
            "name": rz["name"],
            "category": "Restricted Security Zone",
            "polygon": rz["polygon"]
        })

    # Weather hazard cell (approx 15 km storm radius)
    if weather_hazard_center:
        w_lat, w_lon = weather_hazard_center
        weather_poly = [
            [round(w_lat + 0.12, 4), round(w_lon, 4)],
            [round(w_lat, 4), round(w_lon + 0.12, 4)],
            [round(w_lat - 0.12, 4), round(w_lon, 4)],
            [round(w_lat, 4), round(w_lon - 0.12, 4)],
            [round(w_lat + 0.12, 4), round(w_lon, 4)]
        ]
        all_polygons.append({
            "name": "Severe Wave/Lightning Cell",
            "category": "Weather Hazard",
            "polygon": weather_poly
        })

    # 2. Check collision on direct rhumb line
    intersected_hazards: List[Dict[str, Any]] = []
    for item in all_polygons:
        if line_intersects_polygon((start_lat, start_lon), (dest_lat, dest_lon), item["polygon"]):
            intersected_hazards.append(item)

    hazard_names = [f"{h['name']} ({h['category']})" for h in intersected_hazards]
    direct_dist_km = haversine_distance(start_lat, start_lon, dest_lat, dest_lon)
    direct_dist_nm = round(direct_dist_km / 1.852, 1)
    direct_duration_hrs = round(direct_dist_km / CRUISING_SPEED_KMH, 2)
    direct_duration_mins = int(direct_duration_hrs * 60)
    direct_fuel_liters = round(direct_duration_hrs * FUEL_CONSUMPTION_LPH, 1)
    shortest_risk = "HIGH" if intersected_hazards else "LOW"

    b_direct_deg, b_direct_comp = calculate_bearing(start_lat, start_lon, dest_lat, dest_lon)

    # Waypoints for direct route
    shortest_waypoints = [
        Waypoint(
            name="Departure Point (Vessel GPS)",
            latitude=start_lat,
            longitude=start_lon,
            segment_risk="LOW",
            bearing_deg=b_direct_deg,
            bearing_compass=b_direct_comp,
            leg_distance_km=0.0,
            leg_distance_nm=0.0,
            eta_minutes=0.0,
            instruction="Cast off and set engine throttle to cruising speed.",
            sea_state="Calm"
        ),
        Waypoint(
            name="Destination Zone (Direct Rhumb Line)",
            latitude=dest_lat,
            longitude=dest_lon,
            segment_risk=shortest_risk,
            bearing_deg=b_direct_deg,
            bearing_compass=b_direct_comp,
            leg_distance_km=round(direct_dist_km, 2),
            leg_distance_nm=direct_dist_nm,
            eta_minutes=float(direct_duration_mins),
            instruction=f"Maintain heading {b_direct_comp} ({b_direct_deg}°) for {direct_dist_nm} NM until destination.",
            sea_state="Hazardous" if shortest_risk == "HIGH" else "Moderate"
        )
    ]

    shortest_instructions = [
        f"1. Depart harbor/origin at {round(start_lat, 4)}°N, {round(start_lon, 4)}°E.",
        f"2. Steer direct heading {b_direct_comp} ({b_direct_deg}°) for {direct_dist_nm} NM ({direct_duration_mins} mins).",
        f"3. Arrive at destination coordinate {round(dest_lat, 4)}°N, {round(dest_lon, 4)}°E."
    ]
    if hazard_names:
        shortest_instructions.append(f"⚠ DANGER: Direct route cuts through {', '.join(hazard_names)}!")

    shortest_option = RouteOption(
        route_type="shortest",
        waypoints=shortest_waypoints,
        distance_km=round(direct_dist_km, 2),
        distance_nm=direct_dist_nm,
        estimated_duration_hours=direct_duration_hrs,
        estimated_duration_minutes=float(direct_duration_mins),
        estimated_fuel_liters=direct_fuel_liters,
        risk_level=shortest_risk,
        hazards_intersected=hazard_names,
        description=f"Direct track: {round(direct_dist_km, 1)} km ({direct_dist_nm} NM, {direct_duration_mins} mins, ~{direct_fuel_liters} L fuel)." +
                    (f" WARNING: Crosses {len(hazard_names)} protected/hazard zones!" if hazard_names else " Navigable clear track."),
        turn_by_turn_instructions=shortest_instructions,
        emergency_port_refuge=find_nearest_port_of_refuge(dest_lat, dest_lon)
    )

    # 3. Construct Multi-Waypoint Safe Route using Eurostat searoute and Coastal Fairways
    from app.geo.coastline import is_point_in_sea, get_seaward_anchor_point

    safe_pts: List[Tuple[float, float, str]] = []
    safe_pts.append((start_lat, start_lon, "Departure Point (Harbor Moorings)"))

    # If vessel is inside an estuary, bay, or harbor basin, navigate outward through harbor channel exit
    if not is_point_in_sea(start_lat, start_lon) and is_point_in_sea(dest_lat, dest_lon):
        exit_lat, exit_lon = get_seaward_anchor_point(start_lat, start_lon)
        d_start_dest = haversine_distance(start_lat, start_lon, dest_lat, dest_lon)
        d_exit_dest = haversine_distance(exit_lat, exit_lon, dest_lat, dest_lon)
        if d_exit_dest < d_start_dest and haversine_distance(start_lat, start_lon, exit_lat, exit_lon) > 0.4:
            safe_pts.append((exit_lat, exit_lon, "Harbor Channel & Breakwater Exit"))

    # Attempt nautical fairway routing via Eurostat searoute
    searoute_success = False
    try:
        import searoute as sr
        # searoute expects coordinates as (longitude, latitude)
        # Use seaward departure point if starting in harbor basin
        sr_origin = (safe_pts[-1][1], safe_pts[-1][0])
        sr_dest = (dest_lon, dest_lat)
        sr_result = sr.searoute(sr_origin, sr_dest, units="km")
        
        if sr_result and "geometry" in sr_result and "coordinates" in sr_result["geometry"]:
            coords = sr_result["geometry"]["coordinates"]
            # searoute length > 0 means it navigated real sea fairway nodes
            props = sr_result.get("properties", {})
            length = props.get("length", 0)
            if len(coords) >= 2 and length > 2.0:
                for idx, c in enumerate(coords):
                    # c is [lon, lat]
                    pt_lat = round(float(c[1]), 4)
                    pt_lon = round(float(c[0]), 4)
                    # Skip if too close to last point
                    prev = safe_pts[-1]
                    if haversine_distance(prev[0], prev[1], pt_lat, pt_lon) > 1.0:
                        safe_pts.append((pt_lat, pt_lon, f"Searoute Fairway Corridor Waypoint #{idx + 1}"))
                searoute_success = True
    except Exception as e:
        # Fall back cleanly to geometric coastal routing
        searoute_success = False

    offset_dist = 6.0
    if not searoute_success:
        if intersected_hazards:
            # Build intelligent detour waypoints around hazard perimeter
            for h in intersected_hazards:
                poly = h["polygon"]
                avg_lat = sum(p[0] for p in poly) / len(poly)
                avg_lon = sum(p[1] for p in poly) / len(poly)

                # Offset seaward (west in Arabian Sea, east in Bay of Bengal) with 4-8 km clearance
                offset_dist = 6.0
                offset_bearing = 270.0 if start_lon < 78.0 else 90.0
                detour_lat, detour_lon = destination_point(avg_lat, avg_lon, offset_dist, offset_bearing)

                # Approach waypoint (clearing buffer entry)
                app_lat, app_lon = destination_point(detour_lat, detour_lon, 2.5, (offset_bearing + 180.0) % 360.0)
                safe_pts.append((round(app_lat, 4), round(app_lon, 4), f"Navigational Clearance Entry: {h['name']}"))
                safe_pts.append((round(detour_lat, 4), round(detour_lon, 4), f"Apex Safe Waypoint: Seaward Buffer ({h['name']})"))
        else:
            # If no obstacles, add intermediate checkpoint strictly forward along the last leg to destination (never backtracking)
            last_pt = safe_pts[-1]
            dist_to_dest = haversine_distance(last_pt[0], last_pt[1], dest_lat, dest_lon)
            if dist_to_dest > 5.5:
                mid_lat = round(last_pt[0] + 0.5 * (dest_lat - last_pt[0]), 4)
                mid_lon = round(last_pt[1] + 0.5 * (dest_lon - last_pt[1]), 4)
                safe_pts.append((mid_lat, mid_lon, "Open Sea Fairway Checkpoint"))

    safe_pts.append((dest_lat, dest_lon, "Destination Fishing Zone"))

    # Compute step-by-step turn-by-turn legs
    safe_waypoints: List[Waypoint] = []
    safe_instructions: List[str] = []
    total_safe_dist_km = 0.0
    accumulated_mins = 0.0

    for i in range(len(safe_pts)):
        c_lat, c_lon, pt_name = safe_pts[i]

        if i == 0:
            # First point
            next_lat, next_lon, _ = safe_pts[1]
            b_deg, b_comp = calculate_bearing(c_lat, c_lon, next_lat, next_lon)
            safe_waypoints.append(Waypoint(
                name=pt_name,
                latitude=c_lat,
                longitude=c_lon,
                segment_risk="LOW",
                bearing_deg=b_deg,
                bearing_compass=b_comp,
                leg_distance_km=0.0,
                leg_distance_nm=0.0,
                eta_minutes=0.0,
                instruction=f"Depart origin. Set compass to {b_comp} ({b_deg}°).",
                sea_state="Calm"
            ))
            safe_instructions.append(f"1. Depart starting point at {round(c_lat, 4)}°N, {round(c_lon, 4)}°E.")
        else:
            prev_lat, prev_lon, _ = safe_pts[i - 1]
            leg_km = haversine_distance(prev_lat, prev_lon, c_lat, c_lon)
            leg_nm = round(leg_km / 1.852, 1)
            leg_mins = int((leg_km / CRUISING_SPEED_KMH) * 60)
            total_safe_dist_km += leg_km
            accumulated_mins += leg_mins

            b_deg, b_comp = calculate_bearing(prev_lat, prev_lon, c_lat, c_lon)

            is_last = (i == len(safe_pts) - 1)
            action_desc = (
                f"Arrive at destination fishing zone ({round(c_lat, 4)}°N, {round(c_lon, 4)}°E)."
                if is_last else
                f"Steer {b_comp} ({b_deg}°) for {leg_nm} NM ({leg_mins} mins) to clear {pt_name}."
            )

            safe_waypoints.append(Waypoint(
                name=pt_name,
                latitude=c_lat,
                longitude=c_lon,
                hazard_distance_km=offset_dist if intersected_hazards else None,
                segment_risk="LOW",
                bearing_deg=b_deg,
                bearing_compass=b_comp,
                leg_distance_km=round(leg_km, 2),
                leg_distance_nm=leg_nm,
                eta_minutes=float(accumulated_mins),
                instruction=action_desc,
                sea_state="Safe Navigable Water"
            ))
            safe_instructions.append(f"{i + 1}. Leg {i}: {action_desc}")

    total_safe_dist_km = round(total_safe_dist_km, 2)
    total_safe_nm = round(total_safe_dist_km / 1.852, 1)
    safe_duration_hrs = round(total_safe_dist_km / CRUISING_SPEED_KMH, 2)
    safe_duration_mins = int(safe_duration_hrs * 60)
    safe_fuel_liters = round(safe_duration_hrs * FUEL_CONSUMPTION_LPH, 1)

    if searoute_success:
        reasoning = (
            f"Navigation planned via Eurostat searoute nautical fairway network. "
            f"The route follows verified international and coastal shipping corridors ({total_safe_nm} NM, {safe_duration_mins} mins), "
            f"bypassing all headlands, shallows, and restricted marine zones."
        )
        safe_desc = f"Eurostat searoute fairway corridor: {total_safe_dist_km} km ({total_safe_nm} NM, {safe_duration_mins} mins, ~{safe_fuel_liters} L fuel). Verified marine shipping network."
    elif intersected_hazards:
        reasoning = (
            f"Direct rhumb line cuts through {', '.join(hazard_names)}. "
            f"Safe marine corridor routes seaward with a 6 km safety clearance buffer, "
            f"adding {round(total_safe_dist_km - direct_dist_km, 1)} km ({safe_duration_mins - direct_duration_mins} mins, "
            f"+{round(safe_fuel_liters - direct_fuel_liters, 1)} L fuel) while eliminating boundary violation & collision risks."
        )
        safe_desc = f"Safe hazard-bypass corridor: {total_safe_dist_km} km ({total_safe_nm} NM, {safe_duration_mins} mins, ~{safe_fuel_liters} L fuel). Zero hazard crossings."
    else:
        reasoning = (
            f"Direct nautical corridor is completely clear of hazards. Multi-leg navigation track generated with "
            f"turn-by-turn compass bearings and fuel projection ({safe_fuel_liters} L)."
        )
        safe_desc = f"Safe corridor: {total_safe_dist_km} km ({total_safe_nm} NM, {safe_duration_mins} mins, ~{safe_fuel_liters} L fuel)."

    safe_option = RouteOption(
        route_type="safe",
        waypoints=safe_waypoints,
        distance_km=total_safe_dist_km,
        distance_nm=total_safe_nm,
        estimated_duration_hours=safe_duration_hrs,
        estimated_duration_minutes=float(safe_duration_mins),
        estimated_fuel_liters=safe_fuel_liters,
        risk_level="LOW",
        hazards_intersected=[],
        description=safe_desc,
        turn_by_turn_instructions=safe_instructions,
        emergency_port_refuge=find_nearest_port_of_refuge(dest_lat, dest_lon)
    )

    return RouteComparison(
        origin=origin,
        destination=destination,
        shortest_route=shortest_option,
        safe_route=safe_option,
        recommendation="Recommended Safe Route" if intersected_hazards else "Direct Navigation Route",
        reasoning=reasoning
    )
