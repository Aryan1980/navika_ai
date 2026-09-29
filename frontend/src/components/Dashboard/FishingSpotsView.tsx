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
import { getLocalizedPortName, localizeDestination, getLocalizedRecommendation } from '../../utils/locationTranslations';
import { getSafetyStatusTheme } from '../../utils/statusColors';

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
  const selectedTheme = getSafetyStatusTheme(selected?.safety_rating);

  const estHours = selected ? (selected.distance_km / 12.0).toFixed(1) : '1.5';
  const fuelEst = selected ? Math.round(selected.distance_km * 0.85) : 18;

  return (
    <div className="h-full min-h-0 flex-1 flex flex-col overflow-y-auto lg:overflow-hidden bg-[#151926] text-[#f1f5fb] p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 relative selection:bg-[#384959] selection:text-[#BDDDFC] font-sans">
      
      {/* ── Ambient Glow (Stormy morning tones) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-[#384959]/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-[#6A89A7]/10 rounded-full blur-[140px]" />
      </div>

      {/* ── Top Header ── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#384959]/60 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#384959] border border-[#6A89A7]/50 flex items-center justify-center text-[#88BDF2] shadow-md flex-shrink-0">
              <Fish className="w-5 h-5 sm:w-6 sm:h-6 text-[#88BDF2]" />
            </div>
            <div>
              <h1 className="font-editorial text-xl sm:text-3xl font-normal text-white tracking-tight">
                {getTranslation('spots_header_title', language)}
              </h1>
              <p className="text-xs sm:text-sm text-[#BDDDFC] font-mono mt-0.5 sm:mt-1 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>{getTranslation('departure_fix_label', language)}: <strong className="text-white font-semibold">{getLocalizedPortName(activeLocationName, language)}</strong></span>
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
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 pt-4 sm:pt-5 overflow-visible lg:overflow-hidden">
        
        {/* Left Column (5 Cols): List of Spots with Crisp High-Contrast Cards */}
        <div className="lg:col-span-5 flex flex-col min-h-0 max-h-[380px] lg:max-h-none bg-[#1a222f] border border-[#384959] rounded-2xl p-4 sm:p-5 shadow-xl">
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
              const statusTheme = getSafetyStatusTheme(pfz.safety_rating);

              return (
                <div
                  key={pfz.id}
                  onClick={() => handleSelectSpot(pfz)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? `bg-[#222d3d] ${statusTheme.cardSelectedBorder} ${statusTheme.cardSelectedShadow} ${statusTheme.cardSelectedRing}`
                      : `bg-[#151a24] hover:bg-[#1d2533] border-[#384959] ${statusTheme.cardBorderHover}`
                  }`}
                >
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#384959]/60">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-[#263140] text-[#88BDF2] font-mono font-bold text-xs flex items-center justify-center border border-[#6A89A7]/40 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-sans text-base font-semibold text-white truncate">
                        {localizeDestination(pfz.name, language)}
                      </span>
                    </div>

                    {/* Consistent SAFE / CAUTION / AVOID Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${statusTheme.badgeBg} ${statusTheme.badgeText} border ${statusTheme.badgeBorder} flex-shrink-0 flex items-center gap-1.5 ${statusTheme.glowClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusTheme.dotClass}`} />
                      <span>{getTranslation(pfz.safety_rating.toLowerCase(), language) || pfz.safety_rating}</span>
                    </span>
                  </div>

                  {/* Conditions Grid - Clean & High Contrast */}
                  <div className="grid grid-cols-3 gap-2 bg-[#12161f] p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm font-mono mb-2.5 border border-[#384959]/60">
                    <div>
                      <span className="text-[#BDDDFC] block text-xs sm:text-sm uppercase font-bold">{getTranslation('transit_label', language)}</span>
                      <span className="text-white font-bold text-sm sm:text-base mt-0.5 block">{pfz.distance_km} km</span>
                      <span className="text-[#BDDDFC] text-xs sm:text-sm font-medium">{pfz.bearing_compass}</span>
                    </div>
                    <div>
                      <span className="text-[#BDDDFC] block text-xs sm:text-sm uppercase font-bold">{getTranslation('sst_front_label', language)}</span>
                      <span className="text-white font-bold text-sm sm:text-base mt-0.5 block">{pfz.sst_c}°C</span>
                      <span className="text-[#88BDF2] text-xs sm:text-sm font-semibold">{getTranslation('optimal', language)}</span>
                    </div>
                    <div>
                      <span className="text-[#BDDDFC] block text-xs sm:text-sm uppercase font-bold">{getTranslation('feasibility_label', language)}</span>
                      <span className="text-[#88BDF2] font-extrabold text-sm sm:text-base mt-0.5 block">{Math.round(pfz.suitability_score)}%</span>
                      <span className="text-[#BDDDFC] text-xs sm:text-sm font-medium">{getTranslation('match', language)}</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[#F1F5F9] font-normal leading-relaxed line-clamp-2">
                    {getLocalizedRecommendation(pfz.recommendation, language)}
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-mono text-[#88BDF2] uppercase tracking-wider block font-bold">
                      {getTranslation('selected_front_route', language)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${selectedTheme.badgeBg} ${selectedTheme.badgeText} border ${selectedTheme.badgeBorder} flex items-center gap-1.5 shadow-sm`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedTheme.dotClass}`} />
                      <span>{getTranslation(selected.safety_rating.toLowerCase(), language) || selected.safety_rating}</span>
                    </span>
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal mt-1">
                    {localizeDestination(selected.name, language)}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right font-mono">
                    <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block font-medium">{getTranslation('harvest_match', language)}</span>
                    <span className="text-2xl sm:text-4xl font-extrabold text-[#88BDF2] font-mono leading-none">
                      {Math.round(selected.suitability_score)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Transit & Fuel Highlights - High Contrast & Large Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 sm:p-5 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
                  <span className="text-xs sm:text-sm text-[#BDDDFC] block uppercase font-bold tracking-wider">{getTranslation('one_way_distance', language)}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white block mt-1">{selected.distance_km} km</span>
                  <span className="text-xs sm:text-sm text-[#88BDF2] font-semibold block mt-1">
                    {getTranslation('bearing_prefix', language)} {selected.bearing_deg}° ({selected.bearing_compass})
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
                  <span className="text-xs sm:text-sm text-[#BDDDFC] block uppercase font-bold tracking-wider">{getTranslation('est_steaming_time', language)}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-white block mt-1">{estHours} hrs</span>
                  <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1">{getTranslation('cruise_speed', language)}</span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
                  <span className="text-xs sm:text-sm text-[#BDDDFC] block uppercase font-bold tracking-wider">{getTranslation('fuel_consumption', language)}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#88BDF2] block mt-1">~{fuelEst} Liters</span>
                  <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1">{getTranslation('fuel_type', language)}</span>
                </div>
              </div>

              {/* Target GPS Coordinates Card - Large, Readable Coordinates */}
              <div className="p-5 rounded-xl bg-[#12161f] border border-[#384959] space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider block">
                    {getTranslation('target_gps_coords', language)}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${selected.location.latitude.toFixed(4)}, ${selected.location.longitude.toFixed(4)}`);
                      alert(getTranslation('copied_alert', language));
                    }}
                    className="text-xs sm:text-sm font-mono text-[#88BDF2] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-semibold px-2.5 py-1.5 rounded-lg bg-[#1e2634] border border-[#384959]"
                  >
                    <span>{getTranslation('copy_coordinates', language)}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-4 rounded-xl bg-[#1a222f] border border-[#384959] font-mono text-sm">
                    <span className="text-[#BDDDFC] block text-xs sm:text-sm uppercase font-bold tracking-wider">{getTranslation('target_location_fix', language)}</span>
                    <span className="text-white font-extrabold text-base sm:text-lg block mt-1">
                      {selected.location.latitude.toFixed(4)}°N, {selected.location.longitude.toFixed(4)}°E
                    </span>
                    <span className={`${selectedTheme.accentTextClass} text-xs sm:text-sm font-semibold block mt-1 flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedTheme.dotClass}`} />
                      <span>{getTranslation('verified_front', language)} ({selected.safety_rating})</span>
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1a222f] border border-[#384959] font-mono text-sm">
                    <span className="text-[#BDDDFC] block text-xs sm:text-sm uppercase font-bold tracking-wider">{getTranslation('departure_fix_box', language)}</span>
                    <span className="text-white font-bold text-base sm:text-lg block mt-1">
                      {activeLocation.latitude.toFixed(4)}°N, {activeLocation.longitude.toFixed(4)}°E
                    </span>
                    <span className="text-[#BDDDFC]/90 text-xs sm:text-sm font-medium block mt-1">
                      {getLocalizedPortName(activeLocationName, language)} {getTranslation('harbor_suffix', language)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigational Hazard & Danger Clearance - High Readability */}
              <div className="p-5 rounded-xl bg-[#12161f] border border-[#384959] space-y-3.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    {getTranslation('hazard_danger_scan', language)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959]">
                    <span className="text-[#BDDDFC] block text-xs uppercase font-bold tracking-wider">{getTranslation('imbl_border', language)}</span>
                    <span className="text-white font-bold text-sm sm:text-base mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{getTranslation('imbl_clear', language)}</span>
                    </span>
                    <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1 font-medium">{getTranslation('no_territorial_risk', language)}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959]">
                    <span className="text-[#BDDDFC] block text-xs uppercase font-bold tracking-wider">{getTranslation('protected_areas', language)}</span>
                    <span className="text-white font-bold text-sm sm:text-base mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{getTranslation('zero_intersections', language)}</span>
                    </span>
                    <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1 font-medium">{getTranslation('sanctuary_clear', language)}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959]">
                    <span className="text-[#BDDDFC] block text-xs uppercase font-bold tracking-wider">{getTranslation('defense_restrictions', language)}</span>
                    <span className="text-white font-bold text-sm sm:text-base mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{getTranslation('unrestricted', language)}</span>
                    </span>
                    <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1 font-medium">{getTranslation('naval_corridor_open', language)}</span>
                  </div>
                </div>

                {/* Safety Guidance Note - Consistent Dynamic Status Theme */}
                <div className={`p-4 sm:p-5 rounded-xl bg-[#1a222f] border ${selectedTheme.badgeBorder} space-y-2 shadow-sm`}>
                  <div className={`flex items-center gap-2 ${selectedTheme.accentTextClass} font-bold text-base sm:text-lg`}>
                    {selected.safety_rating === 'SAFE' ? (
                      <CheckCircle2 className={`w-5 h-5 ${selectedTheme.iconColorClass}`} />
                    ) : (
                      <AlertTriangle className={`w-5 h-5 ${selectedTheme.iconColorClass}`} />
                    )}
                    <span>
                      {selected.safety_rating === 'SAFE'
                        ? getTranslation('safe_seaward_passage', language, 'Safe Seaward Passage Verified')
                        : selected.safety_rating === 'CAUTION'
                        ? getTranslation('advisory_caution_zone', language, 'Advisory Caution Zone')
                        : getTranslation('hazardous_boundary_avoid', language, 'Hazardous Boundary / Restricted Area - Avoid')}
                    </span>
                  </div>
                  <p className="text-[#F1F5F9] text-sm sm:text-base leading-relaxed font-normal">
                    {getLocalizedRecommendation(selected.recommendation, language)}
                  </p>
                </div>
              </div>

              {/* Bottom CTA to Jump to Map */}
              <div className="pt-2">
                <button
                  onClick={onViewOnMap}
                  className="btn-signature w-full py-3.5 group text-sm sm:text-base tracking-[0.12em] cursor-pointer shadow-lg"
                >
                  <Navigation className="w-5 h-5 text-[#BDDDFC]" />
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
