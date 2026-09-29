import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { MarineMap } from './components/Map/MarineMap';
import { LocationAnalyticsView } from './components/Dashboard/LocationAnalyticsView';
import { FishingSpotsView } from './components/Dashboard/FishingSpotsView';
import { AIAssistantView } from './components/Chat/AIAssistantView';
import { SettingsModal } from './components/Dashboard/SettingsModal';
import { LocationSetupView } from './components/Onboarding/LocationSetupView';
import { RoutePlannerPanel } from './components/Navigation/RoutePlannerPanel';
import { PhoneAuthModal } from './components/Auth/PhoneAuthModal';
import { CaptainProfileModal } from './components/Profile/CaptainProfileModal';
import { DualSyncModeBanner } from './components/Navigation/DualSyncModeBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sun, MapPin, Layers, User, Phone, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getTranslation } from './utils/translations';
import { getLocalizedPortName } from './utils/locationTranslations';

const DashboardView: React.FC = () => {
  const {
    activeLocationName,
    weather,
    resetLocation,
    activeNav,
    setActiveNav,
    user,
    voyages,
    language,
    setLanguage,
    setIsAuthModalOpen,
    setIsProfileModalOpen
  } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const tempVal = weather?.temperature_c ?? 28.4;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1E2632] text-[#F8FAFC] selection:bg-[#88BDF2]/30 selection:text-[#BDDDFC] font-sans">
      
      {/* ── 1. Left Vertical Navigation Rail ── */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* ── 2. Settings & Overlays Modal ── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* ── 3. Main Viewport Area ── */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden relative">

        {/* ── Top Shared Minimalist Header Bar ── */}
        <header className="h-14 px-6 bg-[#242E3B] border-b border-[#384959] flex items-center justify-between z-20 flex-shrink-0 shadow-sm">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#BDDDFC]/75 font-medium">SamudraAI</span>
            <span className="text-[#6A89A7]">/</span>
            <span className="text-white font-semibold tracking-tight">
              {activeNav === 'map' && getTranslation('nav_dashboard', language)}
              {activeNav === 'route' && getTranslation('nav_route', language)}
              {activeNav === 'analytics' && getTranslation('nav_analytics', language)}
              {activeNav === 'spots' && getTranslation('nav_spots', language)}
              {activeNav === 'assistant' && getTranslation('nav_assistant', language)}
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 text-xs">
            
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E2632] border border-[#384959] text-xs">
              <Globe className="w-3.5 h-3.5 text-[#88BDF2]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[#BDDDFC] text-xs font-medium focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#1E2632] text-white">
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Port Chip */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E2632] border border-[#384959] text-[#BDDDFC]">
              <MapPin className="w-3.5 h-3.5 text-[#88BDF2] flex-shrink-0" />
              <span className="truncate max-w-[150px] sm:max-w-[240px] font-medium text-white text-xs sm:text-sm">
                {getLocalizedPortName(activeLocationName, language)}
              </span>
            </div>

            {/* Date & Weather Indicator */}
            <div className="flex items-center gap-1.5 text-[#BDDDFC] font-mono hidden md:flex">
              <Sun className="w-4 h-4 text-[#88BDF2]" />
              <span className="font-semibold text-white">{tempVal}°C</span>
              <span className="text-[#6A89A7]">· {getTranslation('sea_normal', language)}</span>
            </div>

            {/* Captain Profile Header Pill */}
            {user ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E2632] hover:bg-[#2A3644] border border-[#6A89A7]/50 hover:border-[#88BDF2] text-[#BDDDFC] transition-all shadow-sm cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#88BDF2]" />
                <span className="font-medium text-white">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] font-mono text-[#88BDF2] bg-[#2A3644] px-1.5 py-0.5 rounded">
                  {voyages.length} {getTranslation('logged_count', language)}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#384959]/60 hover:bg-[#384959] border border-[#88BDF2]/40 hover:border-[#88BDF2] text-[#BDDDFC] transition-all shadow-sm cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-[#88BDF2]" />
                <span className="font-medium text-white">{getTranslation('captain_sign_in', language)}</span>
              </button>
            )}
          </div>
        </header>

        {/* ── Dual Sync Mode Indicator Bar ── */}
        <DualSyncModeBanner />

        {/* ── Viewport Contents by Active Tab ── */}
        <div className="flex-1 relative overflow-hidden">
          
          {/* Option A: Dedicated Satellite Map View */}
          <div className={activeNav === 'map' ? 'absolute inset-0 w-full h-full' : 'hidden'}>
            <ErrorBoundary>
              <MarineMap />
            </ErrorBoundary>
          </div>

          {/* Option B: Dedicated Voyage Route Planner View */}
          {activeNav === 'route' && (
            <div className="h-full w-full overflow-y-auto p-4 sm:p-6 bg-[#1E2632]">
              <div className="max-w-4xl mx-auto h-full">
                <RoutePlannerPanel />
              </div>
            </div>
          )}

          {/* Option C: Dedicated Location Analytics View */}
          {activeNav === 'analytics' && (
            <div className="h-full w-full overflow-y-auto">
              <LocationAnalyticsView />
            </div>
          )}

          {/* Option D: Dedicated Fishing Spots & Routes View */}
          {activeNav === 'spots' && (
            <div className="h-full w-full overflow-y-auto">
              <FishingSpotsView onViewOnMap={() => setActiveNav('map')} />
            </div>
          )}

          {/* Option E: Dedicated AI Assistant View */}
          {activeNav === 'assistant' && (
            <div className="h-full w-full overflow-hidden">
              <AIAssistantView />
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

const MainContent: React.FC = () => {
  const { isLocationSelected, user } = useApp();
  // Captain sign-in AND location confirmation are both strictly required before entering main website
  const canAccessDashboard = isLocationSelected && !!user;

  return (
    <>
      {canAccessDashboard ? <DashboardView /> : <LocationSetupView />}
      <PhoneAuthModal />
      <CaptainProfileModal />
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

