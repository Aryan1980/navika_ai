import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GitCommit, 
  ShieldAlert, 
  Waves, 
  Fish, 
  Navigation, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  Database, 
  Play, 
  RefreshCw, 
  Info,
  Clock,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface AgentNodeInfo {
  id: string;
  name: string;
  subTitle: string;
  pptRole: string;
  source: string;
  latencyMs: number;
  status: 'IDLE' | 'RUNNING' | 'DONE' | 'VETO';
  color: string;
  borderColor: string;
  bgGradient: string;
  inputs: string[];
  outputs: string[];
}

export const AgentDAGFlowDiagram: React.FC = () => {
  const { isAnalyzing, agentTraces, risk } = useApp();
  const [selectedNode, setSelectedNode] = useState<AgentNodeInfo | null>(null);
  const [simulateVetoMode, setSimulateVetoMode] = useState<boolean>(false);

  const isVetoActive = simulateVetoMode || risk?.risk_level === 'HIGH' || risk?.risk_level === 'EXTREME';

  // 5 PPT Agents Definition
  const nodes: AgentNodeInfo[] = [
    {
      id: 'supervisor',
      name: 'Supervisor Agent (Router)',
      subTitle: 'Top-Level Orchestrator',
      pptRole: 'Autonomous intent decomposition, subtask graph scheduling, and multi-agent dispatch.',
      source: 'LangGraph State Graph / Router',
      latencyMs: 14,
      status: isAnalyzing ? 'RUNNING' : 'DONE',
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/50',
      bgGradient: 'from-indigo-950/40 to-[#12161f]',
      inputs: ['User Natural Language Query', 'Vessel GPS Fix', 'Active Port Geometry'],
      outputs: ['Parallel Execution DAG', 'Sub-Agent Context Buffers']
    },
    {
      id: 'ocean',
      name: 'Ocean Agent',
      subTitle: 'PFZ Math Engine',
      pptRole: 'Inversion of SST thermal gradients and Chlorophyll-a fronts to pinpoint pelagic fish aggregations.',
      source: 'Oceansat-3 (OCM-3) & INCOIS PFZ',
      latencyMs: 32,
      status: isAnalyzing ? 'RUNNING' : 'DONE',
      color: 'text-blue-400',
      borderColor: 'border-blue-500/50',
      bgGradient: 'from-blue-950/40 to-[#12161f]',
      inputs: ['SST Multi-sensor Grids', 'Chlorophyll-a mg/m³', 'Upwelling Vector'],
      outputs: ['Frontal Probability Scores', 'Ranked High-Yield Waypoints']
    },
    {
      id: 'meteo',
      name: 'Meteo Agent',
      subTitle: 'Wave Guard Engine',
      pptRole: 'Numerical wave height modeling, swell kinematics, wind gusts, and cyclone alert enforcement.',
      source: 'MOSDAC ECMWF / IMD Squall Radar',
      latencyMs: 26,
      status: isAnalyzing ? 'RUNNING' : 'DONE',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      bgGradient: 'from-cyan-950/40 to-[#12161f]',
      inputs: ['Significant Wave Height (Hs)', 'Peak Period (Tp)', 'Wind Speed & Gusts'],
      outputs: ['Wave Guard Threshold Matrix', 'Squall Hazard Flag']
    },
    {
      id: 'kinematics',
      name: 'Kinematics Agent',
      subTitle: 'IMBL Vector Engine',
      pptRole: 'Geofence proximity calculation to the International Maritime Boundary Line and MPA buffer avoidance.',
      source: 'Maritime GIS GIS / Hydrographic Office',
      latencyMs: 18,
      status: isAnalyzing ? 'RUNNING' : 'DONE',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      bgGradient: 'from-amber-950/40 to-[#12161f]',
      inputs: ['IMBL Coordinates', 'Vessel Speed / Course', 'MPA Polygon Zones'],
      outputs: ['Buffer Distance (km)', 'Safe Sea-corridor Waypoints']
    },
    {
      id: 'conflict',
      name: 'Conflict Resolution Engine',
      subTitle: 'Safety Veto Override Layer',
      pptRole: 'Deterministic safety veto override layer that supersedes any agent proposal if safety thresholds are breached.',
      source: 'Deterministic Safety Veto Engine',
      latencyMs: 8,
      status: isAnalyzing ? 'RUNNING' : (isVetoActive ? 'VETO' : 'DONE'),
      color: isVetoActive ? 'text-rose-400' : 'text-emerald-400',
      borderColor: isVetoActive ? 'border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      bgGradient: isVetoActive ? 'from-rose-950/40 to-[#12161f]' : 'from-emerald-950/40 to-[#12161f]',
      inputs: ['Ocean PFZ Proposal', 'Meteo Hazard Matrix', 'Kinematics IMBL Proximity'],
      outputs: isVetoActive ? ['CRITICAL SAFETY VETO: Route Cancelled', 'Emergency Port Refuge Plan'] : ['APPROVED: Safety Verification Token', 'Tactical Dispatch Vector']
    }
  ];

  return (
    <div className="bg-[#12161f] border border-[#384959] rounded-2xl p-4 sm:p-5 shadow-xl text-white">
      
      {/* ── Top Header Bar with LangGraph Trace Badge ── */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#384959]/70 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <GitCommit className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm">Agent DAG Architecture</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0474C4]/20 text-[#88BDF2] border border-[#88BDF2]/40">
                LangGraph
              </span>
            </div>
            <p className="text-[11px] text-[#BDDDFC]/70 mt-0.5">
              Auditable state traces - each decision logged as a timestamped node
            </p>
          </div>
        </div>

        {/* Right Action Tools: Simulation Mode & Status */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulateVetoMode(!simulateVetoMode)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              simulateVetoMode
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-[#1E2632] text-[#BDDDFC]/80 border-[#384959] hover:text-white'
            }`}
            title="Simulate Conflict Resolution Engine VETO response"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>{simulateVetoMode ? 'Veto Override Active' : 'Test Safety Veto'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#1E2632] border border-[#384959] text-[11px] font-mono text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-ping' : isVetoActive ? 'bg-rose-400' : 'bg-emerald-400'}`} />
            <span>{isAnalyzing ? 'Executing...' : isVetoActive ? 'VETO TRIGGERED' : '5/5 Nodes Ready'}</span>
          </div>
        </div>
      </div>

      {/* ── Visual 5-Node Interactive DAG Flow Diagram ── */}
      <div className="mt-5 relative">
        
        {/* Step 1: Supervisor Router Node (Top Center) */}
        <div className="flex justify-center mb-6">
          <div 
            onClick={() => setSelectedNode(nodes[0])}
            className={`w-full max-w-sm p-3.5 rounded-2xl border bg-gradient-to-b ${nodes[0].bgGradient} ${nodes[0].borderColor} cursor-pointer transition-all hover:scale-[1.01] shadow-lg`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span className="font-bold text-xs text-indigo-300">{nodes[0].name}</span>
              </div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                isAnalyzing ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                {isAnalyzing ? 'ROUTING' : 'READY (14ms)'}
              </span>
            </div>
            <p className="text-[11px] text-[#BDDDFC]/75 leading-tight">{nodes[0].pptRole}</p>
          </div>
        </div>

        {/* Directed Connectors (Supervisor -> Sub-agents) */}
        <div className="hidden sm:flex justify-around items-center px-12 -my-2 text-[#384959]">
          <div className="w-px h-6 bg-gradient-to-b from-indigo-500/60 to-blue-500/60"></div>
          <div className="w-px h-6 bg-gradient-to-b from-indigo-500/60 to-cyan-500/60"></div>
          <div className="w-px h-6 bg-gradient-to-b from-indigo-500/60 to-amber-500/60"></div>
        </div>

        {/* Step 2: Three Parallel Sub-Agents (Ocean, Meteo, Kinematics) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
          
          {/* Node 2: Ocean Agent */}
          <div 
            onClick={() => setSelectedNode(nodes[1])}
            className={`p-3.5 rounded-2xl border bg-gradient-to-b ${nodes[1].bgGradient} ${nodes[1].borderColor} cursor-pointer transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Fish className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-bold text-xs text-blue-300">{nodes[1].name}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  PFZ Math
                </span>
              </div>
              <p className="text-[10px] text-[#BDDDFC]/75 leading-tight">{nodes[1].pptRole}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#88BDF2]">
              <span>Oceansat-3 OCM</span>
              <span>{nodes[1].latencyMs}ms</span>
            </div>
          </div>

          {/* Node 3: Meteo Agent */}
          <div 
            onClick={() => setSelectedNode(nodes[2])}
            className={`p-3.5 rounded-2xl border bg-gradient-to-b ${nodes[2].bgGradient} ${nodes[2].borderColor} cursor-pointer transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-xs text-cyan-300">{nodes[2].name}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Wave Guard
                </span>
              </div>
              <p className="text-[10px] text-[#BDDDFC]/75 leading-tight">{nodes[2].pptRole}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-cyan-400">
              <span>ECMWF/MOSDAC</span>
              <span>{nodes[2].latencyMs}ms</span>
            </div>
          </div>

          {/* Node 4: Kinematics Agent */}
          <div 
            onClick={() => setSelectedNode(nodes[3])}
            className={`p-3.5 rounded-2xl border bg-gradient-to-b ${nodes[3].bgGradient} ${nodes[3].borderColor} cursor-pointer transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-xs text-amber-300">{nodes[3].name}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  IMBL Vector
                </span>
              </div>
              <p className="text-[10px] text-[#BDDDFC]/75 leading-tight">{nodes[3].pptRole}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-amber-400">
              <span>Maritime GIS</span>
              <span>{nodes[3].latencyMs}ms</span>
            </div>
          </div>

        </div>

        {/* Directed Connectors (Parallel Sub-Agents -> Conflict Resolution) */}
        <div className="hidden sm:flex justify-around items-center px-12 -my-2 text-[#384959]">
          <div className="w-px h-6 bg-gradient-to-b from-blue-500/60 to-emerald-500/60"></div>
          <div className="w-px h-6 bg-gradient-to-b from-cyan-500/60 to-emerald-500/60"></div>
          <div className="w-px h-6 bg-gradient-to-b from-amber-500/60 to-emerald-500/60"></div>
        </div>

        {/* Step 3: Conflict Resolution Engine (Safety Veto Override Layer) */}
        <div className="flex justify-center mt-6">
          <div 
            onClick={() => setSelectedNode(nodes[4])}
            className={`w-full max-w-xl p-4 rounded-2xl border bg-gradient-to-b ${nodes[4].bgGradient} ${nodes[4].borderColor} cursor-pointer transition-all hover:scale-[1.01] shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isVetoActive ? (
                  <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <div>
                  <span className={`font-bold text-xs ${isVetoActive ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {nodes[4].name}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-2">Safety Veto Override</span>
                </div>
              </div>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                isVetoActive 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}>
                {isVetoActive ? 'OVERRIDE TRIGGERED: VETO' : 'OVERRIDE IDLE: PASS (8ms)'}
              </span>
            </div>

            <p className="text-[11px] text-[#BDDDFC]/85 leading-relaxed">
              {isVetoActive
                ? 'CRITICAL SAFETY VETO: Hazardous swell (> 2.8m) or IMBL boundary proximity (< 5km) breached threshold. Ocean Agent fishing recommendation has been forcefully overridden.'
                : 'Deterministic validation passed. No severe weather squalls, IMBL proximity > 8.5 km buffer, and swell conditions within commercial safety limits.'}
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] font-mono text-[#88BDF2]">
              <span>Distinct Safety Arbitration Step</span>
              <span className="text-white underline hover:text-[#BDDDFC] flex items-center gap-1">
                Click to inspect telemetry state <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Modal / Drawer for Node Inspection ── */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-2xl bg-[#161c27] border border-[#88BDF2]/40 shadow-xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#384959]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{selectedNode.name}</span>
              <span className="text-[10px] font-mono text-[#88BDF2]">({selectedNode.source})</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-[#1E2632] border border-[#384959] cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#BDDDFC]/70 block mb-1">State Inputs</span>
              <ul className="space-y-1">
                {selectedNode.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="w-1 h-1 rounded-full bg-[#88BDF2]"></span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-[#BDDDFC]/70 block mb-1">Generated Decisions</span>
              <ul className="space-y-1">
                {selectedNode.outputs.map((out, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono">
                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
