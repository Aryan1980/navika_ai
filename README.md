# SamudraAI — ISRO Agentic Marine Intelligence Platform

[![ISRO Problem Statement Prototype](https://img.shields.io/badge/ISRO-MOSDAC%20Live%20Telemetry-008080?style=for-the-badge&logo=satellite)](https://mosdac.gov.in)
[![Multi-Agent Architecture](https://img.shields.io/badge/Architecture-Autonomous%20Swarm-0284c7?style=for-the-badge)](./docs/architecture.md)
[![Deterministic Safety Matrix](https://img.shields.io/badge/Safety-Deterministic%20Zero--Hallucination-10b981?style=for-the-badge)](./docs/safety-score.md)
[![Scientific Pipeline](https://img.shields.io/badge/Pipeline-xarray%20%2B%20HDF5%20%2B%20NetCDF4-purple?style=for-the-badge)](./docs/data-pipeline.md)
[![Predictive Trajectory](https://img.shields.io/badge/Kinematics-Dead%20Reckoning%20%2B%20Leeway-orange?style=for-the-badge)](./docs/trajectory.md)

**SamudraAI (ORCA)** is an operational Agentic AI Marine Intelligence Platform developed in response to the ISRO Smart India Hackathon (SIH) Round 2 problem statement. Built for traditional coastal fishermen, maritime researchers, port authorities, and coast guard personnel, SamudraAI provides natural-language conversation and voice interaction in **10 Indian languages** (English, Hindi, Tamil, Telugu, Malayalam, Kannada, Bengali, Marathi, Gujarati, and Odia).

Departing fundamentally from naive chatbots or static dashboards, SamudraAI demonstrates **genuine Agentic AI behaviors**: intent understanding, autonomous subtask decomposition, multi-agent dispatch, heterogeneous satellite & oceanographic data fusion, spatial-temporal kinematic reasoning, deterministic physical risk scoring, cross-agent consensus verification, and explainable evidence provenance.

---

## 🛰️ Technical Chain Demonstration

```
ISRO MOSDAC Satellite Passes
  ├─ EOS-06 OCM-3: Analysed Chlorophyll-a (E06OCM_L4_AC, NetCDF4)
  ├─ INSAT-3DR Imager: Sea Surface Temperature (3RIMG_L2B_SST, HDF5)
  └─ EOS-06 SCAT-3: Ku-band Surface Winds (E06SCT_L2B_WV12, HDF5)
               │
               ▼
Scientific Ingestion Engine (xarray, netCDF4, h5py, SI Units: °C, mg/m³, km/h)
               │
               ▼
Kinematic Predictive Trajectory Engine (Dead Reckoning + 2.5% Wind Leeway Drift)
               │
               ▼
Deterministic Mathematical Safety Score: Safety Score = 100 × (1 - Total Risk)
               │
               ▼
Multi-Agent Swarm (Planner, Ocean, Weather, Geospatial, Trajectory, Safety)
               │
               ▼
Verification Agent (Physical Range & Cross-Agent Consensus Audit)
               │
               ▼
Fisherman Voice UX (Tamil, Malayalam, Hindi, English STT + Auto-Speak Readback)
               │
               ▼
SIH Requirement 15 Judge Dashboard (File Inspection, Sync, Live Coordinate Probe)
```

---

## 📚 Technical Documentation

- **[System Architecture (docs/architecture.md)](./docs/architecture.md)**: Multi-agent coordination, subtask dispatch, and consensus audit.
- **[MOSDAC Scientific Data Pipeline (docs/data-pipeline.md)](./docs/data-pipeline.md)**: Standing orders ingestion, `xarray` NetCDF4 parsing, `h5py` array squeezing, and Level-2B vs Level-3 scatterometer specification.
- **[Mathematical Safety Score Model (docs/safety-score.md)](./docs/safety-score.md)**: 7 normalized factor weights, non-negotiable critical overrides, and uncertainty penalties.
- **[Predictive Trajectory Engine (docs/trajectory.md)](./docs/trajectory.md)**: Kinematic dead reckoning, downwind aerodynamic leeway, and spherical segment intersection algorithms.
- **[Offline & Edge Resilient Mode (docs/offline-mode.md)](./docs/offline-mode.md)**: Atomic local disk cache, explicit staleness warnings, and pure-Python local fallback.

---

## 🚀 Active MOSDAC Standing Orders

| Category | Satellite & Sensor | Dataset ID | Format | Parameters Extracted | Scientific Engine |
|---|---|---|---|---|---|
| **Chlorophyll-a** | EOS-06 (Oceansat-3) OCM-3 | `E06OCM_L4_AC` | NetCDF4 | Analysed Chlorophyll-a ($\text{mg/m}^3$) | `xarray.open_dataset` nearest-neighbor |
| **Sea Surface Temp** | INSAT-3DR Imager (1DVAR) | `3RIMG_L2B_SST` | HDF5 (`.h5`) | Sea Surface Temperature ($^\circ\text{C}$) | `h5py` ($K - 273.15$) |
| **Surface Winds** | EOS-06 SCAT-3 (Ku-band) | `E06SCT_L2B_WV12`* | HDF5 (`.h5`) | Wind Speed ($\text{km/h}$) & Direction ($^\circ$) | `h5py` dataset slicing |

*\*Note on SCAT-3 L2B vs L3: The MOSDAC catalog endpoint returns HTTP 500 for `E06SCT_L3_WV12` because gridded L3 is not indexed for standing order streams. `E06SCT_L2B_WV12` (12.5 km Ku-band ocean wind vectors) is actively published and updated in real-time. SamudraAI ingests L2B and explicitly identifies it as Level-2B.*

---

## 🧮 Mathematical Risk & Safety Formulation

$$\text{Total Risk} = \sum_{i=1}^{7} w_i \cdot r_i \quad \left(\sum w_i = 1.00\right)$$
$$\text{Safety Score} = 100 \times (1 - \text{Total Risk})$$

### 7 Configurable Factor Weights:
1. **Significant Wave Height**: $w = 0.25$
2. **Surface Wind Speed**: $w = 0.20$
3. **Atmospheric Weather Hazard (Cyclone / Lightning)**: $w = 0.15$
4. **Sovereign Border Clearance (IMBL / MPAs / Restricted Zones)**: $w = 0.15$
5. **Predictive Trajectory Clearance**: $w = 0.10$
6. **Spaceborne Sea Surface Temperature (SST)**: $w = 0.05$
7. **Spaceborne Chlorophyll-a Concentration**: $w = 0.05$

---

## 🛠️ Quick Start

### 1. Prerequisites
- Python 3.11+
- Node.js v18+ and npm

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/Aryan1980/samudra_ai.git
cd samudra_ai

# Install dependencies (includes xarray, h5py, netCDF4, fastapi, pydantic)
pip install -r backend/requirements.txt

# Run the automated test suite (30+ tests covering all engines and endpoints)
python -m pytest backend/tests/ -v

# Start FastAPI server
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run build   # Verified zero TypeScript errors
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 Key API Endpoints

- `POST /api/chat`: Multi-agent query processing with auditable `multi_agent_evidence` and `provenance`.
- `POST /api/trajectory/predict`: Predictive forward course modeling with wind leeway drift.
- `POST /api/demo/simulate`: Deterministic full-chain simulation endpoint for SIH judges.
- `GET /api/mosdac/status`: SIH Requirement 15 technical dashboard reporting ingested files and dimensions.
- `POST /api/mosdac/sync`: On-demand satellite pass synchronization across EOS-06 and INSAT-3DR.
- `GET /api/mosdac/probe?lat=...&lon=...`: Exact localized spaceborne pixel retrieval.

---

## 🔒 Security Compliance
- MOSDAC credentials are stored exclusively in local `.env` and are strictly excluded via `.gitignore`.
- Binary satellite files (`*.nc`, `*.hdf`, `*.h5`) are excluded from Git to prevent repository bloat.
- Zero fake data policy: All scientific values preserve verified SI units with complete provenance.
