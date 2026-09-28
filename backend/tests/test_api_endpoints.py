"""Integration tests for FastAPI REST API endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "Planner Agent" in data["agents"]

def test_marine_conditions():
    resp = client.get("/api/marine-conditions?lat=9.9312&lon=76.2673")
    assert resp.status_code == 200
    data = resp.json()
    assert "weather" in data
    assert "ocean" in data
    assert "risk" in data
    assert data["weather"]["temperature_c"] > 0
    assert data["risk"]["overall_score"] >= 0

def test_weather():
    resp = client.get("/api/weather?lat=18.9220&lon=72.8347")
    assert resp.status_code == 200
    data = resp.json()
    assert data["wind_speed_kmh"] > 0
    assert isinstance(data["is_demo"], bool)

def test_ocean():
    resp = client.get("/api/ocean?lat=13.0827&lon=80.2707")
    assert resp.status_code == 200
    data = resp.json()
    assert data["sst"] is not None
    assert data["chlorophyll"] is not None

def test_pfz():
    resp = client.get("/api/pfz?lat=9.9312&lon=76.2673&sort_by=distance")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 3
    assert data[0]["distance_km"] <= data[1]["distance_km"]

def test_alerts():
    resp = client.get("/api/alerts?lat=9.9312&lon=76.2673")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)

def test_geofences():
    resp = client.get("/api/geofences")
    assert resp.status_code == 200
    data = resp.json()
    assert "imbl" in data
    assert "mpas" in data
    assert "coastal_presets" in data

def test_risk_endpoint():
    resp = client.post("/api/risk", json={"latitude": 9.9312, "longitude": 76.2673})
    assert resp.status_code == 200
    data = resp.json()
    assert data["overall_score"] >= 0
    assert data["risk_level"] in ["LOW", "MODERATE", "HIGH", "EXTREME"]

def test_route_endpoint():
    resp = client.post("/api/route", json={
        "origin": {"latitude": 9.9312, "longitude": 76.2673},
        "destination": {"latitude": 9.5, "longitude": 75.8}
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "shortest_route" in data
    assert "safe_route" in data
    assert data["shortest_route"]["distance_km"] > 0

def test_data_sources():
    resp = client.get("/api/data-sources")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 3
    assert any("Oceansat-3" in d["name"] for d in data)

def test_chat_endpoint():
    resp = client.post("/api/chat", json={
        "query": "Where is the nearest PFZ?",
        "latitude": 9.9312,
        "longitude": 76.2673,
        "language": "en"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "direct_answer" in data
    assert len(data["agent_traces"]) >= 5
    assert data["evidence"]["deterministic_score"] >= 0

def test_trajectory_predict_endpoint():
    resp = client.post("/api/trajectory/predict", json={
        "latitude": 9.9312,
        "longitude": 76.2673,
        "boat_speed_knots": 12.0,
        "heading_deg": 240.0,
        "time_horizon_min": 60.0
    })
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["waypoints"]) > 0
    assert "min_distance_to_boundary_km" in data
    assert "trajectory_risk_score" in data

def test_demo_simulate_endpoint():
    resp = client.post("/api/demo/simulate", json={
        "latitude": 9.9312,
        "longitude": 76.2673,
        "boat_speed_knots": 10.0,
        "heading_deg": 240.0,
        "time_horizon_min": 60.0,
        "language": "en"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "spaceborne_telemetry" in data
    assert "trajectory" in data
    assert "mathematical_risk" in data
    assert data["mathematical_risk"]["safety_score"] > 0
    assert "verification_audit" in data
    assert "fisherman_voice_advisory" in data

def test_mosdac_probe_endpoint():
    resp = client.get("/api/mosdac/probe?lat=9.9312&lon=76.2673")
    assert resp.status_code == 200
    data = resp.json()
    assert data["source"] == "MOSDAC"
    assert "variables" in data

