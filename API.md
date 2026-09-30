# NavikaAI - REST API Documentation

Base URL: `http://127.0.0.1:8000/api`
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

---

## Endpoints Summary

### 1. Agentic Chat Pipeline
- **`POST /api/chat`**
  - **Body**:
    ```json
    {
      "query": "Is it safe to fish tomorrow morning?",
      "latitude": 9.9312,
      "longitude": 76.2673,
      "language": "en"
    }
    ```
  - **Response**: `ChatResponse` containing direct answer, deterministic risk level, conditions summary, expandable evidence details, agent trace execution times, and active map layer recommendations.

### 2. Marine Conditions & Observations
- **`GET /api/marine-conditions?lat=9.9312&lon=76.2673`**
  - Aggregates weather, ocean, risk, active alerts, and nearest PFZ in a single payload.
- **`GET /api/weather?lat=9.9312&lon=76.2673`**
  - Returns wind speed, gust, temperature, wave height, lightning status, and cyclone alert level.
- **`GET /api/ocean?lat=9.9312&lon=76.2673`**
  - Returns SST, chlorophyll concentration, wave direction, tide status, and Douglas sea state.

### 3. Potential Fishing Zones (PFZs)
- **`GET /api/pfz?lat=9.9312&lon=76.2673&sort_by=distance&radius_km=120`**
  - Returns ranked list of PFZ zones with bearing, distance, SST, chlorophyll, and suitability score (0?100). Supported sort options: `distance`, `suitability`, `safety`, `combined`.

### 4. Deterministic Risk Assessment
- **`POST /api/risk`**
  - **Body**: `{"latitude": 9.9312, "longitude": 76.2673}`
  - **Response**: Overall deterministic risk score (0?100), risk level (`LOW` / `MODERATE` / `HIGH` / `EXTREME`), and individual factor penalty scores.

### 5. Safe Navigational Routing
- **`POST /api/route`**
  - **Body**:
    ```json
    {
      "origin": {"latitude": 9.9312, "longitude": 76.2673},
      "destination": {"latitude": 9.85, "longitude": 75.90}
    }
    ```
  - **Response**: Direct shortest track vs risk-mitigated safe detour waypoints avoiding MPAs, IMBL buffers, and hazard centroids.

### 6. Alerts & Geofences
- **`GET /api/alerts?lat=9.9312&lon=76.2673`**
  - Returns active marine alerts (Extreme, High, Moderate, Informational).
- **`GET /api/geofences`**
  - Returns polygon coordinates for IMBL boundaries, Marine Protected Areas, and Naval restricted zones.
- **`GET /api/data-sources`**
  - Returns metadata, dataset names, and live/demo statuses of all configured providers.
- **`GET /api/health`**
  - System readiness and active agent list.
