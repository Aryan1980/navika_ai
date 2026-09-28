"""Conversational agent schemas."""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.marine import Coordinates, MarineObservation, PFZZone
from app.schemas.risk import RiskAssessment
from app.schemas.route import RouteComparison
from app.schemas.alert import MarineAlert

class AgentTrace(BaseModel):
    agent_name: str
    status: str = Field(..., description="COMPLETED, FALLBACK, SKIPPED")
    execution_time_ms: int
    data_source: str
    summary: str

class EvidenceDetails(BaseModel):
    intent_detected: str
    datasets_used: List[str]
    timestamps: Dict[str, str]
    deterministic_score: float
    risk_factors: Dict[str, Any]
    observed_vs_forecast: str
    demo_vs_live: str
    agent_reasoning_flow: List[str]
    multi_agent_evidence: Optional[Dict[str, List[str]]] = Field(default_factory=dict)
    provenance: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ChatRequest(BaseModel):
    query: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    language: Optional[str] = "en"
    conversation_id: Optional[str] = None
    active_layers: Optional[List[str]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    direct_answer: str
    risk_level: str
    safety_verdict: str
    recommendation: str
    conditions_summary: Optional[Dict[str, Any]] = None
    evidence: EvidenceDetails
    agent_traces: List[AgentTrace]
    active_map_layers: List[str]
    suggested_queries: List[str]
    relevant_pfz: Optional[List[PFZZone]] = None
    route_comparison: Optional[RouteComparison] = None
    alerts: Optional[List[MarineAlert]] = None
    focus_location: Coordinates
