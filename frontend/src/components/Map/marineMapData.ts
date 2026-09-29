/**
 * Marine Intelligence Map Data & Geospatial Layers
 * High-detail data structures for Ports, MoES/INCOIS Buoys, AIS Vessels,
 * Graticule Gridlines, Ocean Basin Labels, Current Vectors, SST Thermal Fronts, and Satellite Swaths.
 */

export interface MarinePort {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  depth_m: number;
  vhf_ch: string;
  berths: number;
  ice_plants: number;
  type: 'Major Commercial Port' | 'Deep-Sea Fishery Harbor' | 'Coastal Landing Refuge';
  refuge_shelter: boolean;
  cold_storage_mt: number;
}

export interface OceanBuoy {
  id: string;
  name: string;
  agency: 'INCOIS' | 'MoES / NIOT' | 'IMD';
  lat: number;
  lon: number;
  type: 'Directional Wave Buoy' | 'OMNI Met-Ocean Buoy' | 'Tsunami BPR Buoy' | 'Coastal AWS Buoy';
  hs_m: number;
  period_s: number;
  sst_c: number;
  tide_m: number;
  salinity_psu: number;
  wind_kn: number;
  battery_v: number;
  last_ping: string;
  status: 'ONLINE' | 'ACTIVE';
}

export interface AISVessel {
  mmsi: string;
  name: string;
  callsign: string;
  vessel_type: 'Cargo Container' | 'Crude Oil Tanker' | 'Mechanized Trawler' | 'Tuna Longliner' | 'Coast Guard Patrol' | 'Oceanographic Research';
  color: string;
  lat: number;
  lon: number;
  sog_kn: number;
  cog_deg: number;
  length_m: number;
  draft_m: number;
  destination: string;
  nav_status: string;
  eta: string;
}

export interface OceanBasin {
  name: string;
  subtext: string;
  lat: number;
  lon: number;
  depth_m: string;
  type: 'sea' | 'gulf' | 'ocean' | 'strait';
}

