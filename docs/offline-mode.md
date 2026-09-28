# Offline / Edge Resilient Mode

## Overview
Traditional fishermen operate in remote coastal and oceanic waters far beyond 4G/5G cellular coverage. A marine intelligence platform that fails when disconnected from the cloud is non-viable in operational sea conditions.

SamudraAI implements a **three-tier transparent fallback architecture**:
1. **Tier 1 (Live Spaceborne)**: Live telemetry ingested directly from ISRO MOSDAC standing orders.
2. **Tier 2 (Cached Edge Mode)**: Local disk cache read from previous passes with explicit observation staleness provenance.
3. **Tier 3 (Scientific Proxy Fallback)**: Deterministic scientific simulation conforming to realistic physical distributions for local development and CI testing.

---

## Explicit Staleness Provenance

When operating in offline or edge mode, SamudraAI **never** masquerades cached data as live telemetry. The evidence drawer and UI badges explicitly report:

> **"MOSDAC unavailable. Using cached marine data from 2026-09-27T16:45:00Z."**

The provenance block retains:
- Original satellite mission and sensor (e.g. `INSAT-3DR Imager 1DVAR`).
- Actual observation pass timestamp.
- Local file name and size in cache.

---

## Local Edge Synthesis

Even with no internet connectivity or cloud LLM access:
- **Spatial Calculations**: Geodesy, Haversine distances, and point-in-polygon containment run in pure Python without external geocoding APIs.
- **Trajectory Modeling**: Dead reckoning and wind leeway run locally in < 5 milliseconds.
- **Safety Engine**: The 7-factor mathematical safety score evaluates deterministically in < 1 millisecond.
- **Fisherman Voice Advisory**: The deterministic multilingual template synthesizer generates localized responses in all 10 Indian languages.
- **Local Speech**: Web Speech API uses local speech synthesis engines on mobile/desktop browsers without network roundtrips.
