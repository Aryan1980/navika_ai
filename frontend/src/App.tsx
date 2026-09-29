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
import { LiveStatusBar } from './components/Header/LiveStatusBar';
import { LocationSetupView } from './components/Onboarding/LocationSetupView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sun, MapPin, Layers, ShieldAlert, FileText, Cpu } from 'lucide-react';

const DashboardView: React.FC = () => {
  const { activeLocationName, weather, resetLocation } = useApp();
  const [activeNav, setActiveNav] = useState<string>('map');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isAdvisoryOpen, setIsAdvisoryOpen] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const tempVal = weather?.temperature_c ?? 28.4;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#151926] text-[#f1f5fb] selection:bg-[#0474C4]/30 selection:text-[#A8C4EC] font-roboto">
      
      {/* ── 1. Left Vertical Navigation Rail ── */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

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
        <header className="h-14 px-6 bg-[#181e2e]/95 backdrop-blur-md border-b border-[#5379AE]/25 flex items-center justify-between z-20 flex-shrink-0 shadow-sm">
          
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#A8C4EC]/75 font-medium">SamudraAI</span>
            <span className="text-[#5379AE]">/</span>
            <span className="text-white font-semibold tracking-tight">
              {activeNav === 'map' && 'Satellite Recon & Navigation'}
              {activeNav === 'analytics' && 'Port & Ocean Telemetry'}
              {activeNav === 'spots' && 'Potential Fishing Grounds & Seaward Routes'}
              {activeNav === 'assistant' && 'Conversational AI Helmsman'}
              {activeNav === 'observability' && '11-Agent AI DAG & Live Stream'}
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 text-xs">
            
            {/* Quick Action: Advisory PDF */}
            <button
              onClick={() => setIsAdvisoryOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151926] border border-[#5379AE]/30 hover:border-emerald-400 text-emerald-300 font-mono transition-colors cursor-pointer"
              title="Download Official Marine Advisory PDF"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Advisory PDF</span>
            </button>

            {/* Quick Action: SOS 1554 */}
            <button
              onClick={() => setIsSOSOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/60 hover:border-rose-400 text-rose-200 font-mono font-bold transition-all shadow-[0_0_10px_rgba(244,63,94,0.25)] cursor-pointer"
              title="Indian Coast Guard Emergency (1554)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>SOS 1554</span>
            </button>

            {/* Active Port Chip */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151926] border border-[#5379AE]/30 text-[#A8C4EC] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#0474C4]" />
              <span className="truncate max-w-[150px] sm:max-w-[200px] font-medium text-white">{activeLocationName.split(',')[0]}</span>
            </div>

            {/* Date & Weather Indicator */}
            <div className="flex items-center gap-1.5 text-[#A8C4EC] font-mono hidden sm:flex">
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">{tempVal}°C</span>
              <span className="text-[#5379AE]">· Today</span>
            </div>
          </div>
        </header>

        {/* ── Persistent Data Source Status Bar ── */}
        <LiveStatusBar
          onOpenSOS={() => setIsSOSOpen(true)}
          onOpenAdvisory={() => setIsAdvisoryOpen(true)}
          onOpenDAG={() => setActiveNav('observability')}
        />

        {/* ── Viewport Contents by Active Tab ── */}
        <div className="flex-1 relative overflow-hidden">
          
          {/* Option A: Dedicated Satellite Map View */}
          <div className={activeNav === 'map' ? 'absolute inset-0 w-full h-full' : 'hidden'}>
            <ErrorBoundary>
              <MarineMap />
            </ErrorBoundary>
          </div>

          {/* Option B: Dedicated Location Analytics View */}
          {activeNav === 'analytics' && (
            <div className="h-full w-full overflow-y-auto">
              <LocationAnalyticsView
                onOpenAdvisory={() => setIsAdvisoryOpen(true)}
                onOpenDAG={() => setActiveNav('observability')}
              />
            </div>
          )}

          {/* Option C: Dedicated Fishing Spots & Routes View */}
          {activeNav === 'spots' && (
            <div className="h-full w-full overflow-y-auto">
              <FishingSpotsView onViewOnMap={() => setActiveNav('map')} />
            </div>
          )}

          {/* Option D: Dedicated AI Assistant View */}
          {activeNav === 'assistant' && (
            <div className="h-full w-full overflow-hidden">
              <AIAssistantView onOpenDAG={() => setActiveNav('observability')} />
            </div>
          )}

          {/* Option E: Dedicated 11-Agent AI DAG & Live Stream View */}
          {activeNav === 'observability' && (
            <div className="h-full w-full overflow-hidden">
              <AgentStreamingDAGView />
            </div>
          )}

        </div>

      </div>

      {/* Floating Persistent Emergency SOS 1554 Button (Always Accessible in Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsSOSOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(244,63,94,0.45)] hover:shadow-[0_0_35px_rgba(244,63,94,0.65)] border border-rose-400/80 transition-all transform hover:scale-105 active:scale-95 cursor-pointer font-mono"
          title="Indian Coast Guard Emergency (1554)"
        >
          <ShieldAlert className="w-4 h-4 text-white animate-bounce" />
          <span>🆘 SOS 1554</span>
        </button>
      </div>

    </div>
  );
};

const MainContent: React.FC = () => {
  const { isLocationSelected } = useApp();
  return isLocationSelected ? <DashboardView /> : <LocationSetupView />;
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