// ── 1. Strategic Indian Coastal & Commercial Harbors ──
export const MARINE_PORTS: MarinePort[] = [
  {
    id: 'port-kochi',
    name: 'Kochi (Fort Kochi / Thoppumpady)',
    state: 'Kerala',
    lat: 9.9650,
    lon: 76.2220,
    depth_m: 14.5,
    vhf_ch: '12 / 16',
    berths: 22,
    ice_plants: 48,
    type: 'Deep-Sea Fishery Harbor',
    refuge_shelter: true,
    cold_storage_mt: 3200
  },
  {
    id: 'port-mumbai',
    name: 'Mumbai (Sassoon Docks / New Ferry)',
    state: 'Maharashtra',
    lat: 18.9220,
    lon: 72.8347,
    depth_m: 11.2,
    vhf_ch: '14 / 16',
    berths: 28,
    ice_plants: 64,
    type: 'Major Commercial Port',
    refuge_shelter: true,
    cold_storage_mt: 4500
  },
  {
    id: 'port-chennai',
    name: 'Kasimedu Fishery Harbor (Chennai)',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lon: 80.2707,
    depth_m: 8.5,
    vhf_ch: '16',
    berths: 16,
    ice_plants: 36,
    type: 'Deep-Sea Fishery Harbor',
    refuge_shelter: true,
    cold_storage_mt: 2800
  },
  {
    id: 'port-vizag',
    name: 'Visakhapatnam Fishing Harbor',
    state: 'Andhra Pradesh',
    lat: 17.6868,
    lon: 83.2185,
    depth_m: 12.0,
    vhf_ch: '12 / 16',
    berths: 18,
    ice_plants: 30,
    type: 'Major Commercial Port',
    refuge_shelter: true,
    cold_storage_mt: 3100
  },
  {
    id: 'port-paradip',
    name: 'Paradip Fishery Harbor',
    state: 'Odisha',
    lat: 20.3165,
    lon: 86.6114,
    depth_m: 9.8,
    vhf_ch: '16',
    berths: 14,
    ice_plants: 24,
    type: 'Coastal Landing Refuge',
    refuge_shelter: true,
    cold_storage_mt: 1800
  },
  {
    id: 'port-digha',
    name: 'Shankarpur / Digha',
    state: 'West Bengal',
    lat: 21.6266,
    lon: 87.5074,
    depth_m: 6.5,
    vhf_ch: '16',
    berths: 12,
    ice_plants: 20,
    type: 'Coastal Landing Refuge',
    refuge_shelter: true,
    cold_storage_mt: 1500
  },
  {
    id: 'port-veraval',
    name: 'Veraval Harbor',
    state: 'Gujarat',
    lat: 20.9020,
    lon: 70.3680,
    depth_m: 7.2,
    vhf_ch: '16',
    berths: 24,
    ice_plants: 58,
    type: 'Deep-Sea Fishery Harbor',
    refuge_shelter: true,
    cold_storage_mt: 5200
  },
  {
    id: 'port-porbandar',
    name: 'Porbandar (Subhash Nagar)',
    state: 'Gujarat',
    lat: 21.6417,
    lon: 69.6293,
    depth_m: 8.0,
    vhf_ch: '14 / 16',
    berths: 15,
    ice_plants: 32,
    type: 'Deep-Sea Fishery Harbor',
    refuge_shelter: true,
    cold_storage_mt: 2400
  },
  {
    id: 'port-mangalore',
    name: 'Old Mangalore Port',
    state: 'Karnataka',
    lat: 12.8460,
    lon: 74.8320,
    depth_m: 9.2,
    vhf_ch: '16',
    berths: 14,
    ice_plants: 28,
    type: 'Major Commercial Port',
    refuge_shelter: true,
    cold_storage_mt: 2900
  },
  {
    id: 'port-goa',
    name: 'Panaji (Malim Jetty / Mormugao)',
    state: 'Goa',
    lat: 15.4909,
    lon: 73.8278,
    depth_m: 8.4,
    vhf_ch: '16',
    berths: 10,
    ice_plants: 18,
    type: 'Coastal Landing Refuge',
    refuge_shelter: true,
    cold_storage_mt: 1600
  },
  {
    id: 'port-kanyakumari',
    name: 'Kanyakumari Pier Harbor',
    state: 'Tamil Nadu',
    lat: 8.0883,
    lon: 77.5385,
    depth_m: 6.8,
    vhf_ch: '16',
    berths: 8,
    ice_plants: 14,
    type: 'Coastal Landing Refuge',
    refuge_shelter: true,
    cold_storage_mt: 1200
  },
  {
    id: 'port-tuticorin',
    name: 'Tuticorin (V.O.C. Fishery Port)',
    state: 'Tamil Nadu',
    lat: 8.7980,
    lon: 78.1620,
    depth_m: 14.2,
    vhf_ch: '12 / 16',
    berths: 16,
    ice_plants: 34,
    type: 'Major Commercial Port',
    refuge_shelter: true,
    cold_storage_mt: 3800
  },
  {
    id: 'port-portblair',
    name: 'Port Blair (Junglighat Jetty)',
    state: 'Andaman & Nicobar',
    lat: 11.6234,
    lon: 92.7265,
    depth_m: 13.5,
    vhf_ch: '12 / 16',
    berths: 10,
    ice_plants: 16,
    type: 'Major Commercial Port',
    refuge_shelter: true,
    cold_storage_mt: 2100
  },
  {
    id: 'port-beypore',
    name: 'Beypore Fishery Harbor',
    state: 'Kerala',
    lat: 11.1620,
    lon: 75.8050,
    depth_m: 6.2,
    vhf_ch: '16',
    berths: 10,
    ice_plants: 18,
    type: 'Coastal Landing Refuge',
    refuge_shelter: true,
    cold_storage_mt: 1400
  }
];

