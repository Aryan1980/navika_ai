import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Terminal, Play, Pause, Trash2, Copy, Check, Filter, Sparkles, Clock } from 'lucide-react';

interface TraceLog {
  id: string;
  timestamp: string;
  agent: 'Supervisor' | 'Ocean' | 'Meteo' | 'Kinematics' | 'Conflict Resolution';
  level: 'ROUTER' | 'PFZ_MATH' | 'WAVE_GUARD' | 'IMBL_VECTOR' | 'VETO_PASS' | 'VETO_ALERT';
  message: string;
}

const DEFAULT_DEMO_LOGS: TraceLog[] = [
  {
    id: 'l1',
    timestamp: '13:58:02.114',
    agent: 'Supervisor',
    level: 'ROUTER',
    message: 'Supervisor Agent (Router) -> Ingested query. Intent decomposed into [PFZ_MATH, WAVE_GUARD, IMBL_VECTOR]. Dispatching parallel DAG execution.'
  },
  {
    id: 'l2',
    timestamp: '13:58:02.268',
    agent: 'Ocean',
    level: 'PFZ_MATH',
    message: 'Ocean Agent -> Oceansat-3 OCM-3 thermal edge detected. SST gradient d(SST)/dx = 0.42°C/km, Chlorophyll-a = 0.84 mg/m³. Spot 1 ranked optimal.'
  },
  {
    id: 'l3',
    timestamp: '13:58:02.412',
    agent: 'Meteo',
    level: 'WAVE_GUARD',
    message: 'Meteo Agent -> Significant wave height Hs = 1.24m (threshold < 2.5m). Peak swell period Tp = 8.6s. Wind speed 12.8 kt NW. Squall alert: NONE.'
  },
  {
    id: 'l4',
    timestamp: '13:58:02.580',
    agent: 'Kinematics',
    level: 'IMBL_VECTOR',
    message: 'Kinematics Agent -> IMBL vector buffer computed. Proximity distance = 18.4 km to sovereign boundary (safe buffer > 5.0 km). Detour required: NO.'
  },
  {
    id: 'l5',
    timestamp: '13:58:02.724',
    agent: 'Conflict Resolution',
    level: 'VETO_PASS',
    message: 'Conflict Resolution Engine -> Evaluated all sub-agent proposals against safety constraints. Verification: PASS. Safety veto override NOT triggered.'
  }
];

