import React from 'react';
import { useApp } from '../../context/AppContext';
import { Radio, Cloud, Cpu, Wifi, CheckCircle2, Zap } from 'lucide-react';

export const DualSyncModeBanner: React.FC = () => {
  const { syncMode, setSyncMode } = useApp();

  return (
    <div className="w-full bg-[#161c27] border-b border-[#384959]/60 px-3 sm:px-4 py-1.5 flex items-center justify-between gap-2.5 text-xs select-none z-10 transition-colors shadow-inner overflow-x-auto no-scrollbar flex-nowrap md:flex-wrap">
      {/* Left: Mode Toggle & Sync Status */}
      <div className="flex items-center gap-2 flex-shrink-0 flex-nowrap">
        <div className="flex items-center rounded-xl bg-[#12161f] p-0.5 border border-[#384959]/80 shadow-sm flex-shrink-0">
          <button
            onClick={() => setSyncMode('edge')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer whitespace-nowrap ${
              syncMode === 'edge'
                ? 'bg-[#1E2632] text-[#88BDF2] border border-[#88BDF2]/40 shadow-sm'
                : 'text-[#BDDDFC]/70 hover:text-white'
            }`}
            title="Switch to NavIC / LoRaWAN Mesh Edge Sync"
          >
            <Radio className={`w-3.5 h-3.5 ${syncMode === 'edge' ? 'text-[#88BDF2] animate-pulse' : ''}`} />
            <span>Edge Mesh Mode</span>
            {syncMode === 'edge' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setSyncMode('cloud')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer ${
              syncMode === 'cloud'
                ? 'bg-[#0474C4] text-white shadow-sm'
                : 'text-[#BDDDFC]/70 hover:text-white'
            }`}
            title="Switch to ISRO MOSDAC / INCOIS Cloud Sync"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud Sync Mode</span>
            {syncMode === 'cloud' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span>
            )}
          </button>
        </div>

        {/* Live Ingestion / Relay Details */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#BDDDFC] bg-[#1E2632]/60 px-2.5 sm:px-3 py-1 rounded-lg border border-[#384959]/50 flex-shrink-0 whitespace-nowrap">
          {syncMode === 'edge' ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
              <span className="text-white font-semibold">NavIC/LoRaWAN Mesh</span>
              <span className="text-[#6A89A7]">·</span>
              <span className="text-[#88BDF2] font-medium">Zero-4G Offshore</span>
              <span className="text-[#6A89A7] hidden sm:inline">·</span>
              <span className="text-emerald-300 font-semibold hidden sm:inline">Peer-to-peer relay active</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
              <span className="text-white font-semibold">MOSDAC / INCOIS SSO</span>
              <span className="text-[#6A89A7]">·</span>
              <span className="text-[#88BDF2] font-medium">Ingesting .nc grids</span>
              <span className="text-[#6A89A7] hidden sm:inline">·</span>
              <span className="text-cyan-300 font-semibold hidden sm:inline">SST, Chl-a, Wave Period</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Edge Hardware Badge & Telemetry Latency */}
      <div className="flex items-center gap-2.5 flex-shrink-0 whitespace-nowrap">
        {/* Edge Hardware Badge */}
        <div 
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-xl bg-[#1E2632] border border-[#88BDF2]/30 text-xs font-sans text-white shadow-sm flex-shrink-0"
          title="Field-tested edge acceleration with 100% offline capability"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-bounce" />
          <span className="font-bold text-[#88BDF2]">Edge-Ready</span>
          <span className="text-[#6A89A7]">·</span>
          <span className="text-emerald-400 font-bold">100% Offline</span>
          <span className="text-[#6A89A7] hidden sm:inline">·</span>
          <span className="text-cyan-300 font-semibold hidden sm:inline">{syncMode === 'edge' ? '180ms Inference' : '240ms Ingestion'}</span>
        </div>
      </div>
    </div>
  );
};
