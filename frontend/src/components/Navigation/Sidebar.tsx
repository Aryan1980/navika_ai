import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Fish,
  Sparkles,
  Settings,
  LogOut,
  Compass,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, onOpenSettings }) => {
  const { activeLocationName, resetLocation, pfzs } = useApp();

  const navItems = [
    { id: 'map', label: 'Dashboard & Satellite', icon: LayoutDashboard },
    { id: 'analytics', label: 'Location Analytics', icon: Layers },
    { id: 'spots', label: 'Fishing Spots & Routes', icon: Fish, badge: pfzs.length },
    { id: 'assistant', label: 'AI Helmsman Assistant', icon: Sparkles },
    { id: 'observability', label: '11-Agent AI DAG', icon: Cpu, badge: '11' },
  ];

  return (
    <aside className="w-64 bg-[#111520] border-r border-[#5379AE]/20 flex flex-col justify-between p-3.5 select-none min-h-screen text-[#A8C4EC] flex-shrink-0 z-40 font-sans">
      
      {/* ── Top Section ── */}
      <div className="space-y-4">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#06457F] border border-[#5379AE]/40 flex items-center justify-center text-white shadow-[0_2px_10px_rgba(4,116,196,0.3)]">
              <Compass className="w-4 h-4 text-[#A8C4EC] stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight block leading-tight">SamudraAI</span>
            </div>
          </div>
        </div>

        {/* Vessel Status Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#171d2b] border border-[#5379AE]/20 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#262B40] border border-[#5379AE]/35 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                🚢
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#171d2b]" />
            </div>
            <div>
              <span className="font-semibold text-xs text-white block leading-tight">Active Vessel</span>
              <span className="text-[11px] text-[#A8C4EC]/85 font-mono truncate max-w-[125px] block">
                {activeLocationName.split(',')[0]}
              </span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Telemetry Live" />
        </div>

        {/* ── Main Navigation Items (Image 2 Style with Zero Outline Flash) ── */}
        <nav className="space-y-1 pt-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none ${
                  isActive
                    ? 'bg-[#1e2538] text-white font-medium border border-[#5379AE]/35 shadow-sm'
                    : 'border border-transparent text-[#8fa2bf] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6c7f9d]'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-xs font-mono rounded-full font-bold ${
                    isActive
                      ? 'bg-[#0474C4]/25 text-[#A8C4EC] border border-[#0474C4]/40'
                      : 'bg-white/5 text-[#8fa2bf]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* ── Bottom Section: Settings & Change Port ── */}
      <div className="pt-3 border-t border-[#5379AE]/20 space-y-1">
        
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm border border-transparent text-[#8fa2bf] hover:text-white hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none"
        >
          <Settings className="w-4 h-4 text-[#6c7f9d]" />
          <span>Settings & Overlays</span>
        </button>

        {/* Change Port Button */}
        <button
          onClick={resetLocation}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm border border-transparent text-[#e59883] hover:text-white hover:bg-rose-500/10 transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none"
        >
          <LogOut className="w-4 h-4 text-[#e59883]" />
          <span className="truncate">Switch Port ({activeLocationName.split(',')[0]})</span>
        </button>
      </div>

    </aside>
  );
};
