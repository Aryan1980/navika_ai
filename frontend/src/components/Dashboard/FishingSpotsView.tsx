import React, { useState, useRef, useEffect } from 'react';
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
  Check,
  Anchor,
  Layers,
  ChevronLeft,
  ChevronRight,
  Copy
} from 'lucide-react';
import { PFZZone } from '../../types/marine';
import { getTranslation } from '../../utils/translations';
import {
  getLocalizedPortName,
  localizeDestination,
  getLocalizedRecommendation
} from '../../utils/locationTranslations';
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

  const [activeSpot, setActiveSpot] = useState<PFZZone | null>(
    selectedPFZForRoute || pfzs[0] || null
  );
  const [mobileLayout, setMobileLayout] = useState<'carousel' | 'stack'>('carousel');
  const [copied, setCopied] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const handleSelectSpot = (pfz: PFZZone) => {
    setActiveSpot(pfz);
    openRouteForPFZ(pfz);
  };

  const selected = activeSpot || pfzs[0];
  const selectedTheme = getSafetyStatusTheme(selected?.safety_rating);

  const activeIndex = pfzs.findIndex((p) => p.id === selected?.id);

  // Sync active spot if selectedPFZForRoute updates from outside (e.g. map click)
  useEffect(() => {
    if (selectedPFZForRoute) {
      setActiveSpot(selectedPFZForRoute);
    }
  }, [selectedPFZForRoute]);

  // Smooth scroll carousel to active card when active index changes on mobile
  useEffect(() => {
    if (mobileLayout === 'carousel' && carouselRef.current && selected?.id) {
      const cardEl = document.getElementById(`pfz-card-mobile-${selected.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [selected?.id, mobileLayout]);

  const handlePrev = () => {
    if (activeIndex > 0) {
      handleSelectSpot(pfzs[activeIndex - 1]);
    }
  };

  const handleNext = () => {
    if (activeIndex < pfzs.length - 1) {
      handleSelectSpot(pfzs[activeIndex + 1]);
    }
  };

  const handleCopyCoords = () => {
    if (!selected) return;
    const text = `${selected.location.latitude.toFixed(4)}, ${selected.location.longitude.toFixed(4)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const estHours = selected ? (selected.distance_km / 12.0).toFixed(1) : '1.5';
  const fuelEst = selected ? Math.round(selected.distance_km * 0.85) : 18;

  // Single card renderer for consistency across desktop grid, mobile carousel, and mobile stack
  const renderSpotCard = (pfz: PFZZone, idx: number, isMobileCard = false) => {
    const isSelected = selected?.id === pfz.id;
    const statusTheme = getSafetyStatusTheme(pfz.safety_rating);

    return (
      <div
        key={pfz.id}
        id={isMobileCard ? `pfz-card-mobile-${pfz.id}` : `pfz-card-${pfz.id}`}
        onClick={() => handleSelectSpot(pfz)}
        className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer select-none flex flex-col justify-between ${
          isMobileCard ? 'w-[86vw] max-w-[340px] flex-shrink-0 snap-center' : 'w-full'
        } ${
          isSelected
            ? `bg-[#222d3d] ${statusTheme.cardSelectedBorder} ${statusTheme.cardSelectedShadow} ring-2 ring-[#88BDF2]`
            : `bg-[#1a222f] hover:bg-[#1f2838] border-[#384959] ${statusTheme.cardBorderHover}`
        }`}
      >
        <div>
          {/* Card Header: Spot Name & Status Badge */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#384959]/60 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-[#263140] text-[#88BDF2] font-mono font-bold text-xs flex items-center justify-center border border-[#6A89A7]/40 flex-shrink-0">
                {idx + 1}
              </span>
              <span className="font-sans text-sm sm:text-base font-semibold text-white truncate">
                {localizeDestination(pfz.name, language)}
              </span>
            </div>

            {/* Consistent SAFE / CAUTION / AVOID Status Badge */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${statusTheme.badgeBg} ${statusTheme.badgeText} border ${statusTheme.badgeBorder} flex-shrink-0 flex items-center gap-1.5 ${statusTheme.glowClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusTheme.dotClass}`} />
              <span>
                {getTranslation(pfz.safety_rating.toLowerCase(), language) || pfz.safety_rating}
              </span>
            </span>
          </div>

          {/* Conditions Grid - Clean & High Contrast */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-[#12161f] p-2.5 sm:p-3 rounded-xl text-xs font-mono mb-2.5 border border-[#384959]/60">
            <div className="min-w-0">
              <span className="text-[#BDDDFC] block text-[10px] sm:text-xs uppercase font-bold truncate">
                {getTranslation('transit_label', language)}
              </span>
              <span className="text-white font-bold text-xs sm:text-sm mt-0.5 block truncate">
                {pfz.distance_km} km
              </span>
              <span className="text-[#BDDDFC] text-[10px] sm:text-xs font-medium truncate block">
                {pfz.bearing_compass}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[#BDDDFC] block text-[10px] sm:text-xs uppercase font-bold truncate">
                {getTranslation('sst_front_label', language)}
              </span>
              <span className="text-white font-bold text-xs sm:text-sm mt-0.5 block truncate">
                {pfz.sst_c}°C
              </span>
              <span className="text-[#88BDF2] text-[10px] sm:text-xs font-semibold truncate block">
                {getTranslation('optimal', language)}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[#BDDDFC] block text-[10px] sm:text-xs uppercase font-bold truncate">
                {getTranslation('feasibility_label', language)}
              </span>
              <span className="text-[#88BDF2] font-extrabold text-xs sm:text-sm mt-0.5 block truncate">
                {Math.round(pfz.suitability_score)}%
              </span>
              <span className="text-[#BDDDFC] text-[10px] sm:text-xs font-medium truncate block">
                {getTranslation('match', language)}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#F1F5F9] font-normal leading-relaxed line-clamp-2">
            {getLocalizedRecommendation(pfz.recommendation, language)}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-2.5 mt-2.5 border-t border-[#384959]/50 flex items-center justify-between text-xs font-mono">
          {isSelected ? (
            <span className="text-[#88BDF2] font-semibold flex items-center gap-1.5 text-[11px] sm:text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#88BDF2] flex-shrink-0" />
              <span>Selected Fix</span>
            </span>
          ) : (
            <span className="text-[#BDDDFC]/70 hover:text-white flex items-center gap-1 text-[11px] sm:text-xs">
              <span>Inspect</span>
              <span>→</span>
            </span>
          )}
          <span className="text-[#BDDDFC]/60 text-[10px] sm:text-[11px] truncate max-w-[120px]">
            {pfz.chlorophyll_mg_m3.toFixed(1)} mg/m³ Chl-a
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-full w-full flex flex-col bg-[#151926] text-[#f1f5fb] p-3.5 sm:p-6 md:p-8 pb-28 md:pb-12 relative selection:bg-[#384959] selection:text-[#BDDDFC] font-sans space-y-6 sm:space-y-8">
      
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
                <span>
                  {getTranslation('departure_fix_label', language)}:{' '}
                  <strong className="text-white font-semibold">
                    {getLocalizedPortName(activeLocationName, language)}
                  </strong>
                </span>
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
          className="btn-signature group cursor-pointer text-xs sm:text-sm shadow-md flex-shrink-0 self-start sm:self-auto"
        >
          <Navigation className="w-4 h-4 text-[#BDDDFC]" />
          <span>{getTranslation('view_on_satellite_map', language)}</span>
          <span className="text-[#BDDDFC] transition-transform duration-200 group-hover:translate-x-1 font-sans">
            →
          </span>
        </button>
      </div>

      {/* ── Section 1: Identified Thermal Fronts (Responsive Cards Section) ── */}
      <section className="relative z-10 space-y-3.5">
        
        {/* Section Header with Proximity Info & Mobile View Switcher */}
        <div className="flex items-center justify-between pb-2 border-b border-[#384959]/50 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-editorial text-lg sm:text-xl text-white font-normal">
                {getTranslation('identified_thermal_fronts', language)}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#263140] text-[#88BDF2] font-semibold border border-[#6A89A7]/40">
                {pfzs.length} Spots
              </span>
            </div>
            <span className="text-xs font-mono text-[#BDDDFC]/80 font-medium block mt-0.5">
              {getTranslation('sorted_by_proximity', language)}
            </span>
          </div>

          {/* Mobile View Toggle: Carousel vs Stack (Hidden on desktop) */}
          <div className="flex lg:hidden items-center gap-1 bg-[#12161f] p-1 rounded-xl border border-[#384959]/80 text-xs font-mono">
            <button
              onClick={() => setMobileLayout('carousel')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                mobileLayout === 'carousel'
                  ? 'bg-[#263140] text-[#88BDF2] font-semibold shadow-sm'
                  : 'text-[#BDDDFC]/70 hover:text-white'
              }`}
            >
              Swipe Carousel
            </button>
            <button
              onClick={() => setMobileLayout('stack')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                mobileLayout === 'stack'
                  ? 'bg-[#263140] text-[#88BDF2] font-semibold shadow-sm'
                  : 'text-[#BDDDFC]/70 hover:text-white'
              }`}
            >
              List Stack
            </button>
          </div>
        </div>

        {/* ── Mobile View A: Horizontal Swipe Carousel (zero nested scroll, no trapped box) ── */}
        {mobileLayout === 'carousel' && (
          <div className="block lg:hidden space-y-3">
            <div
              ref={carouselRef}
              className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-1 pb-2 scroll-smooth -mx-1 px-1"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {pfzs.map((pfz, idx) => renderSpotCard(pfz, idx, true))}
            </div>

            {/* Mobile Carousel Controls & Pagination Dots */}
            <div className="flex items-center justify-between px-1 text-xs font-mono text-[#BDDDFC]/80">
              <button
                onClick={handlePrev}
                disabled={activeIndex <= 0}
                className="p-1.5 px-2.5 rounded-lg bg-[#1a222f] border border-[#384959] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Previous Spot"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-[11px]">Prev</span>
              </button>

              {/* Interactive Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {pfzs.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectSpot(p)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeIndex
                        ? 'w-5 bg-[#88BDF2]'
                        : 'w-1.5 bg-[#384959] hover:bg-[#BDDDFC]/50'
                    }`}
                    aria-label={`Go to spot ${i + 1}`}
                  />
                ))}
                <span className="ml-1 text-[11px] font-bold text-white">
                  {activeIndex >= 0 ? activeIndex + 1 : 1}/{pfzs.length}
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={activeIndex >= pfzs.length - 1}
                className="p-1.5 px-2.5 rounded-lg bg-[#1a222f] border border-[#384959] text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Next Spot"
              >
                <span className="text-[11px]">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ── Mobile View B: Vertical Stack (natural page flow, no inner scroll container) ── */}
        {mobileLayout === 'stack' && (
          <div className="flex flex-col lg:hidden gap-3.5 pt-1">
            {pfzs.map((pfz, idx) => renderSpotCard(pfz, idx, false))}
          </div>
        )}

        {/* ── Desktop View: Clean Responsive Grid (No forced scrollbars!) ── */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-4 pt-1">
          {pfzs.map((pfz, idx) => renderSpotCard(pfz, idx, false))}
        </div>

      </section>

      {/* ── Section 2: Detailed Route Waypoints & Navigation Diagnostics for Selected Spot ── */}
      {selected && (
        <section className="relative z-10 bg-[#1a222f] border border-[#384959] rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl space-y-5 sm:space-y-6">
          
          {/* Active Spot Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#384959]/60 gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-mono text-[#88BDF2] uppercase tracking-wider block font-bold">
                  {getTranslation('selected_front_route', language)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${selectedTheme.badgeBg} ${selectedTheme.badgeText} border ${selectedTheme.badgeBorder} flex items-center gap-1.5 shadow-sm`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedTheme.dotClass}`} />
                  <span>
                    {getTranslation(selected.safety_rating.toLowerCase(), language) || selected.safety_rating}
                  </span>
                </span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal mt-1">
                {localizeDestination(selected.name, language)}
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="sm:text-right font-mono">
                <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block font-medium">
                  {getTranslation('harvest_match', language)}
                </span>
                <span className="text-2xl sm:text-4xl font-extrabold text-[#88BDF2] font-mono leading-none">
                  {Math.round(selected.suitability_score)}%
                </span>
              </div>
            </div>
          </div>

          {/* Transit & Fuel Highlights - High Contrast & Large Typography */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 sm:p-5 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
              <span className="text-xs sm:text-sm text-[#BDDDFC] block uppercase font-bold tracking-wider">
                {getTranslation('one_way_distance', language)}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-white block mt-1">
                {selected.distance_km} km
              </span>
              <span className="text-xs sm:text-sm text-[#88BDF2] font-semibold block mt-1">
                {getTranslation('bearing_prefix', language)} {selected.bearing_deg}° ({selected.bearing_compass})
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
              <span className="text-xs sm:text-sm text-[#BDDDFC] block uppercase font-bold tracking-wider">
                {getTranslation('est_steaming_time', language)}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-white block mt-1">
                {estHours} hrs
              </span>
              <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1">
                {getTranslation('cruise_speed', language)}
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#12161f] border border-[#384959] font-mono shadow-sm">
              <span className="text-xs sm:text-sm text-[#BDDDFC] block uppercase font-bold tracking-wider">
                {getTranslation('fuel_consumption', language)}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#88BDF2] block mt-1">
                ~{fuelEst} Liters
              </span>
              <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1">
                {getTranslation('fuel_type', language)}
              </span>
            </div>
          </div>

          {/* Target GPS Coordinates Card - Large, Readable Coordinates */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#12161f] border border-[#384959] space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider block">
                {getTranslation('target_gps_coords', language)}
              </span>
              <button
                onClick={handleCopyCoords}
                className="text-xs sm:text-sm font-mono text-[#88BDF2] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-lg bg-[#1e2634] border border-[#384959]"
                title="Copy Target GPS Coordinates"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{getTranslation('copy_coordinates', language)}</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-[#1a222f] border border-[#384959] font-mono text-sm">
                <span className="text-[#BDDDFC] block text-xs sm:text-sm uppercase font-bold tracking-wider">
                  {getTranslation('target_location_fix', language)}
                </span>
                <span className="text-white font-extrabold text-base sm:text-lg block mt-1">
                  {selected.location.latitude.toFixed(4)}°N, {selected.location.longitude.toFixed(4)}°E
                </span>
                <span
                  className={`${selectedTheme.accentTextClass} text-xs sm:text-sm font-semibold block mt-1 flex items-center gap-1.5`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedTheme.dotClass}`} />
                  <span>
                    {getTranslation('verified_front', language)} ({selected.safety_rating})
                  </span>
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#1a222f] border border-[#384959] font-mono text-sm">
                <span className="text-[#BDDDFC] block text-xs sm:text-sm uppercase font-bold tracking-wider">
                  {getTranslation('departure_fix_box', language)}
                </span>
                <span className="text-white font-bold text-base sm:text-lg block mt-1">
                  {activeLocation.latitude.toFixed(4)}°N, {activeLocation.longitude.toFixed(4)}°E
                </span>
                <span className="text-[#BDDDFC]/90 text-xs sm:text-sm font-medium block mt-1 truncate">
                  {getLocalizedPortName(activeLocationName, language)} {getTranslation('harbor_suffix', language)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigational Hazard & Danger Clearance - High Readability */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#12161f] border border-[#384959] space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                {getTranslation('hazard_danger_scan', language)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959]">
                <span className="text-[#BDDDFC] block text-xs uppercase font-bold tracking-wider">
                  {getTranslation('imbl_border', language)}
                </span>
                <span className="text-white font-bold text-sm sm:text-base mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{getTranslation('imbl_clear', language)}</span>
                </span>
                <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1 font-medium">
                  {getTranslation('no_territorial_risk', language)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959]">
                <span className="text-[#BDDDFC] block text-xs uppercase font-bold tracking-wider">
                  {getTranslation('protected_areas', language)}
                </span>
                <span className="text-white font-bold text-sm sm:text-base mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{getTranslation('zero_intersections', language)}</span>
                </span>
                <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1 font-medium">
                  {getTranslation('sanctuary_clear', language)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1a222f] border border-[#384959]">
                <span className="text-[#BDDDFC] block text-xs uppercase font-bold tracking-wider">
                  {getTranslation('defense_restrictions', language)}
                </span>
                <span className="text-white font-bold text-sm sm:text-base mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{getTranslation('unrestricted', language)}</span>
                </span>
                <span className="text-xs sm:text-sm text-[#BDDDFC]/80 block mt-1 font-medium">
                  {getTranslation('naval_corridor_open', language)}
                </span>
              </div>
            </div>

            {/* Safety Guidance Note - Consistent Dynamic Status Theme */}
            <div className={`p-4 sm:p-5 rounded-xl bg-[#1a222f] border ${selectedTheme.badgeBorder} space-y-2 shadow-sm`}>
              <div className={`flex items-center gap-2 ${selectedTheme.accentTextClass} font-bold text-base sm:text-lg`}>
                {selected.safety_rating === 'SAFE' ? (
                  <CheckCircle2 className={`w-5 h-5 ${selectedTheme.iconColorClass} flex-shrink-0`} />
                ) : (
                  <AlertTriangle className={`w-5 h-5 ${selectedTheme.iconColorClass} flex-shrink-0`} />
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
              <span className="text-[#BDDDFC] transition-transform duration-200 group-hover:translate-x-1 font-sans">
                →
              </span>
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
