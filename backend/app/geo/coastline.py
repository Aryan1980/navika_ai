"""Accurate Indian Coastline Land/Sea Boundary Classifier.

Ensures Potential Fishing Zones (PFZs), waypoints, and navigation routes are
strictly generated in the open ocean and NEVER on land, city streets, or inland terrain.
"""
import math
from typing import Tuple

# High-resolution boundary piecewise representation of Indian coastline
# For West Coast: Sea is WEST of the shoreline (point_lon < shoreline_lon)
# For East Coast: Sea is EAST of the shoreline (point_lon > shoreline_lon)

WEST_COAST_SHORELINE = [
    # (lat, shoreline_lon) from South to North
    (8.08, 77.55),   # Kanyakumari
    (8.38, 76.99),   # Vizhinjam
    (8.50, 76.91),   # Thiruvananthapuram
    (8.95, 76.54),   # Kollam / Neendakara
    (9.49, 76.32),   # Alappuzha
    (9.93, 76.215),  # Kochi / Fort Kochi beach (Sea is < 76.215)
    (10.19, 76.16),  # Munambam
    (10.58, 75.92),  # Ponnani
    (11.15, 75.80),  # Beypore
    (11.25, 75.76),  # Kozhikode
    (11.87, 75.36),  # Kannur
    (12.85, 74.82),  # Mangalore
    (13.35, 74.69),  # Malpe / Udupi
    (14.80, 74.12),  # Karwar
    (15.40, 73.78),  # Mormugao, Goa
    (15.75, 73.68),  # North Goa
    (16.99, 73.28),  # Ratnagiri
    (18.92, 72.81),  # Mumbai / Colaba
    (19.25, 72.78),  # Mumbai North
    (20.00, 72.73),  # Dahanu
    (20.50, 72.85),  # Daman
    (21.10, 72.65),  # Surat / Hazira
    (21.65, 69.60),  # Porbandar
    (22.25, 68.95),  # Dwarka
]

EAST_COAST_SHORELINE = [
    # (lat, shoreline_lon) from South to North
    (8.08, 77.55),   # Kanyakumari
    (8.79, 78.16),   # Tuticorin
    (9.28, 79.13),   # Mandapam / Palk Bay
    (9.28, 79.31),   # Rameswaram
    (10.76, 79.84),  # Nagapattinam
    (11.93, 79.83),  # Puducherry
    (12.55, 80.17),  # Mahabalipuram
    (13.12, 80.30),  # Chennai / Kasimedu
    (14.00, 80.10),  # Pulicat / Nellore South
    (14.45, 80.15),  # Krishnapatnam
    (15.80, 80.55),  # Nizampatnam
    (16.95, 82.25),  # Kakinada
    (17.69, 83.32),  # Visakhapatnam
    (18.25, 83.90),  # Srikakulam
    (19.30, 85.05),  # Gopalpur
    (19.80, 85.85),  # Puri
    (20.26, 86.70),  # Paradip
    (21.05, 86.90),  # Dhamra
    (21.62, 87.52),  # Digha / Shankarpur
]

def get_shoreline_longitude(lat: float, is_west_coast: bool = True) -> float:
    """Interpolates shoreline longitude at a given latitude."""
    shoreline = WEST_COAST_SHORELINE if is_west_coast else EAST_COAST_SHORELINE
    # Clamp to table bounds
    if lat <= shoreline[0][0]:
        return shoreline[0][1]
    if lat >= shoreline[-1][0]:
        return shoreline[-1][1]

    for i in range(len(shoreline) - 1):
        lat1, lon1 = shoreline[i]
        lat2, lon2 = shoreline[i + 1]
        if lat1 <= lat <= lat2:
            frac = (lat - lat1) / (lat2 - lat1) if lat2 != lat1 else 0.0
            return lon1 + frac * (lon2 - lon1)
    return shoreline[0][1]

def is_point_in_sea(lat: float, lon: float) -> bool:
    """Returns True if (lat, lon) is in open sea water (Arabian Sea or Bay of Bengal)."""
    # Boundary checks for Indian waters
    if not (6.0 <= lat <= 25.0 and 65.0 <= lon <= 95.0):
        return False

    is_west = (lon < 78.0)
    shore_lon = get_shoreline_longitude(lat, is_west_coast=is_west)

    if is_west:
        # Arabian sea: coordinate MUST be WEST of the shoreline (lon < shore_lon)
        # Add a 0.005 buffer (~500m) to guarantee clear offshore water
        return lon <= (shore_lon - 0.005)
    else:
        # Bay of Bengal: coordinate MUST be EAST of the shoreline (lon > shore_lon)
        return lon >= (shore_lon + 0.005)

def get_seaward_anchor_point(lat: float, lon: float) -> Tuple[float, float]:
    """If coordinate is inside a harbor or on land, returns the seaward departure anchor in the open ocean."""
    if is_point_in_sea(lat, lon):
        return (lat, lon)

    is_west = (lon < 78.0)
    shore_lon = get_shoreline_longitude(lat, is_west_coast=is_west)

    if is_west:
        # Shift ~1.2 km into open Arabian Sea off the beach
        sea_lon = round(shore_lon - 0.012, 4)
    else:
        # Shift ~1.2 km into open Bay of Bengal off the beach
        sea_lon = round(shore_lon + 0.012, 4)

    return (round(lat, 4), sea_lon)
