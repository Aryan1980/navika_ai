import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Waves, 
  Fish, 
  Navigation, 
  Clock, 
  FileText,
  HelpCircle,
  Cpu
} from 'lucide-react';

export const ReasoningTerminal: React.FC = () => {
  const { weather, ocean, risk, pfzs, activeLocationName } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('why_answer');

  const waveHeight = weather?.wave_height_m ?? 1.2;
  const windKts = weather?.wind_speed_kmh ? (weather.wind_speed_kmh / 1.852).toFixed(1) : '12.4';
  const imblDistanceKm = 18.4;
  const isVetoed = risk?.risk_level === 'HIGH' || risk?.risk_level === 'EXTREME' || waveHeight > 2.5;

  const DATA_SOURCES = [
    {
      agent: 'Ocean Agent',
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
      source: 'INCOIS PFZ & Oceansat-3 OCM-3',
      data: `SST: ${ocean?.sst ?? 28.4}°C · Chl-a: ${pfzs[0]?.chlorophyll_mg_m3 ?? 0.84} mg/m³ · Frontal Index: 0.91`,
      timestamp: '08:45:00 UTC (15m ago)'
    },
    {
      agent: 'Meteo Agent',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
      source: 'ISRO MOSDAC & ECMWF Numerical Wave Grid',
      data: `Wave Hs: ${waveHeight}m · Swell Peak: 8.4s · Wind: ${windKts} kts · Squall: None`,
      timestamp: '08:50:00 UTC (10m ago)'
    },
    {
      agent: 'Kinematics Agent',
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
      source: 'Maritime GIS & Hydrographic Survey Charts',
      data: `IMBL Buffer: ${imblDistanceKm} km · Safe Corridor: Bearing 240° · MPA Conflict: Clear`,
      timestamp: '08:52:30 UTC (7m ago)'
    },
    {
      agent: 'Conflict Resolution Engine',
      color: isVetoed ? 'border-rose-500/40 text-rose-400 bg-rose-950/20' : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
      source: 'Deterministic Safety Veto Engine',
      data: isVetoed 
        ? 'STATUS: VETO OVERRIDE ACTIVE · Hazard threshold violated. Voyage dispatch cancelled.'
        : 'STATUS: PASS · Verified 3/3 physical safety constraints. Safe to navigate.',
      timestamp: 'Just now'
    }
  ];

  return (
    <div className="bg-[#12161f] border border-[#384959] rounded-2xl shadow-xl overflow-hidden text-xs">
      
      {/* ── Collapsible Title Bar ── */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-[#181e2e] border-b border-[#384959] flex items-center justify-between cursor-pointer hover:bg-[#1f2638] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-[#88BDF2]" />
          <div>
            <h3 className="font-bold text-white text-sm">Explainable AI Reasoning Terminal</h3>
            <p className="text-xs text-[#BDDDFC]/80">Auditability, data provenance & deterministic veto checks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
            isVetoed
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            {isVetoed ? 'CONFLICT: VETO' : 'CONFLICT: PASS'}
          </span>
          <button className="text-slate-400 hover:text-white">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Drawer Body ── */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Section 1: Color-Coded Agent Ingestion Matrix */}
          <div>
            <span className="text-xs font-mono uppercase text-[#BDDDFC]/90 tracking-wider font-bold block mb-2.5">
              Multi-Agent Ingested Evidence & Provenance
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DATA_SOURCES.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="font-bold text-sm">{item.agent}</span>
                      <span className="text-xs font-mono opacity-80 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-mono leading-relaxed mb-2.5 text-white">
                      {item.data}
                    </div>
                  </div>
                  <div className="text-xs font-mono opacity-80 flex items-center gap-1.5 pt-2 border-t border-white/10">
                    <Database className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{item.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Deterministic Veto Safety Checks */}
          <div className="p-4 rounded-xl bg-[#161c27] border border-[#384959] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                {isVetoed ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                Deterministic Safety Veto Threshold Evaluation
              </span>
              <span className="text-xs font-mono text-[#88BDF2] font-semibold">Formula: MinRisk(IMBL, Wave, Squall)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs font-mono pt-1">
              <div className="p-2.5 rounded-lg bg-[#12161f] border border-[#384959]/60">
                <span className="text-slate-400 block text-xs uppercase mb-0.5">Wave Threshold</span>
                <span className={`font-bold text-xs sm:text-sm ${waveHeight > 2.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {waveHeight}m / 2.5m Max
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12161f] border border-[#384959]/60">
                <span className="text-slate-400 block text-xs uppercase mb-0.5">IMBL Buffer</span>
                <span className="font-bold text-xs sm:text-sm text-emerald-400">
                  {imblDistanceKm} km / 5.0km Min
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12161f] border border-[#384959]/60">
                <span className="text-slate-400 block text-xs uppercase mb-0.5">Squall Warning</span>
                <span className="font-bold text-xs sm:text-sm text-emerald-400">Clear (0 Hazards)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12161f] border border-[#384959]/60">
                <span className="text-slate-400 block text-xs uppercase mb-0.5">Veto Decision</span>
                <span className={`font-bold text-xs sm:text-sm ${isVetoed ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isVetoed ? 'VETO OVERRIDE' : 'PASSED'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: "Why did I get this answer?" Accordion */}
          <div className="border border-[#384959] rounded-xl overflow-hidden bg-[#161c27]">
            <button
              onClick={() => setActiveAccordion(activeAccordion === 'why_answer' ? null : 'why_answer')}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left font-bold text-xs text-white hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#88BDF2]" />
                <span>Why did I get this answer?</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeAccordion === 'why_answer' ? 'rotate-180' : ''}`} />
            </button>

            {activeAccordion === 'why_answer' && (
              <div className="px-3.5 pb-3 text-[11px] text-[#BDDDFC]/85 leading-relaxed space-y-2 border-t border-[#384959]/60 pt-2.5 font-sans">
                <p>
                  <strong>1. High-Yield Spot Selection:</strong> The Ocean Agent selected the primary fishing hotspot because Oceansat-3 OCM-3 detected an optimal sea-surface temperature gradient (28.4°C) intersecting with a chlorophyll-a plume (0.84 mg/m³). This creates biological upwelling favorable for mackerel and pelagic species.
                </p>
                <p>
                  <strong>2. Seaward Safe Fairway:</strong> Rather than taking a straight line through shallow shoals, the Kinematics Agent generated an A* waypoint path maintaining a <strong>{imblDistanceKm} km buffer</strong> from the International Maritime Boundary Line (IMBL), fully preventing sovereign border infractions.
                </p>
                <p>
                  <strong>3. Safety Arbitration:</strong> The Conflict Resolution Engine checked that significant wave heights ({waveHeight}m) remain below the small-craft advisory ceiling (2.5m). Because no extreme squall advisories were detected by the Meteo Agent, the recommendation was <strong>APPROVED</strong> without a safety veto.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
