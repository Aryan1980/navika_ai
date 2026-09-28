"""Trajectory Agent."""
from typing import Optional
from app.schemas.marine import Coordinates
from app.geo.trajectory import PredictiveTrajectoryEngine, TrajectoryPrediction

class TrajectoryAgent:
    """Evaluates predictive forward navigation trajectory with physical wind leeway drift."""

    def __init__(self):
        self.engine = PredictiveTrajectoryEngine()

    def predict(
        self,
        origin: Coordinates,
        boat_speed_knots: float = 8.0,
        heading_deg: float = 270.0,
        time_horizon_min: float = 60.0,
        wind_speed_kmh: Optional[float] = None,
        wind_direction_deg: Optional[float] = None
    ) -> TrajectoryPrediction:
        return self.engine.predict_trajectory(
            origin=origin,
            boat_speed_knots=boat_speed_knots,
            heading_deg=heading_deg,
            time_horizon_min=time_horizon_min,
            wind_speed_kmh=wind_speed_kmh,
            wind_direction_deg=wind_direction_deg
        )
