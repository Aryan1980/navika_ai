import React from 'react';
import {
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Gauge,
  Fuel,
  Compass,
  XCircle,
  MapPin,
  CheckCircle2,
  Fish,
  ChevronRight,
  ShieldAlert,
  Volume2,
  Anchor,
  LifeBuoy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { voiceService } from '../../services/voice';
import { getTranslation } from '../../utils/translations';
import { localizeInstruction, localizeDestination, getLocalizedPortName } from '../../utils/locationTranslations';

export const RoutePlannerPanel: React.FC = () => {
  const {
    routeComparison,
    selectedPFZForRoute,
    clearRoute,
    setActiveCommandTab,
    language
  } = useApp();

  if (!routeComparison) {
    return (
      <div className="bg-[#242E3B] border border-[#384959] rounded-2xl p-8 flex flex-col items-center justify-center h-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#384959] border border-[#6A89A7]/40 flex items-center justify-center text-[#88BDF2] mb-3.5 shadow-md">
          <Navigation className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {getTranslation('nav_route', language)}
        </h3>
        <p className="text-xs sm:text-sm text-[#BDDDFC] mt-2 max-w-md leading-relaxed">
          {getTranslation('route_planner_title', language)}. Select any dynamic Potential Fishing Zone (PFZ) or issue a natural language query to plot an evidence-based nautical voyage route with turn-by-turn guidance and dynamic hazard avoidance.
        </p>

        <button
          onClick={() => setActiveCommandTab('pfz')}
          className="mt-5 px-5 py-2.5 bg-[#384959] hover:bg-[#2A3744] text-white border border-[#88BDF2]/40 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-md"
        >
          <Fish className="w-4 h-4 text-[#88BDF2]" />
          <span>{getTranslation('browse_spots_btn', language)}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const { shortest_route, safe_route, recommendation, reasoning } = routeComparison;
  const targetName = selectedPFZForRoute ? selectedPFZForRoute.name : 'Target Fishing Ground';

  const safeFuelLiters = safe_route.estimated_fuel_liters ?? (safe_route.distance_km * 0.45).toFixed(1);
  const directFuelLiters = shortest_route.estimated_fuel_liters ?? (shortest_route.distance_km * 0.45).toFixed(1);

  const speakTurnByTurn = () => {
    const voicePrefix = getTranslation('nautical_guidance_voice', language);
    if (safe_route.turn_by_turn_instructions && safe_route.turn_by_turn_instructions.length > 0) {
      const fullGuide = safe_route.turn_by_turn_instructions.map(i => localizeInstruction(i, language)).join('. ');
      voiceService.speak(`${voicePrefix}: ${fullGuide}`, language);
    } else {
      voiceService.speak(localizeInstruction(safe_route.description, language), language);
    }
  };

  const refuge = safe_route.emergency_port_refuge;

  return (
    <div className="bg-[#242E3B] border border-[#384959] rounded-2xl p-5 flex flex-col h-full overflow-hidden text-xs sm:text-sm text-[#BDDDFC] shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#384959]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#384959] border border-[#6A89A7]/40 flex items-center justify-center text-[#88BDF2] shadow-sm flex-shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div>
              <span className="px-3 py-1 rounded-lg bg-[#384959] text-[#88BDF2] border border-[#88BDF2]/40 text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-sm">
                <Navigation className="w-3.5 h-3.5 text-[#88BDF2]" />
                <span>{getTranslation('nautical_route_active', language)}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#BDDDFC] font-medium truncate max-w-[360px] mt-1.5">
              {getTranslation('destination_label', language)}:{' '}
              <span className="text-white font-bold">{localizeDestination(targetName, language)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={speakTurnByTurn}
            className="flex items-center gap-1.5 text-xs text-[#BDDDFC] hover:text-white bg-[#384959] hover:bg-[#2A3744] border border-[#6A89A7]/40 px-3 py-1.5 rounded-xl transition-colors cursor-pointer font-medium"
            title="Read turn-by-turn nautical navigation aloud"
          >
            <Volume2 className="w-4 h-4 text-[#88BDF2]" />
            <span>{getTranslation('voice_guide_btn', language)}</span>
          </button>

          <button
            onClick={clearRoute}
            className="flex items-center gap-1 text-xs text-[#BDDDFC]/80 hover:text-rose-400 bg-[#1E2632] hover:bg-rose-500/10 border border-[#384959] hover:border-rose-500/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer font-medium"
            title="Clear route"
          >
            <XCircle className="w-4 h-4" />
            <span>{getTranslation('clear_btn', language)}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
        
        {/* Comparison Cards: Safe Route vs Direct Track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Card 1: Safe Nautical Route (Recommended) */}
          <div className="p-4 rounded-xl border border-[#88BDF2]/50 bg-[#2A3744] flex flex-col justify-between relative overflow-hidden shadow-md">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white">
                  <ShieldCheck className="w-4 h-4 text-[#88BDF2] flex-shrink-0" />
                  {getTranslation('recommended_safe_route', language)}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#384959] text-[#88BDF2] border border-[#88BDF2]/40 text-[10px] font-mono font-bold flex-shrink-0">
                  {getTranslation('hazard_free_badge', language)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono my-2.5">
                <div className="bg-[#1E2632] p-2.5 rounded-lg border border-[#384959]">
                  <span className="text-[#BDDDFC]/70 block text-[10px] uppercase font-semibold">{getTranslation('distance_label', language)}</span>
                  <span className="text-white font-bold text-sm sm:text-base">{safe_route.distance_km} km</span>
                  <span className="text-xs text-[#BDDDFC]/70 ml-1">({safe_route.distance_nm ?? (safe_route.distance_km / 1.852).toFixed(1)} NM)</span>
                </div>
                <div className="bg-[#1E2632] p-2.5 rounded-lg border border-[#384959]">
                  <span className="text-[#BDDDFC]/70 block text-[10px] uppercase font-semibold">{getTranslation('est_duration', language)}</span>
                  <span className="text-[#88BDF2] font-bold text-sm sm:text-base">
                    {safe_route.estimated_duration_minutes ? `${safe_route.estimated_duration_minutes} mins` : `${safe_route.estimated_duration_hours} hrs`}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#BDDDFC] pt-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#BDDDFC]/85 flex items-center gap-1.5 font-medium flex-shrink-0">
                    <Fuel className="w-3.5 h-3.5 text-[#88BDF2] flex-shrink-0" /> {getTranslation('est_fuel_label', language)}
                  </span>
                  <span className="font-mono text-white font-bold">{safeFuelLiters} L</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-0.5">
                  <span className="text-[#BDDDFC]/85 flex items-center gap-1.5 font-medium flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#88BDF2] flex-shrink-0" /> {getTranslation('status_label', language)}:
                  </span>
                  <span className="text-[#88BDF2] font-semibold text-left sm:text-right leading-tight">{getTranslation('bypasses_restricted_zones', language)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#384959] text-xs text-[#F1F5F9] leading-relaxed font-sans">
              {safe_route.description}
            </div>
          </div>

          {/* Card 2: Direct Rhumb Line (Baseline) */}
          <div className="p-4 rounded-xl border border-[#384959] bg-[#2A3744]/70 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  {getTranslation('direct_rhumb_line', language)}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-400/15 text-rose-300 text-[10px] font-mono font-bold flex-shrink-0">
                  {shortest_route.risk_level === 'HIGH' ? getTranslation('high_risk_badge', language) : getTranslation('direct_track_badge', language)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono my-2.5">
                <div className="bg-[#1E2632] p-2.5 rounded-lg border border-[#384959]">
                  <span className="text-[#BDDDFC]/70 block text-[10px] uppercase font-semibold">{getTranslation('distance_label', language)}</span>
                  <span className="text-white font-bold text-sm sm:text-base">{shortest_route.distance_km} km</span>
                  <span className="text-xs text-[#BDDDFC]/70 ml-1">({shortest_route.distance_nm ?? (shortest_route.distance_km / 1.852).toFixed(1)} NM)</span>
                </div>
                <div className="bg-[#1E2632] p-2.5 rounded-lg border border-[#384959]">
                  <span className="text-[#BDDDFC]/70 block text-[10px] uppercase font-semibold">{getTranslation('est_duration', language)}</span>
                  <span className="text-rose-300 font-bold text-sm sm:text-base">
                    {shortest_route.estimated_duration_minutes ? `${shortest_route.estimated_duration_minutes} mins` : `${shortest_route.estimated_duration_hours} hrs`}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#BDDDFC] pt-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#BDDDFC]/85 flex items-center gap-1.5 font-medium flex-shrink-0">
                    <Fuel className="w-3.5 h-3.5 text-[#BDDDFC]/60 flex-shrink-0" /> {getTranslation('fuel_consumption', language)}:
                  </span>
                  <span className="font-mono text-white font-bold">{directFuelLiters} L</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-0.5">
                  <span className="text-[#BDDDFC]/85 flex items-center gap-1.5 font-medium flex-shrink-0">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" /> {getTranslation('intersections_label', language)}
                  </span>
                  <span className="text-rose-300 font-semibold text-left sm:text-right leading-tight">
                    {shortest_route.hazards_intersected && shortest_route.hazards_intersected.length > 0
                      ? shortest_route.hazards_intersected.join(', ')
                      : getTranslation('none_clear', language)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#384959] text-xs text-rose-300/90 leading-relaxed font-sans">
              {getTranslation('direct_line_warning', language)}
            </div>
          </div>

        </div>

        {/* Turn-by-Turn Nautical Instructions Card (Google Maps for Ocean) */}
        {safe_route.turn_by_turn_instructions && safe_route.turn_by_turn_instructions.length > 0 && (
          <div className="p-4 rounded-xl bg-[#2A3744] border border-[#384959]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#88BDF2]" />
                {getTranslation('turn_by_turn_instructions', language)}
              </span>
              <span className="font-mono text-xs text-[#BDDDFC] font-semibold">
                {safe_route.turn_by_turn_instructions.length} {getTranslation('navigation_steps_suffix', language)}
              </span>
            </div>

            <div className="space-y-2.5">
              {safe_route.turn_by_turn_instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1E2632] border border-[#384959] text-sm text-[#F1F5F9] shadow-sm">
                  <span className="w-6 h-6 rounded-full bg-[#384959] border border-[#88BDF2]/40 text-[#88BDF2] text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{localizeInstruction(inst, language)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Port of Refuge Card */}
        {refuge && refuge.name && (
          <div className="p-4 rounded-xl bg-[#2A3744] border border-[#384959]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-[#88BDF2]" />
                {getTranslation('nearest_emergency_port', language)}
              </span>
              <span className="text-xs text-[#88BDF2] bg-[#384959] border border-[#88BDF2]/30 px-2.5 py-0.5 rounded-lg font-bold">
                {getTranslation('shelter_harbor', language)}
              </span>
            </div>
            <p className="text-base text-white font-bold">
              {getLocalizedPortName(refuge.name, language)} &mdash;{' '}
              <span className="font-mono text-[#88BDF2]">{refuge.distance_nm} NM ({refuge.distance_km} km)</span>
            </p>
            <p className="text-xs sm:text-sm text-[#BDDDFC] mt-1.5 leading-relaxed font-sans">
              {localizeInstruction(refuge.instruction, language)} (Transit: ~{refuge.transit_time_minutes} mins)
            </p>
          </div>
        )}

        {/* Tactical Recommendation & Agent Rationale */}
        <div className="p-4 rounded-xl bg-[#2A3744] border border-[#384959]">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-[#88BDF2]" />
            <span className="text-xs sm:text-sm font-bold text-white">{getTranslation('navigation_rationale', language)}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#F1F5F9] leading-relaxed">
            {recommendation}
          </p>
          {reasoning && (
            <div className="mt-2.5 text-xs text-[#BDDDFC] font-mono bg-[#1E2632] p-3 rounded-lg border border-[#384959] leading-relaxed">
              {reasoning}
            </div>
          )}
        </div>

        {/* Detailed Waypoint Navigation Sequence */}
        <div className="p-4 rounded-xl bg-[#2A3744] border border-[#384959]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Anchor className="w-4 h-4 text-[#88BDF2]" />
              {getTranslation('waypoint_sequence', language)}
            </span>
            <span className="font-mono text-xs text-[#BDDDFC]">
              {safe_route.waypoints.length} {getTranslation('nautical_fix_points', language)}
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {safe_route.waypoints.map((wp, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#1E2632] border border-[#384959] gap-1.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#384959] border border-[#88BDF2]/40 text-[#88BDF2] text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-white font-sans text-xs sm:text-sm font-semibold">{wp.name}</span>
                    {wp.instruction && (
                      <span className="block text-xs text-[#88BDF2] font-mono mt-0.5">{wp.instruction}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-[#BDDDFC] text-xs flex-shrink-0">
                  {wp.bearing_compass && (
                    <span className="px-2 py-0.5 rounded bg-[#384959] text-[#88BDF2] font-bold border border-[#88BDF2]/30">
                      {wp.bearing_compass} ({wp.bearing_deg}&deg;)
                    </span>
                  )}
                  {wp.leg_distance_nm !== undefined && wp.leg_distance_nm > 0 && (
                    <span className="text-white font-bold">{wp.leg_distance_nm} NM</span>
                  )}
                  <span className="text-white/80">{wp.latitude.toFixed(3)}&deg;N, {wp.longitude.toFixed(3)}&deg;E</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