// ── 2. MoES / INCOIS Ocean Buoys & Real-Time Stations ──
export const OCEAN_BUOYS: OceanBuoy[] = [
  {
    id: 'buoy-ad01',
    name: 'INCOIS Coastal Buoy AD01',
    agency: 'INCOIS',
    lat: 9.9180,
    lon: 76.1050,
    type: 'Directional Wave Buoy',
    hs_m: 1.42,
    period_s: 8.6,
    sst_c: 28.6,
    tide_m: 0.42,
    salinity_psu: 34.2,
    wind_kn: 12.4,
    battery_v: 12.9,
    last_ping: '1 min ago',
    status: 'ONLINE'
  },
  {
    id: 'buoy-bd08',
    name: 'MoES OMNI Deep-Sea BD08',
    agency: 'MoES / NIOT',
    lat: 18.2000,
    lon: 71.5000,
    type: 'OMNI Met-Ocean Buoy',
    hs_m: 2.15,
    period_s: 10.4,
    sst_c: 27.8,
    tide_m: -0.12,
    salinity_psu: 35.6,
    wind_kn: 16.5,
    battery_v: 13.1,
    last_ping: '3 mins ago',
    status: 'ONLINE'
  },
  {
    id: 'buoy-cb02',
    name: 'INCOIS Coastal Wave CB02',
    agency: 'INCOIS',
    lat: 13.1500,
    lon: 80.3500,
    type: 'Directional Wave Buoy',
    hs_m: 1.25,
    period_s: 7.9,
    sst_c: 29.1,
    tide_m: -0.18,
    salinity_psu: 33.8,
    wind_kn: 11.2,
    battery_v: 12.8,
    last_ping: '2 mins ago',
    status: 'ONLINE'
  },
  {
    id: 'buoy-tb05',
    name: 'INCOIS Tsunami Buoy TB05',
    agency: 'INCOIS',
    lat: 15.5000,
    lon: 84.8000,
    type: 'Tsunami BPR Buoy',
    hs_m: 1.82,
    period_s: 9.8,
    sst_c: 28.9,
    tide_m: 0.05,
    salinity_psu: 34.9,
    wind_kn: 14.8,
    battery_v: 13.4,
    last_ping: '45 sec ago',
    status: 'ONLINE'
  },
  {
    id: 'buoy-ad04',
    name: 'INCOIS AWS Coastal AD04',
    agency: 'INCOIS',
    lat: 15.3000,
    lon: 73.5000,
    type: 'Coastal AWS Buoy',
    hs_m: 1.58,
    period_s: 8.9,
    sst_c: 28.4,
    tide_m: 0.31,
    salinity_psu: 34.5,
    wind_kn: 13.6,
    battery_v: 12.9,
    last_ping: '4 mins ago',
    status: 'ONLINE'
  }
];

// ── 3. Simulated Live AIS Marine Traffic ──
export const AIS_VESSELS: AISVessel[] = [
  {
    mmsi: '419001420',
    name: 'MV Maersk Colombo',
    callsign: '9V8124',
    vessel_type: 'Cargo Container',
    color: '#38bdf8',
    lat: 9.8420,
    lon: 75.8500,
    sog_kn: 16.4,
    cog_deg: 312,
    length_m: 294,
    draft_m: 13.8,
    destination: 'Colombo -> Salalah',
    nav_status: 'Underway using engine',
    eta: 'Today 22:30 UTC'
  },
  {
    mmsi: '419000854',
    name: 'MT Desh Shanti',
    callsign: 'ATVI',
    vessel_type: 'Crude Oil Tanker',
    color: '#c084fc',
    lat: 10.1500,
    lon: 75.7200,
    sog_kn: 12.8,
    cog_deg: 145,
    length_m: 330,
    draft_m: 16.2,
    destination: 'Sikka -> Kochi Refineries',
    nav_status: 'Underway using engine',
    eta: 'Tomorrow 06:00 UTC'
  },
  {
    mmsi: '419009999',
    name: 'ICGS Samarth',
    callsign: '4XAA',
    vessel_type: 'Coast Guard Patrol',
    color: '#34d399',
    lat: 9.7200,
    lon: 76.0800,
    sog_kn: 18.0,
    cog_deg: 195,
    length_m: 105,
    draft_m: 4.8,
    destination: 'EEZ Maritime Surveillance Patrol',
    nav_status: 'Patrolling sovereign waters',
    eta: 'Routine Patrol'
  },
  {
    mmsi: '419084122',
    name: 'St. Antony III',
    callsign: 'IND-KL-782',
    vessel_type: 'Mechanized Trawler',
    color: '#fbbf24',
    lat: 9.8850,
    lon: 76.1400,
    sog_kn: 3.8,
    cog_deg: 235,
    length_m: 24,
    draft_m: 3.2,
    destination: 'Sector Alpha Fishing Bank',
    nav_status: 'Engaged in pelagic trawling',
    eta: 'Port Return 18:00'
  },
  {
    mmsi: '419092441',
    name: 'Sagara Ratna',
    callsign: 'IND-TN-901',
    vessel_type: 'Tuna Longliner',
    color: '#fbbf24',
    lat: 10.0200,
    lon: 75.9500,
    sog_kn: 5.2,
    cog_deg: 275,
    length_m: 28,
    draft_m: 3.6,
    destination: 'Continental Shelf Break',
    nav_status: 'Hauling longline gear',
    eta: 'Port Return 21:00'
  },
  {
    mmsi: '419077182',
    name: 'RV Samudra Ratnakar',
    callsign: 'IND-GSI',
    vessel_type: 'Oceanographic Research',
    color: '#06b6d4',
    lat: 10.2200,
    lon: 76.0100,
    sog_kn: 7.5,
    cog_deg: 10,
    length_m: 68,
    draft_m: 4.6,
    destination: 'MoES Seafloor Bathymetric Mapping',
    nav_status: 'Restricted in ability to maneuver',
    eta: 'Station Alpha'
  }
];

