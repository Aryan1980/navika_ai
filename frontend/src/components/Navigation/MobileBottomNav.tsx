import React from 'react';
import {
  LayoutDashboard,
  Navigation,
  Fish,
  Layers,
  Sparkles,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/translations';

interface MobileBottomNavProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onOpenMobileDrawer: () => void;
  isMobileDrawerOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeNav,
  setActiveNav,
  onOpenMobileDrawer,
  isMobileDrawerOpen
}) => {
  const { pfzs, routeComparison, language } = useApp();

  const navItems = [
    {
      id: 'map',
      label: getTranslation('nav_dashboard', language)?.split(' ')[0] || 'Map',
      icon: LayoutDashboard,
      badge: undefined
    },
    {
      id: 'route',
      label: getTranslation('nav_route', language)?.split(' ')[0] || 'Route',
      icon: Navigation,
      badge: routeComparison ? '●' : undefined
    },
    {
      id: 'spots',
      label: getTranslation('nav_spots', language)?.split(' ')[0] || 'Spots',
      icon: Fish,
      badge: pfzs.length > 0 ? String(pfzs.length) : undefined
    },
    {
      id: 'analytics',
      label: getTranslation('nav_analytics', language)?.split(' ')[0] || 'Telemetry',
      icon: Layers,
      badge: undefined
    },
    {
      id: 'assistant',
      label: 'AI Helm',
      icon: Sparkles,
      badge: undefined
    }
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-17 bg-[#121622]/95 backdrop-blur-xl border-t border-[#384959]/80 flex items-center justify-around px-1 select-none shadow-[0_-8px_25px_rgba(0,0,0,0.6)] safe-area-bottom"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.id && !isMobileDrawerOpen;

        return (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 h-full relative transition-all duration-150 active:scale-95 cursor-pointer ${
              isActive
                ? 'text-[#88BDF2]'
                : 'text-[#BDDDFC]/70 hover:text-[#BDDDFC]'
            }`}
          >
            {/* Active Indicator Top Glow */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#88BDF2] rounded-b-full shadow-[0_0_10px_#88BDF2]" />
            )}

            <div className="relative">
              <Icon className={`w-5.5 h-5.5 transition-transform ${isActive ? 'scale-110 text-[#88BDF2]' : ''}`} />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#0474C4] text-white text-[10px] font-mono font-bold flex items-center justify-center border border-[#88BDF2]/40">
                  {item.badge}
                </span>
              )}
            </div>

            <span className={`text-[11.5px] tracking-tight mt-1 font-medium truncate max-w-[62px] ${isActive ? 'font-bold text-white' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Menu / Drawer Toggle */}
      <button
        onClick={onOpenMobileDrawer}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 h-full relative transition-all duration-150 active:scale-95 cursor-pointer ${
          isMobileDrawerOpen
            ? 'text-[#88BDF2]'
            : 'text-[#BDDDFC]/70 hover:text-[#BDDDFC]'
        }`}
        title="More Options, Settings & Captain Profile"
      >
        {isMobileDrawerOpen && (
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#88BDF2] rounded-b-full shadow-[0_0_10px_#88BDF2]" />
        )}
        <div className="relative">
          <Menu className={`w-5.5 h-5.5 ${isMobileDrawerOpen ? 'scale-110 text-[#88BDF2]' : ''}`} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
        </div>
        <span className={`text-[11.5px] tracking-tight mt-1 font-medium ${isMobileDrawerOpen ? 'font-bold text-white' : ''}`}>
          Menu
        </span>
      </button>
    </nav>
  );
};
