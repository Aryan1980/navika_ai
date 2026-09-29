import React from 'react';
import { Layers, Fish, Thermometer, Droplets, Waves, Wind, ShieldAlert, Navigation, AlertTriangle, Check, CloudRain, Cloud } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AVAILABLE_LAYERS = [
  { id: 'pfz', label: 'Potential Fishing Zones', icon: Fish, color: 'text-emerald-400', activeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { id: 'sst', label: 'Sea Surface Temp (SST)', icon: Thermometer, color: 'text-amber-400', activeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'chlorophyll', label: 'Chlorophyll-a Plume', icon: Droplets, color: 'text-teal-400', activeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { id: 'waves', label: 'Wave Height & Swell', icon: Waves, color: 'text-blue-400', activeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { id: 'wind', label: 'Wind Field Vectors', icon: Wind, color: 'text-sky-300', activeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
  { id: 'owm_precip', label: 'Live Weather Radar (OWM)', icon: CloudRain, color: 'text-indigo-400', activeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { id: 'owm_clouds', label: 'Satellite Cloud Cover (OWM)', icon: Cloud, color: 'text-violet-400', activeBg: 'bg-violet-500/20 text-violet-300 border-violet-500/40' },
  { id: 'imbl', label: 'IMBL Maritime Border', icon: ShieldAlert, color: 'text-amber-500', activeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'mpas', label: 'Marine Protected Areas', icon: AlertTriangle, color: 'text-rose-400', activeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { id: 'restricted', label: 'Naval / Oil Geofences', icon: AlertTriangle, color: 'text-purple-400', activeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { id: 'route', label: 'Navigational Routes', icon: Navigation, color: 'text-cyan-300', activeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { id: 'simulated_vessel', label: 'Simulated Vessel (AIS IND-8421)', icon: Navigation, color: 'text-amber-400', activeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
];

export const MapLayersControl: React.FC = () => {
  const { activeMapLayers, toggleMapLayer } = useApp();
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="absolute top-4 right-4 z-[400] bg-[#050b18]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_25px_rgba(0,0,0,0.6)] overflow-hidden text-xs transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 hover:from-slate-800 text-slate-200 font-semibold cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="tracking-wide">Map Overlays ({activeMapLayers.length})</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
          {isExpanded ? 'CLOSE' : 'OPEN'}
        </span>
      </button>

      {isExpanded && (
        <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto min-w-[220px] bg-[#030712]/95 border-t border-cyan-900/40">
          {AVAILABLE_LAYERS.map((layer) => {
            const Icon = layer.icon;
            const isChecked = activeMapLayers.includes(layer.id);
            return (
              <div
                key={layer.id}
                onClick={() => toggleMapLayer(layer.id)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? layer.activeBg
                    : 'border-transparent text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isChecked ? '' : layer.color}`} />
                  <span className="text-[11px] font-medium">{layer.label}</span>
                </div>
                <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                  isChecked ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                }`}>
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
