import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { MarineMap } from './components/Map/MarineMap';
import { LocationAnalyticsView } from './components/Dashboard/LocationAnalyticsView';
import { FishingSpotsView } from './components/Dashboard/FishingSpotsView';
import { AIAssistantView } from './components/Chat/AIAssistantView';
import { AgentStreamingDAGView } from './components/Observability/AgentStreamingDAGView';
import { SettingsModal } from './components/Dashboard/SettingsModal';
import { EmergencySOSModal } from './components/Emergency/EmergencySOSModal';
import { AdvisoryBulletinModal } from './components/Advisory/AdvisoryBulletinModal';
import { LocationSetupView } from './components/Onboarding/LocationSetupView';
import { RoutePlannerPanel } from './components/Navigation/RoutePlannerPanel';
import { PhoneAuthModal } from './components/Auth/PhoneAuthModal';
import { CaptainProfileModal } from './components/Profile/CaptainProfileModal';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sun, MapPin, Layers, ShieldAlert, FileText, Cpu, User, Phone, Globe, Menu } from 'lucide-react';
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
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const tempVal = weather?.temperature_c ?? 28.4;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1E2632] text-[#F8FAFC] selection:bg-[#88BDF2]/30 selection:text-[#BDDDFC] font-sans">
      
      {/* ── 1. Left Vertical Navigation Rail (Desktop) ── */}
      <div className="hidden md:flex flex-shrink-0 h-full">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* ── 1b. Mobile Off-Canvas Drawer (Slide-Over) ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Container */}
          <div className="relative w-[280px] max-w-[85vw] h-full bg-[#1E2632] z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <Sidebar
              activeNav={activeNav}
              setActiveNav={(nav) => {
                setActiveNav(nav);
                setIsMobileMenuOpen(false);
              }}
              onOpenSettings={() => {
                setIsSettingsOpen(true);
                setIsMobileMenuOpen(false);
              }}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── 2. Modals (Settings, SOS Emergency, Advisory Bulletin) ── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      <AdvisoryBulletinModal
        isOpen={isAdvisoryOpen}
        onClose={() => setIsAdvisoryOpen(false)}
      />
      {/* ── 3. Main Viewport Area ── */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden relative">

        {/* ── Top Shared Minimalist Header Bar ── */}
        <header className="px-3.5 sm:px-6 bg-[#242E3B] border-b border-[#384959] z-20 flex-shrink-0 shadow-sm">
          {/* Desktop single row: hidden on mobile (<md), flex on md+ */}
          <div className="hidden md:flex h-16 items-center justify-between gap-3">
            {/* Left: Breadcrumb */}
            <div className="flex items-center gap-2.5 text-sm sm:text-base min-w-0">
              <span className="text-[#BDDDFC]/75 font-medium">NavikaAI</span>
              <span className="text-[#6A89A7]">/</span>
              <span className="text-white font-semibold tracking-tight truncate max-w-none text-sm sm:text-base">
                {activeNav === 'map' && (getTranslation('nav_dashboard', language) || 'Satellite Recon & Navigation')}
                {activeNav === 'route' && (getTranslation('nav_route', language) || 'Route Planner')}
                {activeNav === 'analytics' && (getTranslation('nav_analytics', language) || 'Port & Ocean Telemetry')}
                {activeNav === 'spots' && (getTranslation('nav_spots', language) || 'Potential Fishing Grounds & Seaward Routes')}
                {activeNav === 'assistant' && (getTranslation('nav_assistant', language) || 'Conversational AI Helmsman')}
                {activeNav === 'observability' && (getTranslation('nav_dag_breadcrumb', language) || '11-Agent AI DAG & Live Stream')}
              </span>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2 sm:gap-3 text-sm flex-shrink-0">
              {/* Quick Action: Official Advisory PDF */}
              <button
                onClick={() => setIsAdvisoryOpen(true)}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#1E2632] border border-[#384959] hover:border-emerald-400 text-emerald-300 font-medium transition-colors cursor-pointer text-xs sm:text-sm shadow-sm"
                title="Download Official Marine Advisory PDF"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Advisory PDF</span>
              </button>

              {/* Quick Action: SOS 1554 Distress Line */}
              <button
                onClick={() => setIsSOSOpen(true)}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/60 hover:border-rose-400 text-rose-200 font-bold transition-all shadow-[0_0_12px_rgba(244,63,94,0.3)] cursor-pointer text-xs sm:text-sm font-mono"
                title="Indian Coast Guard Emergency (1554)"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>SOS 1554</span>
              </button>

              {/* Language Selector Dropdown */}
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1E2632] border border-[#384959] text-sm">
                <Globe className="w-4 h-4 text-[#88BDF2]" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-[#BDDDFC] text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#1E2632] text-white">
                      {l.flag} {l.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Port Chip */}
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#1E2632] border border-[#384959] text-[#BDDDFC]">
                <MapPin className="w-4 h-4 text-[#88BDF2] flex-shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-[180px] md:max-w-[260px] font-semibold text-white text-xs sm:text-sm">
                  {getLocalizedPortName(activeLocationName, language).split(',')[0]}
                </span>
                <button
                  onClick={() => resetLocation()}
                  className="text-[11px] text-[#88BDF2] hover:text-white underline ml-1 cursor-pointer"
                  title="Change Port"
                >
                  Change
                </button>
              </div>

              {/* Date & Weather Indicator */}
              <div className="flex items-center gap-1.5 text-[#BDDDFC] font-mono hidden lg:flex text-sm">
                <Sun className="w-4.5 h-4.5 text-[#88BDF2]" />
                <span className="font-semibold text-white">{tempVal}°C</span>
                <span className="text-[#6A89A7]">· {getTranslation('sea_normal', language)}</span>
              </div>

              {/* Captain Profile Header Pill */}
              {user ? (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E2632] hover:bg-[#2A3644] border border-[#6A89A7]/50 hover:border-[#88BDF2] text-[#BDDDFC] transition-all shadow-sm cursor-pointer text-xs sm:text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#88BDF2]" />
                  <span className="font-medium text-white">{user.name.split(' ')[0]}</span>
                  <span className="text-xs font-mono text-[#88BDF2] bg-[#2A3644] px-1.5 py-0.5 rounded">
                    {voyages.length} {getTranslation('logged_count', language)}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#384959]/60 hover:bg-[#384959] border border-[#88BDF2]/40 hover:border-[#88BDF2] text-[#BDDDFC] transition-all shadow-sm cursor-pointer text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4 text-[#88BDF2]" />
                  <span className="font-medium text-white">{getTranslation('captain_sign_in', language)}</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile dedicated 2-row layout: visible only on mobile (<md) */}
          <div className="md:hidden py-2 space-y-2">
            {/* Row 1: Hamburger + Navika AI title | Advisory + SOS 1554 */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-1.5 rounded-lg bg-[#1E2632] border border-[#384959] text-[#BDDDFC] hover:text-white transition-colors cursor-pointer flex-shrink-0"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <span className="text-white font-semibold text-sm truncate">
                  NavikaAI
                </span>
                <span className="text-[#6A89A7] text-xs">/</span>
                <span className="text-[#BDDDFC] text-xs font-medium truncate max-w-[110px]">
                  {activeNav === 'map' && 'Recon'}
                  {activeNav === 'route' && 'Route'}
                  {activeNav === 'analytics' && 'Telemetry'}
                  {activeNav === 'spots' && 'PFZ Spots'}
                  {activeNav === 'assistant' && 'AI Helmsman'}
                  {activeNav === 'observability' && 'DAG'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setIsAdvisoryOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E2632] border border-[#384959] text-emerald-300 font-medium text-xs shadow-sm cursor-pointer"
                  title="Advisory"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Advisory</span>
                </button>

                <button
                  onClick={() => setIsSOSOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-500/70 text-rose-200 font-bold text-xs shadow-sm cursor-pointer font-mono"
                  title="SOS 1554"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>SOS 1554</span>
                </button>
              </div>
            </div>

            {/* Row 2: Language Selector Dropdown | Active Port Chip with Change */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#384959]/50">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E2632] border border-[#384959] text-xs flex-shrink-0">
                <Globe className="w-3.5 h-3.5 text-[#88BDF2] flex-shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-[#BDDDFC] text-xs font-medium focus:outline-none cursor-pointer max-w-[90px]"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#1E2632] text-white">
                      {l.flag} {l.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E2632] border border-[#384959] text-[#BDDDFC] text-xs min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#88BDF2] flex-shrink-0" />
                <span className="truncate max-w-[120px] font-semibold text-white text-xs">
                  {getLocalizedPortName(activeLocationName, language).split(',')[0]}
                </span>
                <button
                  onClick={() => resetLocation()}
                  className="text-[10px] text-[#88BDF2] hover:text-white underline ml-1 cursor-pointer flex-shrink-0"
                  title="Change Port"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </header>

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
            <div className="h-full w-full overflow-y-auto p-3 sm:p-6 pb-24 md:pb-6 bg-[#1E2632]">
              <div className="max-w-4xl mx-auto h-full">
                <RoutePlannerPanel />
              </div>
            </div>
          )}

          {/* Option C: Dedicated Location Analytics View */}
          {activeNav === 'analytics' && (
            <div className="h-full w-full overflow-y-auto pb-24 md:pb-0">
              <LocationAnalyticsView
                onOpenAdvisory={() => setIsAdvisoryOpen(true)}
                onOpenDAG={() => setActiveNav('observability')}
              />
            </div>
          )}

          {/* Option D: Dedicated Fishing Spots & Routes View */}
          {activeNav === 'spots' && (
            <div className="h-full w-full overflow-y-auto pb-24 md:pb-0">
              <FishingSpotsView onViewOnMap={() => setActiveNav('map')} />
            </div>
          )}

          {/* Option E: Dedicated AI Assistant View */}
          {activeNav === 'assistant' && (
            <div className="h-full w-full overflow-hidden pb-18 md:pb-0">
              <AIAssistantView onOpenDAG={() => setActiveNav('observability')} />
            </div>
          )}

          {/* Option F: Dedicated 11-Agent AI DAG & Live Stream View */}
          {activeNav === 'observability' && (
            <div className="h-full w-full overflow-hidden pb-18 md:pb-0">
              <AgentStreamingDAGView />
            </div>
          )}

        </div>

      </div>

      {/* Floating Persistent Emergency SOS 1554 Button (Elevated above mobile bottom nav) */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40">
        <button
          onClick={() => setIsSOSOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(244,63,94,0.45)] hover:shadow-[0_0_35px_rgba(244,63,94,0.65)] border border-rose-400/80 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-mono"
          title="Indian Coast Guard Emergency (1554)"
        >
          <ShieldAlert className="w-4 h-4 text-white animate-bounce" />
          <span>🆘 SOS 1554</span>
        </button>
      </div>

      {/* ── Mobile Bottom Navigation Bar (Visible only on <md screens) ── */}
      <MobileBottomNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenMobileDrawer={() => setIsMobileMenuOpen(true)}
        isMobileDrawerOpen={isMobileMenuOpen}
      />

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

