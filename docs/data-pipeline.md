# ISRO MOSDAC Scientific Data Ingestion Pipeline

## Overview
SamudraAI ingests live spaceborne telemetry directly from the **ISRO Meteorological and Oceanographic Satellite Data Archival Centre (MOSDAC)** operated by the **Space Applications Centre (SAC), Ahmedabad**.

All satellite data processing follows scientific protocols, preserving physical SI units without synthetic or hallucinated values.

---

## Active MOSDAC Standing Orders

| Category | Satellite / Sensor | Dataset ID | Format | File Size | Parameter Extracted | Scientific Engine |
|---|---|---|---|---|---|---|
| **Chlorophyll-a** | EOS-06 (Oceansat-3) OCM-3 | `E06OCM_L4_AC` | NetCDF4 | ~5.95 MB | Analysed Chlorophyll-a ($\text{mg/m}^3$) | `xarray.open_dataset()` with nearest-neighbor selection |
| **Sea Surface Temp (SST)** | INSAT-3DR Imager (1DVAR) | `3RIMG_L2B_SST` | HDF5 (`.h5`) | ~16.22 MB | Sea Surface Temperature ($^\circ\text{C}$) | `h5py` (Kelvin to Celsius: $K - 273.15$) |
| **Surface Winds** | EOS-06 SCAT-3 (Ku-band) | `E06SCT_L2B_WV12` | HDF5 (`.h5`) | ~16.58 MB | Ocean Surface Wind Speed ($\text{km/h}$) & Direction ($^\circ$) | `h5py` dataset slicing |

---

## Technical Note: EOS-06 Scatterometer L2B vs L3
> [!IMPORTANT]
> The MOSDAC catalog endpoint returns **HTTP 500** for `E06SCT_L3_WV12` because Level-3 gridded daily composites are not indexed for real-time order streams.
>
> In contrast, **`E06SCT_L2B_WV12`** (Level-2B 12.5 km Ku-band ocean wind vectors) is actively published and updated in real-time by SAC Ahmedabad.
>
> **SamudraAI explicitly ingests `E06SCT_L2B_WV12` and accurately labels it Level-2B across all interfaces, logs, and evidence trails.** It is never falsely labeled as Level-3.

---

## Scientific Processing Engines

### 1. Chlorophyll-a (`xarray` + `netCDF4`)
- File format: NetCDF4 (`.nc`).
- Coordinate variables: `lat` (1D array), `lon` (1D array).
- Variable: `chlorophyll_a` (2D grid).
- Ingestion algorithm:
  ```python
  import xarray as xr

  with xr.open_dataset(file_path) as ds:
      da = ds["chlorophyll_a"].sel(lat=target_lat, lon=target_lon, method="nearest")
      val = float(da.values)
  ```
- Gracefully handles fill values (`-999.0`, `NaN`) and clouds.

### 2. Sea Surface Temperature (`h5py`)
- File format: HDF5 (`.h5`).
- Coordinate datasets: `Latitude` (2D), `Longitude` (2D).
- Data dataset: `SST` (2D integer array with attributes `scale_factor` and `add_offset`).
- Ingestion algorithm:
  ```python
  import h5py
  import numpy as np

  with h5py.File(file_path, "r") as h5:
      lat_grid = h5["Latitude"][:]
      lon_grid = h5["Longitude"][:]
      raw_sst = h5["SST"][:]
      scale = float(np.squeeze(h5["SST"].attrs.get("scale_factor", 0.01)))
      
      # Convert raw DN to Kelvin, then to Celsius
      temp_k = raw_sst[min_r, min_c] * scale
      temp_c = temp_k - 273.15
  ```

### 3. Ku-band Scatterometer Surface Wind Vectors (`h5py`)
- File format: HDF5 (`.h5`).
- Datasets: `lat`, `lon`, `wind_speed`, `wind_direction`.
- Converts wind speed from $\text{m/s}$ to $\text{km/h}$ ($v \times 3.6$).

---

## Zero Fake Data & Transparency Rules
1. **No Invented Waves or Currents**: MOSDAC radiometers and scatterometers measure SST, chlorophyll, and winds. They do not measure significant wave height or deep currents. Where wave or current data is unavailable from MOSDAC, the system explicitly returns `null` / `UNAVAILABLE_FROM_MOSDAC` and relies on verified INCOIS bulletins.
2. **Atomic Local Cache**: Downloaded orbital passes are stored in `data/mosdac/` and indexed in `mosdac_registry.json`. This prevents redundant network requests while ensuring immediate sub-millisecond retrieval.
3. **Strict Credential Protection**: MOSDAC credentials are stored exclusively in the local `.env` file, which is guarded by `.gitignore`. No credentials or binary satellite files are committed to version control.
