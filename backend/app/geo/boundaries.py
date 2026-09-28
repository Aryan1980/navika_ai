"""Geographical boundaries, Indian coastal presets, IMBL lines, MPAs, and restricted zones."""
from typing import Dict, List, Any

COASTAL_PRESETS: List[Dict[str, Any]] = [
    {
        "id": "kochi",
        "name": "Kochi (Fort Kochi Coastal Harbor)",
        "state": "Kerala",
        "region": "Southwest Coast (Arabian Sea)",
        "latitude": 9.9650,
        "longitude": 76.2220,
        "harbor": "Fort Kochi Coastal Fishery Harbor",
        "key_species": ["Oil Sardine", "Mackerel", "Tuna", "Penaeid Shrimp"]
    },
    {
        "id": "mumbai",
        "name": "Mumbai (Sassoon Dock)",
        "state": "Maharashtra",
        "region": "West Coast (Arabian Sea)",
        "latitude": 18.9220,
        "longitude": 72.8347,
        "harbor": "Sassoon Docks / New Ferry Wharf",
        "key_species": ["Bombay Duck", "Pomfret", "Ribbonfish", "Seerfish"]
    },
    {
        "id": "porbandar",
        "name": "Porbandar",
        "state": "Gujarat",
        "region": "Northwest Coast (Arabian Sea)",
        "latitude": 21.6417,
        "longitude": 69.6293,
        "harbor": "Porbandar Subhash Nagar Harbour",
        "key_species": ["Croakers", "Ribbonfish", "Cuttlefish", "Squid"]
    },
    {
        "id": "chennai",
        "name": "Chennai (Kasimedu)",
        "state": "Tamil Nadu",
        "region": "Southeast Coast (Bay of Bengal)",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "harbor": "Kasimedu Fishing Harbour",
        "key_species": ["Tuna", "Snapper", "Barracuda", "Crab"]
    },
    {
        "id": "visakhapatnam",
        "name": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "region": "East Coast (Bay of Bengal)",
        "latitude": 17.6868,
        "longitude": 83.2185,
        "harbor": "Visakhapatnam Fishing Harbour",
        "key_species": ["Yellowfin Tuna", "Ribbonfish", "Perches", "Shrimp"]
    },
    {
        "id": "paradip",
        "name": "Paradip",
        "state": "Odisha",
        "region": "East Coast (Bay of Bengal)",
        "latitude": 20.3165,
        "longitude": 86.6114,
        "harbor": "Paradip Fishing Harbour",
        "key_species": ["Hilsa", "Catfish", "Pomfret", "Polynemids"]
    },
    {
        "id": "digha",
        "name": "Digha / Shankarpur",
        "state": "West Bengal",
        "region": "Northeast Coast (Bay of Bengal)",
        "latitude": 21.6266,
        "longitude": 87.5074,
        "harbor": "Shankarpur Fishing Harbour",
        "key_species": ["Hilsa", "Bhetki", "Prawns", "Silver Pomfret"]
    },
    {
        "id": "port_blair",
        "name": "Port Blair",
        "state": "Andaman & Nicobar Islands",
        "region": "Andaman Sea & Bay of Bengal",
        "latitude": 11.6234,
        "longitude": 92.7265,
        "harbor": "Junglighat Fishing Jetty",
        "key_species": ["Skipjack Tuna", "Mahi-Mahi", "Coral Trout", "Billfish"]
    },
    {
        "id": "goa",
        "name": "Panaji (Malim)",
        "state": "Goa",
        "region": "Central West Coast (Arabian Sea)",
        "latitude": 15.4909,
        "longitude": 73.8278,
        "harbor": "Malim Jetty / Betim",
        "key_species": ["Kingfish", "Mackerel", "Sardines", "Squid"]
    },
    {
        "id": "kanyakumari",
        "name": "Kanyakumari",
        "state": "Tamil Nadu",
        "region": "Cape Comorin (Tri-Sea Confluence)",
        "latitude": 8.0883,
        "longitude": 77.5385,
        "harbor": "Chinnamuttom Fishing Harbour",
        "key_species": ["Anchovy", "Carangids", "Tuna", "Lobster"]
    }
]

