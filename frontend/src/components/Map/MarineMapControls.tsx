import React, { useState } from 'react';
import {
  Layers,
  Check,
  Globe,
  Compass,
  Plus,
  Minus,
  Crosshair,
  Maximize2,
  Minimize2,
  Ruler,
  Anchor,
  Radio,
  Ship,
  Waves,
  Thermometer,
  Droplets,
  ShieldAlert,
  AlertTriangle,
  Grid,
  Filter,
  Eye,
  Box,
  Satellite
} from 'lucide-react';

export type BasemapMode = 'satellite' | 'dark_marine' | 'bathymetry';

export type QuickFilterMode = 'all' | 'safe_only' | 'vessels_only' | 'ports_only';

interface MarineMapControlsProps {
  basemapMode: BasemapMode;
  onSelectBasemap: (mode: BasemapMode) => void;
  activeLayers: string[];
  onToggleLayer: (layerId: string) => void;
  quickFilter: QuickFilterMode;
  onSelectQuickFilter: (filter: QuickFilterMode) => void;
  is3DMode: boolean;
  onToggle3D: () => void;
  isRulerActive: boolean;
  onToggleRuler: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onResetNorth: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const MarineMapControls: React.FC<MarineMapControlsProps> = ({
  basemapMode,
  onSelectBasemap,
  activeLayers,
  onToggleLayer,
  quickFilter,
  onSelectQuickFilter,
  is3DMode,
  onToggle3D,
  isRulerActive,
  onToggleRuler,
  onZoomIn,
  onZoomOut,
  onRecenter,
  onResetNorth,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isBasemapOpen, setIsBasemapOpen] = useState(false);

  // Grouped layer definitions
  const LAYER_GROUPS = [
    {
      group: 'Fish & Biological Catch',
      layers: [
        { id: 'pfz', label: 'Potential Fishing Zones', icon: Eye, color: 'text-emerald-400' },
        { id: 'sst_gradient', label: 'SST Thermal Upwelling Front', icon: Thermometer, color: 'text-amber-400' },
        { id: 'chlorophyll', label: 'Chlorophyll-a Plumes', icon: Droplets, color: 'text-teal-400' }
      ]
    },
    {
      group: 'Navigation & Fleet',
      layers: [
        { id: 'ports', label: 'Commercial & Fishery Harbors', icon: Anchor, color: 'text-cyan-400' },
        { id: 'ais_vessels', label: 'AIS Marine Vessel Traffic', icon: Ship, color: 'text-sky-300' },
        { id: 'openseamap', label: 'OpenSeaMap Official Seamarks', icon: Anchor, color: 'text-blue-400' },
        { id: 'navic_mesh', label: 'NavIC LoRaWAN Vessel Mesh', icon: Radio, color: 'text-cyan-300' }
      ]
    },
    {
      group: 'Oceanography & Sensors',
      layers: [
        { id: 'ocean_buoys', label: 'MoES / INCOIS Telemetry Buoys', icon: Radio, color: 'text-amber-400' },
        { id: 'current_vectors', label: 'Ocean Currents & Swell Vectors', icon: Waves, color: 'text-blue-400' },
        { id: 'satellite_swath', label: 'ISRO Oceansat-3 Orbit Swath', icon: Satellite, color: 'text-purple-400' },
        { id: 'graticule', label: 'Lat/Long ECDIS Graticule Grid', icon: Grid, color: 'text-slate-300' }
      ]
    },
    {
      group: 'Borders & Geofences',
      layers: [
        { id: 'imbl', label: 'IMBL Sovereign Maritime Border', icon: ShieldAlert, color: 'text-amber-500' },
        { id: 'mpas', label: 'Marine Protected Areas (MPA)', icon: AlertTriangle, color: 'text-rose-400' },
        { id: 'restricted', label: 'Naval / Oil Platform Geofences', icon: AlertTriangle, color: 'text-purple-400' }
      ]
    }
  ];

  return (
    <>
      {/* ── Top-Right Floating Control Bar (Basemaps & Overlays) ── */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-30 flex items-center gap-2 pointer-events-auto">
        
        {/* Basemap Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setIsBasemapOpen(!isBasemapOpen);
              setIsLayersOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl bg-[#121824]/90 hover:bg-[#1E2632] backdrop-blur-md border border-[#384959] text-xs font-semibold text-white shadow-xl transition-all cursor-pointer"
            title="Switch Marine Basemap"
          >
            <Globe className="w-3.5 h-3.5 text-[#88BDF2]" />
            <span className="hidden sm:inline">
              {basemapMode === 'satellite'
                ? 'Satellite Hybrid'
                : basemapMode === 'dark_marine'
                ? 'Dark Marine'
                : 'Bathymetry Depth'}
            </span>
            <span className="sm:hidden">Map</span>
          </button>

          {isBasemapOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 p-2 rounded-2xl bg-[#121824]/95 backdrop-blur-xl border border-[#384959] shadow-2xl space-y-1 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70">
                Basemap Mode
              </div>
              <button
                onClick={() => {
                  onSelectBasemap('satellite');
                  setIsBasemapOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-colors cursor-pointer ${
                  basemapMode === 'satellite'
                    ? 'bg-[#0474C4]/25 text-white font-bold border border-[#0474C4]/40'
                    : 'text-[#BDDDFC] hover:bg-[#1E2632]'
                }`}
              >
                <span>Satellite Hybrid</span>
                {basemapMode === 'satellite' && <Check className="w-3.5 h-3.5 text-[#88BDF2]" />}
              </button>
              <button
                onClick={() => {
                  onSelectBasemap('dark_marine');
                  setIsBasemapOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-colors cursor-pointer ${
                  basemapMode === 'dark_marine'
                    ? 'bg-[#0474C4]/25 text-white font-bold border border-[#0474C4]/40'
                    : 'text-[#BDDDFC] hover:bg-[#1E2632]'
                }`}
              >
                <span>Dark Marine (CARTO)</span>
                {basemapMode === 'dark_marine' && <Check className="w-3.5 h-3.5 text-[#88BDF2]" />}
              </button>
              <button
                onClick={() => {
                  onSelectBasemap('bathymetry');
                  setIsBasemapOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-colors cursor-pointer ${
                  basemapMode === 'bathymetry'
                    ? 'bg-[#0474C4]/25 text-white font-bold border border-[#0474C4]/40'
                    : 'text-[#BDDDFC] hover:bg-[#1E2632]'
                }`}
              >
                <span>Bathymetry / Depth (ESRI)</span>
                {basemapMode === 'bathymetry' && <Check className="w-3.5 h-3.5 text-[#88BDF2]" />}
              </button>
            </div>
          )}
        </div>

        {/* Marine Intelligence Overlays Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsLayersOpen(!isLayersOpen);
              setIsBasemapOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl bg-[#121824]/90 hover:bg-[#1E2632] backdrop-blur-md border border-[#384959] text-xs font-semibold text-white shadow-xl transition-all cursor-pointer"
            title="Toggle Marine Layers"
          >
            <Layers className="w-3.5 h-3.5 text-[#88BDF2]" />
            <span>Overlays</span>
            <span className="w-5 h-5 rounded-full bg-[#0474C4] text-white text-[10px] flex items-center justify-center font-bold">
              {activeLayers.length}
            </span>
          </button>

          {isLayersOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-3 rounded-2xl sm:rounded-3xl bg-[#121824]/95 backdrop-blur-xl border border-[#384959] shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[75vh] overflow-y-auto custom-scrollbar space-y-3.5 text-xs animate-in fade-in zoom-in-95 duration-150">
              
              {/* Quick Filters */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 mb-1.5 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-[#88BDF2]" />
                  <span>Quick Tactical Filters</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onSelectQuickFilter('all')}
                    className={`py-1 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                      quickFilter === 'all'
                        ? 'bg-[#0474C4] text-white font-bold'
                        : 'bg-[#1E2632] text-[#BDDDFC] hover:bg-[#2A3744]'
                    }`}
                  >
                    All Features
                  </button>
                  <button
                    onClick={() => onSelectQuickFilter('safe_only')}
                    className={`py-1 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                      quickFilter === 'safe_only'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-[#1E2632] text-[#BDDDFC] hover:bg-[#2A3744]'
                    }`}
                  >
                    Safe Catch Only
                  </button>
                  <button
                    onClick={() => onSelectQuickFilter('vessels_only')}
                    className={`py-1 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                      quickFilter === 'vessels_only'
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-[#1E2632] text-[#BDDDFC] hover:bg-[#2A3744]'
                    }`}
                  >
                    AIS Vessels Only
                  </button>
                  <button
                    onClick={() => onSelectQuickFilter('ports_only')}
                    className={`py-1 px-2 rounded-lg text-center font-medium transition-colors cursor-pointer ${
                      quickFilter === 'ports_only'
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-[#1E2632] text-[#BDDDFC] hover:bg-[#2A3744]'
                    }`}
                  >
                    Refuge Ports Only
                  </button>
                </div>
              </div>

              {/* Categorized Layers */}
              {LAYER_GROUPS.map((grp, gIdx) => (
                <div key={gIdx} className="space-y-1.5 pt-2 border-t border-[#384959]/50">
                  <div className="text-[10px] font-mono font-bold uppercase text-[#BDDDFC]/70 tracking-wider">
                    {grp.group}
                  </div>
                  <div className="space-y-1">
                    {grp.layers.map((layer) => {
                      const Icon = layer.icon;
                      const isChecked = activeLayers.includes(layer.id);
                      return (
                        <div
                          key={layer.id}
                          onClick={() => onToggleLayer(layer.id)}
                          className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer select-none ${
                            isChecked
                              ? 'bg-[#1E2632] text-white border border-[#384959]'
                              : 'text-[#BDDDFC]/70 hover:bg-[#1E2632]/50 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isChecked ? layer.color : 'text-slate-500'}`} />
                            <span className="text-[11px] font-medium truncate">{layer.label}</span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                              isChecked
                                ? 'bg-[#0474C4] border-[#88BDF2] text-white'
                                : 'border-[#384959] bg-[#0b0f17]'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ruler Tool Toggle */}
        <button
          onClick={onToggleRuler}
          className={`p-2 rounded-xl sm:rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xl cursor-pointer ${
            isRulerActive
              ? 'bg-[#0474C4] border-[#88BDF2] text-white shadow-[0_0_15px_rgba(4,116,196,0.5)]'
              : 'bg-[#121824]/90 border-[#384959] text-[#BDDDFC] hover:text-white'
          }`}
          title="Nautical Distance Measurement Tool (Click 2 points to measure NM and bearing)"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ruler</span>
        </button>

        {/* 3D / 2D Perspective Toggle */}
        <button
          onClick={onToggle3D}
          className={`p-2 rounded-xl sm:rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xl cursor-pointer ${
            is3DMode
              ? 'bg-[#0474C4] border-[#88BDF2] text-white shadow-[0_0_15px_rgba(4,116,196,0.5)]'
              : 'bg-[#121824]/90 border-[#384959] text-[#BDDDFC] hover:text-white'
          }`}
          title="Switch 2D / 3D Nautical Perspective"
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{is3DMode ? '3D' : '2D'}</span>
        </button>
      </div>

      {/* ── Right-Side Floating Action Toolbar (Camera, Zoom, Center) ── */}
      <div className="absolute right-3 sm:right-4 bottom-20 md:bottom-8 z-30 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={onZoomIn}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#121824]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={onZoomOut}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#121824]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={onRecenter}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#121824]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer"
          title="Recenter on Active Vessel Fix"
        >
          <Crosshair className="w-4 h-4 text-[#88BDF2]" />
        </button>

        <button
          onClick={onResetNorth}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#121824]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer"
          title="Reset Orientation & Heading to True North"
        >
          <Compass className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          onClick={onToggleFullscreen}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#121824]/95 border border-[#384959] text-[#BDDDFC] hover:text-white hover:border-[#88BDF2] flex items-center justify-center shadow-2xl transition-all cursor-pointer hidden sm:flex"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </>
  );
};
