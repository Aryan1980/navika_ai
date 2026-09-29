import React, { useState } from 'react';
import { Radio, Database, ShieldAlert, FileText, CheckCircle2, Info } from 'lucide-react';

interface DataSourceStatus {
  name: string;
  source: string;
  cadence: string;
  status: 'LIVE' | 'CACHED' | 'DEMO';
  details: string;
}

const DATA_SOURCES: DataSourceStatus[] = [
  {
    name: 'INCOIS',
    source: 'Ocean State Forecasts & PFZ Advisories',
    cadence: '6-Hour Bulletins',
    status: 'LIVE',
    details: 'Real-time sync with INCOIS Web Services (SST, Chlorophyll fronts, High Wave Alerts)'
  },
  {
    name: 'IMD',
    source: 'Coastal Automatic Weather Stations (AWS)',
    cadence: '3-Hour Observations',
    status: 'LIVE',
    details: 'Surface wind velocity, gust speed, convective precipitation, cyclone bulletins'
  },
  {
    name: 'MOSDAC',
    source: 'ISRO Space Applications Centre (SAC)',
    cadence: 'Oceansat-3 Level-2/3 Ingested',
    status: 'CACHED',
    details: 'EOS-06 OCM-3 Chlorophyll (NetCDF4) & INSAT-3DR TIR SST (HDF5) scientific pipelines'
  },
  {
    name: 'ISRO',
    source: 'Spaceborne Ocean Telemetry & Calibration',
    cadence: 'Daily Passes',
    status: 'CACHED',
    details: 'In-situ calibrated ocean radiometer and scatterometer datasets for Indian waters'
  },
  {
    name: 'Bhuvan',
    source: 'Maritime GIS & Coastal Bathymetry',
    cadence: 'Static Boundary GIS',
    status: 'DEMO',
    details: 'Simulated 12nm Territorial Waters, 200nm EEZ, MPAs & Sovereign IMBL geofence layers'
  }
];

interface LiveStatusBarProps {
  onOpenSOS?: () => void;
  onOpenAdvisory?: () => void;
  onOpenDAG?: () => void;
}

export const LiveStatusBar: React.FC<LiveStatusBarProps> = ({
  onOpenSOS,
  onOpenAdvisory,
  onOpenDAG
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const getStatusBadge = (status: DataSourceStatus['status']) => {
    switch (status) {
      case 'LIVE':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300',
          dot: 'bg-emerald-400 animate-pulse'
        };
      case 'CACHED':
        return {
          bg: 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300',
          dot: 'bg-cyan-400'
        };
      case 'DEMO':
      default:
        return {
          bg: 'bg-amber-500/15 border-amber-500/35 text-amber-300',
          dot: 'bg-amber-400'
        };
    }
  };

  return (
    <div className="w-full bg-[#0c101a] border-b border-[#5379AE]/20 px-3 py-1.5 flex items-center justify-between gap-2 text-xs select-none z-30 overflow-x-auto no-scrollbar flex-nowrap md:flex-wrap">
      
      {/* Left: ISRO PS Branding + Data Sources */}
      <div className="flex items-center gap-2 flex-shrink-0 flex-nowrap md:flex-wrap">
        {/* Platform Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-900/60 to-cyan-900/40 border border-cyan-500/40 text-cyan-200 font-mono text-[10.5px] font-semibold tracking-wide shadow-sm flex-shrink-0">
          <span>🛰️</span>
          <span className="whitespace-nowrap">MARITIME INTELLIGENCE LIVE</span>
        </div>

        <span className="text-[#5379AE]/50 hidden md:inline">|</span>

        {/* Persistent Data Source Chips */}
        <div className="flex items-center gap-1.5 flex-nowrap md:flex-wrap flex-shrink-0">
          <span className="text-[10px] text-slate-400 font-mono hidden lg:inline uppercase tracking-wider">
            Feeds:
          </span>
          {DATA_SOURCES.map((ds) => {
            const badge = getStatusBadge(ds.status);
            const isHovered = activeTooltip === ds.name;

            return (
              <div
                key={ds.name}
                className="relative"
                onMouseEnter={() => setActiveTooltip(ds.name)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10.5px] font-mono transition-all duration-150 cursor-pointer ${badge.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                  <span className="font-semibold text-white">{ds.name}:</span>
                  <span className="font-medium">{ds.status}</span>
                </button>

                {/* Rich Tooltip */}
                {isHovered && (
                  <div className="absolute left-0 top-full mt-1.5 w-64 p-2.5 rounded-xl bg-[#141a29] border border-[#5379AE]/40 shadow-2xl z-50 text-[11px] text-slate-200 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between mb-1 pb-1 border-b border-white/10 font-mono">
                      <span className="font-bold text-white text-xs">{ds.name} Telemetry</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border ${badge.bg}`}>
                        {ds.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[10.5px] leading-snug mb-1.5">{ds.source}</p>
                    <div className="text-[9.5px] text-[#A8C4EC] font-mono flex items-center justify-between">
                      <span>Cadence:</span>
                      <span className="text-white">{ds.cadence}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 mt-1 italic leading-tight">
                      {ds.details}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Quick Action Buttons (Advisory PDF + SOS 1554 + Agent DAG) */}
      <div className="flex items-center gap-2 ml-auto">
        {onOpenDAG && (
          <button
            onClick={onOpenDAG}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#182033] hover:bg-[#202b45] border border-[#5379AE]/30 hover:border-cyan-400/50 text-cyan-300 text-[11px] font-medium transition-colors cursor-pointer"
            title="Inspect 11-Agent Orchestration DAG"
          >
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">11 AI Agents</span>
            <span className="sm:hidden">DAG</span>
          </button>
        )}

        {onOpenAdvisory && (
          <button
            onClick={onOpenAdvisory}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#182033] hover:bg-[#202b45] border border-[#5379AE]/30 hover:border-emerald-400/50 text-emerald-300 text-[11px] font-medium transition-colors cursor-pointer"
            title="Generate Official Marine Advisory Bulletin (PDF)"
          >
            <FileText className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Advisory PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        )}

        {onOpenSOS && (
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 hover:border-rose-400 text-rose-200 text-[11px] font-bold transition-all shadow-[0_0_10px_rgba(244,63,94,0.25)] cursor-pointer"
            title="Coast Guard Marine Distress Emergency (1554)"
          >
            <ShieldAlert className="w-3 h-3 text-rose-400 animate-bounce" />
            <span>SOS 1554</span>
          </button>
        )}
      </div>

    </div>
  );
};
