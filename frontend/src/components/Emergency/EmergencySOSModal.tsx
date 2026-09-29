import React from 'react';
import { AlertOctagon, PhoneCall, Radio, X, ShieldAlert, CheckCircle, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ isOpen, onClose }) => {
  const { activeLocation, activeLocationName } = useApp();

  if (!isOpen) return null;

  // Format DMS (Degrees Minutes Seconds) for maritime VHF broadcast
  const toDMS = (deg: number, isLat: boolean) => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    const direction = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
    return `${degrees.toString().padStart(2, '0')}° ${minutes.toString().padStart(2, '0')}' ${seconds.toString().padStart(2, '0')}" ${direction}`;
  };

  const latDMS = toDMS(activeLocation.latitude, true);
  const lonDMS = toDMS(activeLocation.longitude, false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#120a0e] border-2 border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.35)] overflow-hidden text-slate-100 font-sans">
        
        {/* Top Emergency Red Banner */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/25 animate-pulse">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-rose-200 font-bold">
                DISTRESS TELEMETRY PROTOCOL
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Indian Coast Guard Emergency (MRCC)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Main Dial Action: 1554 */}
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="text-xs font-mono uppercase text-rose-300 font-semibold">
                Maritime Rescue Coordination Centre (MRCC)
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mt-0.5 tracking-wider flex items-center justify-center sm:justify-start gap-2">
                <span className="text-rose-400">Toll-Free:</span> 1554
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                24x7 Dedicated Maritime Search & Rescue Hotline (Operated by Indian Coast Guard)
              </p>
            </div>

            <a
              href="tel:1554"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-600/30 transition-transform active:scale-95 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>DIAL 1554 NOW</span>
            </a>
          </div>

          {/* Current GPS Position Monospace Card (For VHF Channel 16 Transmission) */}
          <div className="p-4 rounded-xl bg-[#1b1420] border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-rose-300 flex items-center gap-1.5 font-semibold">
                <Navigation className="w-3.5 h-3.5 text-rose-400" />
                VESSEL POSITION (READ OVER VHF RADIO CH 16)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                GPS ACQUIRED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block">DEGREES MINUTES SECONDS (DMS)</span>
                <span className="text-base font-bold text-white">{latDMS}</span>
                <span className="text-base font-bold text-white block">{lonDMS}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 block">DECIMAL COORDINATES</span>
                <span className="text-sm font-semibold text-rose-200">LAT: {activeLocation.latitude.toFixed(5)}° N</span>
                <span className="text-sm font-semibold text-rose-200 block">LON: {activeLocation.longitude.toFixed(5)}° E</span>
                <span className="text-[10px] text-slate-400 block truncate mt-1">Ref: {activeLocationName}</span>
              </div>
            </div>
          </div>

          {/* 4-Step Marine Distress Checklist */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Standard Maritime Distress Checklist (SOLAS)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-start gap-2">
                <span className="text-rose-400 font-mono font-bold">01</span>
                <div>
                  <strong className="text-white block">VHF Ch 16 (156.8 MHz)</strong>
                  <span className="text-slate-400 text-[11px]">Broadcast "MAYDAY, MAYDAY, MAYDAY" with boat name and DMS coordinates.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-start gap-2">
                <span className="text-rose-400 font-mono font-bold">02</span>
                <div>
                  <strong className="text-white block">Activate 406 MHz EPIRB</strong>
                  <span className="text-slate-400 text-[11px]">Deploy Emergency Position Indicating Radio Beacon for satellite relay.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-start gap-2">
                <span className="text-rose-400 font-mono font-bold">03</span>
                <div>
                  <strong className="text-white block">Don Lifejackets (SOLAS)</strong>
                  <span className="text-slate-400 text-[11px]">Ensure all crew don reflective life vests and secure safety tethers.</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-start gap-2">
                <span className="text-rose-400 font-mono font-bold">04</span>
                <div>
                  <strong className="text-white block">Prepare Red Pyrotechnics</strong>
                  <span className="text-slate-400 text-[11px]">Fire red parachute flare or orange smoke signal when search vessels are in sight.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <span>Indian Coast Guard MRCC Coverage: Arabian Sea, Bay of Bengal, Indian Ocean</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
