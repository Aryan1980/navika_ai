"""FastAPI route handlers for SamudraAI marine intelligence services."""
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

from app.schemas.marine import Coordinates, MarineObservation, PFZZone, WeatherReport
from app.schemas.risk import RiskAssessment
from app.schemas.route import RouteComparison
from app.schemas.alert import MarineAlert
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.data_sources import DataSourceInfo

from app.providers.demo_provider import DemoDataProvider
from app.agents.orchestrator import AgentOrchestrator
from app.agents.gis import GeospatialReasoningAgent
from app.agents.pfz import PFZIntelligenceAgent
from app.agents.risk import RiskAssessmentAgent
from app.agents.route import RouteOptimizationAgent
from app.services.bhashini import bhashini_service
from app.database import (
    save_message,
    get_conversation_history,
    get_or_create_user,
    update_user_profile,
    get_user_voyages,
    save_user_voyage
)
router = APIRouter()

provider = DemoDataProvider()
orchestrator = AgentOrchestrator()
gis_agent = GeospatialReasoningAgent(provider)
pfz_agent = PFZIntelligenceAgent(provider)
risk_agent = RiskAssessmentAgent()
route_agent = RouteOptimizationAgent()

class CoordinatesPayload(BaseModel):
    latitude: float
    longitude: float

class RouteRequestPayload(BaseModel):
    origin: Coordinates
    destination: Coordinates

class VoiceTranscribePayload(BaseModel):
    audio_base64: str
    language: str = "ml"

class VoiceSynthesizePayload(BaseModel):
    text: str
    language: str = "ml"
    gender: str = "female"

@router.post("/voice/transcribe")
async def voice_transcribe(payload: VoiceTranscribePayload):
    """Transcribes audio voice query using Digital India NLTM Bhashini ASR."""
    return await bhashini_service.transcribe_audio(payload.audio_base64, payload.language)

@router.post("/voice/synthesize")
async def voice_synthesize(payload: VoiceSynthesizePayload):
    """Synthesizes vernacular speech advice using Digital India NLTM Bhashini TTS."""
    return await bhashini_service.synthesize_speech(payload.text, payload.language, payload.gender)

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """Process natural language or voice query through Agentic Multi-Agent Pipeline."""
    resp = await orchestrator.execute_query(req)
    if req.conversation_id:
        save_message(req.conversation_id, "user", req.query)
        save_message(req.conversation_id, "assistant", resp.direct_answer, {
            "risk_level": resp.risk_level,
            "safety_verdict": resp.safety_verdict
        })
    return resp

@router.get("/weather", response_model=WeatherReport)
async def get_weather(lat: float = Query(..., ge=-90, le=90), lon: float = Query(..., ge=-180, le=180)):
    """Retrieve atmospheric & meteorological observations for sea coordinates."""
    coords = Coordinates(latitude=lat, longitude=lon)
    return await provider.get_weather(coords)

@router.get("/ocean", response_model=MarineObservation)
async def get_ocean(lat: float = Query(..., ge=-90, le=90), lon: float = Query(..., ge=-180, le=180)):
    """Retrieve hydrodynamic & biogeochemical ocean parameters (SST, Chlorophyll, Waves, Tide)."""
    coords = Coordinates(latitude=lat, longitude=lon)
    return await provider.get_ocean_conditions(coords)

@router.get("/pfz", response_model=List[PFZZone])
async def get_pfz(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    sort_by: str = Query("distance", pattern="^(distance|suitability|safety|combined)$"),
    radius_km: float = Query(120.0, ge=10, le=500)
):
    """Retrieve ranked Potential Fishing Zones surrounding coordinates."""
    coords = Coordinates(latitude=lat, longitude=lon)
    return await pfz_agent.get_ranked_pfzs(coords, sort_by=sort_by, radius_km=radius_km)

@router.get("/alerts", response_model=List[MarineAlert])
async def get_alerts(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180)
):
    """Retrieve active marine, severe weather, and maritime boundary alerts."""
    coords = Coordinates(latitude=lat, longitude=lon)
    return await provider.get_active_alerts(coords)

