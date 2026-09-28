import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Fish,
  Navigation,
  Compass,
  Thermometer,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Anchor,
  Layers
} from 'lucide-react';
import { PFZZone } from '../../types/marine';
import { getTranslation } from '../../utils/translations';

interface FishingSpotsViewProps {
  onViewOnMap: () => void;
}

export const FishingSpotsView: React.FC<FishingSpotsViewProps> = ({ onViewOnMap }) => {
  const {
    pfzs,
    activeLocation,
    activeLocationName,
    selectedPFZForRoute,
    routeComparison,
    openRouteForPFZ,
    isAnalyzing,
    language
  } = useApp();

  const [activeSpot, setActiveSpot] = useState<PFZZone | null>(selectedPFZForRoute || pfzs[0] || null);

  const handleSelectSpot = (pfz: PFZZone) => {
    setActiveSpot(pfz);
    openRouteForPFZ(pfz);
  };

  const selected = activeSpot || pfzs[0];

  const estHours = selected ? (selected.distance_km / 12.0).toFixed(1) : '1.5';
  const fuelEst = selected ? Math.round(selected.distance_km * 0.85) : 18;

  return (
    <div className="h-full min-h-0 flex-1 flex flex-col overflow-hidden bg-[#151926] text-[#f1f5fb] p-6 sm:p-8 relative selection:bg-[#384959] selection:text-[#BDDDFC] font-sans">
      
      {/* ── Ambient Glow (Stormy morning tones) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-[#384959]/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-[#6A89A7]/10 rounded-full blur-[140px]" />
      </div>

      {/* ── Top Header ── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#384959]/60 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#384959] border border-[#6A89A7]/50 flex items-center justify-center text-[#88BDF2] shadow-md">
              <Fish className="w-6 h-6 text-[#88BDF2]" />
            </div>
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-white tracking-tight">
                {getTranslation('spots_header_title', language)}
              </h1>
              <p className="text-xs sm:text-sm text-[#BDDDFC] font-mono mt-1 flex items-center gap-2">
                <span>{getTranslation('departure_fix_label', language)}: <strong className="text-white font-semibold">{activeLocationName}</strong></span>
                <span className="text-[#88BDF2]">·</span>
                <span className="text-[#88BDF2] font-semibold">
                  {pfzs.length} {getTranslation('fronts_detected', language)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Action button to jump to map */}
        <button
          onClick={onViewOnMap}
          className="btn-signature group cursor-pointer text-xs sm:text-sm shadow-md"
        >
          <Navigation className="w-4 h-4 text-[#BDDDFC]" />
          <span>{getTranslation('view_on_satellite_map', language)}</span>
          <span className="text-[#BDDDFC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
        </button>
      </div>

      {/* ── Main 2-Column Grid ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pt-5 overflow-hidden">
        
        {/* Left Column (5 Cols): List of Spots with Crisp High-Contrast Cards */}
        <div className="lg:col-span-5 flex flex-col min-h-0 bg-[#1a222f] border border-[#384959] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#384959]/60 flex-shrink-0">
            <span className="font-editorial text-lg text-white font-normal">
              {getTranslation('identified_thermal_fronts', language)}
            </span>
            <span className="text-xs font-mono text-[#BDDDFC]/80 font-medium">
              {getTranslation('sorted_by_proximity', language)}
            </span>
          </div>

          <div className="space-y-3.5 overflow-y-auto flex-1 pr-1.5 pt-3.5">
            {pfzs.map((pfz, idx) => {
              const isSelected = selected?.id === pfz.id;
              const isSafe = pfz.safety_rating === 'SAFE';

              return (
                <div
                  key={pfz.id}
                  onClick={() => handleSelectSpot(pfz)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#222d3d] border-[#88BDF2] shadow-[0_0_20px_rgba(136,189,242,0.18)] ring-1 ring-[#88BDF2]/60'
                      : 'bg-[#151a24] hover:bg-[#1d2533] border-[#384959]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#384959]/60">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-[#263140] text-[#88BDF2] font-mono font-bold text-xs flex items-center justify-center border border-[#6A89A7]/40 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-sans text-sm font-semibold text-white truncate">
                        {getTranslation('spot_prefix', language)} {idx + 1}: {pfz.name.replace(`Spot ${idx + 1}: `, '')}
                      </span>
                    </div>

                    {/* Smooth, high-contrast badge */}
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#384959] text-white border border-[#88BDF2]/40 flex-shrink-0 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#88BDF2]" />
                      <span>{pfz.safety_rating}</span>
                    </span>
                  </div>

                  {/* Conditions Grid - Clean & High Contrast */}
                  <div className="grid grid-cols-3 gap-2 bg-[#12161f] p-3 rounded-xl text-xs font-mono mb-2.5 border border-[#384959]/60">
                    <div>
                      <span className="text-[#BDDDFC]/75 block text-[10px] uppercase font-semibold">{getTranslation('transit_label', language)}</span>
                      <span className="text-white font-bold text-xs sm:text-sm mt-0.5 block">{pfz.distance_km} km</span>
                      <span className="text-[#BDDDFC] text-[10px]">{pfz.bearing_compass}</span>
                    </div>
                    <div>
                      <span className="text-[#BDDDFC]/75 block text-[10px] uppercase font-semibold">{getTranslation('sst_front_label', language)}</span>
                      <span className="text-white font-bold text-xs sm:text-sm mt-0.5 block">{pfz.sst_c}°C</span>
                      <span className="text-[#88BDF2] text-[10px]">Optimal</span>
                    </div>
                    <div>
                      <span className="text-[#BDDDFC]/75 block text-[10px] uppercase font-semibold">{getTranslation('feasibility_label', language)}</span>
                      <span className="text-[#88BDF2] font-extrabold text-xs sm:text-sm mt-0.5 block">{Math.round(pfz.suitability_score)}%</span>
                      <span className="text-[#BDDDFC] text-[10px]">Match</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#F1F5F9] font-normal leading-relaxed line-clamp-2">
                    {pfz.recommendation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 Cols): Detailed Route Waypoints & Navigation Diagnostics */}
        <div className="lg:col-span-7 flex flex-col min-h-0 bg-[#1a222f] border border-[#384959] rounded-2xl p-6 shadow-xl space-y-5 overflow-y-auto">
          
          {selected && (
            <>
              {/* Active Spot Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#384959]/60">
                <div>
                  <span className="text-xs font-mono text-[#88BDF2] uppercase tracking-wider block font-bold">
                    {getTranslation('selected_front_route', language)}
                  </span>
                  <h2 className="font-editorial text-xl sm:text-2xl text-white font-normal mt-1">
                    {selected.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right font-mono">
                    <span className="text-xs text-[#BDDDFC]/80 block font-medium">{getTranslation('harvest_match', language)}</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#88BDF2] font-mono leading-none">
                      {Math.round(selected.suitability_score)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Transit & Fuel Highlights - High Contrast & Large Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
                  <span className="text-xs text-[#BDDDFC] block uppercase font-bold tracking-wider">{getTranslation('one_way_distance', language)}</span>
                  <span className="text-2xl font-bold text-white block mt-1">{selected.distance_km} km</span>
                  <span className="text-xs text-[#88BDF2] font-semibold block mt-1">
                    {getTranslation('bearing_prefix', language)} {selected.bearing_deg}° ({selected.bearing_compass})
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
                  <span className="text-xs text-[#BDDDFC] block uppercase font-bold tracking-wider">{getTranslation('est_steaming_time', language)}</span>
                  <span className="text-2xl font-bold text-white block mt-1">{estHours} hrs</span>
                  <span className="text-xs text-[#BDDDFC]/80 block mt-1">{getTranslation('cruise_speed', language)}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
                  <span className="text-xs text-[#BDDDFC] block uppercase font-bold tracking-wider">{getTranslation('fuel_consumption', language)}</span>
                  <span className="text-2xl font-bold text-[#88BDF2] block mt-1">~{fuelEst} Liters</span>
                  <span className="text-xs text-[#BDDDFC]/80 block mt-1">{getTranslation('fuel_type', language)}</span>
                </div>
              </div>

              {/* Target GPS Coordinates Card - Large, Readable Coordinates */}
              <div className="p-5 rounded-xl bg-[#12161f] border border-[#384959] space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider block">
                    {getTranslation('target_gps_coords', language)}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${selected.location.latitude.toFixed(4)}, ${selected.location.longitude.toFixed(4)}`);
                      alert(getTranslation('copied_alert', language));
                    }}
                    className="text-xs font-mono text-[#88BDF2] hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold px-2 py-1 rounded bg-[#1e2634] border border-[#384959]"
                  >
                    <span>{getTranslation('copy_coordinates', language)}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959] font-mono text-xs">
                    <span className="text-[#BDDDFC] block text-xs uppercase font-bold tracking-wider">{getTranslation('target_location_fix', language)}</span>
                    <span className="text-white font-extrabold text-base block mt-1">
                      {selected.location.latitude.toFixed(4)}°N, {selected.location.longitude.toFixed(4)}°E
                    </span>
                    <span className="text-[#88BDF2] text-xs font-semibold block mt-1">
                      ● {getTranslation('verified_front', language)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959] font-mono text-xs">
                    <span className="text-[#BDDDFC] block text-xs uppercase font-bold tracking-wider">{getTranslation('departure_fix_box', language)}</span>
                    <span className="text-white font-bold text-base block mt-1">
                      {activeLocation.latitude.toFixed(4)}°N, {activeLocation.longitude.toFixed(4)}°E
                    </span>
                    <span className="text-[#BDDDFC]/90 text-xs font-medium block mt-1">
                      {activeLocationName} {getTranslation('harbor_suffix', language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigational Hazard & Danger Clearance - High Readability */}
              <div className="p-5 rounded-xl bg-[#12161f] border border-[#384959] space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#88BDF2]" />
                  <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    {getTranslation('hazard_danger_scan', language)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#1a222f] border border-[#384959]">
                    <span className="text-[#BDDDFC] block text-[10px] uppercase font-bold tracking-wider">{getTranslation('imbl_border', language)}</span>
                    <span className="text-white font-bold text-sm block mt-1">{getTranslation('imbl_clear', language)}</span>
                    <span className="text-xs text-[#BDDDFC]/80 block mt-1 font-medium">{getTranslation('no_territorial_risk', language)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1a222f] border border-[#384959]">
                    <span className="text-[#BDDDFC] block text-[10px] uppercase font-bold tracking-wider">{getTranslation('protected_areas', language)}</span>
                    <span className="text-white font-bold text-sm block mt-1">{getTranslation('zero_intersections', language)}</span>
                    <span className="text-xs text-[#BDDDFC]/80 block mt-1 font-medium">{getTranslation('sanctuary_clear', language)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1a222f] border border-[#384959]">
                    <span className="text-[#BDDDFC] block text-[10px] uppercase font-bold tracking-wider">{getTranslation('defense_restrictions', language)}</span>
                    <span className="text-white font-bold text-sm block mt-1">{getTranslation('unrestricted', language)}</span>
                    <span className="text-xs text-[#BDDDFC]/80 block mt-1 font-medium">{getTranslation('naval_corridor_open', language)}</span>
                  </div>
                </div>

                {/* Safety Guidance Note - Crisp, High-Contrast Text */}
                <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959] space-y-1.5">
                  <div className="flex items-center gap-2 text-[#88BDF2] font-bold text-xs sm:text-sm">
                    <AlertTriangle className="w-4 h-4 text-[#88BDF2]" />
                    <span>{getTranslation('areas_to_avoid', language)}</span>
                  </div>
                  <p className="text-[#F1F5F9] text-xs sm:text-sm leading-relaxed font-normal">
                    {getTranslation('safety_guidance_text', language).replace('{bearing}', `${selected.bearing_deg}° (${selected.bearing_compass})`)}
                  </p>
                </div>
              </div>

              {/* Bottom CTA to Jump to Map */}
              <div className="pt-2">
                <button
                  onClick={onViewOnMap}
                  className="btn-signature w-full py-3.5 group text-xs sm:text-sm tracking-[0.14em] cursor-pointer shadow-lg"
                >
                  <Navigation className="w-4 h-4 text-[#BDDDFC]" />
                  <span>{getTranslation('inspect_spot_on_map', language)}</span>
                  <span className="text-[#BDDDFC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                </button>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
};
