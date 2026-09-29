import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Waves, Thermometer, Wind, Ship, ChevronDown } from 'lucide-react';
import { getTranslation } from '../../utils/translations';

export const OceanDynamicsPanel: React.FC = () => {
  const { weather, ocean, pfzs, language } = useApp();
  const [timeframe, setTimeframe] = useState<'Live' | '24h' | 'Week'>('Live');

  const safeCount = pfzs.filter((p) => p.safety_rating === 'SAFE').length || 4;
  const cautionCount = pfzs.filter((p) => p.safety_rating === 'CAUTION').length || 3;
  const avoidCount = pfzs.filter((p) => p.safety_rating === 'AVOID').length || 1;
  const total = safeCount + cautionCount + avoidCount;

  const safePct = Math.round((safeCount / total) * 100);
  const cautionPct = Math.round((cautionCount / total) * 100);
  const avoidPct = 100 - safePct - cautionPct;

  const sstVal = ocean?.sst ?? 28.4;
  const waveVal = weather?.wave_height_m ?? 1.2;

  // Wave points for smooth SVG area curve
  const curvePoints = [
    { time: '04:00', val: 0.8 },
    { time: '07:00', val: 1.1 },
    { time: '10:00', val: 0.9 },
    { time: '13:00', val: 1.4 },
    { time: '16:00', val: 1.2 },
    { time: '19:00', val: 1.0 },
    { time: '22:00', val: 0.7 },
  ];

  return (
    <div className="bg-[#1d2334] border border-[#5379AE]/30 rounded-2xl p-5 flex flex-col justify-between h-full shadow-xl text-[#f1f5fb]">
      
      {/* ── Top Area: Chart Header ── */}
      <div>
        <div className="flex items-center justify-between pb-2">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight font-sans">
              {getTranslation('ocean_dynamics_title', language)}
            </h3>
            <span className="text-[11px] text-[#A8C4EC]/75 font-mono">
              {getTranslation('ocean_dynamics_sub', language)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#151926] border border-[#5379AE]/30 rounded-lg px-2.5 py-1 text-[11px] text-[#A8C4EC] font-mono">
            <span>{timeframe === 'Live' ? getTranslation('timeframe_live', language) : timeframe === '24h' ? getTranslation('timeframe_24h', language) : getTranslation('timeframe_week', language)}</span>
            <ChevronDown className="w-3 h-3 text-[#5379AE]" />
          </div>
        </div>

        {/* ── SVG Smooth Area Curve Chart ── */}
        <div className="relative w-full h-32 pt-2">
          
          {/* Floating Data Badge Node */}
          <div className="absolute top-2 right-1/3 z-10 bg-[#151926]/95 border border-[#0474C4]/50 px-3 py-1.5 rounded-xl text-[10px] font-mono shadow-xl backdrop-blur-md">
            <div className="text-[#A8C4EC]/75 text-[9px]">{getTranslation('peak_swell_sensor', language)}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Wave {waveVal}m
              </span>
              <span className="text-amber-300">SST {sstVal}°C</span>
            </div>
          </div>

          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="oceanSapphireGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0474c4" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#06457f" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#151926" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle horizontal grid lines */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(83,121,174,0.15)" strokeDasharray="3 3" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(83,121,174,0.15)" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(83,121,174,0.15)" strokeDasharray="3 3" />

            {/* Area Fill */}
            <path
              d="M 0 65 Q 40 45, 80 52 T 160 55 T 240 28 T 320 40 T 400 70 L 400 90 L 0 90 Z"
              fill="url(#oceanSapphireGrad)"
            />

            {/* Smooth Glowing Line */}
            <path
              d="M 0 65 Q 40 45, 80 52 T 160 55 T 240 28 T 320 40 T 400 70"
              fill="none"
              stroke="#0474c4"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Active Point Node */}
            <circle cx="240" cy="28" r="4.5" fill="#ffffff" stroke="#0474c4" strokeWidth="2.5" />
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between text-[9px] font-mono text-[#5379AE] pt-1">
            <span>04:00</span>
            <span>07:00</span>
            <span>10:00</span>
            <span>13:00</span>
            <span className="text-[#A8C4EC] font-bold">16:00 (Now)</span>
            <span>19:00</span>
            <span>22:00</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Split: Status Overview & Vehicles in Transit ── */}
      <div className="grid grid-cols-12 gap-3 pt-3 border-t border-[#5379AE]/20 mt-2">
        
        {/* Status Overview with Segmented Progress Bar */}
        <div className="col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white font-sans">{getTranslation('sector_safety_dist', language)}</span>
            <span className="text-[10px] text-[#5379AE] font-mono">Real-time</span>
          </div>

          {/* Segmented Bar */}
          <div className="w-full h-3 rounded-full bg-[#151926] overflow-hidden flex gap-1 p-0.5 border border-[#5379AE]/25">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all shadow-[0_0_8px_rgba(52,211,153,0.3)]"
              style={{ width: `${safePct}%` }}
              title={`${getTranslation('safe_status', language)}: ${safeCount}`}
            />
            <div
              className="h-full rounded-full bg-amber-400 transition-all shadow-[0_0_8px_rgba(251,191,36,0.3)]"
              style={{ width: `${cautionPct}%` }}
              title={`${getTranslation('caution_status', language)}: ${cautionCount}`}
            />
            <div
              className="h-full rounded-full bg-rose-500 transition-all shadow-[0_0_8px_rgba(244,63,94,0.3)]"
              style={{ width: `${avoidPct}%` }}
              title={`${getTranslation('avoid_status', language)}: ${avoidCount}`}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-[#f1f5fb]">
              <span className="w-2 h-2 rounded-sm bg-emerald-400"></span> {getTranslation('safe_status', language)} ({safeCount})
            </span>
            <span className="flex items-center gap-1 text-[#f1f5fb]">
              <span className="w-2 h-2 rounded-sm bg-amber-400"></span> {getTranslation('caution_status', language)} ({cautionCount})
            </span>
            <span className="flex items-center gap-1 text-[#f1f5fb]">
              <span className="w-2 h-2 rounded-sm bg-rose-500"></span> {getTranslation('avoid_status', language)} ({avoidCount})
            </span>
          </div>
        </div>

        {/* Fleet / Craft Counter */}
        <div className="col-span-5 flex items-center justify-between pl-3 border-l border-[#5379AE]/20">
          <div>
            <span className="text-[10px] text-[#A8C4EC]/75 block font-sans font-medium">{getTranslation('vessels_in_sector', language)}</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xs font-mono font-bold text-emerald-400">+4</span>
              <span className="text-2xl font-mono font-bold text-white leading-none">38</span>
            </div>
            <span className="text-[9px] text-[#5379AE] font-mono">{getTranslation('ais_tracked', language)}</span>
          </div>

          <div className="w-11 h-10 rounded-xl bg-[#151926] border border-[#5379AE]/30 flex items-center justify-center text-lg shadow-inner">
            🚢
          </div>
        </div>

      </div>

    </div>
  );
};