export const LiveTerminalTrace: React.FC = () => {
  const { isAnalyzing, agentTraces, activeLocationName } = useApp();
  const [logs, setLogs] = useState<TraceLog[]>(DEFAULT_DEMO_LOGS);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // If live analysis begins from AppContext, trigger realistic simulated step delays
  useEffect(() => {
    if (isAnalyzing) {
      runSimulatedTrace();
    }
  }, [isAnalyzing]);

  const runSimulatedTrace = () => {
    setIsSimulating(true);
    setLogs([]);

    const now = () => {
      const d = new Date();
      return `${d.toTimeString().split(' ')[0]}.${String(d.getMilliseconds()).padStart(3, '0')}`;
    };

    const steps: TraceLog[] = [
      {
        id: `log_${Date.now()}_1`,
        timestamp: now(),
        agent: 'Supervisor',
        level: 'ROUTER',
        message: `Supervisor Agent (Router) -> Ingested operational prompt for ${activeLocationName.split(',')[0]}. Scheduled LangGraph state nodes.`
      },
      {
        id: `log_${Date.now()}_2`,
        timestamp: now(),
        agent: 'Ocean',
        level: 'PFZ_MATH',
        message: 'Ocean Agent -> INCOIS & Oceansat-3 OCM-3 satellite inversion active. Chlorophyll-a front detected at 0.88 mg/m³.'
      },
      {
        id: `log_${Date.now()}_3`,
        timestamp: now(),
        agent: 'Meteo',
        level: 'WAVE_GUARD',
        message: 'Meteo Agent -> Wave height 1.2m, swell 8s, surface wind 14 kt. Squall warning: CLEAR. Sea state code 3.'
      },
      {
        id: `log_${Date.now()}_4`,
        timestamp: now(),
        agent: 'Kinematics',
        level: 'IMBL_VECTOR',
        message: 'Kinematics Agent -> Geofence check against IMBL coordinates. Clearance: 22.8 km. Sovereign buffer intact.'
      },
      {
        id: `log_${Date.now()}_5`,
        timestamp: now(),
        agent: 'Conflict Resolution',
        level: 'VETO_PASS',
        message: 'Conflict Resolution Engine -> Deterministic safety rules evaluated. Final Verdict: APPROVED. Zero veto overrides needed.'
      }
    ];

    // Simulate 150-250ms delay between steps
    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step]);
        if (index === steps.length - 1) {
          setIsSimulating(false);
        }
      }, (index + 1) * 220);
    });
  };

  const handleCopy = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter(l => {
    if (activeFilter === 'ALL') return true;
    return l.agent.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="bg-[#090d16] border border-[#384959] rounded-2xl overflow-hidden shadow-2xl font-mono text-xs text-slate-200">
      
      {/* ── Terminal Header Bar ── */}
      <div className="px-4 py-2.5 bg-[#0e1422] border-b border-[#384959]/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Mac-style traffic lights */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-white text-[11px] tracking-wide">
            LangGraph Trace
          </span>
          <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 hidden sm:inline">
            Simulated 100-300ms step execution
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={runSimulatedTrace}
            disabled={isSimulating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0474C4]/20 hover:bg-[#0474C4]/40 text-[#88BDF2] border border-[#88BDF2]/30 text-[10px] font-bold cursor-pointer disabled:opacity-40 transition-all"
            title="Re-run simulated live trace"
          >
            <Play className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Streaming...' : 'Replay Trace'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[10px] cursor-pointer"
            title="Copy logs"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-300 border border-white/10 text-[10px] cursor-pointer"
            title="Clear terminal"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── Sub-header: Filter Chips ── */}
      <div className="px-3 py-1.5 bg-[#090d16] border-b border-[#384959]/40 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <span className="text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-2.5 h-2.5" /> Filter:
        </span>
        {['ALL', 'Supervisor', 'Ocean', 'Meteo', 'Kinematics', 'Conflict Resolution'].map((agentName) => (
          <button
            key={agentName}
            onClick={() => setActiveFilter(agentName)}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              activeFilter === agentName
                ? 'bg-[#88BDF2]/20 text-[#88BDF2] border border-[#88BDF2]/40 font-bold'
                : 'text-slate-400 hover:text-white bg-white/[0.02]'
            }`}
          >
            {agentName}
          </button>
        ))}
      </div>

      {/* ── CRT Monospace Terminal Window ── */}
      <div 
        ref={terminalRef}
        className="p-3.5 max-h-56 overflow-y-auto space-y-2 bg-[#060910] font-mono text-[11px] leading-relaxed selection:bg-[#88BDF2]/30 selection:text-white"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 italic py-4 text-center">
            Terminal buffer empty. Click "Replay Trace" to stream agent state events.
          </div>
        ) : (
          filteredLogs.map((log) => {
            let levelColor = 'text-cyan-400';
            let badgeBg = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';

            if (log.level === 'ROUTER') {
              levelColor = 'text-indigo-300';
              badgeBg = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
            } else if (log.level === 'PFZ_MATH') {
              levelColor = 'text-blue-300';
              badgeBg = 'bg-blue-500/10 text-blue-300 border-blue-500/30';
            } else if (log.level === 'WAVE_GUARD') {
              levelColor = 'text-cyan-300';
              badgeBg = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
            } else if (log.level === 'IMBL_VECTOR') {
              levelColor = 'text-amber-300';
              badgeBg = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
            } else if (log.level === 'VETO_PASS') {
              levelColor = 'text-emerald-300';
              badgeBg = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
            } else if (log.level === 'VETO_ALERT') {
              levelColor = 'text-rose-400';
              badgeBg = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
            }

            return (
              <div key={log.id} className="flex items-start gap-2 animate-in fade-in duration-100">
                <span className="text-slate-500 flex-shrink-0">[{log.timestamp}]</span>
                <span className={`px-1 py-0.2 rounded border text-[9px] font-bold flex-shrink-0 ${badgeBg}`}>
                  {log.level}
                </span>
                <span className={`${levelColor} break-words`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}

        {/* Blinking Terminal Cursor */}
        <div className="flex items-center gap-1.5 text-cyan-400/80 pt-1">
          <span>❯</span>
          <span className="w-2 h-3.5 bg-cyan-400 animate-pulse"></span>
        </div>
      </div>

    </div>
  );
};
