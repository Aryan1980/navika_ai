"""Nautical Route, Waypoint, and Marine Navigation schemas for Google Maps for the Ocean."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.marine import Coordinates

class Waypoint(BaseModel):
    name: str
    latitude: float
    longitude: float
    hazard_distance_km: Optional[float] = None
    segment_risk: str = "LOW"
    bearing_deg: Optional[float] = None
    bearing_compass: Optional[str] = None
    leg_distance_km: Optional[float] = None
    leg_distance_nm: Optional[float] = None
    eta_minutes: Optional[float] = None
    instruction: Optional[str] = None
    sea_state: Optional[str] = None

class RouteOption(BaseModel):
    route_type: str = Field(..., description="'shortest' or 'safe'")
    waypoints: List[Waypoint]
    distance_km: float
    estimated_duration_hours: float
    distance_nm: Optional[float] = None
    estimated_duration_minutes: Optional[float] = None
    estimated_fuel_liters: Optional[float] = None
    risk_level: str
    hazards_intersected: List[str] = Field(default_factory=list)
    description: str
    turn_by_turn_instructions: List[str] = Field(default_factory=list)
    emergency_port_refuge: Optional[Dict[str, Any]] = None

class RouteComparison(BaseModel):
    origin: Coordinates
    destination: Coordinates
    shortest_route: RouteOption
    safe_route: RouteOption
    recommendation: str
    reasoning: str
