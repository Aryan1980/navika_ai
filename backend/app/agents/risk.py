"""Deterministic Marine Risk Assessment Engine.

Calculates transparent, mathematically interpretable safety scores based on physical thresholds
without LLM hallucination:
    Risk = sum(weight_i * normalized_risk_i)
    Safety Score = 100 * (1 - Risk)
"""
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple, Optional
from app.config import settings
from app.schemas.marine import WeatherReport, MarineObservation
from app.schemas.risk import FactorScore, RiskAssessment

class RiskAssessmentAgent:
    """Calculates transparent, deterministic risk scores and categories."""

    def __init__(self):
        self.cfg = settings.RISK

    def _calc_wind_risk(self, wind_kmh: Optional[float]) -> Tuple[float, str, str, bool]:
        """Evaluates surface wind speed. Returns (normalized_risk, severity, explanation, is_missing)."""
        if wind_kmh is None:
            return self.cfg.MISSING_DATA_PENALTY, "MODERATE", "Wind observation unavailable; uncertainty penalty applied.", True

        w = float(wind_kmh)
        if w < self.cfg.WIND_MODERATE:
            # 0 to 25 km/h -> 0.05 to 0.20
            r = 0.05 + 0.15 * (w / self.cfg.WIND_MODERATE)
            return round(r, 3), "LOW", f"Wind speed {w} km/h is within gentle/moderate breeze limits (<{self.cfg.WIND_MODERATE} km/h).", False
        elif w < self.cfg.WIND_HIGH:
            # 25 to 40 km/h -> 0.20 to 0.55
            r = 0.20 + 0.35 * ((w - self.cfg.WIND_MODERATE) / (self.cfg.WIND_HIGH - self.cfg.WIND_MODERATE))
            return round(r, 3), "MODERATE", f"Wind speed {w} km/h presents fresh breeze; small craft caution advised.", False
        elif w < self.cfg.WIND_EXTREME:
            # 40 to 55 km/h -> 0.55 to 0.85
            r = 0.55 + 0.30 * ((w - self.cfg.WIND_HIGH) / (self.cfg.WIND_EXTREME - self.cfg.WIND_HIGH))
            return round(r, 3), "HIGH", f"Strong wind {w} km/h exceeds safe threshold ({self.cfg.WIND_HIGH} km/h); nearshore operations only.", False
        else:
            return 1.0, "EXTREME", f"Gale/storm force winds {w} km/h. Capsize and navigation hazard.", False

    def _calc_wave_risk(self, wave_m: Optional[float]) -> Tuple[float, str, str, bool]:
        """Evaluates significant wave height. Returns (normalized_risk, severity, explanation, is_missing)."""
        if wave_m is None:
            return self.cfg.MISSING_DATA_PENALTY, "MODERATE", "Wave height observation unavailable; uncertainty penalty applied.", True

        wv = float(wave_m)
        if wv < self.cfg.WAVE_MODERATE:
            r = 0.05 + 0.15 * (wv / self.cfg.WAVE_MODERATE)
            return round(r, 3), "LOW", f"Significant wave height {wv} m is slight/favourable (<{self.cfg.WAVE_MODERATE} m).", False
        elif wv < self.cfg.WAVE_HIGH:
            r = 0.20 + 0.35 * ((wv - self.cfg.WAVE_MODERATE) / (self.cfg.WAVE_HIGH - self.cfg.WAVE_MODERATE))
            return round(r, 3), "MODERATE", f"Wave height {wv} m indicates moderate chop; manageable for decked motor vessels.", False
        elif wv < self.cfg.WAVE_EXTREME:
            r = 0.55 + 0.35 * ((wv - self.cfg.WAVE_HIGH) / (self.cfg.WAVE_EXTREME - self.cfg.WAVE_HIGH))
            return round(r, 3), "HIGH", f"Rough seas with wave height {wv} m exceeding {self.cfg.WAVE_HIGH} m advisory limit.", False
        else:
            return 1.0, "EXTREME", f"Very rough to high seas ({wv} m). High capsize hazard.", False

    def _calc_weather_risk(
        self,
        cyclone_status: str,
        cyclone_category: Optional[str],
        lightning_detected: bool,
        lightning_distance_km: Optional[float]
    ) -> Tuple[float, str, str, bool]:
        """Evaluates convective atmospheric hazards (cyclones, squalls, lightning)."""
        st = (cyclone_status or "none").lower()
        if st == "warning":
            return 1.0, "EXTREME", f"Active IMD Cyclone Warning ({cyclone_category or 'Severe'}). Absolute harbor shelter mandatory.", False
        elif st == "watch":
            return 0.65, "HIGH", f"IMD Cyclone Watch in effect ({cyclone_category or 'Depression'}). Offshore ventures prohibited.", False

        if lightning_detected:
            if lightning_distance_km and lightning_distance_km <= self.cfg.LIGHTNING_ACTIVE_KM:
                return 0.95, "EXTREME", f"Active lightning discharge within {lightning_distance_km} km. Immediate open-deck strike hazard.", False
            elif lightning_distance_km and lightning_distance_km <= self.cfg.LIGHTNING_NEARBY_KM:
                return 0.60, "HIGH", f"Thunderstorm cell detected {lightning_distance_km} km away. Approach expected within 30-45 mins.", False
            return 0.35, "MODERATE", "Distal convective clouds detected in sector.", False

        return 0.05, "LOW", "No cyclonic disturbance or active lightning discharge in sector.", False

    def _calc_border_risk(self, boundary_ctx: Dict[str, Any]) -> Tuple[float, str, str, bool]:
        """Evaluates static sovereign boundary (IMBL) and MPA exclusion zones."""
        imbl = boundary_ctx.get("imbl", {})
        mpa = boundary_ctx.get("mpa", {})
        rz = boundary_ctx.get("restricted_zone", {})

        if imbl.get("is_critical") or imbl.get("inside"):
            return 1.0, "EXTREME", f"Vessel within critical 5 km buffer of {imbl.get('name', 'IMBL')}. High apprehension risk.", False
        if rz.get("inside"):
            return 0.95, "EXTREME", f"Vessel inside defense/energy restricted perimeter: {rz.get('name')}.", False
        if mpa.get("inside"):
            return 0.75, "HIGH", f"Vessel inside Marine Protected Area ({mpa.get('name')}). Commercial fishing prohibited.", False
        if imbl.get("is_approaching"):
            return 0.50, "MODERATE", f"Approaching maritime boundary: {imbl.get('distance_km')} km from {imbl.get('name', 'IMBL')}.", False

        dist = imbl.get("distance_km", 99.0)
        return 0.05, "LOW", f"Safe distance maintained from all international boundaries ({dist} km clearance).", False

    def _calc_trajectory_risk(self, trajectory_pred: Optional[Any]) -> Tuple[float, str, str, bool]:
        """Evaluates forward predictive trajectory clearance and restricted perimeter intersection."""
        if trajectory_pred is None:
            return 0.08, "LOW", "Forward navigation trajectory clear; no immediate boundary intersection.", False

        r_score = getattr(trajectory_pred, "trajectory_risk_score", 0.05)
        is_crossing = getattr(trajectory_pred, "is_crossing", False)
        is_approaching = getattr(trajectory_pred, "is_approaching", False)
        b_name = getattr(trajectory_pred, "closest_boundary_name", "Boundary")
        eta = getattr(trajectory_pred, "estimated_time_to_boundary_min", None)

        if is_crossing:
            return 1.0, "EXTREME", f"Projected course INTERSECTS {b_name} in ~{int(eta or 15)} mins.", False
        elif is_approaching:
            return float(r_score), "MODERATE" if r_score < 0.6 else "HIGH", getattr(trajectory_pred, "warning_message", f"Trajectory approaching {b_name}."), False

        return float(r_score), "LOW", "Projected trajectory maintains safe navigation clearance.", False

    def _calc_sst_risk(self, sst_c: Optional[float]) -> Tuple[float, str, str, bool]:
        """Evaluates Spaceborne Sea Surface Temperature (thermal stress / storm fuel)."""
        if sst_c is None:
            return self.cfg.MISSING_DATA_PENALTY, "MODERATE", "SST spaceborne reading unavailable; uncertainty penalty applied.", True

        t = float(sst_c)
        if t > self.cfg.SST_ELEVATED:
            # Over 31 C -> High convective storm fuel
            r = min(0.65, 0.20 + (t - self.cfg.SST_ELEVATED) * 0.45)
            return round(r, 3), "MODERATE", f"Elevated SST ({t}°C) indicates thermal convective potential in upper layer.", False
        elif t < 24.0:
            return 0.30, "MODERATE", f"Sub-normal SST ({t}°C) indicates strong upwelling or thermal shock.", False
        else:
            return 0.05, "LOW", f"Spaceborne SST ({t}°C) is normal for tropical fishing operations.", False

    def _calc_chlorophyll_risk(self, chl_mg_m3: Optional[float]) -> Tuple[float, str, str, bool]:
        """Evaluates Spaceborne Chlorophyll-a (productivity vs harmful algal bloom)."""
        if chl_mg_m3 is None:
            return self.cfg.MISSING_DATA_PENALTY, "MODERATE", "Chlorophyll reading unavailable; uncertainty penalty applied.", True

        c = float(chl_mg_m3)
        if c > self.cfg.CHLOROPHYLL_HAB_ALERT:
            r = min(0.85, 0.40 + (c - self.cfg.CHLOROPHYLL_HAB_ALERT) * 0.05)
            return round(r, 3), "HIGH", f"Excessive chlorophyll concentration ({c} mg/m³) indicates potential harmful algal bloom (HAB).", False
        elif c > 5.0:
            return 0.15, "LOW", f"High chlorophyll ({c} mg/m³) indicates strong nutrient upwelling and rich fishing potential.", False
        else:
            return 0.05, "LOW", f"Normal spaceborne chlorophyll concentration ({c} mg/m³).", False

    def assess_risk(
        self,
        weather: WeatherReport,
        ocean: MarineObservation,
        boundary_ctx: Dict[str, Any],
        trajectory_pred: Optional[Any] = None
    ) -> RiskAssessment:
        """Computes transparent mathematical safety score grounded in normalized components:

        Risk = sum(weight_i * normalized_risk_i)
        Safety Score = 100 * (1 - Risk)
        """
        factors: List[FactorScore] = []
        is_any_missing = False

        # 1. Wind Risk
        w_risk, w_sev, w_exp, w_miss = self._calc_wind_risk(weather.wind_speed_kmh)
        is_any_missing = is_any_missing or w_miss
        factors.append(FactorScore(
            factor_name="Wind Speed",
            raw_value=weather.wind_speed_kmh,
            unit="km/h",
            normalized_risk=w_risk,
            weight=self.cfg.WEIGHT_WIND,
            contribution=round(self.cfg.WEIGHT_WIND * w_risk, 4),
            score=round(w_risk * 100.0, 1),
            weighted_score=round(self.cfg.WEIGHT_WIND * w_risk * 100.0, 2),
            severity=w_sev,
            explanation=w_exp,
            is_missing=w_miss
        ))

        # 2. Wave Risk
        wv_raw = ocean.wave_height or weather.wave_height_m
        wv_risk, wv_sev, wv_exp, wv_miss = self._calc_wave_risk(wv_raw)
        is_any_missing = is_any_missing or wv_miss
        factors.append(FactorScore(
            factor_name="Wave Height",
            raw_value=wv_raw,
            unit="m",
            normalized_risk=wv_risk,
            weight=self.cfg.WEIGHT_WAVE,
            contribution=round(self.cfg.WEIGHT_WAVE * wv_risk, 4),
            score=round(wv_risk * 100.0, 1),
            weighted_score=round(self.cfg.WEIGHT_WAVE * wv_risk * 100.0, 2),
            severity=wv_sev,
            explanation=wv_exp,
            is_missing=wv_miss
        ))

        # 3. Weather Hazard (Cyclone & Lightning)
        wt_risk, wt_sev, wt_exp, wt_miss = self._calc_weather_risk(
            weather.cyclone_status, weather.cyclone_category,
            weather.lightning_detected, weather.lightning_distance_km
        )
        is_any_missing = is_any_missing or wt_miss
        factors.append(FactorScore(
            factor_name="Atmospheric Weather Hazard",
            raw_value=1.0 if weather.cyclone_status != "none" or weather.lightning_detected else 0.0,
            unit="alert_index",
            normalized_risk=wt_risk,
            weight=self.cfg.WEIGHT_WEATHER,
            contribution=round(self.cfg.WEIGHT_WEATHER * wt_risk, 4),
            score=round(wt_risk * 100.0, 1),
            weighted_score=round(self.cfg.WEIGHT_WEATHER * wt_risk * 100.0, 2),
            severity=wt_sev,
            explanation=wt_exp,
            is_missing=wt_miss
        ))

        # 4. Border / Geofence Proximity
        b_risk, b_sev, b_exp, b_miss = self._calc_border_risk(boundary_ctx)
        is_any_missing = is_any_missing or b_miss
        factors.append(FactorScore(
            factor_name="Maritime Border Clearance",
            raw_value=boundary_ctx.get("imbl", {}).get("distance_km", 99.0),
            unit="km_to_border",
            normalized_risk=b_risk,
            weight=self.cfg.WEIGHT_BORDER,
            contribution=round(self.cfg.WEIGHT_BORDER * b_risk, 4),
            score=round(b_risk * 100.0, 1),
            weighted_score=round(self.cfg.WEIGHT_BORDER * b_risk * 100.0, 2),
            severity=b_sev,
            explanation=b_exp,
            is_missing=b_miss
        ))

        # 5. Predictive Trajectory Clearance
        tr_risk, tr_sev, tr_exp, tr_miss = self._calc_trajectory_risk(trajectory_pred)
        is_any_missing = is_any_missing or tr_miss
        factors.append(FactorScore(
            factor_name="Predictive Trajectory Clearance",
            raw_value=getattr(trajectory_pred, "min_distance_to_boundary_km", 99.0) if trajectory_pred else 99.0,
            unit="km_clearance",
            normalized_risk=tr_risk,
            weight=self.cfg.WEIGHT_TRAJECTORY,
            contribution=round(self.cfg.WEIGHT_TRAJECTORY * tr_risk, 4),
            score=round(tr_risk * 100.0, 1),
            weighted_score=round(self.cfg.WEIGHT_TRAJECTORY * tr_risk * 100.0, 2),
            severity=tr_sev,
            explanation=tr_exp,
            is_missing=tr_miss
        ))

        # 6. Spaceborne SST
        sst_risk, sst_sev, sst_exp, sst_miss = self._calc_sst_risk(ocean.sst)
        is_any_missing = is_any_missing or sst_miss
        factors.append(FactorScore(
            factor_name="Sea Surface Temperature (SST)",
            raw_value=ocean.sst,
            unit="°C",
            normalized_risk=sst_risk,
            weight=self.cfg.WEIGHT_SST,
            contribution=round(self.cfg.WEIGHT_SST * sst_risk, 4),
            score=round(sst_risk * 100.0, 1),
            weighted_score=round(self.cfg.WEIGHT_SST * sst_risk * 100.0, 2),
            severity=sst_sev,
            explanation=sst_exp,
            is_missing=sst_miss
        ))

        # 7. Spaceborne Chlorophyll-a
        chl_risk, chl_sev, chl_exp, chl_miss = self._calc_chlorophyll_risk(ocean.chlorophyll)
        is_any_missing = is_any_missing or chl_miss
        factors.append(FactorScore(
            factor_name="Chlorophyll-a Concentration",
            raw_value=ocean.chlorophyll,
            unit="mg/m³",
            normalized_risk=chl_risk,
            weight=self.cfg.WEIGHT_CHLOROPHYLL,
            contribution=round(self.cfg.WEIGHT_CHLOROPHYLL * chl_risk, 4),
            score=round(chl_risk * 100.0, 1),
            weighted_score=round(self.cfg.WEIGHT_CHLOROPHYLL * chl_risk * 100.0, 2),
            severity=chl_sev,
            explanation=chl_exp,
            is_missing=chl_miss
        ))

        # Calculate Total Mathematical Risk: Sum of contributions
        total_risk = round(sum(f.contribution for f in factors), 4)

        # Critical Overrides: If any non-negotiable hazard is extreme, elevate overall risk
        if wt_risk >= 0.90 or b_risk >= 0.90 or tr_risk >= 0.90 or w_risk >= 0.90 or wv_risk >= 0.90:
            total_risk = max(total_risk, 0.80)

        # Interpretable Safety Score: 100 * (1 - Total_Risk)
        safety_score = round(max(0.0, min(100.0, 100.0 * (1.0 - total_risk))), 1)
        overall_risk_score = round(total_risk * 100.0, 1)

        # Categorize
        if safety_score >= 75.0:
            risk_level = "LOW"
            safety_verdict = "SAFE"
            recommendation = "Favourable marine conditions. Normal nearshore and offshore fishing operations permitted."
        elif safety_score >= 50.0:
            risk_level = "MODERATE"
            safety_verdict = "SAFE_WITH_CAUTION"
            recommendation = "Conditions generally suitable, but small motorboats and non-motorized crafts should maintain caution."
        elif safety_score >= 25.0:
            risk_level = "HIGH"
            safety_verdict = "UNSAFE"
            recommendation = "High risk. Rough sea states, elevated wind, or boundary proximity make offshore voyages unsafe."
        else:
            risk_level = "EXTREME"
            safety_verdict = "HAZARDOUS"
            recommendation = "Extreme marine hazard. Severe weather, cyclone or sovereign boundary breach. Return to port immediately."

        # Summary bullet reasons
        summary_reasons = [f.explanation for f in factors if f.severity in ["MODERATE", "HIGH", "EXTREME"]]
        if not summary_reasons:
            summary_reasons.append("All meteorological, oceanographic, and navigational indicators are within green safety limits.")

        formula_exp = f"Safety Score = 100 * (1 - Total_Risk) = 100 * (1 - {total_risk:.2f}) = {safety_score:.1f}/100"

        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        return RiskAssessment(
            safety_score=safety_score,
            total_risk=total_risk,
            overall_score=overall_risk_score,
            risk_level=risk_level,
            safety_verdict=safety_verdict,
            recommendation=recommendation,
            factors=factors,
            summary_reasons=summary_reasons,
            formula_explanation=formula_exp,
            is_missing_data_penalized=is_any_missing,
            timestamp=now_str
        )
