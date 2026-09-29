# NavikaAI — Data Sources & Integration Guide

## 1. Overview
NavikaAI uses a modular **Provider Abstraction Layer** (`backend/app/providers/base.py`) separating the application logic from external data providers. 

During evaluation and local installation, NavikaAI operates in **DEMO MODE**, serving high-fidelity, physically consistent synthetic datasets for Indian coastal waters without requiring external API credentials.

---

## 2. Supported National Data Sources

| Source | Organization | Dataset | Parameters | Update Frequency | Status |
|---|---|---|---|---|---|
| **Oceansat-3 (EOS-06)** | ISRO / NRSC | Ocean Colour Monitor (OCM-3) & AASS | SST (?C), Chlorophyll-a (mg/m?), Turbidity | Daily (6-hr revisit) | `ACTIVE_DEMO` |
| **MOSDAC** | ISRO / SAC | INSAT-3D / 3DR Imager & Sounder | Rapid convective clouds, Sea surface wind vectors | 15-Minute Interval | `ACTIVE_DEMO` |
| **INCOIS OSF** | MoES / INCOIS | Ocean State Forecast (SWAN/WAVEWATCH III) | Significant wave height (m), Swell direction, Sea state | 6-Hourly Model Run | `ACTIVE_DEMO` |
| **INCOIS PFZ** | MoES / INCOIS | Integrated Multilingual PFZ Advisories | Frontal coordinates, Bearing, Depth, Fishery suitability | Daily at 06:00 & 18:00 IST | `ACTIVE_DEMO` |
| **IMD Marine** | MoES / IMD | Coastal Weather Bulletins & Cyclone Tracks | Wind speed (km/h), Squall warnings, Cyclone categories | 3-Hourly Bulletin | `ACTIVE_DEMO` |
| **ICG GIS** | Indian Coast Guard | National Maritime Geofence Repository | IMBL 1974/76 lines, Marine Protected Areas (MPAs) | Statutory / Periodic | `ACTIVE_DEMO` |

---

## 3. Connecting Live External APIs

To connect live APIs, configure your credentials in `.env`:

```bash
# 1. Copy template
cp .env.example .env

# 2. Add credentials
OCEAN_API_KEY=your_incois_wfs_token_here
SATELLITE_API_KEY=your_mosdac_credentials_here
WEATHER_API_KEY=your_imd_api_token_here
LLM_API_KEY=your_google_gemini_api_key_here
```

When credentials are detected on startup, the respective adapter in `backend/app/providers/adapters.py` automatically initializes live HTTP connections while preserving the demo provider as a zero-downtime fallback.
