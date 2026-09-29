import React from 'react';
import { estimateBathymetryDepth } from './marineMapData';

interface MarineCoordinateHUDProps {
  cursorCoords: { lat: number; lon: number } | null;
  activeCoords: { latitude: number; longitude: number };
  zoomLevel: number;
}

export const MarineCoordinateHUD: React.FC<MarineCoordinateHUDProps> = ({
  cursorCoords,
  activeCoords,
  zoomLevel
}) => {
  const displayLat = cursorCoords ? cursorCoords.lat : activeCoords.latitude;
  const displayLon = cursorCoords ? cursorCoords.lon : activeCoords.longitude;
  const bathy = estimateBathymetryDepth(displayLat, displayLon);

  return (
    <div className="absolute bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[95%] sm:max-w-none">
      <div className="flex items-center gap-2 sm:gap-3.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#0e141f]/90 backdrop-blur-md border border-[#384959]/80 shadow-[0_8px_30px_rgba(0,0,0,0.6)] font-mono text-[10px] sm:text-xs text-[#BDDDFC] pointer-events-auto">
        
        {/* Live Coordinate Fix */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">
            {displayLat.toFixed(4)}°N, {displayLon.toFixed(4)}°E
          </span>
        </div>

        <div className="hidden sm:block w-px h-3 bg-[#384959]" />

        {/* Bathymetric Depth Estimate */}
        <div className="hidden xs:flex items-center gap-1 text-[#88BDF2] whitespace-nowrap">
          <span className="text-slate-400">Depth:</span>
          <span className="text-white font-bold">~{bathy.depth_m}m</span>
          <span className="hidden md:inline text-[10px] text-[#BDDDFC]/70">({bathy.zone})</span>
        </div>

        <div className="hidden sm:block w-px h-3 bg-[#384959]" />

        {/* Zoom & NavIC GNSS Precision */}
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-slate-400">Zoom:</span>
          <span className="text-white font-semibold">{zoomLevel.toFixed(1)}</span>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-emerald-400 whitespace-nowrap pl-1 border-l border-[#384959]">
          <span className="text-[10px]">NavIC L5 / S-Band</span>
        </div>
      </div>
    </div>
  );
};