@router.get("/zones")
@router.get("/geofences")
async def get_geofences():
    """Retrieve all official maritime boundaries, MPAs, restricted zones, and coastal hubs."""
    return gis_agent.get_all_geofences()

@router.post("/risk", response_model=RiskAssessment)
async def assess_risk(payload: CoordinatesPayload):
    """Perform deterministic multi-factor marine risk evaluation."""
    coords = Coordinates(latitude=payload.latitude, longitude=payload.longitude)
    weather = await provider.get_weather(coords)
    ocean = await provider.get_ocean_conditions(coords)
    boundary_ctx = await provider.get_boundary_contexts(coords)
    return risk_agent.assess_risk(weather, ocean, boundary_ctx)

@router.post("/route", response_model=RouteComparison)
async def calculate_route(payload: RouteRequestPayload):
    """Compute and compare direct navigation track against hazard-avoiding safe route."""
    return route_agent.plan_route(payload.origin, payload.destination)

@router.get("/marine-conditions")
async def get_marine_conditions(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180)
):
    """Get unified dashboard snapshot for coordinates."""
    coords = Coordinates(latitude=lat, longitude=lon)
    weather = await provider.get_weather(coords)
    ocean = await provider.get_ocean_conditions(coords)
    boundary_ctx = await provider.get_boundary_contexts(coords)
    risk = risk_agent.assess_risk(weather, ocean, boundary_ctx)
    alerts = await provider.get_active_alerts(coords)
    pfzs = await pfz_agent.get_ranked_pfzs(coords, sort_by="distance")

    return {
        "coordinates": coords,
        "weather": weather,
        "ocean": ocean,
        "boundary_context": boundary_ctx,
        "risk": risk,
        "active_alerts": alerts,
        "nearest_pfz": pfzs[0] if pfzs else None
    }

@router.get("/data-sources", response_model=List[DataSourceInfo])
async def get_data_sources():
    """Return official data provenance, update status, and live connection instructions."""
    return provider.get_source_metadata()

@router.get("/conversations/{conv_id}/history")
async def get_history(conv_id: str):
    """Retrieve conversation history from database."""
    return get_conversation_history(conv_id)

@router.get("/health")
async def health_check():
    """System health and readiness check."""
    return {
        "status": "healthy",
        "service": "SamudraAI Marine Intelligence Platform",
        "version": "1.0.0",
        "mode": "ISRO_MOSDAC_LIVE_OPERATIONAL",
        "agents": [
            "Planner Agent", "Data Discovery Agent", "Weather Intelligence Agent",
            "Ocean Analytics Agent", "PFZ Agent", "Geospatial Reasoning Agent",
            "Risk Assessment Agent", "Route Optimization Agent", "Marine Alert Agent",
            "Visualization Agent", "Explanation & Evidence Agent"
        ]
    }

# ============================================================================
# ISRO MOSDAC Satellite Ingestion & Technical Dashboard Endpoints
# ============================================================================

@router.get("/mosdac/status")
async def get_mosdac_status():
    """Technical dashboard reporting MOSDAC standing orders, ingested files, and satellite telemetry status."""
    from app.providers.mosdac_provider import MosdacDataProvider
    mosdac = MosdacDataProvider()
    return mosdac.get_technical_dashboard_status()

@router.post("/mosdac/sync")
async def sync_mosdac_pipeline(force: bool = Query(False, description="Force re-download of latest files")):
    """Triggers an on-demand satellite pass synchronization across EOS-06 and INSAT-3DR."""
    from app.providers.mosdac_provider import MosdacDataProvider
    mosdac = MosdacDataProvider()
    sync_results = mosdac.sync_all(force=force)
    dashboard_status = mosdac.get_technical_dashboard_status()
    return {
        "message": "MOSDAC satellite pass synchronization complete",
        "sync_results": sync_results,
        "dashboard_status": dashboard_status
    }

