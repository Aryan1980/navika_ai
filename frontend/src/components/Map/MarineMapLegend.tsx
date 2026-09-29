import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Anchor,
  Radio,
  Ship,
  Waves,
  ShieldAlert,
  AlertTriangle,
  Grid,
  Thermometer,
  Fish
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';

interface MarineMapLegendProps {
  language: string;
}

export const MarineMapLegend: React.FC<MarineMapLegendProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute left-3 sm:left-4 bottom-20 md:bottom-8 z-30 pointer-events-auto">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl sm:rounded-2xl bg-[#121824]/95 hover:bg-[#1E2632] backdrop-blur-md border border-[#384959] text-xs font-semibold text-[#88BDF2] shadow-2xl transition-all cursor-pointer group"
          title="Open Marine Map Legend"
        >
          <Layers className="w-4 h-4 text-[#88BDF2] group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium">Map Legend</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      ) : (
        <div className="w-[280px] sm:w-[320px] p-4 rounded-2xl sm:rounded-3xl bg-[#121824]/95 backdrop-blur-xl border border-[#384959] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white font-sans text-xs animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#384959]/70 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#88BDF2]" />
              <span className="font-bold text-sm text-white">Marine Legend & Symbols</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#BDDDFC] hover:text-white hover:bg-[#1E2632] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Legend Items */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto custom-scrollbar pr-1 text-xs">
            
            {/* PFZ Zones */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 tracking-wider">
                Potential Fishing Grounds (PFZ)
              </div>
              <div className="grid grid-cols-1 gap-1.5 pl-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] flex-shrink-0" />
                  <span className="text-[#BDDDFC]">High Probability Safe Catch Zone</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border border-white/80 shadow-[0_0_8px_rgba(245,158,11,0.8)] flex-shrink-0" />
                  <span className="text-[#BDDDFC]">Caution Zone (Marginal Weather)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 border border-white/80 shadow-[0_0_8px_rgba(244,63,94,0.8)] flex-shrink-0" />
                  <span className="text-[#BDDDFC]">Avoid (Boundary Hazard / Marine Sanctuary)</span>
                </div>
              </div>
            </div>

            {/* Ports & Harbors */}
            <div className="pt-2 border-t border-[#384959]/50 space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 tracking-wider">
                Ports & Refuges
              </div>
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Anchor className="w-2.5 h-2.5 text-cyan-300" />
                </div>
                <span className="text-[#BDDDFC]">Commercial Port & Fishery Refuge</span>
              </div>
            </div>

            {/* AIS Vessels & Fleet */}
            <div className="pt-2 border-t border-[#384959]/50 space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 tracking-wider">
                AIS Traffic & Fleet
              </div>
              <div className="grid grid-cols-1 gap-1.5 pl-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#0474C4] border-2 border-white shadow-sm flex-shrink-0" />
                  <span className="text-white font-medium">{getTranslation('active_vessel_fix', language)}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded bg-sky-500/20 border border-sky-400 flex items-center justify-center flex-shrink-0">
                    <Ship className="w-2.5 h-2.5 text-sky-400" />
                  </div>
                  <span className="text-[#BDDDFC]">Cargo / Tanker Shipping Corridor</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-400 flex items-center justify-center flex-shrink-0">
                    <Ship className="w-2.5 h-2.5 text-amber-400" />
                  </div>
                  <span className="text-[#BDDDFC]">Active Artisanal Fishing Trawler</span>
                </div>
              </div>
            </div>

            {/* Sensors & Ocean Buoys */}
            <div className="pt-2 border-t border-[#384959]/50 space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 tracking-wider">
                Ocean Metocean Sensors
              </div>
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center flex-shrink-0">
                  <Radio className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                </div>
                <span className="text-[#BDDDFC]">MoES / INCOIS Directional Wave Buoy</span>
              </div>
            </div>

            {/* Geofences & Boundaries */}
            <div className="pt-2 border-t border-[#384959]/50 space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 tracking-wider">
                Geofences & Sovereign Limits
              </div>
              <div className="grid grid-cols-1 gap-1.5 pl-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-0.5 border-b-2 border-dashed border-amber-500 flex-shrink-0" />
                  <span className="text-[#BDDDFC]">IMBL Sovereign Maritime Boundary</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-2.5 rounded bg-rose-500/30 border border-rose-500 flex-shrink-0" />
                  <span className="text-[#BDDDFC]">Marine Protected Area (MPA)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-2.5 rounded bg-purple-500/30 border border-purple-500 flex-shrink-0" />
                  <span className="text-[#BDDDFC]">Naval / Offshore Oil Geofence</span>
                </div>
              </div>
            </div>

            {/* ECDIS Nautical Grid */}
            <div className="pt-2 border-t border-[#384959]/50 space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 tracking-wider">
                ECDIS Charting Grids
              </div>
              <div className="flex items-center gap-2.5 pl-1">
                <span className="w-4 h-0.5 border-b border-sky-400/60 border-dashed flex-shrink-0" />
                <span className="text-[#BDDDFC]">Lat/Long Graticule (1.0° Gridlines)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
