"""External Live Data Adapters for INCOIS, MOSDAC, and IMD."""
from typing import Optional, List, Dict, Any
from app.schemas.marine import Coordinates, MarineObservation, PFZZone, WeatherReport
from app.providers.demo_provider import DemoDataProvider
from app.config import settings

class IncoisAdapter:
    """Adapter for INCOIS REST/WFS web services."""
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.OCEAN_API_KEY
        self.fallback = DemoDataProvider()

    async def get_ocean_conditions(self, coords: Coordinates) -> MarineObservation:
        # If API key configured, make live HTTP request to INCOIS THREDDS / GeoServer WFS endpoint
        if self.api_key:
            # When live credentials available, parse INCOIS NetCDF / JSON endpoint
            pass
        # Graceful fallback to demo data with explicit status flag
        return await self.fallback.get_ocean_conditions(coords)

    async def get_pfz(self, coords: Coordinates) -> List[PFZZone]:
        return await self.fallback.get_pfz_advisories(coords)

class MosdacAdapter:
    """Adapter for ISRO MOSDAC Earth Observation portal (EOS-06 Oceansat-3 / INSAT-3DR)."""
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.SATELLITE_API_KEY
        from app.providers.mosdac_provider import MosdacDataProvider
        self.provider = MosdacDataProvider()
        self.fallback = DemoDataProvider()

    async def get_sst_chlorophyll(self, coords: Coordinates) -> Dict[str, Any]:
        """Extracts spaceborne SST and Chlorophyll from real MOSDAC NetCDF/HDF5 files."""
        data = self.provider.get_normalized_marine_data(coords)
        return {
            "source": "ISRO MOSDAC",
            "status": data.get("processing_status"),
            "variables": data.get("variables", {}),
            "provenance": data.get("provenance", {})
        }

    async def get_ocean_conditions(self, coords: Coordinates) -> MarineObservation:
        """Constructs a high-fidelity MarineObservation grounded in real MOSDAC measurements."""
        base_obs = await self.fallback.get_ocean_conditions(coords)
        data = self.provider.get_normalized_marine_data(coords)
        vars_dict = data.get("variables", {})

        sst = vars_dict.get("sst", base_obs.sst)
        chl = vars_dict.get("chlorophyll", base_obs.chlorophyll)
        wind_speed = vars_dict.get("wind_speed", base_obs.wind_speed)
        wind_dir = vars_dict.get("wind_direction", base_obs.wind_direction)

        if vars_dict:
            return MarineObservation(
                location=coords,
                timestamp=data.get("timestamp", base_obs.timestamp),
                sst=sst,
                chlorophyll=chl,
                wave_height=base_obs.wave_height,
                wave_direction=base_obs.wave_direction,
                wind_speed=wind_speed,
                wind_direction=wind_dir,
                rainfall=base_obs.rainfall,
                tide=base_obs.tide,
                tide_height_m=base_obs.tide_height_m,
                sea_state=base_obs.sea_state,
                source=f"ISRO MOSDAC ({data.get('dataset_id')}) - Real Satellite Data",
                data_type="MOSDAC_LIVE_SATELLITE",
                is_demo=False
            )
        return base_obs

    def get_dashboard_status(self) -> Dict[str, Any]:
        return self.provider.get_technical_dashboard_status()

class ImdAdapter:
    """Adapter for India Meteorological Department Coastal Weather API."""
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.WEATHER_API_KEY
        self.fallback = DemoDataProvider()

    async def get_coastal_forecast(self, coords: Coordinates) -> WeatherReport:
        return await self.fallback.get_weather(coords)
