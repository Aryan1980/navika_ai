"""Train and export the PFZ Pelagic Fish Aggregation Predictor Model.

Physics-informed Random Forest Regressor trained on Indian coastal oceanographic regimes
(Arabian Sea, Bay of Bengal, Lakshadweep Sea, and Gulf of Mannar).
Features:
- sst: Sea Surface Temperature (°C)
- sst_gradient: Thermal front boundary intensity (°C/km)
- chlorophyll: Phytoplankton concentration (mg/m³)
- chlorophyll_gradient: Chlorophyll plume edge intensity (mg/m³/km)
- bathymetry_depth_m: Seafloor depth (m)
- distance_to_coast_km: Distance to nearest shore (km)
- wind_speed_kmh: Ocean surface wind speed (km/h)
- month: Seasonality index (1-12, capturing SW & NE monsoons)

Target:
- suitability_score: Pelagic fish aggregation probability (0.0 to 100.0)
"""
import os
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "pfz_model.joblib"))

FEATURE_NAMES = [
    "sst",
    "sst_gradient",
    "chlorophyll",
    "chlorophyll_gradient",
    "bathymetry_depth_m",
    "distance_to_coast_km",
    "wind_speed_kmh",
    "month"
]

def generate_synthetic_ocean_dataset(n_samples: int = 6000, random_seed: int = 42):
    """Generates synthetic dataset calibrated to Indian Ocean fisheries research.

    Biological & Oceanographic Truth:
    - Pelagic fish (Sardinella longiceps, Rastrelliger kanagurta, Thunnus albacares)
      aggregate strongly at thermal fronts (sharp SST changes) co-located with high
      chlorophyll-a (phytoplankton blooms) over coastal shelf breaks (depth 15-80m).
    - Proximity to coast (2-10 km) gives higher artisanal catch feasibility.
    - Extreme winds (>35 km/h) disperse schools and diminish fishability.
    """
    rng = np.random.RandomState(random_seed)

    # 1. Physical Ocean Variables
    # SST in Indian waters typically 25.0°C to 31.5°C
    sst = rng.uniform(24.5, 32.0, n_samples)
    # SST spatial gradient: 0.05 to 1.5 °C/km (fronts > 0.4 °C/km)
    sst_grad = rng.exponential(scale=0.35, size=n_samples) + 0.02
    sst_grad = np.clip(sst_grad, 0.02, 2.0)

    # Chlorophyll-a: 0.1 to 8.0 mg/m³
    chlorophyll = rng.lognormal(mean=0.6, sigma=0.8, size=n_samples)
    chlorophyll = np.clip(chlorophyll, 0.1, 10.0)

    # Chlorophyll gradient
    chl_grad = rng.exponential(scale=0.25, size=n_samples) + 0.01
    chl_grad = np.clip(chl_grad, 0.01, 1.5)

    # Coastal bathymetry: 5m to 120m
    depth = rng.uniform(5.0, 150.0, n_samples)

    # Distance to coast: 0.5 km to 20 km
    dist_coast = rng.uniform(0.5, 20.0, n_samples)

    # Wind speed: 5 to 55 km/h
    wind = rng.uniform(5.0, 50.0, n_samples)

    # Month: 1 to 12
    month = rng.randint(1, 13, n_samples)

    # 2. Physics-Informed Suitability Formulation (Biological Response Function)
    scores = np.zeros(n_samples)

    for i in range(n_samples):
        # Base thermal score: Gaussian centered at optimal 27.8°C
        temp_score = np.exp(-((sst[i] - 27.8) ** 2) / (2 * (1.8 ** 2))) * 25.0

        # Thermal front bonus: sharp boundary (upwelling edge)
        front_bonus = min(25.0, sst_grad[i] * 22.0)

        # Chlorophyll score: optimal between 1.2 and 4.5 mg/m³
        if chlorophyll[i] < 0.3:
            chl_score = chlorophyll[i] * 10.0
        elif chlorophyll[i] <= 4.0:
            chl_score = 15.0 + (chlorophyll[i] - 0.3) * 3.5
        else:
            # Diminishing / eutrophic / potential bloom drop
            chl_score = max(5.0, 28.0 - (chlorophyll[i] - 4.0) * 4.0)

        # Bathymetry score: continental shelf 15m - 65m is prime pelagic feeding zone
        if 15.0 <= depth[i] <= 65.0:
            depth_score = 15.0
        elif depth[i] < 15.0:
            depth_score = max(3.0, depth[i])
        else:
            depth_score = max(4.0, 15.0 - (depth[i] - 65.0) * 0.15)

        # Wind penalty: high turbulence breaks surface schools
        wind_penalty = 0.0
        if wind[i] > 30.0:
            wind_penalty = (wind[i] - 30.0) * 0.8

        # Seasonal monsoon bonus: post-monsoon upwelling (Sep-Nov) and pre-monsoon (Mar-May)
        monsoon_factor = 1.0
        if month[i] in [8, 9, 10, 11]:
            monsoon_factor = 1.12
        elif month[i] in [6, 7]:  # Rough peak monsoon
            monsoon_factor = 0.85

        raw_score = (temp_score + front_bonus + chl_score + depth_score - wind_penalty) * monsoon_factor
        # Add realistic noise
        noise = rng.normal(0.0, 2.5)
        scores[i] = np.clip(raw_score + noise, 5.0, 98.0)

    X = np.column_stack([
        sst,
        sst_grad,
        chlorophyll,
        chl_grad,
        depth,
        dist_coast,
        wind,
        month
    ])
    y = scores
    return X, y

def train_and_export_model():
    """Trains the Random Forest model and serializes to disk."""
    print("Generating oceanographic training dataset...")
    X, y = generate_synthetic_ocean_dataset(n_samples=7500, random_seed=42)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Physics-Informed Random Forest Regressor...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        n_jobs=1,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluation
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"Model Training Complete! Test MAE: {mae:.2f} points, Test R²: {r2:.4f}")

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Exported model to: {MODEL_PATH}")
    return model

if __name__ == "__main__":
    train_and_export_model()
