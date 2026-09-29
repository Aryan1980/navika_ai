# NavikaAI Multi-Agent System Architecture

## Overview
NavikaAI is an operational marine intelligence platform designed to support traditional fishermen, coastal maritime authorities, and researchers. It implements an autonomous multi-agent swarm architecture where specialized agents decompose queries, extract satellite telemetry, compute forward dead-reckoning vessel trajectories, calculate deterministic mathematical safety scores, and synthesize multilingual localized voice advisories.

## Multi-Agent Swarm Components

```
                          ┌───────────────────────────┐
                          │   Fisherman / Researcher  │
                          │   Natural Language / Voice│
                          └─────────────┬─────────────┘
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │       Planner Agent       │
                          │ Intent & Param Extraction │
                          └─────────────┬─────────────┘
                                        │
        ┌───────────────────────────────┼──────────────────────────────┐
        ▼                               ▼                              ▼
┌───────────────┐              ┌────────────────┐             ┌─────────────────┐
│ Weather Agent │              │  Ocean Agent   │             │ Geospatial Agent│
│ EOS-06 SCAT-3 │              │ EOS-06 OCM-3   │             │ IMBL / MPAs / RZ│
│ Wind Vectors  │              │ INSAT-3DR SST  │             │ Distance Model  │
└───────┬───────┘              └────────┬───────┘             └────────┬────────┘
        │                               │                              │
        └───────────────────────┬───────┴──────────────────────────────┘
                                │
                                ▼
                 ┌─────────────────────────────┐
                 │  Predictive Trajectory      │
                 │  Dead Reckoning + Leeway    │
                 └──────────────┬──────────────┘
                                │
                                ▼
                 ┌─────────────────────────────┐
                 │ Mathematical Safety Engine  │
                 │ 7 Normalized Factors        │
                 │ Safety Score = 100*(1-Risk) │
                 └──────────────┬──────────────┘
                                │
                                ▼
                 ┌─────────────────────────────┐
                 │     Verification Agent      │
                 │ Cross-Sensor Consensus Audit│
                 └──────────────┬──────────────┘
                                │
                                ▼
                 ┌─────────────────────────────┐
                 │ Explanation & Voice Agent   │
                 │ Multilingual Tamil/ML/HI/EN │
                 └─────────────────────────────┘
```

### 1. Planner Agent
- Decomposes unstructured natural language into structured execution plans.
- Identifies intent (`safety_check`, `pfz_query`, `safe_route`, `weather_query`, `boundary_check`, `greeting`).
- Extracts geographic coordinates, speed, heading, and time horizons.

### 2. Ocean Analytics Agent
- Ingests spaceborne telemetry from ISRO MOSDAC:
  - **EOS-06 OCM-3**: Analysed Chlorophyll-a concentration (`E06OCM_L4_AC`, NetCDF4).
  - **INSAT-3DR Imager**: Sea Surface Temperature (`3RIMG_L2B_SST`, HDF5).
- Evaluates thermal anomalies and chlorophyll gradients for PFZ aggregation.

### 3. Weather Intelligence Agent
- Ingests Ku-band ocean surface wind vectors from **EOS-06 SCAT-3** (`E06SCT_L2B_WV12`, HDF5).
- Ingests atmospheric warnings (IMD cyclone bulletins, convective lightning alerts).

### 4. Geospatial Reasoning Agent
- High-precision spherical geometry (Haversine formula, initial bearing, destination point).
- Ray-casting point-in-polygon containment and orthogonal distance to boundary segments.
- Official boundary perimeters:
  - International Maritime Boundary Line (IMBL: India-Sri Lanka, India-Pakistan, India-Bangladesh).
  - Marine Protected Areas (Gulf of Mannar, Malvan, Sundarbans, Gahirmatha).
  - Naval & Offshore Energy Restricted Zones (Bombay High, KG Basin).

### 5. Predictive Trajectory Engine
- Forward vessel track modeling using nautical dead reckoning:
  $$\Delta \vec{x}_{\text{boat}} = v_{\text{boat}} \cdot \Delta t \cdot [\sin(\theta_{\text{boat}}), \cos(\theta_{\text{boat}})]$$
- Physical wind leeway drift vector (2.5% wind speed in wind direction):
  $$\Delta \vec{x}_{\text{wind}} = 0.025 \cdot v_{\text{wind}} \cdot \Delta t \cdot [\sin(\theta_{\text{wind}}), \cos(\theta_{\text{wind}})]$$
- Step-by-step segment intersection against all sovereign and protected boundaries.

### 6. Mathematical Safety Assessment Agent
- Evaluates 7 normalized risk components summing to total risk $\in [0, 1]$.
- Outputs interpretable Safety Score:
  $$\text{Safety Score} = 100 \times (1 - \text{Total Risk})$$

### 7. Verification Agent
- Performs physical parameter range validation (SST $\in [15, 40]^\circ\text{C}$, Chl $\in [0, 80]\,\text{mg/m}^3$).
- Verifies cross-agent consensus: ensures no high wind (>45 km/h) or high swell (>2.5m) is certified as `SAFE`.

### 8. Explanation & Voice Synthesis Agent
- Generates localized natural language in 10 Indian languages.
- Web Speech API integration provides two-way audio for traditional fishermen.
- Delivers an auditable `multi_agent_evidence` log with dataset IDs and timestamps.
