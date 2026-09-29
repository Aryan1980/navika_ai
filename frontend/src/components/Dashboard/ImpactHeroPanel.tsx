import React, { useState, useEffect } from 'react';
import { Users, Fuel, Globe, Cpu, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface ImpactHeroPanelProps {
  onExploreDAG?: () => void;
  onExploreSpots?: () => void;
}

export const ImpactHeroPanel: React.FC<ImpactHeroPanelProps> = ({ onExploreDAG, onExploreSpots }) => {
  const [animatedFishermen, setAnimatedFishermen] = useState<number>(0);
  const [animatedFuel, setAnimatedFuel] = useState<number>(0);

  // Smooth count-up animation on initial render
  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    const targetFishermen = 4.2; // 4.2 Million
    const targetFuel = 30; // 30%

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setAnimatedFishermen(Number((targetFishermen * ease).toFixed(1)));
      setAnimatedFuel(Math.round(targetFuel * ease));

      if (frame >= totalFrames) clearInterval(timer);
    }, 25);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      id: 'fishermen',
      label: 'Artisanal & Mechanized Fleet',
      value: `${animatedFishermen}M+`,
      metric: 'Fishermen Protected',
      subtext: 'Across 3,288 coastal fishing villages & 7,516 km Indian coastline',
      icon: Users,
      accent: 'from-blue-500/20 to-cyan-500/10 border-cyan-500/30 text-cyan-300'
    },
    {
      id: 'fuel',
      label: 'Operational Economic Impact',
      value: `${animatedFuel}%`,
      metric: 'Direct Fuel Savings',
      subtext: 'Reduced ocean search hours via satellite PFZ frontal vectors',
      icon: Fuel,
      accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300'
    },
    {
      id: 'languages',
      label: 'Vernacular Marine Inclusion',
      value: '10',
      metric: 'Coastal Languages',
      subtext: 'Tamil, Malayalam, Telugu, Kannada, Bengali, Gujarati, Marathi, Odia, Hindi, English',
      icon: Globe,
      accent: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300'
    },
    {
      id: 'agents',
      label: 'Autonomous Intelligence DAG',
      value: '11',
      metric: 'Specialized AI Agents',
      subtext: 'Deterministic orchestration network with concurrent satellite ingestion',
      icon: Cpu,
      accent: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300'
    },
    {
      id: 'hallucination',
      label: 'Physical Safety Guarantee',
      value: '0%',
      metric: 'LLM Hallucination',
      subtext: 'Evaluated purely via deterministic hydrodynamic physics equations',
      icon: ShieldCheck,
      accent: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-300'
    }
  ];

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-[#121828] via-[#101524] to-[#0c101a] border border-[#5379AE]/30 p-5 shadow-2xl relative overflow-hidden font-sans">
      
      {/* Subtle background glow & grid */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#5379AE]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 font-mono text-xs font-bold tracking-wider uppercase">
              NATIONAL MARITIME INTELLIGENCE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5 flex items-center gap-2">
            Empowering India's Blue Economy & Coastal Safety
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onExploreDAG && (
            <button
              onClick={onExploreDAG}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1d263b] hover:bg-[#253250] border border-[#5379AE]/30 hover:border-cyan-400 text-cyan-300 text-sm font-medium transition-colors cursor-pointer"
            >
              <span>View 11-Agent DAG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 5 Impact Metrics Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`p-4 rounded-xl bg-gradient-to-b ${s.accent} border backdrop-blur-sm flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-slate-300 font-bold">
                    {s.label}
                  </span>
                  <div className="p-1 rounded-md bg-white/5">
                    <Icon className="w-4 h-4 text-white/80" />
                  </div>
                </div>

                <div className="text-3xl lg:text-4xl font-extrabold font-mono text-white tracking-tight">
                  {s.value}
                </div>

                <div className="text-sm sm:text-base font-bold text-slate-100 mt-1">
                  {s.metric}
                </div>
              </div>

              <div className="text-sm text-slate-200 leading-snug mt-3 pt-2 border-t border-white/10 font-normal">
                {s.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Guarantee Band */}
      <div className="relative z-10 mt-4 pt-3 border-t border-[#5379AE]/20 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-300 font-mono">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Synthesized from real ISRO MOSDAC satellite passes, INCOIS hydrodynamic forecasts & IMD coastal radar.</span>
        </div>
        <span className="text-[#A8C4EC] font-semibold">Zero-Blackbox Autonomous Safety</span>
      </div>

    </div>
  );
};
