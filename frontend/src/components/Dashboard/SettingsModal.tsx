import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Layers,
  Fish,
  Thermometer,
  Droplets,
  Waves,
  Wind,
  ShieldAlert,
  AlertTriangle,
  Navigation,
  Ship,
  Volume2,
  Gauge,
  Sliders,
  Check
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OVERLAY_OPTIONS = [
  { id: 'pfz', label: 'Potential Fishing Zones (PFZ)', icon: Fish, color: 'text-emerald-400' },
  { id: 'sst', label: 'Sea Surface Temperature (SST)', icon: Thermometer, color: 'text-amber-400' },
  { id: 'chlorophyll', label: 'Chlorophyll-a Plumes', icon: Droplets, color: 'text-teal-400' },
  { id: 'waves', label: 'Wave Height & Swell Vectors', icon: Waves, color: 'text-sky-300' },
  { id: 'wind', label: 'Wind Velocity Field', icon: Wind, color: 'text-[#A8C4EC]' },
  { id: 'imbl', label: 'IMBL Sovereign Border Geofence', icon: ShieldAlert, color: 'text-amber-500' },
  { id: 'mpas', label: 'Marine Protected Areas (MPA)', icon: AlertTriangle, color: 'text-rose-400' },
  { id: 'restricted', label: 'Naval / Offshore Geofences', icon: AlertTriangle, color: 'text-purple-400' },
  { id: 'route', label: 'Calculated Detour Routes', icon: Navigation, color: 'text-[#0474C4]' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { activeMapLayers, toggleMapLayer, soundEnabled, setSoundEnabled } = useApp();
  const [vesselType, setVesselType] = React.useState('Motorized OBM (28ft)');
  const [unitDist, setUnitDist] = React.useState<'km' | 'nm'>('km');
  const [waveAlertThreshold, setWaveAlertThreshold] = React.useState('2.5');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 font-sans">
      
      {/* Dialog Shell */}
      <div className="bg-[#1d2334] border border-[#5379AE]/30 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col text-[#f1f5fb]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#5379AE]/20 bg-[#181e2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#06457F] border border-[#5379AE]/40 flex items-center justify-center text-[#A8C4EC]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">System Settings & Map Overlays</h2>
              <span className="text-[11px] text-[#A8C4EC]/70 font-mono">Calibrate navigation telemetry and overlays</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A8C4EC] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Section 1: Map Overlays */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0474C4]" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">Satellite Map Overlays</h3>
            </div>
            <p className="text-[11px] text-[#A8C4EC]/80">
              Toggle live layers projected on top of high-resolution satellite imagery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {OVERLAY_OPTIONS.map((layer) => {
                const Icon = layer.icon;
                const isChecked = activeMapLayers.includes(layer.id);
                return (
                  <div
                    key={layer.id}
                    onClick={() => toggleMapLayer(layer.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#06457F]/40 border-[#0474C4]/60 text-white shadow-sm'
                        : 'bg-[#151926] border-[#5379AE]/20 text-[#A8C4EC]/75 hover:bg-[#20273a] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isChecked ? layer.color : 'text-[#5379AE]'}`} />
                      <span className="text-[11px] font-medium leading-tight">{layer.label}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                        isChecked ? 'bg-[#0474C4] border-[#0474C4] text-white' : 'border-[#5379AE]/40 bg-[#151926]'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Vessel & Craft Calibration */}
          <div className="space-y-3 pt-4 border-t border-[#5379AE]/20">
            <div className="flex items-center gap-2">
              <Ship className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">Vessel Calibration</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#A8C4EC]/70 font-mono block mb-1">CRAFT TYPE</label>
                <select
                  value={vesselType}
                  onChange={(e) => setVesselType(e.target.value)}
                  className="w-full bg-[#151926] border border-[#5379AE]/30 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option>Artisanal Traditional Canoe</option>
                  <option>Motorized OBM (28ft)</option>
                  <option>Mechanized Trawler (45ft)</option>
                  <option>Deep-sea Longliner (65ft)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#A8C4EC]/70 font-mono block mb-1">HAZARDOUS WAVE LIMIT</label>
                <select
                  value={waveAlertThreshold}
                  onChange={(e) => setWaveAlertThreshold(e.target.value)}
                  className="w-full bg-[#151926] border border-[#5379AE]/30 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="1.8">1.8 meters (Artisanal Craft)</option>
                  <option value="2.5">2.5 meters (Standard Mechanized)</option>
                  <option value="3.5">3.5 meters (Deep-sea Trawler)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Navigation Units & Alerts */}
          <div className="space-y-3 pt-4 border-t border-[#5379AE]/20">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">Measurement Units & Alerts</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#151926] border border-[#5379AE]/20">
                <div>
                  <span className="text-xs font-semibold text-white block">Distance System</span>
                  <span className="text-[10px] text-[#A8C4EC]/70 font-mono">Select telemetry scale</span>
                </div>
                <div className="flex items-center bg-[#1d2334] p-1 rounded-lg border border-[#5379AE]/30 font-mono text-[10px]">
                  <button
                    onClick={() => setUnitDist('km')}
                    className={`px-2 py-1 rounded cursor-pointer ${unitDist === 'km' ? 'bg-[#0474C4] text-white font-bold' : 'text-[#A8C4EC]/70'}`}
                  >
                    KM
                  </button>
                  <button
                    onClick={() => setUnitDist('nm')}
                    className={`px-2 py-1 rounded cursor-pointer ${unitDist === 'nm' ? 'bg-[#0474C4] text-white font-bold' : 'text-[#A8C4EC]/70'}`}
                  >
                    NM
                  </button>
                </div>
              </div>

              <div
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#151926] border border-[#5379AE]/20 cursor-pointer hover:bg-[#20273a] transition-colors"
              >
                <div>
                  <span className="text-xs font-semibold text-white block">Hazard Audio Alerts</span>
                  <span className="text-[10px] text-[#A8C4EC]/70 font-mono">Bilingual audio warnings</span>
                </div>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    soundEnabled ? 'bg-emerald-500' : 'bg-[#262B40]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#5379AE]/20 bg-[#181e2e] flex items-center justify-between">
          <span className="text-[11px] text-[#5379AE] font-mono">NavikaAI Marine Intelligence Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0474C4] hover:bg-[#0360a3] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow"
          >
            Apply & Close
          </button>
        </div>

      </div>

    </div>
  );
};