// ── 4. Prominent Ocean Basin Labels ──
export const OCEAN_BASINS: OceanBasin[] = [
  {
    name: 'ARABIAN SEA BASIN',
    subtext: 'مرتفعات بحر العرب · Deep Pelagic Zone',
    lat: 13.5,
    lon: 69.5,
    depth_m: '~3,850m',
    type: 'sea'
  },
  {
    name: 'BAY OF BENGAL BASIN',
    subtext: 'বঙ্গোপসাগর অববাহিকা · Tropical Monsoon Realm',
    lat: 14.5,
    lon: 87.5,
    depth_m: '~4,100m',
    type: 'sea'
  },
  {
    name: 'LACCADIVE SEA REALM',
    subtext: 'Lakshadweep Atolls Coral Lagoon',
    lat: 10.2,
    lon: 73.2,
    depth_m: '~2,100m',
    type: 'sea'
  },
  {
    name: 'INDIAN OCEAN EQUATORIAL ABYSS',
    subtext: 'Southern Oceanic Transshipment Corridor',
    lat: 5.8,
    lon: 77.2,
    depth_m: '~4,500m',
    type: 'ocean'
  },
  {
    name: 'GULF OF MANNAR BIOSPHERE',
    subtext: 'Palk Bay Shallow Barrier Reef',
    lat: 8.8,
    lon: 79.1,
    depth_m: '~45m',
    type: 'gulf'
  },
  {
    name: 'GULF OF KHAMBHAT',
    subtext: 'High Tidal Bore Estuary Zone',
    lat: 21.3,
    lon: 72.3,
    depth_m: '~28m',
    type: 'gulf'
  },
  {
    name: 'GULF OF KUTCH',
    subtext: 'Marine Sanctuary Coral Trench',
    lat: 22.6,
    lon: 69.5,
    depth_m: '~36m',
    type: 'gulf'
  },
  {
    name: 'ANDAMAN SEA DEEP TRENCH',
    subtext: 'Volcanic Arc Subduction Zone',
    lat: 11.5,
    lon: 94.2,
    depth_m: '~3,600m',
    type: 'sea'
  }
];

export interface GeoFeature {
  type: 'Feature';
  geometry: {
    type: 'LineString' | 'Polygon' | 'Point';
    coordinates: any;
  };
  properties: Record<string, any>;
}

export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

// ── 5. Generate Dynamic Lat/Long Graticule Grid GeoJSON ──
export function generateGraticuleGeoJSON(
  minLat = 4,
  maxLat = 24,
  minLon = 66,
  maxLon = 96,
  step = 1.0
): GeoFeatureCollection {
  const features: GeoFeature[] = [];

  // Parallels (Latitude lines)
  for (let lat = minLat; lat <= maxLat; lat += step) {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [minLon, lat],
          [maxLon, lat]
        ]
      },
      properties: {
        type: 'latitude',
        value: lat,
        label: `${lat}°N`
      }
    });
  }

  // Meridians (Longitude lines)
  for (let lon = minLon; lon <= maxLon; lon += step) {
    features.push({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [lon, minLat],
          [lon, maxLat]
        ]
      },
      properties: {
        type: 'longitude',
        value: lon,
        label: `${lon}°E`
      }
    });
  }

  return {
    type: 'FeatureCollection',
    features
  };
}

// ── 6. Ocean Currents & Swell Vector Field GeoJSON ──
export function generateOceanCurrentVectors(
  centerLat: number,
  centerLon: number
): GeoFeatureCollection {
  const features: GeoFeature[] = [];
  const spacing = 0.35; // ~38 km grid

  for (let dLat = -1.0; dLat <= 1.0; dLat += spacing) {
    for (let dLon = -1.2; dLon <= 0.6; dLon += spacing) {
      const lat = centerLat + dLat;
      const lon = centerLon + dLon;

      // Realistic West India Coastal Current flows Northwest (heading ~325°)
      // Velocity ~0.65 m/s with small local eddies
      const angleRad = (325 * Math.PI) / 180 + Math.sin(lat * 3) * 0.15;
      const lengthDeg = 0.085; // arrow length

      const endLon = lon + Math.sin(angleRad) * lengthDeg;
      const endLat = lat + Math.cos(angleRad) * lengthDeg;

      // Current arrow shaft
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [lon, lat],
            [endLon, endLat]
          ]
        },
        properties: {
          speed_ms: 0.68,
          dir_deg: 325,
          type: 'current_vector'
        }
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features
  };
}

