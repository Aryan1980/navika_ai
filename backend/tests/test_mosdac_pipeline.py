"""Tests for ISRO MOSDAC Satellite Ingestion Pipeline and Technical Endpoints."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.marine import Coordinates
from app.providers.mosdac_provider import MosdacDataProvider

client = TestClient(app)

def test_mosdac_provider_technical_dashboard_status():
    """Verify MosdacDataProvider produces Requirement 15 compliant technical dashboard status."""
    provider = MosdacDataProvider()
    status = provider.get_technical_dashboard_status()

    assert status["data_source"] == "MOSDAC"
    assert "ISRO" in status["data_source_full_name"]
    assert status["connection_status"] in ["ONLINE", "OFFLINE"]
    assert len(status["products"]) == 3

    # Check products
    keys = [p["product_key"] for p in status["products"]]
    assert "chlorophyll" in keys
    assert "sst" in keys
    assert "wind" in keys

    # Verify zero fake data and SI units
    assert status["compliance"]["zero_fake_data"] is True
    assert status["compliance"]["si_units_preserved"] is True

def test_mosdac_provider_normalized_marine_data():
    """Verify physical extraction of real satellite pixels at Kochi coordinates."""
    provider = MosdacDataProvider()
    kochi = Coordinates(latitude=9.9312, longitude=76.2673)
    data = provider.get_normalized_marine_data(kochi)

    assert data["source"] == "MOSDAC"
    assert data["latitude"] == 9.9312
    assert data["longitude"] == 76.2673
    assert data["provenance"]["is_synthetic"] is False

    # If files are ingested, verify physical variables
    vars_dict = data.get("variables", {})
    if "sst" in vars_dict:
        assert 20.0 <= vars_dict["sst"] <= 35.0  # Realistic sea surface temperature in C
        assert vars_dict["sst_unit"] in ["°C", "C", "degC"]
    if "chlorophyll" in vars_dict:
        assert vars_dict["chlorophyll"] >= 0.0
        assert vars_dict["chlorophyll_unit"] == "mg/m3"

def test_api_mosdac_status_endpoint():
    """Verify GET /api/mosdac/status endpoint returns valid HTTP 200."""
    response = client.get("/api/mosdac/status")
    assert response.status_code == 200
    data = response.json()
    assert data["data_source"] == "MOSDAC"
    assert "products" in data
    assert len(data["products"]) == 3

def test_api_mosdac_probe_endpoint():
    """Verify GET /api/mosdac/probe endpoint returns pixel telemetry."""
    response = client.get("/api/mosdac/probe?lat=9.9312&lon=76.2673")
    assert response.status_code == 200
    data = response.json()
    assert "variables" in data
    assert "provenance" in data

def test_api_ocean_live_mosdac_priority():
    """Verify GET /api/ocean prioritizes real MOSDAC spaceborne data."""
    response = client.get("/api/ocean?lat=9.9312&lon=76.2673")
    assert response.status_code == 200
    obs = response.json()
    assert obs["data_type"] == "MOSDAC_LIVE_SATELLITE"
    assert obs["is_demo"] is False
    assert "MOSDAC" in obs["source"]
    assert obs["sst"] is not None
    assert obs["chlorophyll"] is not None
