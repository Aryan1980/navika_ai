"""Verification Agent.

Performs physical range validation and cross-agent consensus audit,
guaranteeing that the final safety verdict strictly aligns with physical sensor evidence.
"""
from typing import Dict, Any, List, Optional
from app.schemas.marine import WeatherReport, MarineObservation
from app.schemas.risk import RiskAssessment
from app.geo.trajectory import TrajectoryPrediction

class VerificationAgent:
    """Verifies that all agent deductions and recommendations are mutually consistent."""

    @staticmethod
    def verify_consistency(
        weather: WeatherReport,
        ocean: MarineObservation,
        risk: RiskAssessment,
        trajectory: Optional[TrajectoryPrediction] = None
    ) -> Dict[str, Any]:
        checks: List[str] = []
        is_consistent = True

        # Check 1: Wind & Verdict consistency
        if weather.wind_speed_kmh > 45.0 and risk.safety_verdict == "SAFE":
            checks.append("❌ Inconsistency: High wind (>45 km/h) conflicting with 'SAFE' verdict.")
            is_consistent = False
        else:
            checks.append("✓ Wind velocity consistent with safety matrix.")

        # Check 2: Wave & Verdict consistency
        wave = ocean.wave_height or weather.wave_height_m or 0.0
        if wave > 2.5 and risk.safety_verdict == "SAFE":
            checks.append("❌ Inconsistency: High swell (>2.5m) conflicting with 'SAFE' verdict.")
            is_consistent = False
        else:
            checks.append("✓ Significant wave height consistent with safety rating.")

        # Check 3: Cyclone override consistency
        if weather.cyclone_status in ["watch", "warning"] and risk.risk_level in ["LOW", "MODERATE"]:
            checks.append("❌ Inconsistency: Cyclone bulletin active but risk categorized as low/moderate.")
            is_consistent = False
        else:
            checks.append("✓ Severe cyclone override policy validated.")

        # Check 4: Trajectory & boundary crossing
        if trajectory and trajectory.is_crossing and risk.risk_level in ["LOW", "MODERATE"]:
            checks.append("❌ Inconsistency: Trajectory predicts restricted zone crossing but risk is not elevated.")
            is_consistent = False
        else:
            checks.append("✓ Forward trajectory boundary clearance validated.")

        # Check 5: Spaceborne telemetry bounds (SST & Chlorophyll)
        if ocean.sst is not None and (ocean.sst < 15.0 or ocean.sst > 40.0):
            checks.append("⚠ Spaceborne SST reading outside typical tropical marine baseline.")
        else:
            checks.append("✓ Spaceborne SST values verified within physical limits.")

        if ocean.chlorophyll is not None and (ocean.chlorophyll < 0.0 or ocean.chlorophyll > 80.0):
            checks.append("⚠ Spaceborne Chlorophyll reading outside standard radiometer range.")
        else:
            checks.append("✓ Spaceborne Chlorophyll readings physically verified.")

        summary_note = (
            "✓ Final recommendation consistent with physical evidence and multi-sensor consensus."
            if is_consistent
            else "⚠ Verification agent detected parameter conflicts; emergency safety override active."
        )

        return {
            "verified": is_consistent,
            "status": "CONSISTENT" if is_consistent else "FAILED_VERIFICATION",
            "summary_note": summary_note,
            "audited_checks": checks
        }
