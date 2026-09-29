import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Fish,
  Sparkles,
  Settings,
  LogOut,
  Compass,
  Navigation,
  User,
  Phone,
  Anchor,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, onOpenSettings }) => {
  const {
    activeLocationName,
    resetLocation,
    logout,
    pfzs,
    routeComparison,
    user,
    voyages,
    language,
    setIsAuthModalOpen,
    setIsProfileModalOpen
  } = useApp();

  const navItems = [
    { id: 'map', label: getTranslation('nav_dashboard', language) || 'Dashboard & Satellite', icon: LayoutDashboard },
    { id: 'route', label: getTranslation('nav_route', language) || 'Route Planner', icon: Navigation, badge: routeComparison ? 'Active' : undefined },
    { id: 'analytics', label: getTranslation('nav_analytics', language) || 'Location Analytics', icon: Layers },
    { id: 'spots', label: getTranslation('nav_spots', language) || 'Fishing Spots & Routes', icon: Fish, badge: pfzs.length },
    { id: 'assistant', label: getTranslation('nav_assistant', language) || 'AI Helmsman Assistant', icon: Sparkles },
    { id: 'observability', label: '11-Agent AI DAG', icon: Cpu, badge: '11' },
  ];

  return (
    <aside className="w-64 bg-[#1E2632] border-r border-[#384959] flex flex-col justify-between p-3.5 select-none min-h-screen text-[#BDDDFC] flex-shrink-0 z-40 font-sans overflow-hidden">
      
      {/* ── Top Section ── */}
      <div className="space-y-3 min-w-0">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#384959] border border-[#6A89A7]/40 flex items-center justify-center text-[#88BDF2] shadow-sm">
              <Compass className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight block leading-tight">SamudraAI</span>
              <span className="text-[10px] text-[#6A89A7] font-mono tracking-wider block">
                {getTranslation('maritime_platform', language)}
              </span>
            </div>
          </div>
        </div>

        {/* Vessel Status Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#2A3644] border border-[#384959] shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-[#384959] border border-[#6A89A7]/40 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                🚢
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#88BDF2] border-2 border-[#2A3644]" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="font-semibold text-xs text-white block leading-tight truncate">
                {getTranslation('active_vessel', language)}
              </span>
              <span className="text-[11px] text-[#BDDDFC] font-mono truncate block">
                {activeLocationName.split(',')[0]}
              </span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#88BDF2] animate-pulse flex-shrink-0 ml-1" title={getTranslation('telemetry_live', language)} />
        </div>

        {/* Captain Profile / Phone Sign-In Card - Compact & Contained */}
        {user ? (
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full text-left p-2 rounded-xl bg-[#222c38] hover:bg-[#2A3644] border border-[#6A89A7]/40 hover:border-[#88BDF2]/60 transition-all flex items-center justify-between gap-1.5 group shadow-sm min-w-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#384959] border border-[#88BDF2]/50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#88BDF2]">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="font-semibold text-xs text-white block leading-tight group-hover:text-[#BDDDFC] truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#6A89A7] font-mono block truncate">
                  {user.vessel_name.split(' ')[0]} · {voyages.length} {getTranslation('logged_count', language)}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#384959] text-[#88BDF2] border border-[#6A89A7]/30 flex-shrink-0">
              {getTranslation('logged_badge', language)}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-[#222c38] to-[#2a3646] hover:from-[#2a3646] hover:to-[#384959] border border-[#88BDF2]/30 hover:border-[#88BDF2] transition-all flex items-center justify-between group shadow-sm min-w-0 overflow-hidden"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#384959] border border-[#88BDF2]/50 flex-shrink-0 flex items-center justify-center text-[#88BDF2]">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="font-semibold text-xs text-white block leading-tight group-hover:text-[#BDDDFC] truncate">
                  {getTranslation('captain_sign_in', language)}
                </span>
                <span className="text-[10px] text-[#6A89A7] block truncate">
                  {getTranslation('sync_voyages', language)}
                </span>
              </div>
            </div>
            <span className="text-xs text-[#88BDF2] group-hover:translate-x-0.5 transition-transform font-bold flex-shrink-0">
              →
            </span>
          </button>
        )}

        {/* ── Main Navigation Items (Image 2 Style with Zero Outline Flash) ── */}
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none ${
                  isActive
                    ? 'bg-[#384959] text-white font-medium border border-[#88BDF2]/40 shadow-sm'
                    : 'border border-transparent text-[#BDDDFC]/80 hover:text-white hover:bg-[#384959]/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#88BDF2]' : 'text-[#6A89A7]'}`} />
                  <span className="tracking-tight truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-xs font-mono rounded-full font-bold flex-shrink-0 ${
                    isActive
                      ? 'bg-[#88BDF2]/20 text-[#BDDDFC] border border-[#88BDF2]/40'
                      : 'bg-[#384959]/50 text-[#BDDDFC]/70'
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
      <div className="pt-3 border-t border-[#384959] space-y-1">
        
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm border border-transparent text-[#BDDDFC]/80 hover:text-white hover:bg-[#384959]/40 transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none"
        >
          <Settings className="w-4 h-4 text-[#6A89A7] flex-shrink-0" />
          <span className="truncate">{getTranslation('settings_overlays', language)}</span>
        </button>

        {/* Option 1: Change Port / Location (keeps captain logged in, goes to Step 2) */}
        <button
          onClick={resetLocation}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm border border-transparent text-[#BDDDFC]/85 hover:text-white hover:bg-[#384959]/50 transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none group"
          title={getTranslation('change_location_button', language)}
        >
          <Anchor className="w-4 h-4 text-[#88BDF2] flex-shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="truncate">{getTranslation('change_location_button', language)}</span>
        </button>

        {/* Option 2: Sign Out (clears session, returns to Step 1 Sign-in) */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm border border-transparent text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/15 transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none group"
          title={getTranslation('sign_out_button', language)}
        >
          <LogOut className="w-4 h-4 text-rose-400 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          <span className="truncate">{getTranslation('sign_out_button', language)}</span>
        </button>
      </div>

    </aside>
  );
};

