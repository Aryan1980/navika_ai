import React from 'react';
import { Cpu, ShieldCheck, Database, Compass, Radio, ArrowDown, Activity, Sparkles, AlertTriangle } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 text-slate-100">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
          Autonomous Maritime AI Architecture Specification
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-200 to-indigo-200">
          How SamudraAI Works: End-to-End Agentic AI Architecture
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl mx-auto">
          SamudraAI departs from superficial conversational bots by employing an autonomous multi-agent planner, concurrent dataset fusion, spatial reasoning, and a strictly deterministic physical risk engine.
        </p>
      </div>

      {/* Architecture Flow Diagram */}
      <div className="bg-slate-900/80 border border-cyan-900/60 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
          <Activity className="w-4 h-4" /> End-to-End Execution Pipeline
        </h3>

        {/* Step 1: Ingestion */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-700/60 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
            1
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-slate-200">Multimodal Intent Ingestion</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono">Voice & Text ? 10 Indian Languages</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              User speaks or types in Hindi, Tamil, Telugu, Malayalam, Bengali, etc. The browser Web Speech API converts speech to text, while the Planner Agent automatically identifies the script and preserves physical SI units (km/h, m, ?C).
            </p>
          </div>
        </div>

        <div className="flex justify-center text-cyan-500"><ArrowDown className="w-5 h-5 animate-bounce" /></div>

        {/* Step 2: Planner Agent */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            2
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-slate-200">Autonomous Planner Agent</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">Intent Classification & Subtask Graph</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Classifies queries (e.g. PFZ discovery, safety forecast, safe routing, boundary proximity) and decomposes them into concurrent subtasks. Only relevant specialized agents are dispatched.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-cyan-500"><ArrowDown className="w-5 h-5" /></div>

        {/* Step 3: Concurrent Multi-Agent Execution */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-200">Specialized Multi-Agent Execution Layer</h4>
              <p className="text-[10px] text-slate-400">Executed concurrently via asyncio provider abstraction</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 text-xs block">Weather Agent</strong>
              <span className="text-[10px] text-slate-400">Wind speed, gusts, swell period, squalls, IMD cyclone tracking</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 text-xs block">Ocean Analytics Agent</strong>
              <span className="text-[10px] text-slate-400">SST thermal gradients, Chlorophyll-a plumes, tidal curves</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 text-xs block">GIS Reasoning Agent</strong>
              <span className="text-[10px] text-slate-400">IMBL cross-track distance, Ray-casting point-in-polygon for MPAs</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 text-xs block">PFZ Intelligence Agent</strong>
              <span className="text-[10px] text-slate-400">Multi-criteria ranking (distance, environmental suitability, safety)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 text-xs block">Route Optimizer Agent</strong>
              <span className="text-[10px] border-slate-800 text-slate-400">Shortest path vs hazard-avoiding safe nautical corridors</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-cyan-300 text-xs block">Marine Alert Agent</strong>
              <span className="text-[10px] text-slate-400">Multi-tier threshold warnings (Extreme, High, Moderate, Info)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center text-cyan-500"><ArrowDown className="w-5 h-5" /></div>

        {/* Step 4: Deterministic Risk Engine */}
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/60 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
            4
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-emerald-300">Deterministic Physical Risk Engine</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">Zero Hallucination Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Critical Requirement: LLMs do <strong>not</strong> invent safety scores. The safety verdict is calculated using a transparent weighted physical formula:
            </p>
            <div className="mt-2 p-2 rounded bg-slate-900 font-mono text-[10px] text-cyan-300">
              Risk = 0.20?Wind + 0.25?Wave + 0.15?Lightning + 0.25?Cyclone + 0.10?Geofence + 0.05?Tide
            </div>
          </div>
        </div>

        <div className="flex justify-center text-cyan-500"><ArrowDown className="w-5 h-5" /></div>

        {/* Step 5: Explainable Synthesis */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
            5
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-slate-200">Explainable Evidence & Visual Orchestration</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">Full Audit Trail & Map Overlays</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              The Explanation Agent synthesizes localized recommendations in the user's native tongue, triggers map layer overlays, and generates an audit drawer with satellite timestamps, observed vs forecast distinction, and source attribution.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
