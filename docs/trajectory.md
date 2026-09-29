# Predictive Vessel Trajectory Engine

## Overview
Traditional marine decision support tools evaluate static conditions at a single point in space. However, fishing vessels operate dynamically: a vessel currently located in safe waters may cross into an International Maritime Boundary Line (IMBL) or a Marine Protected Area (MPA) within 20 minutes under engine propulsion and surface wind drift.

NavikaAI includes a **Predictive Trajectory Engine** that projects forward vessel tracks and detects boundary crossings before they happen.

---

## Kinematic & Environmental Formulation

The vessel's displacement vector over a time interval $\Delta t$ is composed of:
1. **Engine Propulsion (Dead Reckoning)**:
   $$\vec{d}_{\text{boat}} = v_{\text{boat}} \cdot \Delta t \cdot \begin{bmatrix} \sin(\theta_{\text{heading}}) \\ \cos(\theta_{\text{heading}}) \end{bmatrix}$$

2. **Wind Leeway Drift**:
   In marine navigation, surface winds exert aerodynamic leeway on the vessel's hull and superstructure. Standard oceanographic modeling applies a leeway factor of approximately 2.5% of the surface wind speed in the downwind direction:
   $$\vec{d}_{\text{wind}} = 0.025 \cdot v_{\text{wind}} \cdot \Delta t \cdot \begin{bmatrix} \sin(\theta_{\text{wind}}) \\ \cos(\theta_{\text{wind}}) \end{bmatrix}$$

3. **Composite Ground Track Vector**:
   $$\vec{d}_{\text{ground}} = \vec{d}_{\text{boat}} + \vec{d}_{\text{wind}}$$

### Waypoint Projection
For each time step $\Delta t = 5\text{ minutes}$ over the configured time horizon (default: 60 minutes), the new latitude and longitude are calculated using spherical geodesy:
$$\phi_2 = \arcsin\left(\sin(\phi_1)\cos(d/R) + \cos(\phi_1)\sin(d/R)\cos(\theta)\right)$$
$$\lambda_2 = \lambda_1 + \arctan2\left(\sin(\theta)\sin(d/R)\cos(\phi_1), \; \cos(d/R) - \sin(\phi_1)\sin(\phi_2)\right)$$
where $R = 6371.0\text{ km}$ is Earth's mean radius.

---

## Boundary Intersection Algorithm

For each projected waypoint segment $W_k \to W_{k+1}$:
1. **Proximity Computation**:
   - For line boundaries (IMBL): minimum orthogonal distance from waypoint to each segment using spherical distance:
     $$\text{dist}(P, AB) = \text{point\_to\_segment\_distance}(P, A, B)$$
   - For polygonal boundaries (MPAs, Restricted Zones): ray-casting containment and edge distances.
2. **Segment Intersection**:
   Successive waypoint tracks $(W_k, W_{k+1})$ are tested for geometric intersection with boundary segments $(B_m, B_{m+1})$ using orientation tests:
   $$\text{ccw}(A, B, C) = (C_y - A_y)(B_x - A_x) > (B_y - A_y)(C_x - A_x)$$
3. **Estimated Time to Boundary ($\text{ETA}$)**:
   If an intersection is detected, the engine estimates the exact crossing time:
   $$\text{ETA}_{\text{boundary}} = t_k + \frac{\Delta t}{2}$$

---

## API Usage

### Endpoint: `POST /api/trajectory/predict`

```json
{
  "latitude": 9.9312,
  "longitude": 76.2673,
  "boat_speed_knots": 12.0,
  "heading_deg": 240.0,
  "time_horizon_min": 60.0
}
```

### Response:
```json
{
  "boat_speed_knots": 12.0,
  "heading_deg": 240.0,
  "time_horizon_min": 60.0,
  "wind_leeway_applied": true,
  "closest_boundary_name": "Gulf of Mannar Marine Biosphere Reserve",
  "min_distance_to_boundary_km": 254.32,
  "is_approaching": false,
  "is_crossing": false,
  "trajectory_risk_score": 0.05,
  "warning_message": "Projected trajectory maintains safe navigation clearance.",
  "waypoints": [...]
}
```
