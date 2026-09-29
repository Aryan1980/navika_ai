import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Database,
  Radio,
  ExternalLink,
  Layers,
  ArrowRight,
  Terminal,
  Activity,
  ShieldCheck,
  Compass,
  FileText,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

export interface DAGAgentNode {
  id: string;
  name: string;
  role: string;
  category: 'planning' | 'data' | 'spatial' | 'safety' | 'synthesis';
  provider: string;
  equation: string;
  dependencies: string[];
  latencyMs: number;
  sampleOutput: string;
}

export const DAG_AGENTS: DAGAgentNode[] = [
  {
    id: 'planner',
    name: 'Planner Agent',
    role: 'Autonomous Intent Classification & DAG Task Graph Decomposition',
    category: 'planning',
    provider: 'Rule-Based Intent Classifier & Context Engine',
    equation: 'T_plan = argmax_i P(Intent_i | Query, Harbor_Context)',
    dependencies: [],
    latencyMs: 14,
    sampleOutput: "Intent: 'pfz_safe_navigation', Dispatched: 10 Sub-Agents, Coordinates: 9.9312°N, 76.2673°E"
  },
  {
    id: 'discovery',
    name: 'Data Discovery Agent',
    role: 'Spaceborne Satellite Catalogue & Ingest Pipeline Matching',
    category: 'data',
    provider: 'ISRO MOSDAC & INCOIS Open Telemetry Catalog',
    equation: 'Match(Pass_ID, Sensor_Band) where Lat ∈ [6°N, 24°N], Lon ∈ [68°E, 96°E]',
    dependencies: ['planner'],
    latencyMs: 18,
    sampleOutput: 'Catalog match: EOS-06 OCM-3 (NetCDF4), INSAT-3DR TIR (HDF5), IMD AWS Buoy 42001'
  },
  {
    id: 'weather',
    name: 'Weather Intelligence Agent',
    role: 'Atmospheric Wind Vectors, Sea Gusts & Swell Dynamics',
    category: 'data',
    provider: 'IMD Coastal AWS & WeatherAPI Integration',
    equation: 'W_eff = V_wind · cos(θ_wind) + V_gust_factor · 1.3',
    dependencies: ['planner'],
    latencyMs: 28,
    sampleOutput: 'Wind: 16.5 km/h @ 245° WSW, Gust: 22.0 km/h, Swell: 1.2m @ 8.2s interval'
  },
  {
    id: 'ocean',
    name: 'Ocean Analytics Agent',
    role: 'Thermal Radiometry & Ocean Color Chlorophyll Inversion',
    category: 'data',
    provider: 'Oceansat-3 (EOS-06) OCM-3 & INSAT-3DR TIR',
    equation: 'Chl-a = 10^(a0 + a1·R + a2·R^2) ; SST = T_11μm + γ(T_11μm - T_12μm)',
    dependencies: ['planner'],
    latencyMs: 34,
    sampleOutput: 'SST: 28.4°C (Optimal front), Chlorophyll-a: 2.85 mg/m³ (Upwelling plume)'
  },
  {
    id: 'alert',
    name: 'Marine Alert Agent',
    role: 'Early Cyclone Warnings, High Swell Surges & Navigational Hazards',
    category: 'safety',
    provider: 'IMD Coastal Warning System & INCOIS High Wave Alert Service',
    equation: 'Alert_level = max(Cyclone_Depression, Lightning_Strike_Dist, Swell_Surge)',
    dependencies: ['planner'],
    latencyMs: 12,
    sampleOutput: 'Alert Level: 0 (Normal). No convective lightning within 50 km. Cyclone: None'
  },
  {
    id: 'pfz',
    name: 'PFZ Intelligence Agent',
    role: 'Thermal-Chlorophyll Frontal Convergence Zone Extraction',
    category: 'data',
    provider: 'INCOIS PFZ Advisories & Spaceborne Chlorophyll Gradients',
    equation: 'PFZ_Score = w_chl·∇(Chl) + w_sst·∇(SST) - w_dist·Distance_km',
    dependencies: ['ocean', 'weather'],
    latencyMs: 26,
    sampleOutput: 'Extracted 8 PFZ candidate clusters. Top spot: Frontal Zone Alpha (18.5 km, 240° WSW)'
  },
  {
    id: 'gis',
    name: 'Geospatial Reasoning Agent',
    role: 'Sovereign IMBL, 12nm Territorial Waters & MPA Geofencing',
    category: 'spatial',
    provider: 'Indian Coast Guard GIS Boundary Geodatabase & Bhuvan',
    equation: 'D_IMBL = min_j ||P_vessel - Segment_j(IMBL)|| ; CheckRayCast(MPA)',
    dependencies: ['planner'],
    latencyMs: 16,
    sampleOutput: 'IMBL Clearance: 48.2 km (SAFE). Nearest Marine Sanctuary: 36.4 km clear'
  },
  {
    id: 'trajectory',
    name: 'Trajectory Agent',
    role: 'Forward Predictive Dead Reckoning with Wind Leeway Drift',
    category: 'spatial',
    provider: 'Kinematic Leeway Drift Integral (60-Min Horizon)',
    equation: 'P(t+Δt) = P(t) + (V_boat + L_coeff · V_wind) · Δt',
    dependencies: ['weather', 'gis'],
    latencyMs: 22,
    sampleOutput: 'Projected 60-min track: Heading 240°, Leeway 1.4 kn. Boundary clearance maintained'
  },
  {
    id: 'risk',
    name: 'Risk Assessment Agent',
    role: 'Deterministic 7-Factor Hydro-Meteorological Physics Matrix',
    category: 'safety',
    provider: 'Deterministic Physical Safety Engine (Zero LLM Hallucination)',
    equation: 'Risk = 0.20·S_w + 0.25·S_wave + 0.15·S_wx + 0.15·S_imbl + 0.10·S_traj + 0.05·S_sst + 0.05·S_chl',
    dependencies: ['weather', 'ocean', 'gis', 'trajectory', 'alert'],
    latencyMs: 15,
    sampleOutput: 'Safety Score: 85/100 (Risk: 15/100) -> Verdict: SAFE TO VENTURE'
  },
  {
    id: 'route',
    name: 'Route Optimization Agent',
    role: 'A* Waypoint Safe Corridor & Hazard Detour Router',
    category: 'spatial',
    provider: 'A* Coastal Waypoint Graph Router',
    equation: 'f(n) = g(n) + h(n) + Hazard_Penalty(n)',
    dependencies: ['pfz', 'risk', 'gis'],
    latencyMs: 19,
    sampleOutput: 'Safe Route: 22.4 km (Clear channel) vs Direct: 18.5 km (Nearshore reef proximity)'
  },
  {
    id: 'verification',
    name: 'Verification Agent',
    role: 'Cross-Sensor Multi-Source Physical Consensus Audit',
    category: 'safety',
    provider: 'Independent Physical Guardrail Auditor',
    equation: 'Verify: |T_insat - T_incois| < 1.5°C ∧ Wave_swan ≈ Wave_observed',
    dependencies: ['risk', 'weather', 'ocean', 'trajectory'],
    latencyMs: 11,
    sampleOutput: 'Audited 5 physics consistency rules: PASS (100% consensus across sensors)'
  },
  {
    id: 'visualization',
    name: 'Visualization Agent',
    role: 'Dynamic Vector Overlay Synthesizer & Cartographic Symbology',
    category: 'synthesis',
    provider: 'Leaflet Vector Pipeline & Marine Symbology Engine',
    equation: 'Layers = FilterActive(Intent, Risk_Level, User_Overrides)',
    dependencies: ['route', 'pfz', 'risk'],
    latencyMs: 10,
    sampleOutput: 'Activated overlays: [pfz_clusters, swell_vector_field, imbl_boundary, safe_corridor]'
  },
  {
    id: 'explanation',
    name: 'Explanation & Evidence Agent',
    role: 'Multilingual Vernacular Generation with Exact Provenance Trace',
    category: 'synthesis',
    provider: '10-Language Maritime Translator & Provenance Engine',
    equation: 'Advisory = Localize(Template_Safe, Lang_Code) + AuditEvidence(Trace_Hash)',
    dependencies: ['verification', 'visualization', 'risk'],
    latencyMs: 29,
    sampleOutput: 'Generated localized advice in selected language with SHA-256 provenance stamp'
  }
];

