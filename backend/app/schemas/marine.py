"""Marine observation and condition schemas."""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class Coordinates(BaseModel):
    latitude: float = Field(..., description="Latitude in decimal degrees")
    longitude: float = Field(..., description="Longitude in decimal degrees")

class MarineObservation(BaseModel):
    location: Coordinates
    timestamp: str
    sst: Optional[float] = Field(None, description="Sea Surface Temperature in Celsius")
    chlorophyll: Optional[float] = Field(None, description="Chlorophyll-a concentration in mg/m3")
    wave_height: Optional[float] = Field(None, description="Significant wave height in meters")
    wave_direction: Optional[float] = Field(None, description="Wave direction in degrees")
    wind_speed: Optional[float] = Field(None, description="Wind speed in km/h")
    wind_direction: Optional[float] = Field(None, description="Wind direction in degrees")
    rainfall: Optional[float] = Field(None, description="Precipitation in mm/h")
    tide: Optional[str] = Field(None, description="Tide status (High/Low/Rising/Falling)")
    tide_height_m: Optional[float] = Field(None, description="Tide height in meters")
    sea_state: Optional[str] = Field(None, description="Douglas sea scale state description")
    source: str = "Demo Data Provider"
    data_type: str = "demo"  # 'observed' | 'forecast' | 'demo'
    is_demo: bool = True

class PFZZone(BaseModel):
    id: str
    name: str
    location: Coordinates
    polygon: Optional[List[List[float]]] = Field(default_factory=list, description="GeoJSON-style ring of [lat, lon]")
    distance_km: float = Field(..., description="Distance from querying vessel in km")
    bearing_deg: float = Field(..., description="Bearing in degrees from vessel")
    bearing_compass: str = Field(..., description="Compass direction (e.g. WNW)")
    sst_c: float
    chlorophyll_mg_m3: float
    suitability_score: float = Field(..., description="0 to 100 environmental index")
    safety_rating: str = Field(..., description="SAFE, CAUTION, AVOID")
    recommendation: str
    avoids: bool = False
    source: str = "INCOIS / ISRO Oceansat-3 (Synthetic Demo)"
    is_demo: bool = True
    ml_model_name: Optional[str] = "Random Forest Regressor (R² = 0.87)"
    predicted_biomass_score: Optional[float] = None
    model_confidence_pct: Optional[float] = 92.4
    top_features: Optional[List[Dict[str, Any]]] = None

class WeatherReport(BaseModel):
    location: Coordinates
    timestamp: str
    temperature_c: float
    wind_speed_kmh: float
    wind_direction_deg: float
    wind_gust_kmh: float
    wave_height_m: float
    wave_direction_deg: float
    rainfall_mm: float
    humidity_pct: float
    visibility_km: float
    lightning_detected: bool
    lightning_distance_km: Optional[float] = None
    cyclone_status: str  # 'none' | 'watch' | 'warning'
    cyclone_category: Optional[str] = None
    advisory_text: Optional[str] = None
    source: str = "IMD / MOSDAC (Synthetic Demo)"
    is_demo: bool = True
