import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigation, Compass, ChevronDown, MoreHorizontal, ArrowUpRight, Loader2, Check } from 'lucide-react';
import { PFZZone } from '../../types/marine';
import { getLocalizedPortName } from '../../utils/locationTranslations';
import { getSafetyStatusTheme } from '../../utils/statusColors';

export const SpotRoutesPanel: React.FC = () => {
  const { pfzs, activeLocationName, openRouteForPFZ, isAnalyzing, selectedPFZForRoute, language } = useApp();
  const [filter, setFilter] = useState<'All' | 'Safe' | 'Caution'>('All');

  const filteredPfzs = pfzs.filter((p) => {
    if (filter === 'Safe') return p.safety_rating === 'SAFE';
    if (filter === 'Caution') return p.safety_rating === 'CAUTION';
    return true;
  });

  return (
    <div className="bg-[#0c101b] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between h-full shadow-lg text-slate-300">
      
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight font-sans">
              Fishing Spots & Waypoints
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
              Total: {pfzs.length}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Direct waypoints from {getLocalizedPortName(activeLocationName, language).split(',')[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-1 bg-[#141a2a] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span>{filter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <button className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Spot Route Items (Styled exactly like Shipment Routes in Image 1) ── */}
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 max-h-56 mt-3">
        {filteredPfzs.map((pfz, idx) => {
          const isSelected = selectedPFZForRoute?.id === pfz.id;
          const statusTheme = getSafetyStatusTheme(pfz.safety_rating);
          const estHours = (pfz.distance_km / 12.0).toFixed(1);

          return (
            <div
              key={pfz.id}
              className={`rounded-xl p-3 border transition-all ${
                isSelected
                  ? `bg-[#131b2e] ${statusTheme.cardSelectedBorder} ${statusTheme.cardSelectedShadow} ${statusTheme.cardSelectedRing}`
                  : `bg-[#101524]/80 hover:bg-[#13192b] border-white/[0.06] ${statusTheme.cardBorderHover}`
              }`}
            >
              {/* Card Header: Clean Spot Name & Status Badge */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-xs text-white">
                    Spot {idx + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-sans font-medium truncate max-w-[150px]">
                    {pfz.name.replace(`Spot ${idx + 1}: `, '')}
                  </span>
                </div>

                {/* Consistent SAFE / CAUTION / AVOID Status Badge */}
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${statusTheme.badgeBg} ${statusTheme.badgeText} border ${statusTheme.badgeBorder} flex items-center gap-1.5 ${statusTheme.glowClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusTheme.dotClass}`} />
                  <span>{pfz.safety_rating}</span>
                </span>
              </div>

              {/* Middle Row: Shipment Route Tree */}
              <div className="grid grid-cols-12 gap-2 text-xs">
                
                {/* Route Tree Nodes (Left 7 cols) */}
                <div className="col-span-7 space-y-1 relative pl-4">
                  {/* Vertical Route Line */}
                  <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-700"></div>

                  {/* Departure Node */}
                  <div className="relative flex items-center gap-2">
                    <span className="absolute -left-4 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#101524]"></span>
                    <div>
                      <span className="text-xs text-slate-500 block font-mono">DEPARTURE</span>
                      <span className="text-xs sm:text-sm font-medium text-slate-200">
                        {getLocalizedPortName(activeLocationName, language).split(',')[0]} (0 km)
                      </span>
                    </div>
                  </div>

                  {/* Destination Node */}
                  <div className="relative flex items-center gap-2 pt-1.5">
                    <span className="absolute -left-4 w-2.5 h-2.5 rounded-sm bg-emerald-400 border-2 border-[#101524]"></span>
                    <div>
                      <span className="text-xs text-slate-500 block font-mono">TARGET PFZ</span>
                      <span className="text-xs sm:text-sm font-semibold text-emerald-300">
                        {pfz.distance_km} km ({pfz.bearing_compass})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Metrics (Right 5 cols) */}
                <div className="col-span-5 text-right font-mono text-xs space-y-0.5 border-l border-white/5 pl-2">
                  <span className="text-slate-500 block text-xs">EST. TRANSIT</span>
                  <span className="text-slate-200 font-bold">{estHours} hrs</span>
                  <span className="text-slate-500 block text-xs pt-1">MATCH SCORE</span>
                  <span className="text-emerald-400 font-bold">{Math.round(pfz.suitability_score)}%</span>
                </div>

              </div>

              {/* Bottom Action */}
              <div className="pt-2.5 mt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">
                  SST {pfz.sst_c}°C · Chl {pfz.chlorophyll_mg_m3} mg/m³
                </span>

                <button
                  disabled={isAnalyzing}
                  onClick={() => openRouteForPFZ(pfz)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                      : 'bg-white/[0.05] hover:bg-cyan-500/20 text-cyan-300 border border-white/10 hover:border-cyan-500/40'
                  }`}
                >
                  {isAnalyzing && isSelected ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Computing...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3" />
                      <span>{isSelected ? 'Active Route' : 'Plot Route'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
