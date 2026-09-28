"""Risk assessment and scoring schemas."""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class FactorScore(BaseModel):
    factor_name: str
    raw_value: Optional[float] = None
    unit: str
    normalized_risk: float = Field(..., description="Normalized risk between 0.0 (safe) and 1.0 (extreme hazard)")
    weight: float = Field(..., description="Configured factor weight in composite risk model")
    contribution: float = Field(..., description="weight * normalized_risk")
    score: float = Field(..., description="Deterministic penalty score between 0 and 100 (normalized_risk * 100)")
    weighted_score: float = Field(..., description="contribution * 100")
    severity: str = Field(..., description="LOW, MODERATE, HIGH, EXTREME")
    explanation: str
    is_missing: bool = False

class RiskAssessment(BaseModel):
    safety_score: float = Field(..., description="Interpretable safety score 0-100: 100 * (1 - Total_Risk)")
    total_risk: float = Field(..., description="Sum of weighted risk factors between 0.0 and 1.0")
    overall_score: float = Field(..., description="Overall risk penalty (0-100), inverse of safety score")
    risk_level: str = Field(..., description="LOW, MODERATE, HIGH, EXTREME")
    safety_verdict: str = Field(..., description="SAFE, SAFE_WITH_CAUTION, UNSAFE, HAZARDOUS")
    recommendation: str
    factors: List[FactorScore]
    summary_reasons: List[str]
    formula_explanation: str = Field(..., description="Transparent mathematical breakdown: Safety Score = 100 * (1 - sum(w_i * r_i))")
    is_missing_data_penalized: bool = False
    timestamp: str
    calculation_method: str = "deterministic_weighted_matrix"
    disclaimer: str = "SamudraAI is an operational decision-support tool. It does not replace official statutory advisories issued by INCOIS, IMD, or the Indian Coast Guard."
