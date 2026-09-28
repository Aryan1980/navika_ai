"""Provider Abstraction Layer - Abstract base classes for marine data providers."""
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from app.schemas.marine import Coordinates, MarineObservation, PFZZone, WeatherReport
from app.schemas.alert import MarineAlert
from app.schemas.data_sources import DataSourceInfo

class WeatherProvider(ABC):
    @abstractmethod
    async def get_weather(self, coords: Coordinates, target_time: Optional[str] = None) -> WeatherReport:
        """Retrieve atmospheric and surface meteorological conditions."""
        pass

class OceanProvider(ABC):
    @abstractmethod
    async def get_ocean_conditions(self, coords: Coordinates) -> MarineObservation:
        """Retrieve hydrodynamic and biogeochemical ocean parameters (SST, Chl-a, waves, tide)."""
        pass

class PFZProvider(ABC):
    @abstractmethod
    async def get_pfz_advisories(self, coords: Coordinates, radius_km: float = 120.0) -> List[PFZZone]:
        """Retrieve Potential Fishing Zones derived from thermal-chlorophyll frontal features."""
        pass

class GISProvider(ABC):
    @abstractmethod
    async def get_boundary_contexts(self, coords: Coordinates) -> Dict[str, Any]:
        """Check proximity to IMBL, Marine Protected Areas, and restricted military/energy zones."""
        pass

class AlertProvider(ABC):
    @abstractmethod
    async def get_active_alerts(self, coords: Coordinates) -> List[MarineAlert]:
        """Retrieve active severe weather, high wave, lightning, and navigational advisories."""
        pass

class MarineDataProvider(WeatherProvider, OceanProvider, PFZProvider, GISProvider, AlertProvider):
    """Unified interface aggregating all individual provider capabilities."""
    @abstractmethod
    def get_source_metadata(self) -> List[DataSourceInfo]:
        """Return data provenance, dataset description, and live/demo status."""
        pass

    @abstractmethod
    async def get_marine_conditions(self, coords: Coordinates, timestamp: Optional[str] = None) -> Dict[str, Any]:
        """Retrieve unified normalized spaceborne and oceanographic observations."""
        pass