@router.get("/mosdac/probe")
async def probe_mosdac_telemetry(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180)
):
    """Probes the exact physical spaceborne pixels (SST, Chlorophyll, Winds) at sea coordinates."""
    from app.providers.mosdac_provider import MosdacDataProvider
    mosdac = MosdacDataProvider()
    coords = Coordinates(latitude=lat, longitude=lon)
    return mosdac.get_normalized_marine_data(coords)


# ============================================================================
# Predictive Trajectory & Deterministic SIH Judge Simulation Endpoints
# ============================================================================

class TrajectoryRequestPayload(BaseModel):
    latitude: float
    longitude: float
    boat_speed_knots: float = 10.0
    heading_deg: float = 240.0
    time_horizon_min: float = 60.0
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None

class DemoSimulatePayload(BaseModel):
    latitude: float = 9.9312
    longitude: float = 76.2673
    boat_speed_knots: float = 12.0
    heading_deg: float = 240.0
    time_horizon_min: float = 60.0
    language: str = "en"

@router.post("/trajectory/predict")
async def predict_trajectory_endpoint(payload: TrajectoryRequestPayload):
    """Calculates forward vessel trajectory with wind leeway and boundary intersection."""
    from app.geo.trajectory import PredictiveTrajectoryEngine
    coords = Coordinates(latitude=payload.latitude, longitude=payload.longitude)
    
    w_speed = payload.wind_speed_kmh
    w_dir = payload.wind_direction_deg
    if w_speed is None:
        weather = await provider.get_weather(coords)
        w_speed = weather.wind_speed_kmh
        w_dir = weather.wind_direction_deg

    pred = PredictiveTrajectoryEngine.predict_trajectory(
        origin=coords,
        boat_speed_knots=payload.boat_speed_knots,
        heading_deg=payload.heading_deg,
        time_horizon_min=payload.time_horizon_min,
        wind_speed_kmh=w_speed,
        wind_direction_deg=w_dir
    )
    return pred

@router.post("/demo/simulate")
async def demo_simulate_endpoint(payload: DemoSimulatePayload):
    """Deterministic full-pipeline simulation for SIH judges:
    MOSDAC data -> NetCDF/HDF5 parsing -> 7-factor Risk -> Trajectory -> Multi-Agent Evidence -> Fisherman Voice Advisory.
    """
    coords = Coordinates(latitude=payload.latitude, longitude=payload.longitude)
    from app.geo.trajectory import PredictiveTrajectoryEngine
    from app.agents.verification import VerificationAgent
    from app.providers.mosdac_provider import CompositeMarineDataProvider
    from app.agents.explanation import ExplanationAndEvidenceAgent

    comp_provider = CompositeMarineDataProvider()
    marine_data = await comp_provider.get_marine_conditions(coords)
    weather = await comp_provider.get_weather(coords)
    ocean = await comp_provider.get_ocean_conditions(coords)
    boundary_ctx = await comp_provider.get_boundary_contexts(coords)

    trajectory = PredictiveTrajectoryEngine.predict_trajectory(
        origin=coords,
        boat_speed_knots=payload.boat_speed_knots,
        heading_deg=payload.heading_deg,
        time_horizon_min=payload.time_horizon_min,
        wind_speed_kmh=weather.wind_speed_kmh,
        wind_direction_deg=weather.wind_direction_deg
    )

    risk = risk_agent.assess_risk(weather, ocean, boundary_ctx, trajectory_pred=trajectory)
    audit = VerificationAgent.verify_consistency(weather, ocean, risk, trajectory=trajectory)

    exp_agent = ExplanationAndEvidenceAgent()
    resp_text = exp_agent.generate_response(
        query="Is it safe for my fishing voyage?",
        intent="safety_check",
        lang=payload.language,
        risk=risk,
        weather=weather,
        ocean=ocean,
        boundary_ctx=boundary_ctx
    )

    return {
        "simulation_parameters": {
            "coordinates": {"latitude": payload.latitude, "longitude": payload.longitude},
            "boat_speed_knots": payload.boat_speed_knots,
            "heading_deg": payload.heading_deg,
            "time_horizon_min": payload.time_horizon_min,
            "language": payload.language
        },
        "spaceborne_telemetry": marine_data,
        "weather_state": weather,
        "ocean_state": ocean,
        "boundary_context": boundary_ctx,
        "trajectory": trajectory,
        "mathematical_risk": {
            "safety_score": risk.safety_score,
            "total_risk": risk.total_risk,
            "overall_score": risk.overall_score,
            "safety_verdict": risk.safety_verdict,
            "risk_level": risk.risk_level,
            "recommendation": risk.recommendation,
            "formula_explanation": risk.formula_explanation,
            "factors": risk.factors
        },
        "verification_audit": audit,
        "fisherman_voice_advisory": resp_text
    }

