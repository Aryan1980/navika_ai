# Deterministic Marine Safety Score Model

## 1. Mathematical Formulation

Unlike black-box LLM systems that hallucinate navigational ratings, NavikaAI implements an authoritative, deterministic mathematical model grounded in physical oceanography and maritime regulations.

### Total Mathematical Risk
$$\text{Total Risk} = \sum_{i=1}^{7} w_i \cdot r_i \quad \text{where} \quad \sum_{i=1}^{7} w_i = 1.00, \; r_i \in [0, 1]$$

### Interpretable Safety Score
$$\text{Safety Score} = 100 \times (1 - \text{Total Risk})$$

---

## 2. Factor Weights and Normalization Matrix

| Factor ($i$) | Weight ($w_i$) | Raw Metric | Normalization Formula ($r_i$) | Physical Rationale |
|---|---|---|---|---|
| **1. Wind Speed** | **0.20** | $v_{\text{wind}}$ (km/h) | $\min(1.0, \frac{v_{\text{wind}}}{55.0})$ | Beaufort scale: >55 km/h is gale force |
| **2. Significant Wave Height** | **0.25** | $H_s$ (meters) | $\min(1.0, \frac{H_s}{4.0})$ | Douglas scale: >4.0 m is very rough |
| **3. Atmospheric Weather Hazard** | **0.15** | Cyclone / Lightning | Cyclone warning: $1.0$<br>Cyclone watch: $0.75$<br>Lightning active (<10 km): $0.70$<br>Routine: $0.05$ | IMD severe convective storm bulletins |
| **4. Sovereign Border Clearance** | **0.15** | Dist to IMBL / MPA / RZ | Critical IMBL (<5 km): $1.0$<br>Inside RZ: $0.95$<br>Inside MPA: $0.75$<br>Approaching (<15 km): $0.50$<br>Clear (>20 km): $0.05$ | UNCLOS / Indian Coast Guard geofencing |
| **5. Predictive Trajectory Clearance** | **0.10** | Forward course clearance | Course intersects restricted zone: $1.0$<br>Course approaching (<10 km): $0.50$<br>Course clear: $0.05$ | Dead reckoning + wind leeway projection |
| **6. Spaceborne SST** | **0.05** | SST ($^\circ\text{C}$) | SST > 31.0: $\min(0.65, 0.20 + 0.45 \cdot (T - 31))$$<br>Normal ($26-30^\circ\text{C}$): $0.05$ | Thermal convection potential / storm fuel |
| **7. Chlorophyll-a Concentration** | **0.05** | Chl-a ($\text{mg/m}^3$) | Chl > 10.0: Harmful Algal Bloom ($0.40 - 0.85$)<br>Normal ($0.3 - 5.0$): $0.05$ | Pelagic aggregation vs red tide / HAB |

---

## 3. Critical Emergency Overrides
If any non-negotiable hazard is **EXTREME** (e.g. Cyclone Warning active, active IMBL breach, forward course intersecting a naval firing zone, or wind > 55 km/h):
$$\text{Total Risk} = \max(\text{Total Risk}, 0.80) \implies \text{Safety Score} \le 20.0$$

---

## 4. Verdict Classification Thresholds

| Safety Score Range | Total Risk Range | Risk Level | Safety Verdict | Operational Guidance |
|---|---|---|---|---|
| **75.0 – 100.0** | $0.00 – 0.25$ | **LOW** | `SAFE` | Favourable conditions. Normal fishing operations permitted. |
| **50.0 – 74.9** | $0.25 – 0.50$ | **MODERATE** | `SAFE_WITH_CAUTION` | Conditions suitable for mechanized craft; small non-motorized craft exercise caution. |
| **25.0 – 49.9** | $0.50 – 0.75$ | **HIGH** | `UNSAFE` | Adverse sea conditions or boundary proximity. Offshore voyages unsafe. |
| **0.0 – 24.9** | $0.75 – 1.00$ | **EXTREME** | `HAZARDOUS` | Severe cyclone or sovereign boundary breach. Return to harbor immediately. |

---

## 5. Missing Data & Sensor Cloud Penalty
If a satellite parameter is unavailable (e.g. cloud cover masking optical radiometers), NavikaAI does **not** assume zero risk. It applies a transparent uncertainty penalty:
$$r_{\text{missing}} = 0.35$$
The evidence log flags `is_missing_data_penalized = true` to alert navigators.

---

## 6. Worked Verification Examples

### Example A: Kochi Offshore ($9.93^\circ\text{N}, 76.26^\circ\text{E}$)
- Wind: $16.2\text{ km/h} \implies r_1 = 0.295 \implies w_1 r_1 = 0.0589$
- Wave: $1.2\text{ m} \implies r_2 = 0.300 \implies w_2 r_2 = 0.0750$
- Weather: Routine $\implies r_3 = 0.050 \implies w_3 r_3 = 0.0075$
- Border: $254\text{ km to IMBL} \implies r_4 = 0.050 \implies w_4 r_4 = 0.0075$
- Trajectory: Clear course $\implies r_5 = 0.050 \implies w_5 r_5 = 0.0050$
- SST: $27.51^\circ\text{C (INSAT-3DR)} \implies r_6 = 0.050 \implies w_6 r_6 = 0.0025$
- Chlorophyll: $0.082\text{ mg/m}^3\text{ (EOS-06)} \implies r_7 = 0.050 \implies w_7 r_7 = 0.0025$
- **Total Risk**: $0.1589 \approx 0.16$
- **Safety Score**: $100 \times (1 - 0.1589) = \mathbf{84.1 / 100}$
- **Verdict**: `SAFE` (Risk: `LOW`)

### Example B: Palk Strait / Rameswaram ($9.28^\circ\text{N}, 79.31^\circ\text{E}$, heading East)
- Border: $12\text{ km to India-Sri Lanka IMBL} \implies r_4 = 0.50$ (Approaching)
- Trajectory: Projected eastward course intersects Gulf of Mannar Marine National Park in 17 minutes $\implies r_5 = 1.00$
- Total Risk elevated to $> 0.55$
- **Safety Score**: $< 45 / 100$
- **Verdict**: `UNSAFE` (Course revision required)
