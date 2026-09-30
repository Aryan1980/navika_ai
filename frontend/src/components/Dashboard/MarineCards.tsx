import React from 'react';
import { Thermometer, Droplets, Waves, Wind } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Compact inline metric card - minimal horizontal strip
const Stat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  subColor?: string;
  source?: string;
}> = ({ icon, label, value, unit, sub, subColor = 'text-slate-400', source }) => (
  <div className="flex-1 flex items-center gap-3 px-4 py-2.5 group hover:bg-white/[0.02] transition-colors rounded-xl">
    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-base font-bold font-mono text-white tracking-tight leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-[10px] text-slate-500 font-sans">{unit}</span>
        )}
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-[10px] text-slate-500">{label}</span>
        {sub && <span className={`text-[10px] font-mono ${subColor}`}>{sub}</span>}
      </div>
    </div>
  </div>
);

export const MarineCards: React.FC = () => {
  const { weather, ocean } = useApp();

  if (!weather || !ocean) {
    return (
      <div className="rounded-xl border border-white/[0.07] bg-[#0a0f1c] flex items-center divide-x divide-white/[0.06] animate-pulse h-[56px]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-1 h-full skeleton" />
        ))}
      </div>
    );
  }

  const sst = ocean.sst !== undefined ? `${ocean.sst}` : '28.4';
  const chl = ocean.chlorophyll !== undefined ? `${ocean.chlorophyll}` : '2.4';
  const wave = ocean.wave_height !== undefined ? `${ocean.wave_height}` : `${weather.wave_height_m}`;
  const windKmh = `${weather.wind_speed_kmh}`;
  const windKnots = Math.round(weather.wind_speed_kmh * 0.539957);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0a0f1c] flex items-center divide-x divide-white/[0.06] overflow-hidden">
      <Stat
        icon={<Thermometer className="w-3.5 h-3.5 text-amber-400" />}
        label="Sea Surface Temp"
        value={sst}
        unit="°C"
        sub="ΔT 0.8°C"
        subColor="text-slate-400"
      />
      <Stat
        icon={<Droplets className="w-3.5 h-3.5 text-emerald-400" />}
        label="Chlorophyll-a"
        value={chl}
        unit="mg/m³"
        sub="Optimal"
        subColor="text-emerald-400"
      />
      <Stat
        icon={<Waves className="w-3.5 h-3.5 text-blue-400" />}
        label="Wave Height"
        value={wave}
        unit="m"
        sub={`${weather.wave_direction_deg}° SSW`}
        subColor="text-slate-400"
      />
      <Stat
        icon={<Wind className="w-3.5 h-3.5 text-cyan-400" />}
        label="Surface Wind"
        value={windKmh}
        unit="km/h"
        sub={`${windKnots} kn · G${weather.wind_gust_kmh}`}
        subColor="text-slate-400"
      />
    </div>
  );
};