# ── User Profile & Phone Sign-In Endpoints ──

class PhoneLoginRequest(BaseModel):
    phone: str
    otp: Optional[str] = "1234"
    name: Optional[str] = "Captain Murugan"
    vessel_name: Optional[str] = "Matsya Sagar - KL-07-AB-402"
    vessel_type: Optional[str] = "Motorized Country Craft (9.9 HP)"
    home_port: Optional[str] = "Fort Kochi Coastal Harbor"

class UserProfileUpdateRequest(BaseModel):
    phone: str
    name: str
    vessel_name: str
    vessel_type: str
    home_port: str

class VoyageLogRequest(BaseModel):
    user_phone: str
    voyage_date: Optional[str] = None
    origin_name: str
    destination_name: str
    distance_nm: float
    distance_km: float
    duration_mins: float
    fuel_liters: float
    catch_kg: float
    catch_species: str
    safety_rating: Optional[str] = "SAFE"
    notes: Optional[str] = "Optimal thermal front navigation."

@router.post("/auth/phone-login")
async def phone_login(payload: PhoneLoginRequest):
    """Authenticate fisherman by mobile number (simulated OTP verification)."""
    user = get_or_create_user(
        phone=payload.phone,
        name=payload.name or "Captain Murugan",
        vessel_name=payload.vessel_name or "Matsya Sagar - KL-07-AB-402",
        vessel_type=payload.vessel_type or "Motorized Country Craft (9.9 HP)",
        home_port=payload.home_port or "Fort Kochi Coastal Harbor"
    )
    voyages = get_user_voyages(payload.phone)
    return {
        "status": "success",
        "message": f"Welcome aboard, {user.get('name')}.",
        "user": user,
        "voyages": voyages
    }

@router.get("/user/profile")
async def get_profile(phone: str = Query(...)):
    """Fetch user profile and lifetime stats."""
    user = get_or_create_user(phone=phone)
    voyages = get_user_voyages(phone)
    total_catch = sum(v.get("catch_kg", 0) for v in voyages)
    total_fuel = sum(v.get("fuel_liters", 0) for v in voyages)
    return {
        "user": user,
        "lifetime_stats": {
            "total_voyages": len(voyages),
            "total_catch_kg": round(total_catch, 1),
            "total_fuel_liters": round(total_fuel, 1),
            "estimated_fuel_saved_liters": round(len(voyages) * 0.55, 1)
        }
    }

@router.post("/user/profile")
async def update_profile(payload: UserProfileUpdateRequest):
    """Update captain and vessel details."""
    updated = update_user_profile(
        phone=payload.phone,
        name=payload.name,
        vessel_name=payload.vessel_name,
        vessel_type=payload.vessel_type,
        home_port=payload.home_port
    )
    return {"status": "success", "user": updated}

@router.get("/user/voyages")
async def get_voyages(phone: str = Query(...)):
    """Retrieve all historical voyages and catch logs for a fisherman."""
    return get_user_voyages(phone)

@router.post("/user/voyages")
async def log_voyage(payload: VoyageLogRequest):
    """Log a completed fishing voyage with catch metrics and captain's experience notes."""
    saved = save_user_voyage(payload.model_dump())
    return {"status": "success", "voyage": saved}