// ── 7. SST Thermal Front Gradients & Chlorophyll Plumes GeoJSON ──
export function generateSSTThermalFrontGeoJSON(
  centerLat: number,
  centerLon: number
): GeoFeatureCollection {
  // Translucent thermal contour polygons depicting thermal upwelling drop
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [centerLon - 0.70, centerLat - 0.60],
            [centerLon - 0.20, centerLat - 0.55],
            [centerLon - 0.10, centerLat + 0.10],
            [centerLon - 0.35, centerLat + 0.65],
            [centerLon - 0.85, centerLat + 0.45],
            [centerLon - 0.70, centerLat - 0.60]
          ]]
        },
        properties: {
          name: 'Upwelling Front (Optimal Plankton Bloom)',
          sst_temp: '27.4°C - 28.2°C',
          delta_t: 'ΔT 0.85°C Drop',
          color: '#0ea5e9',
          opacity: 0.22
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [centerLon - 1.20, centerLat - 0.80],
            [centerLon - 0.65, centerLat - 0.70],
            [centerLon - 0.50, centerLat + 0.30],
            [centerLon - 0.90, centerLat + 0.80],
            [centerLon - 1.40, centerLat + 0.50],
            [centerLon - 1.20, centerLat - 0.80]
          ]]
        },
        properties: {
          name: 'Open Pelagic Thermal Transition',
          sst_temp: '28.5°C - 29.2°C',
          delta_t: 'ΔT 0.35°C',
          color: '#38bdf8',
          opacity: 0.15
        }
      }
    ]
  };
}

// ── 8. Satellite Swath Footprint GeoJSON (ISRO Oceansat-3 OCM-3) ──
export function generateSatelliteSwathGeoJSON(
  centerLat: number,
  centerLon: number
): GeoFeatureCollection {
  const p1: [number, number] = [centerLon - 1.8, centerLat - 1.5];
  const p2: [number, number] = [centerLon + 0.8, centerLat - 1.5];
  const p3: [number, number] = [centerLon + 0.3, centerLat + 1.8];
  const p4: [number, number] = [centerLon - 2.3, centerLat + 1.8];

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[p1, p2, p3, p4, p1]]
        },
        properties: {
          satellite: 'ISRO Oceansat-3 (EOS-06)',
          sensor: 'Ocean Colour Monitor (OCM-3) & SSTM',
          resolution: '360m Optical / 1km Thermal IR',
          pass_time: 'Today 10:42 IST · Ascending Node',
          swath_km: '1,420 km'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [(p1[0] + p2[0]) / 2, centerLat - 1.5],
            [(p3[0] + p4[0]) / 2, centerLat + 1.8]
          ]
        },
        properties: {
          type: 'ground_track',
          satellite: 'Oceansat-3 Ground Track'
        }
      }
    ]
  };
}

// ── 9. Bathymetric Depth & Zone Estimator ──
export function estimateBathymetryDepth(lat: number, lon: number): {
  depth_m: number;
  zone: string;
  shelf_profile: string;
} {
  // Approximate offshore distance from Indian coast
  // Distance from 76.22 (Kochi) westwards: 1 deg lon ~ 110 km
  const lonDiff = 76.25 - lon;
  
  if (lonDiff <= 0.05) {
    return { depth_m: 14, zone: 'Nearshore Coastal Littoral', shelf_profile: 'Inner Harbor Basin' };
  } else if (lonDiff <= 0.25) {
    return { depth_m: 28, zone: 'Inner Continental Shelf', shelf_profile: 'Gentle Sandy Mud Slope' };
  } else if (lonDiff <= 0.55) {
    return { depth_m: 48, zone: 'Mid-Shelf Pelagic Bank', shelf_profile: 'Productive Upwelling Shelf' };
  } else if (lonDiff <= 0.90) {
    return { depth_m: 95, zone: 'Outer Continental Shelf Break', shelf_profile: 'Steep Bathymetric Ridge' };
  } else if (lonDiff <= 1.40) {
    return { depth_m: 280, zone: 'Continental Slope', shelf_profile: 'Deep Pelagic Drop-off' };
  } else {
    return { depth_m: 1850, zone: 'Arabian Sea Abyssal Plain', shelf_profile: 'Deep Oceanic Trench' };
  }
}
