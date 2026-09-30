# NavikaAI - ISRO Hackathon Evaluation & Demo Guide

This guide enables judges to test the complete end-to-end capabilities of NavikaAI locally without external API configuration.

---

## ⚡ 1-Minute Launch

1. **Start Backend**:
   ```bash
   cd navika_ai
   python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
   ```
2. **Access Platform**:
   Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in Chrome, Edge, or Firefox.

---

## ?? Testing the 8 Problem Statement Scenarios

In the conversational interface, click the **"Try Demo Scenarios"** chips or test them via text/voice:

### Scenario 1: "Where is the nearest PFZ?"
- **Agent Behavior**: Planner invokes Discovery, Ocean, PFZ, and GIS agents.
- **Observed Result**:
  - Ranked PFZ list appears with distance in km, bearing (e.g. WNW), SST, and Chlorophyll.
  - Interactive map highlights the nearest PFZ with a green marker and thermal halo.
  - Explanation panel displays satellite orbit pass time and data provenance.

### Scenario 2: "Is it safe to go fishing tomorrow morning?"
- **Agent Behavior**: Planner targets 24-hr horizon, queries Weather and Ocean forecast models, passes parameters to the Deterministic Risk Engine.
- **Observed Result**:
  - Direct answer displays safety verdict banner (e.g. `SAFE` or `SAFE WITH CAUTION`).
  - Wind speed (km/h) and wave height (m) summary provided.
  - Risk gauge displays deterministic score (0?100) with factor penalty breakdown bars.

### Scenario 3: "What are the wave and wind conditions?"
- **Agent Behavior**: Weather and Ocean agents query hydrodynamic fields.
- **Observed Result**:
  - Marine cards highlight significant wave height, swell direction, wind speed in both km/h and knots, and Beaufort/Douglas sea state description.

### Scenario 4: "Show areas with high chlorophyll and favourable SST."
- **Agent Behavior**: Ocean and Visualization agents activate spaceborne remote sensing overlays.
- **Observed Result**:
  - Interactive map automatically turns on the **SST Isotherms** and **Chlorophyll-a Plume** layers.
  - Explanation outlines thermal-chlorophyll confluence lines.

### Scenario 5: "Which PFZ is safest?"
- **Agent Behavior**: PFZ agent sorts zones by transit safety index rather than distance alone.
- **Observed Result**:
  - Distant offshore zones with elevated transit wave risks are marked `CAUTION` or `AVOID`, while protected zones are recommended.

### Scenario 6: "Find a safe route to the nearest PFZ."
- **Agent Behavior**: Route Optimization Agent executes waypoint hazard avoidance.
- **Observed Result**:
  - Map plots two routes:
    * **Red dashed polyline**: Shortest direct path (intersects hazard or MPA buffer).
    * **Emerald solid polyline**: Safe detour corridor with calculated transit duration and clearance margin.

### Scenario 7: "Are there any cyclone or lightning alerts?"
- **Agent Behavior**: Alert Agent scans IMD warnings and convective radar cells.
- **Observed Result**:
  - Active alert center displays color-coded severity cards (Extreme ??, High ??, Moderate ??).
  - Filter by severity pills (All, Extreme, High).

### Scenario 8: "Am I approaching a restricted area?"
- **Agent Behavior**: Geospatial Agent computes cross-track distance to sovereign IMBL lines and checks Ray-Casting point-in-polygon containment for Marine Protected Areas (e.g. Gahirmatha, Gulf of Mannar).
- **Observed Result**:
  - Boundary distance reported in kilometers.
  - Warning alert triggered if within buffer zone.

---

## ?? Multilingual & Voice Testing

1. **Language Switching**: Use the header dropdown to select Hindi, Tamil, Telugu, Malayalam, Bengali, etc.
2. **Native Language Query**: Try typing or speaking:
   - **Hindi**: `???? ?? ???? ???? ?????? ???? ???????? ???`
   - **Tamil**: `?????????? ???????? ??????? ??????`
   - **Malayalam**: `??????? ?????????? ??????????? ???? ??????????`
3. **Voice Microphone**: Click the microphone icon to test real-time Speech-to-Text.
4. **Voice Readout**: Click the speaker icon on any assistant card to hear the localized voice synthesis.

---

## ?? Inspecting Agentic AI Behavior (For Judges)

1. Click **"Why am I seeing this? (Evidence)"** on any chat message to open the full audit trail showing:
   - Multi-agent execution steps (Planner ? Weather ? Ocean ? GIS ? Risk ? Route ? Viz ? Alert ? Explain).
   - Exact mathematical formula and weighted scores.
   - Satellite orbit timestamps and observed vs forecast indicators.
2. Check the **Multi-Agent Pipeline Observability** panel at the bottom of the Command Center to see live execution latencies in milliseconds for every specialized agent.