interface StreamingLogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  state: 'RUNNING' | 'COMPLETED' | 'ERROR';
  message: string;
  durationMs?: number;
}

export const AgentStreamingDAGView: React.FC = () => {
  const { activeLocation, activeLocationName, language } = useApp();
  const [selectedAgent, setSelectedAgent] = useState<DAGAgentNode>(DAG_AGENTS[0]);
  const [agentStates, setAgentStates] = useState<Record<string, 'IDLE' | 'PENDING' | 'RUNNING' | 'COMPLETED' | 'ERROR'>>(() => {
    const init: Record<string, any> = {};
    DAG_AGENTS.forEach((a) => (init[a.id] = 'COMPLETED'));
    return init;
  });
  const [streamLogs, setStreamLogs] = useState<StreamingLogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamMode, setStreamMode] = useState<'LIVE WS' | 'PROGRESSIVE DEMO'>('PROGRESSIVE DEMO');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [streamLogs]);

  // Progressive streaming simulation (or WS trigger)
  const triggerDAGExecution = () => {
    if (isStreaming) return;
    setIsStreaming(true);

    // Reset all to IDLE
    const resetStates: Record<string, 'IDLE' | 'PENDING' | 'RUNNING' | 'COMPLETED' | 'ERROR'> = {};
    DAG_AGENTS.forEach((a) => (resetStates[a.id] = 'PENDING'));
    setAgentStates(resetStates);
    setStreamLogs([]);

    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let currentStep = 0;
    const stepOrder = DAG_AGENTS.map((a) => a.id);

    const stepInterval = setInterval(() => {
      if (currentStep >= stepOrder.length) {
        clearInterval(stepInterval);
        setIsStreaming(false);
        return;
      }

      const agentId = stepOrder[currentStep];
      const agent = DAG_AGENTS.find((a) => a.id === agentId)!;

      // Mark current as running
      setAgentStates((prev) => ({ ...prev, [agentId]: 'RUNNING' }));
      setSelectedAgent(agent);

      setStreamLogs((prev) => [
        ...prev,
        {
          id: `log_run_${Date.now()}_${agentId}`,
          timestamp: now(),
          agentId,
          agentName: agent.name,
          state: 'RUNNING',
          message: `Dispatched ${agent.name} [${agent.category.toUpperCase()}]. Ingesting dependencies...`
        }
      ]);

      // Complete after latency
      setTimeout(() => {
        setAgentStates((prev) => ({ ...prev, [agentId]: 'COMPLETED' }));
        setStreamLogs((prev) => [
          ...prev,
          {
            id: `log_done_${Date.now()}_${agentId}`,
            timestamp: now(),
            agentId,
            agentName: agent.name,
            state: 'COMPLETED',
            durationMs: agent.latencyMs,
            message: `✓ Completed in ${agent.latencyMs}ms. ${agent.sampleOutput}`
          }
        ]);
      }, 150);

      currentStep++;
    }, 280);
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'RUNNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'COMPLETED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ERROR':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'PENDING':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'IDLE':
      default:
        return 'bg-slate-700/20 text-slate-400 border-slate-700/30';
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0e1320] text-slate-100 font-sans overflow-hidden">
      
      {/* ── Top Bar: Orchestration Status & Actions ── */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#141b2a] border-b border-[#5379AE]/30 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0 shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
                {getTranslation('dag_header_title', language, '11-Agent Autonomous Orchestration DAG')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {getTranslation('dag_header_desc', language, 'Deterministic topological task execution graph with physical consensus verification.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Stream Mode Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1422] border border-[#5379AE]/30 font-mono text-xs sm:text-sm text-slate-200">
            <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-slate-400 font-medium">{getTranslation('dag_mode_label', language, 'Mode:')}</span>
            <span className="font-bold text-cyan-300">{streamMode}</span>
          </div>

          {/* Trigger Simulation Button */}
          <button
            onClick={triggerDAGExecution}
            disabled={isStreaming}
            className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isStreaming ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{getTranslation('executing_pipeline', language, 'Executing Pipeline...')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{getTranslation('run_live_dag', language, 'Run Live DAG Pipeline')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Viewport Split (DAG Visualizer + Live Stream Console + Inspector) ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0">
        
        {/* Left / Center Area: 11-Agent Interactive Topological Network (7 Cols) */}
        <div className="lg:col-span-7 p-4 sm:p-6 overflow-visible lg:overflow-y-auto flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#5379AE]/25 bg-[#0e1320] space-y-5">
          
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {getTranslation('interactive_task_graph', language, 'Interactive Agent Task Graph')}
            </span>
            <span className="text-xs text-slate-300 font-mono">
              {getTranslation('click_agent_inspect', language, 'Click any agent to inspect rules & input/output payload')}
            </span>
          </div>

          {/* Connected Network Pipeline Render */}
          <div className="space-y-4 py-2">
            
            {/* Level 1: Intent & Planning */}
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {getTranslation('stage_01_title', language, 'STAGE 01 · QUERY DECOMPOSITION')}
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {DAG_AGENTS.filter((a) => a.id === 'planner').map((agent) => (
                  <AgentNodeCard
                    key={agent.id}
                    agent={agent}
                    state={agentStates[agent.id] ?? 'COMPLETED'}
                    isSelected={selectedAgent.id === agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    language={language}
                  />
                ))}
              </div>
            </div>

            {/* Connecting Flow Arrow */}
            <div className="flex items-center justify-center text-slate-400 text-xs sm:text-sm font-mono font-semibold">
              <span>{getTranslation('fanout_telemetry', language, '▼ Concurrent Telemetry Retrieval Fan-Out')}</span>
            </div>

            {/* Level 2: Concurrent Data Ingestion (Discovery, Weather, Ocean, Alert, GIS) */}
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {getTranslation('stage_02_title', language, 'STAGE 02 · CONCURRENT SATELLITE & SENSOR INGESTION')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {DAG_AGENTS.filter((a) => ['discovery', 'weather', 'ocean', 'alert', 'gis'].includes(a.id)).map((agent) => (
                  <AgentNodeCard
                    key={agent.id}
                    agent={agent}
                    state={agentStates[agent.id] ?? 'COMPLETED'}
                    isSelected={selectedAgent.id === agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    language={language}
                  />
                ))}
              </div>
            </div>

            {/* Connecting Flow Arrow */}
            <div className="flex items-center justify-center text-slate-400 text-xs sm:text-sm font-mono font-semibold">
              <span>{getTranslation('fanout_biogeochemical', language, '▼ Biogeochemical & Trajectory Convergence')}</span>
            </div>

            {/* Level 3: Ocean Modeling & Predictive Trajectory */}
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {getTranslation('stage_03_title', language, 'STAGE 03 · OCEAN DYNAMICS & PREDICTIVE KINEMATICS')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DAG_AGENTS.filter((a) => ['pfz', 'trajectory'].includes(a.id)).map((agent) => (
                  <AgentNodeCard
                    key={agent.id}
                    agent={agent}
                    state={agentStates[agent.id] ?? 'COMPLETED'}
                    isSelected={selectedAgent.id === agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    language={language}
                  />
                ))}
              </div>
            </div>

            {/* Connecting Flow Arrow */}
            <div className="flex items-center justify-center text-slate-400 text-xs sm:text-sm font-mono font-semibold">
              <span>{getTranslation('fanout_safety_matrix', language, '▼ Deterministic Multi-Factor Safety Matrix')}</span>
            </div>

            {/* Level 4: Risk, Routing & Physical Verification */}
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {getTranslation('stage_04_title', language, 'STAGE 04 · MULTI-FACTOR CONSENSUS & COMPLIANCE')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DAG_AGENTS.filter((a) => ['risk', 'route', 'verification'].includes(a.id)).map((agent) => (
                  <AgentNodeCard
                    key={agent.id}
                    agent={agent}
                    state={agentStates[agent.id] ?? 'COMPLETED'}
                    isSelected={selectedAgent.id === agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    language={language}
                  />
                ))}
              </div>
            </div>

            {/* Connecting Flow Arrow */}
            <div className="flex items-center justify-center text-slate-400 text-xs sm:text-sm font-mono font-semibold">
              <span>{getTranslation('fanout_synthesis', language, '▼ Multilingual Synthesis & Provenance Sign-Off')}</span>
            </div>

            {/* Level 5: Visualization & Vernacular Synthesis */}
            <div className="space-y-1.5">
              <div className="text-xs sm:text-sm font-mono text-cyan-400 uppercase tracking-wider font-bold">
                {getTranslation('stage_05_title', language, 'STAGE 05 · VERNACULAR EVIDENCE GENERATION')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DAG_AGENTS.filter((a) => ['visualization', 'explanation'].includes(a.id)).map((agent) => (
                  <AgentNodeCard
                    key={agent.id}
                    agent={agent}
                    state={agentStates[agent.id] ?? 'COMPLETED'}
                    isSelected={selectedAgent.id === agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    language={language}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Summary Bar */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono text-slate-300">
            <span>Orchestration Topology: 13 Total Agents (11 Core + Trajectory + Verification)</span>
            <span className="text-cyan-400 font-bold">100% Deterministic Reproducibility</span>
          </div>

        </div>

        {/* Right Area: Streaming Event Console & Agent Inspector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-0 lg:h-full bg-[#111726] overflow-visible lg:overflow-hidden">
          
          {/* Agent Node Inspector (Top Half) */}
          <div className="p-5 sm:p-6 border-b border-[#5379AE]/25 space-y-4 bg-[#141b2e] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs uppercase font-bold">
                  {selectedAgent.category}
                </span>
                <h3 className="font-bold text-white text-base sm:text-lg">{selectedAgent.name}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${getStatusBadge(agentStates[selectedAgent.id] ?? 'COMPLETED')}`}>
                {agentStates[selectedAgent.id] ?? 'COMPLETED'}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {selectedAgent.role}
            </p>

            {/* Provider and Formula Details */}
            <div className="space-y-2.5 text-xs sm:text-sm font-mono">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-xs sm:text-sm text-slate-400 block uppercase font-bold tracking-wider">
                  {getTranslation('data_source_provider', language, 'DATA SOURCE / PROVIDER')}
                </span>
                <span className="text-white text-sm sm:text-base flex items-center gap-2 mt-1.5 font-sans font-medium">
                  <Database className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  {selectedAgent.provider}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-xs sm:text-sm text-slate-400 block uppercase font-bold tracking-wider">
                  {getTranslation('governing_equation', language, 'GOVERNING EQUATION / HEURISTIC')}
                </span>
                <code className="text-cyan-300 text-xs sm:text-sm block mt-1.5 overflow-x-auto leading-relaxed font-semibold">
                  {selectedAgent.equation}
                </code>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-xs sm:text-sm text-slate-400 block uppercase font-bold tracking-wider">
                  {getTranslation('live_telemetry_output', language, 'LIVE TELEMETRY OUTPUT')}
                </span>
                <span className="text-emerald-300 text-xs sm:text-sm block mt-1.5 font-sans leading-relaxed font-medium">
                  {selectedAgent.sampleOutput}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Streaming Event Console (Bottom Half) */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#0c101a]">
            <div className="px-4 py-3 bg-[#121827] border-b border-white/5 flex items-center justify-between text-xs sm:text-sm font-mono">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{getTranslation('live_event_console', language, 'Live Event Stream Console')}</span>
              </div>
              <span className="text-xs text-slate-400">
                {streamLogs.length} {getTranslation('events_logged', language, 'events logged')}
              </span>
            </div>

            <div
              ref={logContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-2.5 font-mono text-xs sm:text-sm select-text"
            >
              {streamLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm space-y-2">
                  <Terminal className="w-8 h-8 text-slate-500" />
                  <span>{getTranslation('click_to_stream_events', language, 'Click "Run Live DAG Pipeline" above to stream agent events.')}</span>
                </div>
              ) : (
                streamLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all ${
                      log.state === 'RUNNING'
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : log.state === 'COMPLETED'
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-bold text-white text-xs sm:text-sm">{log.agentName}</span>
                      <span>{log.timestamp} {log.durationMs && `(${log.durationMs}ms)`}</span>
                    </div>
                    <div className="text-slate-100 font-sans text-xs sm:text-sm">
                      {log.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

// Reusable card for each agent in the topological graph
const AgentNodeCard: React.FC<{
  agent: DAGAgentNode;
  state: 'IDLE' | 'PENDING' | 'RUNNING' | 'COMPLETED' | 'ERROR';
  isSelected: boolean;
  onClick: () => void;
  language?: string;
}> = ({ agent, state, isSelected, onClick, language = 'en' }) => {
  const getBorder = () => {
    if (isSelected) return 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] bg-[#1a2336]';
    if (state === 'RUNNING') return 'border-amber-400 bg-amber-950/20 shadow-[0_0_12px_rgba(251,191,36,0.3)]';
    if (state === 'COMPLETED') return 'border-[#5379AE]/35 bg-[#141b2a] hover:border-cyan-500/60';
    return 'border-white/5 bg-[#101522] opacity-60';
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between ${getBorder()}`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="font-bold text-sm sm:text-base text-white truncate">{agent.name}</span>
        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono">
          {state === 'RUNNING' && <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />}
          {state === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="text-slate-300 font-semibold">{agent.latencyMs}ms</span>
        </span>
      </div>

      <div className="text-xs sm:text-sm text-slate-300 truncate font-normal mb-1.5 leading-snug">
        {agent.role}
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 pt-1.5 border-t border-white/5">
        <span className="truncate max-w-[140px] text-slate-300">{agent.provider.split(' ')[0]}</span>
        <span className="text-cyan-400 font-bold uppercase">{agent.category}</span>
      </div>
    </div>
  );
};
