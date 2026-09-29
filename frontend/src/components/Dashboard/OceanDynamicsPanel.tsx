import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Waves, ChevronDown, Radio } from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { useMarineTelemetry } from '../../hooks/useMarineTelemetry';
import { TimeframeMode } from '../../services/marineTelemetryStream';

export const OceanDynamicsPanel: React.FC = () => {
  const { language } = useApp();
  const {
    telemetry,
    chartPoints,
    mode,
    setMode,
    freshnessText,
    areaPath,
    linePath,
    activePoint
  } = useMarineTelemetry();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Safety distribution percentages from reactive telemetry state
  const totalVessels = telemetry.vessel_count || 38;
  const safePct = Math.round((telemetry.safe_vessel_count / totalVessels) * 100);
  const cautionPct = Math.round((telemetry.caution_vessel_count / totalVessels) * 100);
  const avoidPct = Math.max(0, 100 - safePct - cautionPct);

  const isLive = mode === 'Live';
  const isAisLive = telemetry.ais_tracking_status === 'LIVE';
  const isAisConnecting = telemetry.ais_tracking_status === 'CONNECTING';

  return (
    <div className="bg-[#1d2334] border border-[#5379AE]/30 rounded-2xl p-5 flex flex-col justify-between h-full shadow-xl text-[#f1f5fb]">
      
      {/* ── Top Area: Chart Header ── */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight font-sans">
                {getTranslation('ocean_dynamics_title', language)}
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#151926] border border-[#5379AE]/30 text-xs font-mono font-semibold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                  }`}
                />
                <span className="text-[#A8C4EC]">{freshnessText}</span>
              </div>
            </div>
            <span className="text-xs text-[#A8C4EC]/85 font-mono">
              {getTranslation('ocean_dynamics_sub', language)}
            </span>
          </div>

          {/* Mode Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#151926] hover:bg-[#1a2133] border border-[#5379AE]/30 hover:border-[#88BDF2]/50 rounded-lg px-3 py-1.5 text-xs text-[#A8C4EC] font-mono cursor-pointer transition-colors"
            >
              <span className="font-semibold text-white">{mode}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#5379AE]" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-[#151926] border border-[#5379AE]/40 rounded-xl shadow-2xl py-1 z-30 font-mono text-xs">
                {(['Live', 'Historical', 'Forecast'] as TimeframeMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-[#1f283d] transition-colors flex items-center justify-between ${
                      mode === m ? 'text-cyan-300 font-bold bg-[#1d2334]' : 'text-slate-300'
                    }`}
                  >
                    <span>{m}</span>
                    {mode === m && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── SVG Smooth Area Curve Chart ── */}
        <div className="relative w-full h-32 pt-2">
          
          {/* Floating Data Badge Node (Dynamic Tooltip) */}
          <div className="absolute top-1 right-1/4 z-10 bg-[#151926]/95 border border-[#0474C4]/50 px-3 py-1.5 rounded-xl text-[10px] font-mono shadow-xl backdrop-blur-md transition-all duration-300">
            <div className="text-[#A8C4EC]/75 text-[9px] flex items-center justify-between gap-3">
              <span>{isLive ? 'LIVE TELEMETRY STREAM' : `${mode.toUpperCase()} WAVE OBSERVATION`}</span>
              <span className="text-white font-bold">{telemetry.timestamp}</span>
            </div>
            <div className="flex items-center gap-2.5 mt-0.5">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Wave {telemetry.wave_height.toFixed(2)}m
              </span>
              <span className="text-amber-300 font-semibold">SST {telemetry.sst.toFixed(1)}°C</span>
            </div>
          </div>

          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="oceanSapphireGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0474c4" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#06457f" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#151926" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle horizontal grid lines */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(83,121,174,0.15)" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(83,121,174,0.15)" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(83,121,174,0.15)" strokeDasharray="3 3" />

            {/* Area Fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#oceanSapphireGrad)"
                className="transition-all duration-700 ease-out"
              />
            )}

            {/* Smooth Glowing Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#0474c4"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            )}

            {/* Active Point Node & Glow Ping */}
            {activePoint && (
              <>
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="9"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-ping"
                />
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#0474c4"
                  strokeWidth="2.5"
                  className="transition-all duration-700 ease-out shadow-md"
                />
              </>
            )}
          </svg>

          {/* Dynamic X-axis labels */}
          <div className="flex justify-between text-[9px] font-mono text-[#5379AE] pt-1">
            {chartPoints.map((pt, i) => (
              <span
                key={`${pt.time}-${i}`}
                className={pt.isNow ? 'text-[#A8C4EC] font-bold' : ''}
              >
                {pt.isNow ? `${pt.time.slice(0, 5)} (Now)` : pt.time.slice(0, 5)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Split: Status Overview & Vehicles in Transit ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-[#5379AE]/20 mt-2">
        
        {/* Status Overview with Segmented Progress Bar */}
        <div className="sm:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white font-sans">
              {getTranslation('sector_safety_dist', language)}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-time</span>
            </span>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-3 rounded-full bg-[#151926] overflow-hidden flex gap-1 p-0.5 border border-[#5379AE]/25">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
              style={{ width: `${safePct}%` }}
              title={`${getTranslation('safe_status', language)}: ${telemetry.safe_vessel_count} (${safePct}%)`}
            />
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500 shadow-[0_0_8px_rgba(251,191,36,0.3)]"
              style={{ width: `${cautionPct}%` }}
              title={`${getTranslation('caution_status', language)}: ${telemetry.caution_vessel_count} (${cautionPct}%)`}
            />
            <div
              className="h-full rounded-full bg-rose-500 transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
              style={{ width: `${avoidPct}%` }}
              title={`${getTranslation('avoid_status', language)}: ${telemetry.avoid_vessel_count} (${avoidPct}%)`}
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#f1f5fb]">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span> {getTranslation('safe_status', language)} ({telemetry.safe_vessel_count})
            </span>
            <span className="flex items-center gap-1.5 text-[#f1f5fb]">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span> {getTranslation('caution_status', language)} ({telemetry.caution_vessel_count})
            </span>
            <span className="flex items-center gap-1.5 text-[#f1f5fb]">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> {getTranslation('avoid_status', language)} ({telemetry.avoid_vessel_count})
            </span>
          </div>
        </div>

        {/* Fleet / Craft Counter */}
        <div className="sm:col-span-5 flex items-center justify-between pt-2 sm:pt-0 sm:pl-3 border-t sm:border-t-0 sm:border-l border-[#5379AE]/20">
          <div>
            <span className="text-xs text-[#A8C4EC]/85 block font-sans font-medium">
              {getTranslation('vessels_in_sector', language)}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                +{telemetry.vessel_delta}
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white leading-none">
                {telemetry.vessel_count}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isAisLive
                    ? 'bg-emerald-400 animate-pulse'
                    : isAisConnecting
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
              />
              <span
                className={
                  isAisLive
                    ? 'text-emerald-400 font-semibold'
                    : isAisConnecting
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }
              >
                AIS {telemetry.ais_tracking_status}
              </span>
            </div>
          </div>

          <div className="w-12 h-11 rounded-xl bg-[#151926] border border-[#5379AE]/30 flex items-center justify-center text-xl shadow-inner">
            🚢
          </div>
        </div>

      </div>

    </div>
  );
};
