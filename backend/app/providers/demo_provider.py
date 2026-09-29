"""High-fidelity realistic synthetic Demo Data Provider for Indian Waters."""
from datetime import datetime, timezone
import math
from typing import List, Dict, Any, Optional
from app.providers.base import MarineDataProvider
from app.schemas.marine import Coordinates, MarineObservation, PFZZone, WeatherReport
from app.schemas.alert import MarineAlert
from app.schemas.data_sources import DataSourceInfo
from app.geo.calculations import haversine_distance, calculate_bearing, destination_point
from app.geo.geofence import is_point_in_polygon, distance_to_polygon
from app.geo.boundaries import MARINE_PROTECTED_AREAS, RESTRICTED_ZONES, IMBL_BOUNDARIES, COASTAL_PRESETS

class DemoDataProvider(MarineDataProvider):
    """Generates realistic oceanographic, atmospheric, and navigational data for ISRO evaluation."""

    def __init__(self):
        self.is_demo = True

    def _get_utc_now(self) -> str:
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    async def get_weather(self, coords: Coordinates, target_time: Optional[str] = None) -> WeatherReport:
        import httpx
        from app.config import settings

        # 1. Check for Live WeatherAPI.com credentials
        if settings.WEATHER_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(
                        "http://api.weatherapi.com/v1/current.json",
                        params={"key": settings.WEATHER_API_KEY, "q": f"{coords.latitude},{coords.longitude}"}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        cur = data.get("current", {})
                        w_speed = float(cur.get("wind_kph", 16.0))
                        w_dir = float(cur.get("wind_degree", 240.0))
                        w_gust = float(cur.get("gust_kph", w_speed * 1.3))
                        temp = float(cur.get("temp_c", 28.5))
                        precip = float(cur.get("precip_mm", 0.0))
                        humidity = float(cur.get("humidity", 78.0))
                        vis = float(cur.get("vis_km", 10.0))
                        cond_text = cur.get("condition", {}).get("text", "Normal Sea Breeze")
                        
                        # Calculate wave height from wind & swell model
                        wave_m = round(max(0.7, min(4.5, 0.03 * (w_speed ** 1.22))), 1)
                        lightning = "thunder" in cond_text.lower() or "storm" in cond_text.lower()
                        
                        return WeatherReport(
                            location=coords,
                            timestamp=self._get_utc_now(),
                            temperature_c=temp,
                            wind_speed_kmh=w_speed,
                            wind_direction_deg=w_dir,
                            wind_gust_kmh=w_gust,
                            wave_height_m=wave_m,
                            wave_direction_deg=round((w_dir - 15) % 360, 1),
                            rainfall_mm=precip,
                            humidity_pct=humidity,
                            visibility_km=vis,
                            lightning_detected=lightning,
                            lightning_distance_km=15.0 if lightning else None,
                            cyclone_status="none",
                            cyclone_category=None,
                            advisory_text=f"Live Observation ({cond_text}): Surface wind {w_speed} km/h with gusts up to {w_gust} km/h.",
                            source="WeatherAPI.com (Live Satellite/Radar Feed)",
                            is_demo=False
                        )
            except Exception as e:
                pass # Fallback smoothly to alternative provider or physical simulation

        # 2. Check for Live OpenWeatherMap if configured
        owm_key = settings.OPENWEATHER_API_KEY or settings.MAP_API_KEY
        if owm_key:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(
                        "https://api.openweathermap.org/data/2.5/weather",
                        params={"lat": coords.latitude, "lon": coords.longitude, "appid": owm_key, "units": "metric"}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        w_speed = float(data.get("wind", {}).get("speed", 4.5)) * 3.6
                        w_dir = float(data.get("wind", {}).get("deg", 240.0))
                        w_gust = float(data.get("wind", {}).get("gust", (w_speed / 3.6) * 1.3)) * 3.6
                        temp = float(data.get("main", {}).get("temp", 28.5))
                        humidity = float(data.get("main", {}).get("humidity", 78.0))
                        vis = float(data.get("visibility", 10000)) / 1000.0
                        cond_desc = data.get("weather", [{}])[0].get("description", "Clear Sea Breeze")
                        precip = float(data.get("rain", {}).get("1h", 0.0))
                        wave_m = round(max(0.7, min(4.5, 0.03 * (w_speed ** 1.22))), 1)
                        lightning = "thunder" in cond_desc.lower() or "storm" in cond_desc.lower()

                        return WeatherReport(
                            location=coords,
                            timestamp=self._get_utc_now(),
                            temperature_c=temp,
                            wind_speed_kmh=round(w_speed, 1),
                            wind_direction_deg=w_dir,
                            wind_gust_kmh=round(w_gust, 1),
                            wave_height_m=wave_m,
                            wave_direction_deg=round((w_dir - 15) % 360, 1),
                            rainfall_mm=precip,
                            humidity_pct=humidity,
                            visibility_km=vis,
                            lightning_detected=lightning,
                            lightning_distance_km=15.0 if lightning else None,
                            cyclone_status="none",
                            cyclone_category=None,
                            advisory_text=f"Live Observation ({cond_desc.title()}): Surface wind {round(w_speed, 1)} km/h with gusts up to {round(w_gust, 1)} km/h.",
                            source="OpenWeatherMap (Live Marine Atmospheric Feed)",
                            is_demo=False
                        )
            except Exception:
                pass

        # Fallback synthetic physical simulation

        # Base realistic physical parameters derived from coastal coordinates
        lat, lon = coords.latitude, coords.longitude
        
        # Spatial variations along Indian coast
        is_bay_of_bengal = lon > 79.5
        is_north = lat > 18.0

        base_wind = 18.0 + 6.0 * math.sin(lat * 0.7) + (4.0 if is_bay_of_bengal else 0.0)
        base_gust = base_wind * 1.35
        base_wave = 1.2 + 0.5 * math.cos(lon * 0.4) + (0.4 if is_north else 0.1)
        
        # Cyclone scenario simulated for northern Bay of Bengal if lat > 19 and lon > 85
        if lat > 19.5 and lon > 85.5:
            cyclone_status = "watch"
            cyclone_cat = "Depression (BOB-02)"
            advisory = "IMD Cyclone Watch: Deep depression forming over North Bay of Bengal. Fishermen advised to remain cautious."
            lightning = True
            lightning_dist = 22.0
            base_wind = 38.0
            base_wave = 2.7
        else:
            cyclone_status = "none"
            cyclone_cat = None
            advisory = "Normal seasonal sea conditions. Nearshore fishing operations feasible."
            lightning = False
            lightning_dist = None

        return WeatherReport(
            location=coords,
            timestamp=self._get_utc_now(),
            temperature_c=round(29.2 + 1.2 * math.sin(lat * 0.3), 1),
            wind_speed_kmh=round(base_wind, 1),
            wind_direction_deg=round(245.0 + 15.0 * math.sin(lat), 1),
            wind_gust_kmh=round(base_gust, 1),
            wave_height_m=round(base_wave, 1),
            wave_direction_deg=round(230.0 + 10.0 * math.cos(lon), 1),
            rainfall_mm=round(2.5 if is_bay_of_bengal else 0.4, 1),
            humidity_pct=round(78.0 + 8.0 * math.sin(lon * 0.5), 1),
            visibility_km=round(9.5 if not lightning else 6.0, 1),
            lightning_detected=lightning,
            lightning_distance_km=lightning_dist,
            cyclone_status=cyclone_status,
            cyclone_category=cyclone_cat,
            advisory_text=advisory,
            source="IMD / MOSDAC Satellite Feed (Synthetic Demo)",
            is_demo=True
        )

    async def get_ocean_conditions(self, coords: Coordinates) -> MarineObservation:
        import httpx
        from app.config import settings

        lat, lon = coords.latitude, coords.longitude

        # Base calculations for physical fallback
        sst_base = round(28.4 + 0.8 * math.sin(lat * 0.5) - 0.4 * math.cos(lon * 0.3), 1)
        coast_proximity = min(abs(lon - 72.8), abs(lon - 80.2), abs(lat - 8.1))
        chl_base = round(max(0.4, min(4.2, 2.4 / (1.0 + coast_proximity * 0.8))), 2)
        wave_h = round(1.3 + 0.4 * math.sin(lat * 0.6), 1)
        wave_dir = round(235.0, 1)
        wind_s = round(19.5 + 4.0 * math.cos(lon * 0.2), 1)
        wind_dir = round(240.0, 1)

        tide_states = ["Rising Tide (Flood)", "High Tide (Slack)", "Falling Tide (Ebb)", "Low Tide"]
        tide_idx = int((lat * 10 + lon * 5) % 4)
        tide_status = tide_states[tide_idx]
        tide_height = round(1.4 + 0.6 * math.sin(lat * 1.5), 2)

        # 1. PRIMARY: Check for Real ISRO MOSDAC Spaceborne Observations (EOS-06 OCM / INSAT-3DR SST / EOS-06 SCAT)
        mosdac_vars = {}
        mosdac_meta = None
        try:
            from app.providers.mosdac_provider import MosdacDataProvider
            mosdac = MosdacDataProvider()
            mosdac_meta = mosdac.get_normalized_marine_data(coords)
            mosdac_vars = mosdac_meta.get("variables", {})
        except Exception:
            pass

        # 2. Check for Live StormGlass Marine API (for wave spectrum and currents)
        sg_key = settings.STORMGLASS_API_KEY or settings.OCEAN_API_KEY
        if sg_key:
            try:
                headers = {"Authorization": sg_key}
                params = {
                    "lat": coords.latitude,
                    "lng": coords.longitude,
                    "params": "waterTemperature,waveHeight,waveDirection,currentSpeed,currentDirection"
                }
                async with httpx.AsyncClient(timeout=4.0) as client:
                    resp = await client.get("https://api.stormglass.io/v2/weather/point", headers=headers, params=params)
                    if resp.status_code == 200:
                        data = resp.json()
                        hours = data.get("hours", [])
                        if hours:
                            h0 = hours[0]
                            def _val(d, default_val):
                                if isinstance(d, dict):
                                    for src in ["sg", "meto", "ecmwf", "noaa", "dwd"]:
                                        if src in d and d[src] is not None:
                                            return float(d[src])
                                    for v in d.values():
                                        if v is not None:
                                            return float(v)
                                elif d is not None:
                                    return float(d)
                                return default_val

                            wave_h = round(_val(h0.get("waveHeight"), wave_h), 1)
                            wave_dir = round(_val(h0.get("waveDirection"), wave_dir), 1)
                            if not mosdac_vars:
                                sst_base = round(_val(h0.get("waterTemperature"), sst_base), 1)
            except Exception:
                pass

        sea_state = "Slight (Wave 0.5m-1.25m)" if wave_h < 1.5 else "Moderate (Wave 1.25m-2.5m)" if wave_h < 2.5 else "Rough (Wave > 2.5m)"

        # If MOSDAC spaceborne data is available, return verified ISRO satellite observation
        if mosdac_vars:
            live_sst = mosdac_vars.get("sst", sst_base)
            live_chl = mosdac_vars.get("chlorophyll", chl_base)
            live_wind = mosdac_vars.get("wind_speed", wind_s)
            live_wind_dir = mosdac_vars.get("wind_direction", wind_dir)

            provenance_products = mosdac_meta.get("provenance", {}).get("verified_satellite_products", []) if mosdac_meta else []
            sensors_used = [p.get("sensor", "") for p in provenance_products if p.get("sensor")]
            sensor_label = " & ".join(sensors_used) if sensors_used else "EOS-06 / INSAT-3DR"

            return MarineObservation(
                location=coords,
                timestamp=mosdac_meta.get("timestamp", self._get_utc_now()) if mosdac_meta else self._get_utc_now(),
                sst=live_sst,
                chlorophyll=live_chl,
                wave_height=wave_h,
                wave_direction=wave_dir,
                wind_speed=live_wind,
                wind_direction=live_wind_dir,
                rainfall=0.8,
                tide=tide_status,
                tide_height_m=tide_height,
                sea_state=sea_state,
                source=f"ISRO MOSDAC ({sensor_label}) - Spaceborne Telemetry",
                data_type="MOSDAC_LIVE_SATELLITE",
                is_demo=False
            )

        # Sea Surface Temperature (SST) in Indian waters: typically 27.5 - 30.2 C
        sst = round(28.4 + 0.8 * math.sin(lat * 0.5) - 0.4 * math.cos(lon * 0.3), 1)
        
        # Chlorophyll-a: coastal upwelling produces 1.5 - 3.5 mg/m3; offshore 0.3 - 0.9
        # Distance to nominal coastline estimate
        coast_proximity = min(abs(lon - 72.8), abs(lon - 80.2), abs(lat - 8.1))
        chlorophyll = round(max(0.4, min(4.2, 2.4 / (1.0 + coast_proximity * 0.8))), 2)

        wave_h = round(1.3 + 0.4 * math.sin(lat * 0.6), 1)
        wind_s = round(19.5 + 4.0 * math.cos(lon * 0.2), 1)
        wind_dir = round(240.0, 1)

        tide_states = ["Rising Tide (Flood)", "High Tide (Slack)", "Falling Tide (Ebb)", "Low Tide"]
        tide_idx = int((lat * 10 + lon * 5) % 4)
        tide_status = tide_states[tide_idx]
        tide_height = round(1.4 + 0.6 * math.sin(lat * 1.5), 2)

        sea_state = "Slight (Wave 0.5m-1.25m)" if wave_h < 1.5 else "Moderate (Wave 1.25m-2.5m)" if wave_h < 2.5 else "Rough (Wave > 2.5m)"

        # 3. Check for Real ISRO MOSDAC Spaceborne Observations (INSAT-3DR / EOS-06 OCM / EOS-06 SCAT)
        try:
            from app.providers.mosdac_provider import MosdacDataProvider
            mosdac = MosdacDataProvider()
            mosdac_data = mosdac.get_normalized_marine_data(coords)
            vars_dict = mosdac_data.get("variables", {})
            if vars_dict:
                live_sst = vars_dict.get("sst", sst)
                live_chl = vars_dict.get("chlorophyll", chlorophyll)
                live_wind = vars_dict.get("wind_speed", wind_s)
                live_wind_dir = vars_dict.get("wind_direction", wind_dir)

                provenance_products = mosdac_data.get("provenance", {}).get("verified_satellite_products", [])
                sensors_used = [p.get("sensor", "") for p in provenance_products if p.get("sensor")]
                sensor_label = " & ".join(sensors_used) if sensors_used else "EOS-06 / INSAT-3DR"

                return MarineObservation(
                    location=coords,
                    timestamp=mosdac_data.get("timestamp", self._get_utc_now()),
                    sst=live_sst,
                    chlorophyll=live_chl,
                    wave_height=wave_h,
                    wave_direction=round(235.0, 1),
                    wind_speed=live_wind,
                    wind_direction=live_wind_dir,
                    rainfall=0.8,
                    tide=tide_status,
                    tide_height_m=tide_height,
                    sea_state=sea_state,
                    source=f"ISRO MOSDAC ({sensor_label}) - Spaceborne Telemetry",
                    data_type="MOSDAC_LIVE_SATELLITE",
                    is_demo=False
                )
        except Exception:
            pass

        return MarineObservation(
            location=coords,
            timestamp=self._get_utc_now(),
            sst=sst,
            chlorophyll=chlorophyll,
            wave_height=wave_h,
            wave_direction=round(235.0, 1),
            wind_speed=wind_s,
            wind_direction=round(240.0, 1),
            rainfall=0.8,
            tide=tide_status,
            tide_height_m=tide_height,
            sea_state=sea_state,
            source="INCOIS / ISRO Oceansat-3 OCM/AASS (Synthetic Demo)",
            data_type="demo",
            is_demo=True
        )

    async def get_marine_conditions(self, coords: Coordinates, timestamp: Optional[str] = None) -> Dict[str, Any]:
        ocean = await self.get_ocean_conditions(coords)
        weather = await self.get_weather(coords, target_time=timestamp)
        return {
            "source": ocean.source,
            "dataset_id": "SYNTHETIC_DEMO",
            "timestamp": ocean.timestamp,
            "latitude": coords.latitude,
            "longitude": coords.longitude,
            "variables": {
                "sst": ocean.sst,
                "sst_unit": "°C",
                "chlorophyll": ocean.chlorophyll,
                "chlorophyll_unit": "mg/m3",
                "wind_speed": weather.wind_speed_kmh,
                "wind_speed_unit": "km/h",
                "wind_direction": weather.wind_direction_deg,
                "wind_direction_unit": "deg",
                "wave_height": ocean.wave_height or weather.wave_height_m,
                "wave_height_unit": "m",
            },
            "file": "DEMO_SIMULATED",
            "processing_status": "SYNTHETIC_SIMULATION",
            "provenance": {
                "source_authority": "SamudraAI Demo Simulator",
                "observation_time": ocean.timestamp,
                "processing_time": self._get_utc_now(),
                "is_synthetic": True,
                "verified_satellite_products": []
            }
        }

    async def get_pfz_advisories(self, coords: Coordinates, radius_km: float = 10.0) -> List[PFZZone]:
        # Dynamically scan coastal waters <= 10 km using ML Random Forest inference
        from app.ml.dynamic_scanner import dynamic_pfz_scanner
        effective_radius = min(radius_km, 10.0)
        return dynamic_pfz_scanner.scan_dynamic_pfz(
            origin=coords,
            max_distance_km=effective_radius,
            min_distance_km=1.0,
            top_k=8
        )


    async def get_boundary_contexts(self, coords: Coordinates) -> Dict[str, Any]:
        lat, lon = coords.latitude, coords.longitude
        nearest_imbl = None
        min_imbl_dist = float("inf")

        for imbl in IMBL_BOUNDARIES:
            line_coords = imbl["coordinates"]
            for i in range(len(line_coords) - 1):
                p1, p2 = line_coords[i], line_coords[i+1]
                dist = haversine_distance(lat, lon, p1[0], p1[1])
                if dist < min_imbl_dist:
                    min_imbl_dist = dist
                    nearest_imbl = imbl

        # MPAs check
        inside_mpa = None
        nearest_mpa = None
        min_mpa_dist = float("inf")
        for mpa in MARINE_PROTECTED_AREAS:
            if is_point_in_polygon(lat, lon, mpa["polygon"]):
                inside_mpa = mpa
                min_mpa_dist = 0.0
                break
            d = distance_to_polygon(lat, lon, mpa["polygon"])
            if d < min_mpa_dist:
                min_mpa_dist = d
                nearest_mpa = mpa

        # Restricted Zones check
        inside_restricted = None
        for rz in RESTRICTED_ZONES:
            if is_point_in_polygon(lat, lon, rz["polygon"]):
                inside_restricted = rz
                break

        return {
            "imbl": {
                "name": nearest_imbl["name"] if nearest_imbl else "None",
                "distance_km": round(min_imbl_dist, 2),
                "is_approaching": min_imbl_dist <= 20.0,
                "is_critical": min_imbl_dist <= 5.0
            },
            "mpa": {
                "inside": inside_mpa is not None,
                "name": inside_mpa["name"] if inside_mpa else (nearest_mpa["name"] if nearest_mpa else "None"),
                "distance_km": round(min_mpa_dist, 2),
                "restriction": inside_mpa["restriction"] if inside_mpa else "Standard Coastal Regulation Zone"
            },
            "restricted_zone": {
                "inside": inside_restricted is not None,
                "name": inside_restricted["name"] if inside_restricted else "None",
                "authority": inside_restricted["authority"] if inside_restricted else "None"
            }
        }

    async def get_active_alerts(self, coords: Coordinates) -> List[MarineAlert]:
        alerts: List[MarineAlert] = []
        lat, lon = coords.latitude, coords.longitude
        now_str = self._get_utc_now()

        # 1. IMBL Proximity Check
        boundaries = await self.get_boundary_contexts(coords)
        imbl = boundaries["imbl"]
        if imbl["is_critical"]:
            alerts.append(MarineAlert(
                id="alt_imbl_critical",
                title="CRITICAL: International Maritime Boundary Proximity",
                severity="EXTREME",
                category="IMBL",
                location=coords,
                affected_radius_km=10.0,
                message=f"Vessel is within {imbl['distance_km']} km of {imbl['name']}. Immediate course reversal required to avoid sovereign airspace/water transgression.",
                issued_at=now_str,
                expires_at="2026-09-14T23:59:59Z",
                source="Indian Coast Guard / INCOIS Geofence Monitor",
                is_demo=True
            ))
        elif imbl["is_approaching"]:
            alerts.append(MarineAlert(
                id="alt_imbl_warn",
                title="WARNING: Approaching Maritime Boundary Line",
                severity="HIGH",
                category="IMBL",
                location=coords,
                affected_radius_km=20.0,
                message=f"Vessel is within {imbl['distance_km']} km of {imbl['name']}. Exercise caution and maintain active AIS transponder.",
                issued_at=now_str,
                expires_at="2026-09-14T23:59:59Z",
                source="Indian Coast Guard / INCOIS Geofence Monitor",
                is_demo=True
            ))

        # 2. MPA Check
        mpa = boundaries["mpa"]
        if mpa["inside"]:
            alerts.append(MarineAlert(
                id="alt_mpa_breach",
                title=f"RESTRICTED AREA: Inside {mpa['name']}",
                severity="HIGH",
                category="MPA",
                location=coords,
                affected_radius_km=15.0,
                message=f"Mechanized commercial fishing is prohibited in this protected reserve. {mpa['restriction']}.",
                issued_at=now_str,
                expires_at="2026-09-14T23:59:59Z",
                source="Ministry of Environment, Forest and Climate Change (MoEFCC)",
                is_demo=True
            ))

        # 3. Wave & Weather alert
        weather = await self.get_weather(coords)
        if weather.cyclone_status != "none":
            alerts.append(MarineAlert(
                id="alt_cyclone_active",
                title=f"CYCLONE ALERT: {weather.cyclone_category}",
                severity="EXTREME",
                category="CYCLONE",
                location=coords,
                affected_radius_km=150.0,
                message=f"{weather.advisory_text} Maximum sustained winds expected up to 65 km/h.",
                issued_at=now_str,
                expires_at="2026-09-14T18:00:00Z",
                source="India Meteorological Department (IMD)",
                is_demo=True
            ))
        elif weather.wave_height_m >= 2.5:
            alerts.append(MarineAlert(
                id="alt_high_wave",
                title="HIGH WAVE WARNING: Swell Surge",
                severity="HIGH",
                category="WAVE",
                location=coords,
                affected_radius_km=60.0,
                message=f"Significant wave height exceeding {weather.wave_height_m} meters. Small crafts and country boats advised against venturing offshore.",
                issued_at=now_str,
                expires_at="2026-09-14T12:00:00Z",
                source="INCOIS Ocean State Forecast (OSF)",
                is_demo=True
            ))
        else:
            alerts.append(MarineAlert(
                id="alt_routine_marine",
                title="Routine Ocean State Advisory",
                severity="INFORMATIONAL",
                category="WIND",
                location=coords,
                affected_radius_km=50.0,
                message="Normal navigational conditions prevailing along coastal corridors. Wind speeds 15-22 km/h.",
                issued_at=now_str,
                expires_at="2026-09-14T23:59:59Z",
                source="INCOIS Marine Bulletin",
                is_demo=True
            ))

        return alerts

    def get_source_metadata(self) -> List[DataSourceInfo]:
        now_str = self._get_utc_now()
        sources = []

        # Check real ISRO MOSDAC provider status
        mosdac_status = None
        try:
            from app.providers.mosdac_provider import MosdacDataProvider
            mosdac = MosdacDataProvider()
            mosdac_status = mosdac.get_technical_dashboard_status()
        except Exception:
            pass

        if mosdac_status and mosdac_status.get("connection_status") == "ONLINE":
            # Map the 3 live MOSDAC products
            prod_map = {p["product_key"]: p for p in mosdac_status.get("products", [])}

            # 1. EOS-06 OCM Chlorophyll
            chl = prod_map.get("chlorophyll", {})
            sources.append(DataSourceInfo(
                id="isro_eos06_ocm",
                name="ISRO EOS-06 (Oceansat-3) OCM-3",
                organization="ISRO Space Applications Centre (SAC), Ahmedabad",
                dataset_name="Analysed Chlorophyll-a (E06OCM_L4_AC)",
                parameters="Chlorophyll-a concentration (mg/m³), diffuse attenuation coefficient",
                status="LIVE" if chl.get("processing_status") == "INGESTED" else "ONLINE",
                is_demo=False if chl.get("processing_status") == "INGESTED" else True,
                last_update=chl.get("last_data_update", now_str),
                update_frequency="Daily Orbital Swath",
                description=f"Spaceborne ocean color radiometry downloaded from MOSDAC standing order (File: {chl.get('data_file', 'N/A')}).",
                official_portal="https://mosdac.gov.in",
                config_env_var="MOSDAC_USERNAME"
            ))

            # 2. INSAT-3DR SST
            sst = prod_map.get("sst", {})
            sources.append(DataSourceInfo(
                id="isro_insat3dr_sst",
                name="ISRO INSAT-3DR Imager (1DVAR)",
                organization="ISRO Space Applications Centre (SAC), Ahmedabad",
                dataset_name="Sea Surface Temperature (3RIMG_L2B_SST)",
                parameters="Sea Surface Temperature (°C), Kelvin conversion, cloud mask",
                status="LIVE" if sst.get("processing_status") == "INGESTED" else "ONLINE",
                is_demo=False if sst.get("processing_status") == "INGESTED" else True,
                last_update=sst.get("last_data_update", now_str),
                update_frequency="Half-Hourly Geostationary",
                description=f"Geostationary thermal infrared SST raster retrieved from MOSDAC standing order (File: {sst.get('data_file', 'N/A')}).",
                official_portal="https://mosdac.gov.in",
                config_env_var="MOSDAC_PASSWORD"
            ))

            # 3. EOS-06 SCAT Ocean Winds
            wind = prod_map.get("wind", {})
            sources.append(DataSourceInfo(
                id="isro_eos06_scat",
                name="ISRO EOS-06 SCAT-3",
                organization="ISRO Space Applications Centre (SAC), Ahmedabad",
                dataset_name="Ocean Surface Wind Vector (E06SCT_L2B_WV12)",
                parameters="Ocean surface wind speed (km/h), wind direction (deg)",
                status="LIVE" if wind.get("processing_status") == "INGESTED" else "ONLINE",
                is_demo=False if wind.get("processing_status") == "INGESTED" else True,
                last_update=wind.get("last_data_update", now_str),
                update_frequency="Daily Orbital Revisit",
                description=f"Spaceborne Ku-band Scatterometer surface wind vectors from MOSDAC (File: {wind.get('data_file', 'N/A')}).",
                official_portal="https://mosdac.gov.in",
                config_env_var="MOSDAC_USERNAME"
            ))
        else:
            sources.append(DataSourceInfo(
                id="isro_oceansat3",
                name="ISRO Oceansat-3 (EOS-06)",
                organization="Indian Space Research Organisation",
                dataset_name="Ocean Colour Monitor (OCM-3) & AASS-derived SST",
                parameters="Sea Surface Temperature (SST), Chlorophyll-a concentration, diffuse attenuation coefficient",
                status="ACTIVE_DEMO",
                is_demo=True,
                last_update=now_str,
                update_frequency="Daily (6-hour orbital revisit)",
                description="Spaceborne thermal infrared and multi-spectral ocean color radiometry providing high-resolution oceanic fronts for PFZ generation.",
                official_portal="https://mosdac.gov.in",
                config_env_var="SATELLITE_API_KEY"
            ))

        sources.extend([
            DataSourceInfo(
                id="incois_pfz",
                name="INCOIS Potential Fishing Zones Advisory",
                organization="Indian National Centre for Ocean Information Services (MoES)",
                dataset_name="Integrated Multilingual PFZ & Ocean State Forecast (OSF)",
                parameters="PFZ coordinates, depth, compass bearing, ocean surface currents, wave spectrum",
                status="ACTIVE_DEMO",
                is_demo=True,
                last_update=now_str,
                update_frequency="Daily at 06:00 & 18:00 IST",
                description="Operational PFZ bulletins synthesized by INCOIS from satellite SST and Chlorophyll composites to reduce search time for traditional fishermen.",
                official_portal="https://incois.gov.in/portal/pfz/pfz.jsp",
                config_env_var="OCEAN_API_KEY"
            ),
            DataSourceInfo(
                id="imd_marine",
                name="IMD Marine Weather & Cyclone Bulletin",
                organization="India Meteorological Department (MoES)",
                dataset_name="Coastal Weather Forecast, Squall Warnings & Cyclone Tracks",
                parameters="Wind speed & gust, swell height, sea state, visibility, thunderstorm & lightning detection",
                status="ACTIVE_DEMO",
                is_demo=True,
                last_update=now_str,
                update_frequency="3-Hourly Updates",
                description="Authoritative national meteorological advisories for maritime navigation and coastal ports along Arabian Sea and Bay of Bengal.",
                official_portal="https://mausam.imd.gov.in",
                config_env_var="WEATHER_API_KEY"
            ),
            DataSourceInfo(
                id="icg_gis",
                name="National Marine Spatial GIS Repository",
                organization="Indian Coast Guard / Survey of India",
                dataset_name="IMBL, Marine Protected Areas, Oil Offshore Exclusion Zones",
                parameters="Sovereignty lines, bilateral agreements (1974/1976), wildlife protection buffers",
                status="ACTIVE_DEMO",
                is_demo=True,
                last_update=now_str,
                update_frequency="Quarterly / Statutory",
                description="Verified nautical polygon perimeters for maritime security, ecological preservation, and defense hazard avoidance.",
                official_portal="https://indiancoastguard.gov.in",
                config_env_var="MAP_API_KEY"
            )
        ])

        return sources
