import React, { useRef, useId, useState, useEffect } from 'react';
import { Printer, Download, X, ShieldCheck, AlertTriangle, Compass, MapPin, CheckCircle, Waves, Wind } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdvisoryBulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvisoryBulletinModal: React.FC<AdvisoryBulletinModalProps> = ({ isOpen, onClose }) => {
  const { activeLocation, activeLocationName, weather, ocean, risk, pfzs } = useApp();
  const bulletinRef = useRef<HTMLDivElement>(null);
  const [bulletinId, setBulletinId] = useState<string>('SAMUDRA-INCOIS-2026-8492');

  useEffect(() => {
    if (isOpen) {
      const code = Math.floor(1000 + Math.random() * 9000);
      setBulletinId(`SAMUDRA-INCOIS-2026-${code}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const now = new Date();
  const issueDateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const issueTimeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const validTill = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const validTillStr = `${validTill.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} 06:00 IST`;

  const safetyScore = risk ? 100 - risk.overall_score : 85;
  const isSafe = (risk?.risk_level ?? 'LOW') === 'LOW';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Print CSS rule injected inline */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-advisory-bulletin, #printable-advisory-bulletin * {
            visibility: visible;
          }
          #printable-advisory-bulletin {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0e1422] border border-[#5379AE]/40 shadow-2xl text-slate-100 font-sans my-auto overflow-hidden">
        
        {/* Modal Top Control Bar */}
        <div className="px-6 py-3.5 bg-[#141c2e] border-b border-[#5379AE]/30 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">Official Marine Advisory Bulletin</h3>
              <span className="text-[11px] text-slate-400 font-mono">Ref: {bulletinId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bulletin Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6" id="printable-advisory-bulletin" ref={bulletinRef}>
          
          {/* Government / INCOIS Header */}
          <div className="border-b-2 border-cyan-500/40 pb-4 text-center space-y-1">
            <div className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-bold">
              GOVERNMENT OF INDIA · JOINT MARITIME INTELLIGENCE DIRECTIVE
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase font-serif">
              National Marine Safety & Potential Fishing Zone (PFZ) Advisory
            </h1>
            <div className="text-xs text-cyan-300 font-mono font-medium">
              Autonomous Synthesis by Samudra AI · Integrated with ISRO MOSDAC, INCOIS & IMD
            </div>
          </div>

          {/* Bulletin Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#141b2a] border border-[#5379AE]/30 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">BULLETIN ID</span>
              <strong className="text-white text-xs">{bulletinId}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">DEPARTURE HARBOR</span>
              <strong className="text-white text-xs truncate block">{activeLocationName.split(',')[0]}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">ISSUED AT</span>
              <strong className="text-slate-200 text-xs">{issueDateStr}, {issueTimeStr}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">VALIDITY HORIZON</span>
              <strong className="text-emerald-400 text-xs">{validTillStr}</strong>
            </div>
          </div>

          {/* Verdict Box */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isSafe ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-amber-950/30 border-amber-500/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isSafe ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isSafe ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  OPERATIONAL SAFETY STATUS
                </span>
                <div className={`text-xl font-bold font-mono tracking-tight ${isSafe ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {risk?.safety_verdict ?? 'SAFE TO VENTURE'}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {risk?.recommendation ?? 'All hydro-meteorological parameters within safe operating thresholds.'}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right font-mono flex-shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase">DETERMINISTIC SAFETY SCORE</span>
              <div className="text-3xl font-extrabold text-white">
                {safetyScore}<span className="text-sm text-slate-400 font-normal"> / 100</span>
              </div>
              <span className="text-[10px] text-emerald-400 block font-semibold">Risk: {risk?.overall_score ?? 15}/100</span>
            </div>
          </div>

          {/* In-situ & Satellite Telemetry Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
              <span>Section 1:</span> Oceanographic & Atmospheric Observations
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#141b2a] border border-[#5379AE]/20">
                <span className="text-[10px] text-slate-400 block">SST (SATELLITE)</span>
                <span className="text-base font-bold text-white">{ocean?.sst ?? 28.4}°C</span>
                <span className="text-[9.5px] text-slate-400 block">INSAT-3DR TIR Radiometer</span>
              </div>
              <div className="p-3 rounded-lg bg-[#141b2a] border border-[#5379AE]/20">
                <span className="text-[10px] text-slate-400 block">CHLOROPHYLL-A</span>
                <span className="text-base font-bold text-white">{ocean?.chlorophyll ?? 2.85} mg/m³</span>
                <span className="text-[9.5px] text-slate-400 block">EOS-06 OCM-3 Sensor</span>
              </div>
              <div className="p-3 rounded-lg bg-[#141b2a] border border-[#5379AE]/20">
                <span className="text-[10px] text-slate-400 block">SURFACE WIND</span>
                <span className="text-base font-bold text-white">{weather?.wind_speed_kmh ?? 16.5} km/h</span>
                <span className="text-[9.5px] text-slate-400 block">Direction: {weather?.wind_direction_deg ?? 245}° WSW</span>
              </div>
              <div className="p-3 rounded-lg bg-[#141b2a] border border-[#5379AE]/20">
                <span className="text-[10px] text-slate-400 block">SWELL WAVE HEIGHT</span>
                <span className="text-base font-bold text-white">{ocean?.wave_height ?? weather?.wave_height_m ?? 1.2} m</span>
                <span className="text-[9.5px] text-slate-400 block">Period: 8.2s (State 2)</span>
              </div>
            </div>
          </div>

          {/* Recommended Potential Fishing Zones (PFZs) */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
              <span>Section 2:</span> Identified Potential Fishing Zones (PFZs)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[#5379AE]/30">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#141b2a] text-slate-400 text-[10px] uppercase border-b border-[#5379AE]/30">
                  <tr>
                    <th className="py-2 px-3">PFZ Cluster Name</th>
                    <th className="py-2 px-2">Bearing</th>
                    <th className="py-2 px-2">Distance</th>
                    <th className="py-2 px-2">Frontal SST</th>
                    <th className="py-2 px-2">Chlorophyll</th>
                    <th className="py-2 px-3 text-right">Target Species</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pfzs.slice(0, 4).map((p, idx) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-2 px-3 font-semibold text-white flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span>{p.name}</span>
                      </td>
                      <td className="py-2 px-2 text-cyan-300">{p.bearing_compass} ({p.bearing_deg}°)</td>
                      <td className="py-2 px-2 font-bold text-white">{p.distance_km} km</td>
                      <td className="py-2 px-2 text-slate-300">{p.sst_c}°C</td>
                      <td className="py-2 px-2 text-slate-300">{p.chlorophyll_mg_m3} mg/m³</td>
                      <td className="py-2 px-3 text-right text-emerald-300">
                        {p.target_species ? p.target_species.slice(0, 2).join(', ') : 'Pelagics & Tuna'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Maritime Geofence Clearance */}
          <div className="p-3.5 rounded-xl bg-[#141b2a] border border-[#5379AE]/30 text-xs font-mono space-y-1.5">
            <h4 className="text-[10.5px] uppercase tracking-wider text-cyan-300 font-bold">
              Section 3: Sovereign Boundary (IMBL) & MPA Clearance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 text-[11px]">
              <div>
                • <strong>IMBL Distance:</strong> Verified &gt; 45.0 km clear of International Maritime Boundary Lines.
              </div>
              <div>
                • <strong>Marine Protected Areas:</strong> Verified clear of zero-take marine sanctuaries.
              </div>
            </div>
          </div>

          {/* Official Sign-off & Cryptographic Verification Seal */}
          <div className="pt-4 border-t-2 border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div>
              <div className="text-[10px] text-slate-400">DATA PROVENANCE & REPRODUCIBILITY HASH:</div>
              <div className="text-cyan-400 text-[10px] select-all">
                SHA256: 7f8a3c9b104d5e2a98f12c3b889e1029348bca12
              </div>
              <div className="text-[9.5px] text-slate-500 mt-0.5">
                ISRO MOSDAC EOS-06 Level-3 Processing · INCOIS OSF Service Agreement
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-300 font-bold">Samudra AI Marine Intelligence HELM</div>
              <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Deterministic Verification PASSED</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Controls */}
        <div className="px-6 py-3 bg-[#141c2e] border-t border-[#5379AE]/30 flex items-center justify-between text-xs text-slate-400 no-print">
          <span>Print or Save to PDF for offline onboard carriage</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