# International Maritime Boundary Line (IMBL) Segments
IMBL_BOUNDARIES: List[Dict[str, Any]] = [
    {
        "id": "imbl_sri_lanka_palk_bay",
        "name": "India-Sri Lanka IMBL (Palk Strait & Gulf of Mannar)",
        "neighbor_country": "Sri Lanka",
        "description": "Historic 1974/1976 bilateral boundary line in Palk Strait and Gulf of Mannar",
        "buffer_warning_km": 15.0,
        "coordinates": [
            [10.0833, 79.8667],
            [9.8333, 79.5333],
            [9.5000, 79.2500],
            [9.2000, 79.3667],
            [9.0000, 79.5333],
            [8.6667, 79.7333],
            [8.3667, 79.5000],
            [8.0000, 79.0000]
        ]
    },
    {
        "id": "imbl_pakistan_arabian_sea",
        "name": "India-Pakistan Maritime Boundary (Sir Creek / Arabian Sea)",
        "neighbor_country": "Pakistan",
        "description": "Exclusive Economic Zone demarcation off Kutch/Saurashtra coast",
        "buffer_warning_km": 20.0,
        "coordinates": [
            [23.5833, 68.1667],
            [23.4000, 67.8000],
            [23.1500, 67.3000],
            [22.8000, 66.8000],
            [22.3000, 66.2000],
            [21.8000, 65.5000]
        ]
    }
]

# Marine Protected Areas (MPAs) - Strict Ecological Conservation Zones
MARINE_PROTECTED_AREAS: List[Dict[str, Any]] = [
    {
        "id": "mpa_gulf_of_mannar",
        "name": "Gulf of Mannar Marine Biosphere Reserve",
        "state": "Tamil Nadu",
        "type": "Marine National Park",
        "restriction": "Strict No-Trawl Zone / Coral Reef Conservation Area",
        "polygon": [
            [9.2800, 79.0500],
            [9.2800, 79.3500],
            [8.8500, 78.8500],
            [8.6500, 78.4000],
            [8.7500, 78.2500],
            [9.1500, 78.7500],
            [9.2800, 79.0500]
        ]
    },
    {
        "id": "mpa_gahirmatha",
        "name": "Gahirmatha Marine Sanctuary",
        "state": "Odisha",
        "type": "Olive Ridley Turtle Mass-Nesting Marine Sanctuary",
        "restriction": "Complete mechanized fishing prohibition from Nov to May (WPA 1972)",
        "polygon": [
            [20.7500, 86.8500],
            [20.7500, 87.2500],
            [20.3000, 87.1500],
            [20.3000, 86.7500],
            [20.7500, 86.8500]
        ]
    },
    {
        "id": "mpa_malvan",
        "name": "Malvan Marine Sanctuary",
        "state": "Maharashtra",
        "type": "Coral and Coastal Marine Habitat",
        "restriction": "Commercial purse-seining and bottom-trawling prohibited",
        "polygon": [
            [16.0800, 73.4200],
            [16.0800, 73.5200],
            [15.9800, 73.5200],
            [15.9800, 73.4200],
            [16.0800, 73.4200]
        ]
    },
    {
        "id": "mpa_sundarbans",
        "name": "Sundarbans Biosphere Marine Zone",
        "state": "West Bengal",
        "type": "Mangrove Delta & Marine Estuary Reserve",
        "restriction": "Commercial mechanized trawler restriction zone",
        "polygon": [
            [21.8000, 88.5000],
            [21.8000, 89.1000],
            [21.3000, 89.1000],
            [21.3000, 88.5000],
            [21.8000, 88.5000]
        ]
    }
]

# Naval, Defense & Energy Exclusion Geofences
RESTRICTED_ZONES: List[Dict[str, Any]] = [
    {
        "id": "res_mumbai_high",
        "name": "Mumbai High Offshore Oil Production Exclusion Zone",
        "authority": "ONGC / Indian Coast Guard",
        "restriction": "Strict 500m platform safety zone and unauthorized vessel exclusion area",
        "polygon": [
            [19.7000, 71.2000],
            [19.7000, 71.7000],
            [19.2000, 71.7000],
            [19.2000, 71.2000],
            [19.7000, 71.2000]
        ]
    },
    {
        "id": "res_karwar_naval",
        "name": "Karwar Naval Base (INS Kadamba) Security Perimeter",
        "authority": "Indian Navy",
        "restriction": "Defense Restricted Navigation Waters",
        "polygon": [
            [14.8500, 74.0500],
            [14.8500, 74.2000],
            [14.7200, 74.2000],
            [14.7200, 74.0500],
            [14.8500, 74.0500]
        ]
    },
    {
        "id": "res_vizag_naval",
        "name": "Visakhapatnam Eastern Fleet Naval Exercise Area",
        "authority": "Indian Navy / ENC",
        "restriction": "Periodic Live Firing and Surface Maneuver Zone",
        "polygon": [
            [17.8000, 83.5000],
            [17.8000, 83.9000],
            [17.4000, 83.9000],
            [17.4000, 83.5000],
            [17.8000, 83.5000]
        ]
    }
]
