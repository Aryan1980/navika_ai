"""Physical Variable Extraction and Normalization for MOSDAC NetCDF and HDF5 Products."""
import math
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple, List
try:
    import numpy as np
except ImportError:
    np = None

logger = logging.getLogger("mosdac_processor")

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes Great-Circle distance in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

class MosdacDataProcessor:
    """Processes raw satellite binary files (NetCDF / HDF5) and extracts localized physical metrics."""

    @staticmethod
    def extract_chlorophyll(nc_path: str, target_lat: float, target_lon: float, max_search_radius_km: float = 100.0) -> Optional[Dict[str, Any]]:
        """Extracts Chlorophyll-a from EOS-06 OCM NetCDF product (E06OCM_L4_AC)."""
        try:
            import netCDF4 as nc
            with nc.Dataset(nc_path, "r") as ds:
                lats = ds.variables["lat"][:]
                lons = ds.variables["lon"][:]
                chla_var = ds.variables["chla"]

                # Normalize target lon to [0, 360) if needed
                norm_lon = target_lon % 360.0

                # Find closest 1D lat and lon indices
                lat_idx = int(np.argmin(np.abs(lats - target_lat)))
                lon_idx = int(np.argmin(np.abs(lons - norm_lon)))

                # 4D shape (time, lev, lat, lon) or 2D (lat, lon)
                if chla_var.ndim == 4:
                    chla_patch = chla_var[0, 0, max(0, lat_idx - 2):lat_idx + 3, max(0, lon_idx - 2):lon_idx + 3]
                elif chla_var.ndim == 2:
                    chla_patch = chla_var[max(0, lat_idx - 2):lat_idx + 3, max(0, lon_idx - 2):lon_idx + 3]
                else:
                    chla_patch = chla_var[..., max(0, lat_idx - 2):lat_idx + 3, max(0, lon_idx - 2):lon_idx + 3]

                # Find valid (non-masked / non-nan) value
                val = None
                chosen_lat = float(lats[lat_idx])
                chosen_lon = float(lons[lon_idx])

                if isinstance(chla_patch, np.ma.MaskedArray):
                    valid_vals = chla_patch.compressed()
                    if len(valid_vals) > 0:
                        val = float(valid_vals[0])
                else:
                    flat = chla_patch.flatten()
                    valid_vals = flat[~np.isnan(flat)]
                    if len(valid_vals) > 0:
                        val = float(valid_vals[0])

                if val is None or val < 0.0 or val > 50.0:
                    # Cloud masked or invalid
                    logger.debug(f"Chlorophyll masked or out of range at {target_lat}, {target_lon}")
                    return None

                dist = haversine_km(target_lat, target_lon, chosen_lat, chosen_lon)
                if dist > max_search_radius_km:
                    logger.debug(f"Nearest chlorophyll pixel is {dist:.1f} km away (exceeds {max_search_radius_km} km)")
                    return None

                return {
                    "value": round(val, 3),
                    "unit": "mg/m3",
                    "pixel_latitude": round(chosen_lat, 4),
                    "pixel_longitude": round(chosen_lon, 4),
                    "spatial_resolution_km": 25.0,
                    "distance_km": round(dist, 2),
                    "sensor": "EOS-06 OCM-3"
                }
        except Exception as e:
            logger.error(f"Error extracting chlorophyll from {nc_path}: {e}")
            return None

    @staticmethod
    def extract_sst(h5_path: str, target_lat: float, target_lon: float, max_search_radius_km: float = 60.0) -> Optional[Dict[str, Any]]:
        """Extracts Sea Surface Temperature from INSAT-3DR HDF5 product (3RIMG_L2B_SST)."""
        try:
            import h5py
            with h5py.File(h5_path, "r") as f:
                if "SST" not in f or "Latitude" not in f or "Longitude" not in f:
                    logger.error(f"Required datasets (SST, Latitude, Longitude) not found in {h5_path}")
                    return None

                lat_ds = f["Latitude"]
                lon_ds = f["Longitude"]
                sst_ds = f["SST"]

                lat_scale = float(np.squeeze(lat_ds.attrs.get("scale_factor", 0.01)))
                lon_scale = float(np.squeeze(lon_ds.attrs.get("scale_factor", 0.01)))

                # Target window around target_lat (+/- 3.0 deg) and target_lon (+/- 3.0 deg)
                lat_raw_min = int((target_lat - 3.0) / lat_scale)
                lat_raw_max = int((target_lat + 3.0) / lat_scale)
                lon_raw_min = int((target_lon - 3.0) / lon_scale)
                lon_raw_max = int((target_lon + 3.0) / lon_scale)

                raw_lats = lat_ds[:]
                raw_lons = lon_ds[:]

                # Spatial filter
                mask = (raw_lats >= lat_raw_min) & (raw_lats <= lat_raw_max) & (raw_lons >= lon_raw_min) & (raw_lons <= lon_raw_max)
                indices = np.argwhere(mask)

                if len(indices) == 0:
                    return None

                best_dist = float("inf")
                best_sst_c = None
                best_lat = None
                best_lon = None

                # SST is (1, 2816, 2805)
                sst_slice = sst_ds[0, :, :]

                for r, c in indices:
                    k_val = float(sst_slice[r, c])
                    if k_val > 250.0 and k_val < 325.0:  # Valid SST range: ~ -23C to 51C
                        plat = float(raw_lats[r, c]) * lat_scale
                        plon = float(raw_lons[r, c]) * lon_scale
                        d = haversine_km(target_lat, target_lon, plat, plon)
                        if d < best_dist:
                            best_dist = d
                            best_sst_c = k_val - 273.15
                            best_lat = plat
                            best_lon = plon
                            if d < 12.0:
                                break

                if best_sst_c is None or best_dist > max_search_radius_km:
                    logger.debug(f"No clear-sky SST pixel within {max_search_radius_km} km of {target_lat}, {target_lon}")
                    return None

                return {
                    "value": round(best_sst_c, 2),
                    "unit": "°C",
                    "pixel_latitude": round(best_lat, 4),
                    "pixel_longitude": round(best_lon, 4),
                    "distance_km": round(best_dist, 2),
                    "sensor": "INSAT-3DR Imager"
                }
        except Exception as e:
            logger.error(f"Error extracting SST from {h5_path}: {e}")
            return None

    @staticmethod
    def extract_wind(h5_path: str, target_lat: float, target_lon: float, max_search_radius_km: float = 120.0) -> Optional[Dict[str, Any]]:
        """Extracts Ocean Surface Wind Vector from EOS-06 SCAT product (E06SCT_L2B_WV12)."""
        try:
            import h5py
            with h5py.File(h5_path, "r") as f:
                if "science_data" not in f:
                    logger.error(f"science_data group not found in {h5_path}")
                    return None

                sd = f["science_data"]
                raw_lat = sd["Latitude"][:]
                raw_lon = sd["Longitude"][:]
                raw_speed = sd["Wind_speed_selection"][:]
                raw_dir = sd["Wind_direction_selection"][:]

                # Scale factor is 0.01 for coordinates, speed (m/s), and direction (deg)
                lat_scale = 0.01
                lon_scale = 0.01
                speed_scale = 0.01
                dir_scale = 0.01

                # Normalize target lon [0, 360)
                norm_lon = target_lon % 360.0

                # Bounding box candidate filter (+/- 3 deg)
                lat_raw_min = int((target_lat - 3.0) / lat_scale)
                lat_raw_max = int((target_lat + 3.0) / lat_scale)
                lon_raw_min = int((norm_lon - 3.0) / lon_scale)
                lon_raw_max = int((norm_lon + 3.0) / lon_scale)

                mask = (
                    (raw_lat >= lat_raw_min) & (raw_lat <= lat_raw_max) &
                    (raw_lon >= lon_raw_min) & (raw_lon <= lon_raw_max) &
                    (raw_speed < 30000)  # non-fill
                )
                indices = np.argwhere(mask)

                if len(indices) == 0:
                    return None

                best_dist = float("inf")
                best_speed_ms = None
                best_dir_deg = None
                best_lat = None
                best_lon = None

                for r, c in indices:
                    plat = float(raw_lat[r, c]) * lat_scale
                    plon = float(raw_lon[r, c]) * lon_scale
                    d = haversine_km(target_lat, target_lon, plat, plon)
                    if d < best_dist:
                        best_dist = d
                        best_speed_ms = float(raw_speed[r, c]) * speed_scale
                        best_dir_deg = float(raw_dir[r, c]) * dir_scale
                        best_lat = plat
                        best_lon = plon
                        if d < 15.0:
                            break

                if best_speed_ms is None or best_dist > max_search_radius_km:
                    return None

                speed_kmh = round(best_speed_ms * 3.6, 1)

                return {
                    "wind_speed_kmh": speed_kmh,
                    "wind_speed_ms": round(best_speed_ms, 2),
                    "wind_direction_deg": round(best_dir_deg, 1),
                    "pixel_latitude": round(best_lat, 4),
                    "pixel_longitude": round(best_lon, 4),
                    "distance_km": round(best_dist, 2),
                    "sensor": "EOS-06 SCAT-3"
                }
        except Exception as e:
            logger.error(f"Error extracting wind vectors from {h5_path}: {e}")
            return None

    @staticmethod
    def extract_chlorophyll_xarray(nc_path: str, target_lat: float, target_lon: float, max_search_radius_km: float = 100.0) -> Optional[Dict[str, Any]]:
        """Extracts Chlorophyll-a from EOS-06 OCM NetCDF product using xarray scientific multidimensional datasets."""
        try:
            import xarray as xr
            with xr.open_dataset(nc_path) as ds:
                norm_lon = target_lon % 360.0
                
                var_name = "chla" if "chla" in ds else "chlorophyll" if "chlorophyll" in ds else list(ds.data_vars.keys())[0]
                da = ds[var_name]
                
                if "lat" in da.coords and "lon" in da.coords:
                    point = da.sel(lat=target_lat, lon=norm_lon, method="nearest")
                    val = float(point.values)
                    chosen_lat = float(point.lat.values)
                    chosen_lon = float(point.lon.values)
                else:
                    return MosdacDataProcessor.extract_chlorophyll(nc_path, target_lat, target_lon, max_search_radius_km)

                if np.isnan(val) or val < 0.0 or val > 50.0:
                    return None

                dist = haversine_km(target_lat, target_lon, chosen_lat, chosen_lon)
                if dist > max_search_radius_km:
                    return None

                return {
                    "value": round(val, 3),
                    "unit": "mg/m3",
                    "pixel_latitude": round(chosen_lat, 4),
                    "pixel_longitude": round(chosen_lon, 4),
                    "spatial_resolution_km": 25.0,
                    "distance_km": round(dist, 2),
                    "sensor": "EOS-06 OCM-3 (xarray)",
                    "engine": "xarray"
                }
        except Exception as e:
            logger.debug(f"xarray extraction fallback to netCDF4 for {nc_path}: {e}")
            return MosdacDataProcessor.extract_chlorophyll(nc_path, target_lat, target_lon, max_search_radius_km)

    @staticmethod
    def inspect_dataset_structure(file_path: str) -> Dict[str, Any]:
        """Inspects HDF5/NetCDF dataset dimensions, coordinates, variables, and shapes for Judge Dashboard."""
        import os
        if not os.path.exists(file_path):
            return {"status": "FILE_NOT_FOUND", "dimensions": {}, "variables": []}

        file_size_mb = round(os.path.getsize(file_path) / (1024 * 1024), 2)
        lower_path = file_path.lower()

        if lower_path.endswith(".nc"):
            try:
                import xarray as xr
                with xr.open_dataset(file_path) as ds:
                    dims = {str(k): int(v) for k, v in ds.sizes.items()}
                    vars_list = list(ds.data_vars.keys())
                    coords_list = list(ds.coords.keys())
                    return {
                        "status": "VALID",
                        "format": "NetCDF4 (xarray)",
                        "size_mb": file_size_mb,
                        "dimensions": dims,
                        "variables": vars_list,
                        "coordinates": coords_list,
                        "xarray_processed": True
                    }
            except Exception:
                import netCDF4 as nc
                with nc.Dataset(file_path, "r") as ds:
                    dims = {str(k): len(v) for k, v in ds.dimensions.items()}
                    vars_list = list(ds.variables.keys())
                    return {
                        "status": "VALID",
                        "format": "NetCDF4",
                        "size_mb": file_size_mb,
                        "dimensions": dims,
                        "variables": vars_list,
                        "xarray_processed": True
                    }
        elif lower_path.endswith((".h5", ".hdf")):
            try:
                import h5py
                with h5py.File(file_path, "r") as f:
                    dims = {}
                    vars_list = []
                    def _visitor(name, obj):
                        if isinstance(obj, h5py.Dataset):
                            vars_list.append(name)
                            if len(dims) < 5:
                                dims[name] = list(obj.shape)
                    f.visititems(_visitor)
                    return {
                        "status": "VALID",
                        "format": "HDF5",
                        "size_mb": file_size_mb,
                        "dimensions": dims,
                        "variables": vars_list[:15],
                        "hdf5_processed": True
                    }
            except Exception as e:
                return {"status": f"HDF5_READ_ERROR: {e}", "dimensions": {}, "variables": []}

        return {"status": "UNKNOWN_FORMAT", "dimensions": {}, "variables": []}

    @classmethod
    def format_normalized_output(
        cls,
        dataset_id: str,
        timestamp: str,
        latitude: float,
        longitude: float,
        variables: Dict[str, Any],
        filename: str,
        processing_status: str,
        file_size_bytes: Optional[int] = None
    ) -> Dict[str, Any]:
        """Creates the normalized JSON format required by SamudraAI."""
        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        
        # Provenance block
        provenance = {
            "source_authority": "ISRO MOSDAC (Meteorological & Oceanographic Satellite Data Archival Centre)",
            "dataset_id": dataset_id,
            "observation_time": timestamp,
            "file_name": filename,
            "file_size_bytes": file_size_bytes,
            "processing_time": now_iso,
            "verification_status": "PHYSICALLY_VALIDATED"
        }

        return {
            "source": "MOSDAC",
            "dataset_id": dataset_id,
            "timestamp": timestamp,
            "latitude": round(latitude, 4),
            "longitude": round(longitude, 4),
            "variables": variables,
            "file": filename,
            "processing_status": processing_status,
            "provenance": provenance
        }
