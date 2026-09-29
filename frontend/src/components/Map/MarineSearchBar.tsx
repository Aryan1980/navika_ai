import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Anchor, Fish, Navigation, ArrowRight } from 'lucide-react';
import { MARINE_PORTS, OCEAN_BASINS, MarinePort, OceanBasin } from './marineMapData';
import { PFZZone } from '../../types/marine';

interface MarineSearchBarProps {
  pfzs: PFZZone[];
  onFlyTo: (coords: { lat: number; lon: number }, zoom?: number) => void;
  onSelectPFZ?: (pfz: PFZZone) => void;
  onSelectPort?: (port: MarinePort) => void;
}

export const MarineSearchBar: React.FC<MarineSearchBarProps> = ({
  pfzs,
  onFlyTo,
  onSelectPFZ,
  onSelectPort
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items
  const cleanQ = query.trim().toLowerCase();

  // Check if query looks like coordinates (e.g., "9.96, 76.22" or "9.96 76.22")
  const coordMatch = cleanQ.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);

  const matchedPorts = cleanQ
    ? MARINE_PORTS.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.state.toLowerCase().includes(cleanQ) ||
          p.type.toLowerCase().includes(cleanQ)
      ).slice(0, 4)
    : [];

  const matchedPFZs = cleanQ
    ? pfzs.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.recommendation.toLowerCase().includes(cleanQ) ||
          p.safety_rating.toLowerCase().includes(cleanQ)
      ).slice(0, 4)
    : [];

  const matchedBasins = cleanQ
    ? OCEAN_BASINS.filter(
        (b) =>
          b.name.toLowerCase().includes(cleanQ) ||
          b.subtext.toLowerCase().includes(cleanQ)
      ).slice(0, 3)
    : [];

  const hasResults =
    Boolean(coordMatch) ||
    matchedPorts.length > 0 ||
    matchedPFZs.length > 0 ||
    matchedBasins.length > 0;

  const handleCoordinateJump = () => {
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[3]);
      if (!isNaN(lat) && !isNaN(lon)) {
        onFlyTo({ lat, lon }, 12);
        setIsOpen(false);
        setQuery(`${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-48 sm:w-64 md:w-80 pointer-events-auto">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#88BDF2]" />
        <input
          type="text"
          placeholder="Search ports, zones, lat/lon..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && coordMatch) {
              handleCoordinateJump();
            }
          }}
          className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#121824]/90 backdrop-blur-md border border-[#384959] text-white placeholder-[#BDDDFC]/50 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#88BDF2] shadow-xl"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && cleanQ && hasResults && (
        <div className="absolute left-0 top-full mt-2 w-full p-2 rounded-2xl bg-[#121824]/98 backdrop-blur-xl border border-[#384959] shadow-2xl space-y-2 text-xs max-h-80 overflow-y-auto custom-scrollbar z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Direct Coordinate Jump */}
          {coordMatch && (
            <div
              onClick={handleCoordinateJump}
              className="p-2 rounded-xl bg-[#0474C4]/20 border border-[#88BDF2]/40 hover:bg-[#0474C4]/35 text-white flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#88BDF2]" />
                <div>
                  <div className="font-bold text-xs">Jump to Coordinates</div>
                  <div className="text-[10px] text-[#BDDDFC]">
                    {coordMatch[1]}°N, {coordMatch[3]}°E
                  </div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#88BDF2]" />
            </div>
          )}

          {/* Ports */}
          {matchedPorts.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 px-2 py-0.5">
                Harbors & Refuges
              </div>
              {matchedPorts.map((port) => (
                <div
                  key={port.id}
                  onClick={() => {
                    onFlyTo({ lat: port.lat, lon: port.lon }, 12);
                    if (onSelectPort) onSelectPort(port);
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-[#1E2632] flex items-center justify-between cursor-pointer transition-colors text-white"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Anchor className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-xs truncate">{port.name}</div>
                      <div className="text-[10px] text-[#BDDDFC]/60">{port.state} · Draft {port.depth_m}m</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#88BDF2] font-mono whitespace-nowrap">Ch {port.vhf_ch}</span>
                </div>
              ))}
            </div>
          )}

          {/* PFZs */}
          {matchedPFZs.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-[#384959]/50">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 px-2 py-0.5">
                Fishing Grounds (PFZ)
              </div>
              {matchedPFZs.map((pfz) => (
                <div
                  key={pfz.id}
                  onClick={() => {
                    onFlyTo({ lat: pfz.location.latitude, lon: pfz.location.longitude }, 12);
                    if (onSelectPFZ) onSelectPFZ(pfz);
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-[#1E2632] flex items-center justify-between cursor-pointer transition-colors text-white"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Fish className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-xs truncate">{pfz.name}</div>
                      <div className="text-[10px] text-[#BDDDFC]/60">
                        {pfz.distance_km} km · {pfz.bearing_compass} · {pfz.safety_rating}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 font-mono">
                    {Math.round(pfz.suitability_score || 85)}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Ocean Basins */}
          {matchedBasins.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-[#384959]/50">
              <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 px-2 py-0.5">
                Ocean Basins & Seas
              </div>
              {matchedBasins.map((basin, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onFlyTo({ lat: basin.lat, lon: basin.lon }, 7);
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-[#1E2632] flex items-center justify-between cursor-pointer transition-colors text-white"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-xs truncate">{basin.name}</div>
                      <div className="text-[10px] text-[#BDDDFC]/60">{basin.subtext}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#88BDF2] font-mono">{basin.depth_m}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
