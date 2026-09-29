export interface Coordinates {
  latitude: float;
  longitude: float;
}

export type float = number;

export interface MarineObservation {
  location: Coordinates;
  timestamp: string;
  sst?: number;
  chlorophyll?: number;
  wave_height?: number;
  wave_direction?: number;
  wind_speed?: number;
  wind_direction?: number;
  rainfall?: number;
  tide?: string;
  tide_height_m?: number;
  sea_state?: string;
  source: string;
  data_type: string;
  is_demo: boolean;
}

export interface WeatherReport {
  location: Coordinates;
  timestamp: string;
  temperature_c: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  wind_gust_kmh: number;
  wave_height_m: number;
  wave_direction_deg: number;
  rainfall_mm: number;
  humidity_pct: number;
  visibility_km: number;
  lightning_detected: boolean;
  lightning_distance_km?: number;
  cyclone_status: 'none' | 'watch' | 'warning';
  cyclone_category?: string;
  advisory_text?: string;
  source: string;
  is_demo: boolean;
}

export interface PFZZone {
  id: string;
  name: string;
  location: Coordinates;
  polygon: [number, number][];
  distance_km: number;
  bearing_deg: number;
  bearing_compass: string;
  sst_c: number;
  chlorophyll_mg_m3: number;
  suitability_score: number;
  safety_rating: 'SAFE' | 'CAUTION' | 'AVOID';
  recommendation: string;
  avoids: boolean;
  source: string;
  is_demo: boolean;
  target_species?: string[];
  ml_model_name?: string;
  predicted_biomass_score?: number;
  model_confidence_pct?: number;
  top_features?: { feature: string; impact: string }[];
}

export interface FactorScore {
  factor_name: string;
  raw_value: number;
  unit: string;
  score: number;
  weight: number;
  weighted_score: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  explanation: string;
  normalized_risk?: number;
  contribution?: number;
  is_missing?: boolean;
}

export interface RiskAssessment {
  overall_score: number;
  safety_score?: number;
  total_risk?: number;
  formula_explanation?: string;
  is_missing_data_penalized?: boolean;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  safety_verdict: 'SAFE' | 'SAFE_WITH_CAUTION' | 'UNSAFE' | 'HAZARDOUS';
  recommendation: string;
  factors: FactorScore[];
  summary_reasons: string[];
  timestamp: string;
  calculation_method?: string;
  disclaimer?: string;
}

export interface Waypoint {
  name: string;
  latitude: number;
  longitude: number;
  hazard_distance_km?: number;
  segment_risk: string;
  bearing_deg?: number;
  bearing_compass?: string;
  leg_distance_km?: number;
  leg_distance_nm?: number;
  eta_minutes?: number;
  instruction?: string;
  sea_state?: string;
}

export interface RouteOption {
  route_type: 'shortest' | 'safe';
  waypoints: Waypoint[];
  distance_km: number;
  estimated_duration_hours: number;
  distance_nm?: number;
  estimated_duration_minutes?: number;
  estimated_fuel_liters?: number;
  risk_level: string;
  hazards_intersected: string[];
  description: string;
  turn_by_turn_instructions?: string[];
  emergency_port_refuge?: {
    name: string;
    latitude: number;
    longitude: number;
    distance_km: number;
    distance_nm: number;
    bearing_deg: number;
    bearing_compass: string;
    transit_time_minutes: number;
    instruction: string;
  };
}

export interface RouteComparison {
  origin: Coordinates;
  destination: Coordinates;
  shortest_route: RouteOption;
  safe_route: RouteOption;
  recommendation: string;
  reasoning: string;
}

export interface MarineAlert {
  id: string;
  title: string;
  severity: 'EXTREME' | 'HIGH' | 'MODERATE' | 'INFORMATIONAL';
  category: string;
  location: Coordinates;
  affected_radius_km: number;
  message: string;
  issued_at: string;
  expires_at: string;
  source: string;
  is_demo: boolean;
}

export interface AgentTrace {
  agent_name: string;
  status: 'COMPLETED' | 'FALLBACK' | 'SKIPPED';
  execution_time_ms: number;
  data_source: string;
  summary: string;
}

export interface EvidenceDetails {
  intent_detected: string;
  datasets_used: string[];
  timestamps: Record<string, string>;
  deterministic_score: number;
  risk_factors: Record<string, any>;
  observed_vs_forecast: string;
  demo_vs_live: string;
  agent_reasoning_flow: string[];
  multi_agent_evidence?: Record<string, string[]>;
  provenance?: Record<string, any>;
}

export interface MosdacProductStatus {
  product_key: string;
  product_name: string;
  parameter: string;
  dataset_id: string;
  last_data_update: string;
  data_file: string;
  file_size: string;
  processing_status: string;
  format: string;
  dimensions?: Record<string, number>;
  variables_extracted?: string[];
  xarray_supported?: boolean;
  hdf5_supported?: boolean;
}

export interface MosdacTechnicalStatus {
  data_source: string;
  data_source_full_name: string;
  authority: string;
  standing_order_account: string;
  connection_status: string;
  last_pipeline_sync: string;
  products: MosdacProductStatus[];
  pipeline_checklist?: Record<string, boolean>;
  compliance?: Record<string, boolean>;
}

export interface MosdacProbeResult {
  source: string;
  dataset_id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  variables: {
    sst?: number;
    sst_unit?: string;
    chlorophyll?: number;
    chlorophyll_unit?: string;
    wind_speed?: number;
    wind_speed_unit?: string;
    wind_direction?: number;
    wind_direction_unit?: string;
    wave_height?: number | null;
  };
  file: string;
  processing_status: string;
  provenance: {
    source_authority: string;
    observation_time: string;
    processing_time: string;
    is_synthetic: boolean;
    verified_satellite_products?: Array<{
      parameter: string;
      dataset_id: string;
      sensor: string;
      observation_time: string;
      file: string;
      pixel_distance_km: number;
      engine?: string;
    }>;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  risk_level?: string;
  safety_verdict?: string;
  evidence?: EvidenceDetails;
  traces?: AgentTrace[];
  pfzs?: PFZZone[];
  route?: RouteComparison;
}

export interface ChatResponse {
  direct_answer: string;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  safety_verdict: 'SAFE' | 'SAFE_WITH_CAUTION' | 'UNSAFE' | 'HAZARDOUS';
  recommendation: string;
  conditions_summary?: Record<string, any>;
  evidence: EvidenceDetails;
  agent_traces: AgentTrace[];
  active_map_layers: string[];
  suggested_queries: string[];
  relevant_pfz?: PFZZone[];
  route_comparison?: RouteComparison;
  alerts?: MarineAlert[];
  focus_location: Coordinates;
}

export interface DataSourceInfo {
  id: string;
  name: string;
  organization: string;
  dataset_name: string;
  parameters: string;
  status: 'LIVE' | 'ACTIVE_DEMO' | 'STANDBY';
  is_demo: boolean;
  last_update: string;
  update_frequency: string;
  description: string;
  official_portal: string;
  config_env_var: string;
}

export interface CoastalPreset {
  id: string;
  name: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  harbor: string;
  key_species: string[];
}

export interface UserProfile {
  phone: string;
  name: string;
  vessel_name: string;
  vessel_type: string;
  home_port: string;
  created_at?: string;
}

export interface VoyageLog {
  id: string;
  user_phone: string;
  voyage_date: string;
  origin_name: string;
  destination_name: string;
  distance_nm: number;
  distance_km: number;
  duration_mins: number;
  fuel_liters: number;
  catch_kg: number;
  catch_species: string;
  safety_rating: string;
  notes: string;
  created_at?: string;
}
