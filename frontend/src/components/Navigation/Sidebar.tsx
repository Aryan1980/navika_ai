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
  Cpu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenSettings: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, onOpenSettings, onClose }) => {
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
    { id: 'observability', label: getTranslation('nav_dag', language) || '11-Agent AI DAG', icon: Cpu, badge: '11' },
  ];

  return (
    <aside className="w-full md:w-68 lg:w-70 bg-[#1E2632] border-r border-[#384959] flex flex-col justify-between p-3.5 select-none h-full md:min-h-screen text-[#BDDDFC] flex-shrink-0 z-40 font-sans overflow-y-auto">
      
      {/* ── Top Section ── */}
      <div className="space-y-3.5 min-w-0">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#384959] border border-[#6A89A7]/40 flex items-center justify-center text-[#88BDF2] shadow-sm">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight block leading-tight">NavikaAI</span>
              <span className="text-xs text-[#6A89A7] font-mono tracking-wider block">
                {getTranslation('maritime_platform', language)}
              </span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-xl bg-[#2A3644] hover:bg-[#384959] text-[#BDDDFC] hover:text-white transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Vessel Status Card */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#2A3644] border border-[#384959] shadow-sm min-w-0 overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#384959] border border-[#6A89A7]/40 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                🚢
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#88BDF2] border-2 border-[#2A3644]" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="font-semibold text-sm text-white block leading-tight truncate">
                {getTranslation('active_vessel', language)}
              </span>
              <span className="text-xs text-[#BDDDFC] font-mono truncate block mt-0.5">
                {activeLocationName?.split(',')[0] || activeLocationName || ''}
              </span>
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#88BDF2] animate-pulse flex-shrink-0 ml-1" title={getTranslation('telemetry_live', language)} />
        </div>

        {/* Captain Profile / Phone Sign-In Card */}
        {user ? (
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full text-left p-2.5 rounded-xl bg-[#222c38] hover:bg-[#2A3644] border border-[#6A89A7]/40 hover:border-[#88BDF2]/60 transition-all flex items-center justify-between gap-2 group shadow-sm min-w-0 overflow-hidden"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#384959] border border-[#88BDF2]/50 flex-shrink-0 flex items-center justify-center text-sm font-bold text-[#88BDF2]">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="font-semibold text-sm text-white block leading-tight group-hover:text-[#BDDDFC] truncate">
                  {user.name}
                </span>
                <span className="text-xs text-[#6A89A7] font-mono block truncate mt-0.5">
                  {user.vessel_name?.split(' ')[0] || user.vessel_name || ''} · {voyages.length} {getTranslation('logged_count', language)}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#384959] text-[#88BDF2] border border-[#6A89A7]/30 flex-shrink-0">
              {getTranslation('logged_badge', language)}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-[#222c38] to-[#2a3646] hover:from-[#2a3646] hover:to-[#384959] border border-[#88BDF2]/30 hover:border-[#88BDF2] transition-all flex items-center justify-between group shadow-sm min-w-0 overflow-hidden"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#384959] border border-[#88BDF2]/50 flex-shrink-0 flex items-center justify-center text-[#88BDF2]">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <span className="font-semibold text-sm text-white block leading-tight group-hover:text-[#BDDDFC] truncate">
                  {getTranslation('captain_sign_in', language)}
                </span>
                <span className="text-xs text-[#6A89A7] block truncate mt-0.5">
                  {getTranslation('sync_voyages', language)}
                </span>
              </div>
            </div>
            <span className="text-sm text-[#88BDF2] group-hover:translate-x-0.5 transition-transform font-bold flex-shrink-0">
              →
            </span>
          </button>
        )}

        {/* ── Main Navigation Items ── */}
        <nav className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-base transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none ${
                  isActive
                    ? 'bg-[#384959] text-white font-semibold border border-[#88BDF2]/40 shadow-sm'
                    : 'border border-transparent text-[#BDDDFC]/80 hover:text-white hover:bg-[#384959]/40 font-medium'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#88BDF2]' : 'text-[#6A89A7]'}`} />
                  <span className="tracking-tight truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`px-2.5 py-0.5 text-xs font-mono rounded-full font-bold flex-shrink-0 ${
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
          onClick={() => {
            onOpenSettings();
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm sm:text-base border border-transparent text-[#BDDDFC]/85 hover:text-white hover:bg-[#384959]/40 transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none"
        >
          <Settings className="w-5 h-5 text-[#6A89A7] flex-shrink-0" />
          <span className="truncate">{getTranslation('settings_overlays', language)}</span>
        </button>

        {/* Option 1: Change Port / Location */}
        <button
          onClick={() => {
            resetLocation();
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm sm:text-base border border-transparent text-[#BDDDFC]/90 hover:text-white hover:bg-[#384959]/50 transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none group"
          title={getTranslation('change_location_button', language)}
        >
          <Anchor className="w-5 h-5 text-[#88BDF2] flex-shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="truncate">{getTranslation('change_location_button', language)}</span>
        </button>

        {/* Option 2: Sign Out */}
        <button
          onClick={() => {
            logout();
            onClose?.();
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm sm:text-base border border-transparent text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/15 transition-colors duration-150 cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none group"
          title={getTranslation('sign_out_button', language)}
        >
          <LogOut className="w-5 h-5 text-rose-400 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          <span className="truncate">{getTranslation('sign_out_button', language)}</span>
        </button>
      </div>

    </aside>
  );
};

