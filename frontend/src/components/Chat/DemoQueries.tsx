import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles } from 'lucide-react';

export interface DemoPreset {
  id: string;
  tag: string;
  query: string;
  badgeColor: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'pfz_near',
    tag: 'PFZ DISCOVERY',
    query: 'Where is the nearest PFZ?',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'
  },
  {
    id: 'safety_check',
    tag: 'SAFETY VERDICT',
    query: 'Is it safe to go fishing tomorrow morning?',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
  },
  {
    id: 'meteo',
    tag: 'METEOROLOGY',
    query: 'What are the wave and wind conditions?',
    badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10'
  },
  {
    id: 'satellite',
    tag: 'OCEANSAT-3',
    query: 'Show areas with high chlorophyll and favourable SST',
    badgeColor: 'border-teal-500/40 text-teal-300 bg-teal-500/10'
  },
  {
    id: 'safest_pfz',
    tag: 'RANKED PFZ',
    query: 'Which PFZ is safest?',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
  },
  {
    id: 'route',
    tag: 'A* ROUTING',
    query: 'Find a safe route to the nearest PFZ',
    badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-500/10'
  },
  {
    id: 'alerts',
    tag: 'CYCLONE ALERT',
    query: 'Are there any cyclone or lightning alerts?',
    badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10'
  },
  {
    id: 'imbl',
    tag: 'BORDER GEOFENCE',
    query: 'Am I approaching a restricted area?',
    badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-500/10'
  },
  {
    id: 'kannada',
    tag: 'ಕನ್ನಡ VERNACULAR',
    query: 'ಮೀನುಗಾರಿಕೆ ಸುರಕ್ಷಿತವೇ?',
    badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10'
  },
  {
    id: 'sst_anomaly',
    tag: 'MOSDAC HDF5',
    query: 'Historical SST Anomaly Detection in Gulf of Mannar',
    badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10'
  },
  {
    id: 'species',
    tag: 'SPECIES PFZ',
    query: 'PFZ Multi-Species Comparison: Tuna vs Pelagics Catch Probability',
    badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
  },
  {
    id: 'offline',
    tag: 'OFFLINE CACHE',
    query: 'Offline Cache Fallback Check: Verify Indexed Marine Telemetry',
    badgeColor: 'border-slate-500/40 text-slate-300 bg-slate-500/10'
  }
];

export const DemoQueries: React.FC = () => {
  const { sendQuery, isAnalyzing } = useApp();

  return (
    <div className="w-full pb-2">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 px-1">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>12 SIH 2026 Judge Scenario Presets:</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
        {DEMO_PRESETS.map((p) => (
          <button
            key={p.id}
            disabled={isAnalyzing}
            onClick={() => sendQuery(p.query)}
            className="flex-shrink-0 flex items-center gap-1.5 text-left text-xs px-3 py-1.5 rounded-xl bg-[#1d2334] hover:bg-[#252f45] border border-[#5379AE]/30 hover:border-cyan-400/60 text-slate-200 hover:text-white transition-all duration-150 whitespace-nowrap disabled:opacity-40 cursor-pointer shadow-sm group"
          >
            <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold border ${p.badgeColor}`}>
              {p.tag}
            </span>
            <span className="font-medium group-hover:text-cyan-200 transition-colors">
              {p.query}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
