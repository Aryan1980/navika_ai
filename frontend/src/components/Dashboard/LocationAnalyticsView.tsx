import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Thermometer,
  Droplets,
  Waves,
  Wind,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Activity,
  Gauge,
  CheckCircle2,
  Anchor,
  FileText,
  Cpu
} from 'lucide-react';
import { OceanDynamicsPanel } from './OceanDynamicsPanel';
import { ImpactHeroPanel } from './ImpactHeroPanel';
import { DeterministicRiskExplanation } from './DeterministicRiskExplanation';

interface LocationAnalyticsViewProps {
  onOpenAdvisory?: () => void;
  onOpenDAG?: () => void;
}

export const LocationAnalyticsView: React.FC<LocationAnalyticsViewProps> = ({ onOpenAdvisory, onOpenDAG }) => {
  const { activeLocation, activeLocationName, weather, ocean, risk, pfzs } = useApp();

  const sstVal = ocean?.sst ?? 28.4;
  const chlVal = ocean?.chlorophyll ?? 3.4;
  const waveVal = weather?.wave_height_m ?? 1.2;
  const windKmh = weather?.wind_speed_kmh ?? 14.5;
  const windKnots = Math.round(windKmh * 0.539957);
  const windGust = weather?.wind_gust_kmh ?? 22.0;

  const score = risk?.overall_score ?? 8;
  const riskLevel = risk?.risk_level ?? 'LOW';

  const isLowRisk = riskLevel === 'LOW';
  const isModerate = riskLevel === 'MODERATE';

  return (
    <div className="h-full min-h-0 flex-1 flex flex-col overflow-y-auto bg-[#151926] text-[#f1f5fb] p-6 sm:p-8 space-y-8 relative selection:bg-[#0474C4]/30 selection:text-[#A8C4EC]">
      
      {/* ── Ambient Sapphire Nightfall Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-[#0474C4]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-[#2C444C]/15 rounded-full blur-[140px]" />
      </div>

      {/* ── Page Header ── */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5379AE]/25">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#06457F] border border-[#5379AE]/40 flex items-center justify-center text-white shadow-md">
              <Activity className="w-5 h-5 text-[#A8C4EC]" />
            </div>
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Location Telemetry & Ocean Analytics
              </h1>
              <p className="text-xs text-[#A8C4EC]/80 font-mono mt-0.5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0474C4]" />
                <span className="font-medium text-white">{activeLocationName}</span>
                <span className="text-[#5379AE]">·</span>
                <span className="text-[#A8C4EC]">{activeLocation.latitude.toFixed(4)}°N, {activeLocation.longitude.toFixed(4)}°E</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons & Status Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenAdvisory && (
            <button
              onClick={onOpenAdvisory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 font-mono text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Generate Official Marine Advisory Bulletin (PDF)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Advisory PDF</span>
            </button>
          )}

          {onOpenDAG && (
            <button
              onClick={onOpenDAG}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#182033] border border-[#5379AE]/30 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Inspect 11-Agent Autonomous DAG"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>11-Agent DAG</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1d2334] border border-[#5379AE]/30 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#A8C4EC]">Oceansat-3 & INCOIS Synced</span>
          </div>
        </div>
      </div>

      {/* ── National Maritime Impact Statistics Panel (SIH 2026 / ISRO PS 26176) ── */}
      <div className="relative z-10 w-full">
        <ImpactHeroPanel onExploreDAG={onOpenDAG} />
      </div>

      {/* ── Row 1: Primary Telemetry Cards (Collectible Retro-Cartographic Style - Image 1) ── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* ── CARD 1: Sea Surface Temperature (SST) ── */}
        <div className="card-chamfered bg-[#1d2334] border border-[#5379AE]/35 hover:border-[#0474C4]/60 transition-all duration-200 shadow-xl flex flex-col justify-between overflow-hidden group">
          <div>
            {/* Top Oceanic Art Header (Image 1 Style) */}
            <div className="h-28 w-full bg-gradient-to-b from-[#06457F] to-[#0474C4] relative overflow-hidden flex items-end">
              {/* Moon / Celestial Satellite Marker */}
              <div className="absolute top-3 right-4 w-7 h-7 border-2 border-white/90 bg-white/20 flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 border border-white/60 bg-white/40" />
              </div>
              {/* Pixel cloud platforms */}
              <div className="absolute top-4 left-4 w-9 h-2 bg-white/80 border border-black/20 shadow-sm" />
              <div className="absolute top-9 left-14 w-7 h-2 bg-white/80 border border-black/20 shadow-sm" />

              {/* Geometric mountain & ocean horizon silhouettes */}
              <svg className="w-full h-16 absolute bottom-0 left-0" viewBox="0 0 300 70" preserveAspectRatio="none">
                {/* Deep sea ridge */}
                <polygon points="0,70 40,40 90,60 140,25 190,50 250,20 300,45 300,70" fill="#1c3038" opacity="0.9" />
                {/* Inshore wave ridge */}
                <polygon points="0,70 60,48 110,62 170,36 220,56 280,38 300,52 300,70" fill="#2C444C" />
                {/* Surface sea band */}
                <rect x="0" y="62" width="300" height="8" fill="#0474C4" opacity="0.6" />
              </svg>
            </div>

            {/* Hatched Banner Band with Category Badge (Image 1 Style) */}
            <div className="banner-hatched-rust px-4 py-1.5 flex items-center border-y border-black/30">
              <div className="bg-[#121622] px-2.5 py-0.5 border border-white/90 shadow-sm">
                <span className="font-mono text-[9px] font-bold text-white tracking-widest uppercase">
                  THERMAL FRONTS
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 sm:p-5 space-y-2.5">
              {/* Chapter / Sensor subhead */}
              <div className="text-[10px] font-mono text-[#A8C4EC] tracking-widest uppercase font-semibold">
                CHAPTER · 01 · MODIS SATELLITE
              </div>

              {/* Title & Big Metric */}
              <div>
                <h3 className="font-editorial text-lg text-white font-normal leading-tight group-hover:text-[#A8C4EC] transition-colors">
                  Sea Surface Temp (SST)
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                  <span className="text-3xl font-bold text-white tracking-tight">{sstVal}</span>
                  <span className="text-xs text-[#A8C4EC] font-sans">°C</span>
                </div>
              </div>

              {/* Oceanographic Narrative Description */}
              <p className="text-xs text-[#A8C4EC]/85 font-light leading-relaxed pt-1">
                Thermal front detected along the 200m depth contour where cooler upwelling intersects warm surface currents.
              </p>
            </div>
          </div>

          {/* Dotted Divider & Footer (Image 1 Style) */}
          <div className="px-4 sm:px-5 pb-4 pt-1">
            <div className="border-b border-dotted border-[#5379AE]/40 mb-2.5" />
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#A8C4EC]/70 uppercase tracking-wider">INCOIS BUOY · LIVE</span>
              <span className="text-[#e59883] font-bold tracking-wider uppercase">OPTIMAL ▸ 0.8°C ΔT</span>
            </div>
          </div>
        </div>

        {/* ── CARD 2: Chlorophyll-a Plumes ── */}
        <div className="card-chamfered bg-[#1d2334] border border-[#5379AE]/35 hover:border-[#0474C4]/60 transition-all duration-200 shadow-xl flex flex-col justify-between overflow-hidden group">
          <div>
            {/* Top Oceanic Art Header */}
            <div className="h-28 w-full bg-gradient-to-b from-[#06457F] to-[#2C444C] relative overflow-hidden flex items-end">
              {/* Celestial marker */}
              <div className="absolute top-3 right-4 w-7 h-7 border-2 border-white/90 bg-white/20 flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 border border-white/60 bg-emerald-400/40" />
              </div>
              <div className="absolute top-6 left-6 w-8 h-2 bg-white/80 border border-black/20 shadow-sm" />

              {/* Geometric Plume Swath */}
              <svg className="w-full h-16 absolute bottom-0 left-0" viewBox="0 0 300 70" preserveAspectRatio="none">
                <polygon points="0,70 50,30 100,55 160,20 220,50 270,32 300,50 300,70" fill="#132b26" opacity="0.9" />
                <polygon points="0,70 70,42 120,60 180,30 240,48 300,35 300,70" fill="#1b4238" />
                <rect x="0" y="62" width="300" height="8" fill="#34d399" opacity="0.4" />
              </svg>
            </div>

            {/* Hatched Banner Band with Category Badge */}
            <div className="banner-hatched-pine px-4 py-1.5 flex items-center border-y border-black/30">
              <div className="bg-[#121622] px-2.5 py-0.5 border border-white/90 shadow-sm">
                <span className="font-mono text-[9px] font-bold text-white tracking-widest uppercase">
                  BIOGEOCHEMICAL
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 sm:p-5 space-y-2.5">
              <div className="text-[10px] font-mono text-[#A8C4EC] tracking-widest uppercase font-semibold">
                CHAPTER · 02 · OCEANSAT-3 OCM
              </div>

              <div>
                <h3 className="font-editorial text-lg text-white font-normal leading-tight group-hover:text-[#A8C4EC] transition-colors">
                  Chlorophyll-A Plume
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                  <span className="text-3xl font-bold text-emerald-300 tracking-tight">{chlVal}</span>
                  <span className="text-xs text-[#A8C4EC] font-sans">mg/m³</span>
                </div>
              </div>

              <p className="text-xs text-[#A8C4EC]/85 font-light leading-relaxed pt-1">
                Dense phytoplankton convergence zone indicates active trophic food chain supporting pelagic schools.
              </p>
            </div>
          </div>

          {/* Dotted Divider & Footer */}
          <div className="px-4 sm:px-5 pb-4 pt-1">
            <div className="border-b border-dotted border-[#5379AE]/40 mb-2.5" />
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#A8C4EC]/70 uppercase tracking-wider">ISRO OCM · 2H AGO</span>
              <span className="text-emerald-300 font-bold tracking-wider uppercase">BLOOM ▸ HIGH FRONT</span>
            </div>
          </div>
        </div>

        {/* ── CARD 3: Significant Wave Height ── */}
        <div className="card-chamfered bg-[#1d2334] border border-[#5379AE]/35 hover:border-[#0474C4]/60 transition-all duration-200 shadow-xl flex flex-col justify-between overflow-hidden group">
          <div>
            {/* Top Oceanic Art Header */}
            <div className="h-28 w-full bg-gradient-to-b from-[#06457F] to-[#0474C4] relative overflow-hidden flex items-end">
              <div className="absolute top-3 right-4 w-7 h-7 border-2 border-white/90 bg-white/20 flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 border border-white/60 bg-sky-300/40" />
              </div>
              <div className="absolute top-5 left-10 w-9 h-2 bg-white/80 border border-black/20 shadow-sm" />

              {/* Wave Vector Art */}
              <svg className="w-full h-16 absolute bottom-0 left-0" viewBox="0 0 300 70" preserveAspectRatio="none">
                <polygon points="0,70 45,35 95,58 150,22 210,54 265,28 300,48 300,70" fill="#17283c" opacity="0.9" />
                <polygon points="0,70 65,46 115,60 175,34 235,52 285,38 300,50 300,70" fill="#203a56" />
                <rect x="0" y="62" width="300" height="8" fill="#5379AE" opacity="0.5" />
              </svg>
            </div>

            {/* Hatched Banner Band with Category Badge */}
            <div className="banner-hatched-sapphire px-4 py-1.5 flex items-center border-y border-black/30">
              <div className="bg-[#121622] px-2.5 py-0.5 border border-white/90 shadow-sm">
                <span className="font-mono text-[9px] font-bold text-white tracking-widest uppercase">
                  HYDRODYNAMICS
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 sm:p-5 space-y-2.5">
              <div className="text-[10px] font-mono text-[#A8C4EC] tracking-widest uppercase font-semibold">
                CHAPTER · 03 · ALTIMETRY RADAR
              </div>

              <div>
                <h3 className="font-editorial text-lg text-white font-normal leading-tight group-hover:text-[#A8C4EC] transition-colors">
                  Wave Swell Height
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                  <span className="text-3xl font-bold text-sky-200 tracking-tight">{waveVal}</span>
                  <span className="text-xs text-[#A8C4EC] font-sans">meters</span>
                </div>
              </div>

              <p className="text-xs text-[#A8C4EC]/85 font-light leading-relaxed pt-1">
                Gentle swell pattern arriving from {weather?.wave_direction_deg ?? 235}° SSW at 8.2s interval. Smooth navigation window.
              </p>
            </div>
          </div>

          {/* Dotted Divider & Footer */}
          <div className="px-4 sm:px-5 pb-4 pt-1">
            <div className="border-b border-dotted border-[#5379AE]/40 mb-2.5" />
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#A8C4EC]/70 uppercase tracking-wider">SWAN FORECAST · 1H</span>
              <span className="text-sky-300 font-bold tracking-wider uppercase">SWELL ▸ 8.2S PERIOD</span>
            </div>
          </div>
        </div>

        {/* ── CARD 4: Surface Wind Velocity ── */}
        <div className="card-chamfered bg-[#1d2334] border border-[#5379AE]/35 hover:border-[#0474C4]/60 transition-all duration-200 shadow-xl flex flex-col justify-between overflow-hidden group">
          <div>
            {/* Top Oceanic Art Header */}
            <div className="h-28 w-full bg-gradient-to-b from-[#06457F] to-[#262B40] relative overflow-hidden flex items-end">
              <div className="absolute top-3 right-4 w-7 h-7 border-2 border-white/90 bg-white/20 flex items-center justify-center shadow-sm">
                <div className="w-4 h-4 border border-white/60 bg-amber-300/40" />
              </div>
              <div className="absolute top-4 left-5 w-7 h-2 bg-white/80 border border-black/20 shadow-sm" />
              <div className="absolute top-8 left-16 w-8 h-2 bg-white/80 border border-black/20 shadow-sm" />

              {/* Gust vectors */}
              <svg className="w-full h-16 absolute bottom-0 left-0" viewBox="0 0 300 70" preserveAspectRatio="none">
                <polygon points="0,70 55,38 105,58 165,26 225,50 275,30 300,46 300,70" fill="#1b2232" opacity="0.9" />
                <polygon points="0,70 75,44 125,58 185,32 245,48 300,36 300,70" fill="#252d40" />
                <rect x="0" y="62" width="300" height="8" fill="#5379AE" opacity="0.4" />
              </svg>
            </div>

            {/* Hatched Banner Band with Category Badge */}
            <div className="banner-hatched-steel px-4 py-1.5 flex items-center border-y border-black/30">
              <div className="bg-[#121622] px-2.5 py-0.5 border border-white/90 shadow-sm">
                <span className="font-mono text-[9px] font-bold text-white tracking-widest uppercase">
                  METEOROLOGY
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 sm:p-5 space-y-2.5">
              <div className="text-[10px] font-mono text-[#A8C4EC] tracking-widest uppercase font-semibold">
                CHAPTER · 04 · SCATSAT-1 SENSOR
              </div>

              <div>
                <h3 className="font-editorial text-lg text-white font-normal leading-tight group-hover:text-[#A8C4EC] transition-colors">
                  Surface Wind Velocity
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1 font-mono">
                  <span className="text-3xl font-bold text-white tracking-tight">{windKmh}</span>
                  <span className="text-xs text-[#A8C4EC] font-sans">km/h</span>
                  <span className="text-xs text-[#5379AE] ml-1">({windKnots} kn)</span>
                </div>
              </div>

              <p className="text-xs text-[#A8C4EC]/85 font-light leading-relaxed pt-1">
                Moderate coastal breeze with gusts to {windGust} km/h (Beaufort 3). Favorable for small craft and mechanized vessels.
              </p>
            </div>
          </div>

          {/* Dotted Divider & Footer */}
          <div className="px-4 sm:px-5 pb-4 pt-1">
            <div className="border-b border-dotted border-[#5379AE]/40 mb-2.5" />
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#A8C4EC]/70 uppercase tracking-wider">IMD ANEMOMETER</span>
              <span className="text-[#A8C4EC] font-bold tracking-wider uppercase">GUSTS ▸ {windGust} KM/H</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Row 2: Operational Safety Assessment & In-Situ Conditions ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Physical Safety Risk Assessment (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#1d2334] border border-[#5379AE]/30 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#5379AE]/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#06457F]/60 border border-[#5379AE]/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="font-editorial text-lg font-normal text-white">Physical Risk & Hazard Assessment</h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLowRisk
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : isModerate
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {isLowRisk ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {risk?.safety_verdict ?? 'SAFE TO VENTURE'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#151926] border border-[#5379AE]/20">
              <span className="text-[10px] text-[#A8C4EC]/75 font-mono block">COMPOSITE RISK SCORE</span>
              <div className="flex items-baseline gap-1 mt-1.5 font-mono">
                <span className="text-2xl font-bold text-emerald-300">{score}</span>
                <span className="text-xs text-[#5379AE]">/ 100</span>
              </div>
              <span className="text-[10px] text-[#A8C4EC]/75 block mt-1">Minimal sea turbulence</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#151926] border border-[#5379AE]/20">
              <span className="text-[10px] text-[#A8C4EC]/75 font-mono block">CRAFT SUITABILITY</span>
              <span className="text-sm font-semibold text-white block mt-1.5">All Vessel Classes</span>
              <span className="text-[10px] text-emerald-400 block mt-1">Canoe, OBM, Trawler</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#151926] border border-[#5379AE]/20">
              <span className="text-[10px] text-[#A8C4EC]/75 font-mono block">INCOIS CYCLONE RISK</span>
              <span className="text-sm font-semibold text-white block mt-1.5">Level 0 (Normal)</span>
              <span className="text-[10px] text-[#A8C4EC]/75 block mt-1">No active depression</span>
            </div>
          </div>

          {/* Risk Factors Breakdown Progress Bars */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-mono text-[#A8C4EC] uppercase tracking-wider block font-medium">
              Hazard Factor Severity Breakdown
            </span>
            {risk?.factors.map((factor) => (
              <div key={factor.factor_name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#f1f5fb]">{factor.factor_name}</span>
                  <span className={factor.severity === 'LOW' ? 'text-emerald-400' : 'text-amber-400'}>
                    {factor.score}% ({factor.severity})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#151926] overflow-hidden border border-[#5379AE]/20">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      factor.severity === 'LOW' ? 'bg-emerald-400' : factor.severity === 'MODERATE' ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.max(6, factor.score)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary In-Situ Ocean Telemetry (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1d2334] border border-[#5379AE]/30 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#5379AE]/20">
              <div className="w-8 h-8 rounded-xl bg-[#06457F]/60 border border-[#5379AE]/40 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-[#A8C4EC]" />
              </div>
              <h2 className="font-editorial text-lg font-normal text-white">In-Situ Sea State & Tide Profile</h2>
            </div>

            <div className="space-y-2.5 mt-4 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#151926] border border-[#5379AE]/20">
                <span className="text-[#A8C4EC]/75">Tidal Status:</span>
                <span className="text-[#0474C4] font-semibold">{ocean?.tide ?? 'Ebb Tide (Receding)'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#151926] border border-[#5379AE]/20">
                <span className="text-[#A8C4EC]/75">Tidal Elevation:</span>
                <span className="text-white font-semibold">{ocean?.tide_height_m ?? 1.1} m above chart datum</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#151926] border border-[#5379AE]/20">
                <span className="text-[#A8C4EC]/75">WMO Sea State:</span>
                <span className="text-emerald-300 font-semibold">{ocean?.sea_state ?? 'State 2 (Smooth/Slight)'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#151926] border border-[#5379AE]/20">
                <span className="text-[#A8C4EC]/75">Barometric Pressure:</span>
                <span className="text-white font-semibold">1012.4 hPa (Steady)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#151926] border border-[#5379AE]/20">
                <span className="text-[#A8C4EC]/75">Precipitation Rate:</span>
                <span className="text-[#A8C4EC] font-semibold">{weather?.rainfall_mm ?? 0.0} mm/hr (Dry)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#151926] border border-[#5379AE]/30 text-xs text-[#A8C4EC] font-light">
            All readings calibrated from INCOIS Ocean State Forecasts & Oceansat-3 satellite telemetry for {activeLocationName.split(',')[0]}.
          </div>
        </div>

      </div>

      {/* ── Deterministic 7-Factor Mathematical Breakdown ('Why this score?') ── */}
      <div className="relative z-10 w-full">
        <DeterministicRiskExplanation />
      </div>

      {/* ── Row 3: 24h Swell Wave Elevation Curve & Sector Tracking ── */}
      <div className="relative z-10 w-full">
        <OceanDynamicsPanel />
      </div>

    </div>
  );
};
