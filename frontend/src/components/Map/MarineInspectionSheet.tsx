import React from 'react';
import { PFZZone } from '../../types/marine';
import { MarinePort, OceanBuoy, AISVessel } from './marineMapData';
import {
  X,
  Navigation,
  Anchor,
  Radio,
  Ship,
  Waves,
  Thermometer,
  Droplets,
  Compass,
  Battery,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { localizeDestination } from '../../utils/locationTranslations';

export type InspectionTarget =
  | { type: 'pfz'; data: PFZZone }
  | { type: 'port'; data: MarinePort }
  | { type: 'buoy'; data: OceanBuoy }
  | { type: 'vessel'; data: AISVessel };

interface MarineInspectionSheetProps {
  target: InspectionTarget | null;
  onClose: () => void;
  language: string;
  onNavigatePFZ?: (pfz: PFZZone) => void;
  onSelectPort?: (port: MarinePort) => void;
}

export const MarineInspectionSheet: React.FC<MarineInspectionSheetProps> = ({
  target,
  onClose,
  language,
  onNavigatePFZ,
  onSelectPort
}) => {
  if (!target) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:absolute sm:inset-auto sm:top-20 sm:left-4 z-40 max-w-full sm:max-w-[390px] w-full pointer-events-auto animate-in slide-in-from-bottom sm:slide-in-from-left duration-250">
      {/* Mobile Backdrop Tap Area (only on small screens to easily tap outside) */}
      <div
        className="sm:hidden fixed inset-0 bg-black/40 -z-10"
        onClick={onClose}
      />

      <div className="bg-[#121824]/95 backdrop-blur-xl border-t sm:border border-[#384959] sm:rounded-3xl rounded-t-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden max-h-[82vh] sm:max-h-[86vh] flex flex-col text-white font-sans">
        
        {/* Mobile Swipe Handle Indicator */}
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 cursor-grab" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full bg-[#384959]/80" />
        </div>

        {/* ── 1. SPOT: Potential Fishing Zone Inspection ── */}
        {target.type === 'pfz' && (
          <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-3.5">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
                      target.data.safety_rating === 'SAFE'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : target.data.safety_rating === 'CAUTION'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        target.data.safety_rating === 'SAFE'
                          ? 'bg-emerald-400'
                          : target.data.safety_rating === 'CAUTION'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    ● {target.data.safety_rating} ZONE
                  </span>
                  <span className="text-[11px] text-[#88BDF2] font-mono font-medium">
                    {target.data.distance_km} km · {target.data.bearing_compass}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug tracking-tight">
                  {localizeDestination(target.data.name, language)}
                </h3>
                <p className="text-xs text-[#BDDDFC]/70 font-medium">
                  {getTranslation('isro_marine_observation', language)}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1E2632] hover:bg-[#2A3744] text-[#BDDDFC] hover:text-white flex items-center justify-center border border-[#384959] transition-colors flex-shrink-0 cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suitability Score Bar */}
            <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
              <div className="flex items-baseline justify-between mb-1.5">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {getTranslation('catch_potential', language)}
                  </span>
                  <span className="text-[10px] text-[#BDDDFC]/60">
                    {getTranslation('rf_ml_model', language)}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-2xl font-black text-[#88BDF2]">
                    {Math.round(target.data.suitability_score || 85)}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-[#161c27] rounded-full overflow-hidden border border-[#384959]/50 mb-1.5">
                <div
                  className="h-full bg-gradient-to-r from-[#6A89A7] via-[#88BDF2] to-[#BDDDFC] rounded-full transition-all duration-700"
                  style={{ width: `${Math.round(target.data.suitability_score || 85)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#BDDDFC]/80 font-mono">
                <span>Confidence: {target.data.model_confidence_pct ?? 92}%</span>
                <span>Biomass: High</span>
              </div>
            </div>

            {/* SST & Chlorophyll Gauges */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#88BDF2] mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>SST Thermal</span>
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {target.data.sst_c}°C
                </div>
                <div className="text-[10px] text-[#BDDDFC]/60 mt-0.5">
                  Optimal Gradient (ΔT 0.5°C)
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#88BDF2] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-teal-400" />
                  <span>Chlorophyll</span>
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {target.data.chlorophyll_mg_m3} <span className="text-xs font-normal">mg/m³</span>
                </div>
                <div className="text-[10px] text-[#BDDDFC]/60 mt-0.5">
                  Upwelling Plume Peak
                </div>
              </div>
            </div>

            {/* Target Species */}
            <div className="p-2.5 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
              <div className="text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <span>🐟</span>
                <span>High-Likelihood Species</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(target.data.target_species || ['Indian Mackerel', 'Oil Sardine', 'Yellowfin Tuna', 'White Prawn']).map(
                  (sp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#1E2632] border border-[#384959] text-[11px] text-[#BDDDFC] font-medium"
                    >
                      {sp}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Navigational Fix Coordinates */}
            <div className="p-2.5 rounded-2xl bg-[#0b0f17] border border-[#384959]/70 font-mono text-xs flex justify-between items-center text-[#BDDDFC]">
              <div>
                <span className="text-[10px] text-[#BDDDFC]/60 uppercase block">Target Fix</span>
                <span className="font-bold text-white">
                  {target.data.location.latitude.toFixed(4)}°N, {target.data.location.longitude.toFixed(4)}°E
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#BDDDFC]/60 uppercase block">Bearing</span>
                <span className="font-bold text-[#88BDF2]">
                  {target.data.bearing_compass} ({target.data.bearing_deg}°)
                </span>
              </div>
            </div>

            {/* Action Button */}
            {onNavigatePFZ && (
              <button
                onClick={() => {
                  onNavigatePFZ(target.data);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0474C4] to-[#88BDF2] hover:from-[#0361a6] hover:to-[#BDDDFC] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0474C4]/25 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>{getTranslation('navigate_here', language)}</span>
              </button>
            )}
          </div>
        )}

        {/* ── 2. PORT: Major Harbor Inspection ── */}
        {target.type === 'port' && (
          <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                    <Anchor className="w-3 h-3" />
                    <span>{target.data.type}</span>
                  </span>
                  {target.data.refuge_shelter && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Refuge Shelter
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug tracking-tight">
                  {target.data.name}
                </h3>
                <p className="text-xs text-[#BDDDFC]/70 font-medium">
                  {target.data.state} Maritime Board Jurisdiction
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1E2632] hover:bg-[#2A3744] text-[#BDDDFC] hover:text-white flex items-center justify-center border border-[#384959] transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Port Operational Specs */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
                <div className="text-[10px] text-[#BDDDFC]/60 font-semibold uppercase mb-1">
                  Harbor Depth / Draft
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {target.data.depth_m} <span className="text-xs text-[#88BDF2]">meters</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  Dredged Navigation Basin
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
                <div className="text-[10px] text-[#BDDDFC]/60 font-semibold uppercase mb-1">
                  VHF Radio Channel
                </div>
                <div className="text-lg font-bold text-cyan-300 font-mono">
                  Ch {target.data.vhf_ch}
                </div>
                <div className="text-[10px] text-[#BDDDFC]/60 mt-1">
                  Harbor Master Calling
                </div>
              </div>
            </div>

            {/* Fishery Logistics Capacity */}
            <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Berthing Capacity:</span>
                <span className="font-bold text-white font-mono">{target.data.berths} Dedicated Jetties</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Active Ice Plants:</span>
                <span className="font-bold text-white font-mono">{target.data.ice_plants} Shore Facilities</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Cold Storage Buffer:</span>
                <span className="font-bold text-emerald-400 font-mono">{target.data.cold_storage_mt} Metric Tons</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC] pt-1.5 border-t border-[#384959]/50">
                <span className="text-[#BDDDFC]/70">Coordinates:</span>
                <span className="font-bold text-white font-mono">
                  {target.data.lat.toFixed(4)}°N, {target.data.lon.toFixed(4)}°E
                </span>
              </div>
            </div>

            {/* Actions */}
            {onSelectPort && (
              <button
                onClick={() => {
                  onSelectPort(target.data);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Set as Active Departure Harbor</span>
              </button>
            )}
          </div>
        )}

        {/* ── 3. BUOY: MoES/INCOIS Ocean Buoy Inspection ── */}
        {target.type === 'buoy' && (
          <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>{target.data.agency} Active Sensor</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {target.data.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug tracking-tight">
                  {target.data.name}
                </h3>
                <p className="text-xs text-[#BDDDFC]/70 font-medium">
                  {target.data.type} · Pinged {target.data.last_ping}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1E2632] hover:bg-[#2A3744] text-[#BDDDFC] hover:text-white flex items-center justify-center border border-[#384959] transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metocean Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#88BDF2] mb-1">
                  <Waves className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sig Wave (Hs)</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {target.data.hs_m} <span className="text-xs text-[#88BDF2]">m</span>
                </div>
                <div className="text-[10px] text-[#BDDDFC]/60 mt-0.5">
                  Period: {target.data.period_s}s Swell
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#88BDF2] mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sea Surface Temp</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {target.data.sst_c}°C
                </div>
                <div className="text-[10px] text-[#BDDDFC]/60 mt-0.5">
                  Calibrated CTD Sensor
                </div>
              </div>
            </div>

            {/* Additional Physical Parameters */}
            <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Tidal Level Variation:</span>
                <span className="font-bold text-white font-mono">{target.data.tide_m > 0 ? `+${target.data.tide_m}` : target.data.tide_m} m (MSL)</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Ocean Salinity:</span>
                <span className="font-bold text-white font-mono">{target.data.salinity_psu} PSU</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Wind Speed at Mast:</span>
                <span className="font-bold text-white font-mono">{target.data.wind_kn} Knots</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC] pt-1.5 border-t border-[#384959]/50">
                <span className="text-[#BDDDFC]/70">Battery / Solar Health:</span>
                <span className="font-bold text-emerald-400 font-mono flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5" />
                  {target.data.battery_v}V Nominal
                </span>
              </div>
            </div>

            {/* Coordinates */}
            <div className="p-2.5 rounded-2xl bg-[#0b0f17] border border-[#384959]/70 font-mono text-xs text-[#BDDDFC] flex justify-between">
              <span className="text-[#BDDDFC]/60">Sensor Fix:</span>
              <span className="font-bold text-white">
                {target.data.lat.toFixed(4)}°N, {target.data.lon.toFixed(4)}°E
              </span>
            </div>
          </div>
        )}

        {/* ── 4. VESSEL: AIS Shipping Traffic Inspection ── */}
        {target.type === 'vessel' && (
          <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${target.data.color}20`,
                      color: target.data.color,
                      borderColor: `${target.data.color}40`
                    }}
                  >
                    <Ship className="w-3 h-3" />
                    <span>{target.data.vessel_type}</span>
                  </span>
                  <span className="text-xs text-[#BDDDFC]/70 font-mono">
                    MMSI: {target.data.mmsi}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug tracking-tight">
                  {target.data.name}
                </h3>
                <p className="text-xs text-[#BDDDFC]/70 font-medium">
                  Callsign: {target.data.callsign} · AIS Class A Transponder
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1E2632] hover:bg-[#2A3744] text-[#BDDDFC] hover:text-white flex items-center justify-center border border-[#384959] transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Over Ground & Heading */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
                <div className="text-[10px] text-[#BDDDFC]/60 font-semibold uppercase mb-1">
                  Speed Over Ground (SOG)
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {target.data.sog_kn} <span className="text-xs text-[#88BDF2]">knots</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">
                  {(target.data.sog_kn * 1.852).toFixed(1)} km/h
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70">
                <div className="text-[10px] text-[#BDDDFC]/60 font-semibold uppercase mb-1">
                  Course Over Ground (COG)
                </div>
                <div className="text-xl font-bold text-white font-mono flex items-center gap-1">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>{target.data.cog_deg}°</span>
                </div>
                <div className="text-[10px] text-[#BDDDFC]/60 mt-0.5">
                  True Heading Gyro
                </div>
              </div>
            </div>

            {/* Navigational Voyage Info */}
            <div className="p-3 rounded-2xl bg-[#0b0f17] border border-[#384959]/70 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Destination:</span>
                <span className="font-bold text-white">{target.data.destination}</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Estimated Arrival (ETA):</span>
                <span className="font-bold text-cyan-300 font-mono">{target.data.eta}</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC]">
                <span className="text-[#BDDDFC]/70">Navigational Status:</span>
                <span className="font-bold text-emerald-400">{target.data.nav_status}</span>
              </div>
              <div className="flex justify-between items-center text-[#BDDDFC] pt-1.5 border-t border-[#384959]/50">
                <span className="text-[#BDDDFC]/70">Dimensions & Draft:</span>
                <span className="font-bold text-white font-mono">
                  {target.data.length_m}m Length · {target.data.draft_m}m Draft
                </span>
              </div>
            </div>

            {/* Live Position */}
            <div className="p-2.5 rounded-2xl bg-[#0b0f17] border border-[#384959]/70 font-mono text-xs text-[#BDDDFC] flex justify-between">
              <span className="text-[#BDDDFC]/60">AIS GNSS Fix:</span>
              <span className="font-bold text-white">
                {target.data.lat.toFixed(4)}°N, {target.data.lon.toFixed(4)}°E
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
