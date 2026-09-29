import React, { useState, useEffect } from 'react';
import {
  Compass,
  Navigation,
  Anchor,
  Crosshair,
  MapPin,
  ArrowRight,
  AlertCircle,
  Loader2,
  Waves,
  ShieldCheck,
  Fish,
  Terminal,
  LayoutGrid,
  Check,
  User,
  Phone,
  Globe,
  KeyRound,
  LogOut,
  Ship,
  Sparkles,
  Cpu,
  FileText,
  Radio,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  Layers,
  Lock,
  CheckCircle2,
  X,
  ChevronRight,
  Search,
  Zap,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coordinates } from '../../types/marine';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../utils/translations';
import {
  getLocalizedPortName,
  getLocalizedState,
  getLocalizedSea,
  getLocalizedSpecies
} from '../../utils/locationTranslations';

export interface HarborOption {
  id: string;
  name: string;
  state: string;
  sea: string;
  latitude: number;
  longitude: number;
  species: string[];
}

export const MAJOR_HARBORS: HarborOption[] = [
  {
    id: 'kochi',
    name: 'Fort Kochi Coastal Harbor',
    state: 'Kerala',
    sea: 'Arabian Sea',
    latitude: 9.9650,
    longitude: 76.2220,
    species: ['Oil Sardine', 'Indian Mackerel', 'Yellowfin Tuna']
  },
  {
    id: 'mumbai',
    name: 'Sassoon Dock, Mumbai',
    state: 'Maharashtra',
    sea: 'Arabian Sea',
    latitude: 18.9168,
    longitude: 72.8258,
    species: ['Bombay Duck', 'Silver Pomfret', 'Penaeid Prawn']
  },
  {
    id: 'chennai',
    name: 'Royapuram, Chennai',
    state: 'Tamil Nadu',
    sea: 'Bay of Bengal',
    latitude: 13.1147,
    longitude: 80.2974,
    species: ['Skipjack Tuna', 'Seer Fish', 'Ribbon Fish']
  },
  {
    id: 'visakhapatnam',
    name: 'Visakhapatnam Fishing Harbor',
    state: 'Andhra Pradesh',
    sea: 'Bay of Bengal',
    latitude: 17.6975,
    longitude: 83.3009,
    species: ['Tiger Shrimp', 'Yellowfin Tuna', 'Mackerel']
  },
  {
    id: 'mangalore',
    name: 'Old Port (Bunder), Mangalore',
    state: 'Karnataka',
    sea: 'Arabian Sea',
    latitude: 12.8550,
    longitude: 74.8360,
    species: ['Mackerel', 'Sardine', 'Squid']
  },
  {
    id: 'veraval',
    name: 'Veraval Harbor, Saurashtra',
    state: 'Gujarat',
    sea: 'Arabian Sea',
    latitude: 20.9000,
    longitude: 70.3667,
    species: ['Ribbon Fish', 'Croaker', 'Cuttlefish']
  },
  {
    id: 'panaji',
    name: 'Malim Jetty, Panaji',
    state: 'Goa',
    sea: 'Arabian Sea',
    latitude: 15.5085,
    longitude: 73.8322,
    species: ['Mackerel', 'Sardines', 'Kingfish']
  },
  {
    id: 'paradip',
    name: 'Paradip Fishing Harbor',
    state: 'Odisha',
    sea: 'Bay of Bengal',
    latitude: 20.3165,
    longitude: 86.6114,
    species: ['Hilsa', 'Pomfret', 'Sea Catfish']
  },
  {
    id: 'kanyakumari',
    name: 'Chinnamuttom, Kanyakumari',
    state: 'Tamil Nadu',
    sea: 'Indian Ocean Confluence',
    latitude: 8.0934,
    longitude: 77.5614,
    species: ['Tuna', 'Reef Fish', 'Anchovies']
  },
  {
    id: 'port_blair',
    name: 'Junglighat, Port Blair',
    state: 'Andaman & Nicobar',
    sea: 'Andaman Sea',
    latitude: 11.6643,
    longitude: 92.7302,
    species: ['Bigeye Tuna', 'Snapper', 'Mahi-Mahi']
  }
];

export const LocationSetupView: React.FC = () => {
  const {
    confirmLocation,
    user,
    loginWithPhone,
    logout,
    language,
    setLanguage,
    setIsProfileModalOpen
  } = useApp();

  // Onboarding Modal Open State
  // If user is already authenticated but hasn't picked a harbor, modal starts open on step 2
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState<boolean>(!!user);
  const [onboardingStep, setOnboardingStep] = useState<'signin' | 'port'>(user ? 'port' : 'signin');

  // Step 1: Sign-In State
  const [phoneInput, setPhoneInput] = useState('9847012345');
  const [otpInput, setOtpInput] = useState('1234');
  const [captainNameInput, setCaptainNameInput] = useState("Capt. Xavier D'Souza");
  const [vesselNameInput, setVesselNameInput] = useState('Matsya Sagar I');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  // Step 2: Harbor & Port Selection State
  const [portTab, setPortTab] = useState<'harbors' | 'gps' | 'manual'>('harbors');
  const [selectedHarbor, setSelectedHarbor] = useState<HarborOption>(MAJOR_HARBORS[0]);
  const [harborSearch, setHarborSearch] = useState<string>('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsCoords, setGpsCoords] = useState<Coordinates | null>(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string>('');
  const [manualLat, setManualLat] = useState<string>('9.9650');
  const [manualLon, setManualLon] = useState<string>('76.2220');
  const [manualError, setManualError] = useState<string>('');

  // Keep modal step synchronized if user state changes
  useEffect(() => {
    if (user) {
      setOnboardingStep('port');
    }
  }, [user]);

  // Demo Skipper 1-Click Pre-fill
  const selectQuickSkipper = (phone: string, capName: string, boat: string, harborId: string) => {
    setPhoneInput(phone);
    setCaptainNameInput(capName);
    setVesselNameInput(boat);
    setOtpInput('1234');
    const match = MAJOR_HARBORS.find(h => h.id === harborId);
    if (match) setSelectedHarbor(match);
  };

  // Step 1 Action: Authenticate & advance to Port Selection
  const handleCaptainSignIn = async () => {
    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number or select a demo skipper.');
      return;
    }

    setIsAuthenticating(true);
    setAuthError('');
    const success = await loginWithPhone(
      cleanPhone,
      otpInput || '1234',
      captainNameInput || `Capt. (${cleanPhone.slice(-4)})`,
      vesselNameInput || 'Matsya Sagar I',
      'Mechanized Gillnetter / Trawler (18m)',
      `${selectedHarbor.name}, ${selectedHarbor.state}`
    );
    setIsAuthenticating(false);

    if (success) {
      // Advance to Step 2 (Select Port)
      setOnboardingStep('port');
    } else {
      setAuthError('Authentication failed. Please verify code or try again.');
    }
  };

  // Step 2 Action: Confirm Port and Enter Bridge Dashboard
  const handleConfirmPort = (harbor: HarborOption) => {
    setSelectedHarbor(harbor);
    confirmLocation(
      { latitude: harbor.latitude, longitude: harbor.longitude },
      `${harbor.name}, ${harbor.state}`
    );
    setIsOnboardingModalOpen(false);
  };

  // Step 2 Action: GPS Detect & Confirm
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsErrorMsg('Browser geolocation is not supported on this device.');
      return;
    }

    setGpsStatus('locating');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          latitude: parseFloat(position.coords.latitude.toFixed(4)),
          longitude: parseFloat(position.coords.longitude.toFixed(4))
        };
        setGpsCoords(coords);
        setGpsStatus('success');
      },
      (error) => {
        setGpsStatus('error');
        setGpsErrorMsg(error.message || 'Unable to acquire GPS fix. Please select a harbor.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  const handleConfirmGPS = () => {
    if (!gpsCoords) return;
    confirmLocation(
      gpsCoords,
      `GPS Fix: ${gpsCoords.latitude.toFixed(4)}°N, ${gpsCoords.longitude.toFixed(4)}°E`
    );
    setIsOnboardingModalOpen(false);
  };

  const handleConfirmManual = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (isNaN(lat) || lat < 4 || lat > 38 || isNaN(lon) || lon < 65 || lon > 100) {
      setManualError('Please enter valid coordinates within the Indian Exclusive Economic Zone.');
      return;
    }
    confirmLocation({ latitude: lat, longitude: lon }, `Manual Coords: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
    setIsOnboardingModalOpen(false);
  };

  const filteredHarbors = MAJOR_HARBORS.filter(h =>
    h.name.toLowerCase().includes(harborSearch.toLowerCase()) ||
    h.state.toLowerCase().includes(harborSearch.toLowerCase()) ||
    h.sea.toLowerCase().includes(harborSearch.toLowerCase())
  );

  const openAuthFlow = () => {
    setIsOnboardingModalOpen(true);
    setOnboardingStep(user ? 'port' : 'signin');
  };

  return (
    <div className="min-h-screen bg-[#0d121e] text-[#f1f5fb] selection:bg-[#0474C4]/30 selection:text-[#BDDDFC] font-sans relative overflow-x-hidden">
      
      {/* ── Ambient Oceanic Background Glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#06457F]/25 via-[#0474C4]/15 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-[-150px] w-[500px] h-[500px] bg-[#384959]/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 right-[-150px] w-[550px] h-[550px] bg-[#0474C4]/15 rounded-full blur-[160px]" />
      </div>

      {/* ── 1. Floating Pill Navigation Bar (Inspired by Sociyafy Reference) ── */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-40 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto rounded-full bg-[#161c27]/85 backdrop-blur-xl border border-[#384959]/70 px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          
          {/* Brand Logo & PS Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#06457F] to-[#0474C4] border border-[#88BDF2]/40 flex items-center justify-center text-white shadow-md">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                <span>Samudra</span>
                <span className="text-[#88BDF2]">AI</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  ISRO PS 26176
                </span>
              </div>
            </div>
          </div>

          {/* Center Pill Menu Links (Hidden on small mobile) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0e1422]/70 px-3 py-1.5 rounded-full border border-white/5 text-xs lg:text-sm font-medium text-[#BDDDFC]">
            <a href="#features" className="px-3 py-1 rounded-full hover:text-white hover:bg-white/5 transition-all">Features</a>
            <a href="#telemetry" className="px-3 py-1 rounded-full hover:text-white hover:bg-white/5 transition-all">Live Telemetry</a>
            <a href="#pfz" className="px-3 py-1 rounded-full hover:text-white hover:bg-white/5 transition-all">PFZ Fronts</a>
            <a href="#safety" className="px-3 py-1 rounded-full hover:text-white hover:bg-white/5 transition-all">Safety Engine</a>
            <a href="#dag" className="px-3 py-1 rounded-full hover:text-white hover:bg-white/5 transition-all">11-Agent DAG</a>
          </nav>

          {/* Right Controls: Language Dropdown + Sign In / Get Started */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#1e2634] border border-[#384959] text-xs">
              <Globe className="w-3.5 h-3.5 text-[#88BDF2] flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[#BDDDFC] text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#161c27] text-white">
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <button
                onClick={openAuthFlow}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0474C4] to-[#06457F] hover:from-[#0582db] hover:to-[#08559e] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{user.name}</span>
                <span>→</span>
              </button>
            ) : (
              <>
                <button
                  onClick={openAuthFlow}
                  className="hidden sm:inline-flex text-xs sm:text-sm font-semibold text-[#BDDDFC] hover:text-white px-2 py-1.5 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={openAuthFlow}
                  className="flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0474C4] via-[#0585dd] to-[#88BDF2] hover:opacity-95 text-slate-950 font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(4,116,196,0.35)] transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <span className="font-sans font-bold">→</span>
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ── 2. Hero Section: Punchy Headline + 3 Floating Glass Cards (Like Reference Image) ── */}
      <section className="relative z-10 pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        
        {/* Pill Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182336] border border-[#5379AE]/40 text-cyan-300 font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Generation Autonomous Marine Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.12] max-w-5xl mx-auto">
          One Intelligent Platform to Navigate, Protect, and Maximize Every Voyage
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-[#BDDDFC]/90 max-w-3xl mx-auto font-normal leading-relaxed">
          Real-time ISRO satellite radiometry, INCOIS potential fishing zones, and deterministic zero-hallucination safety intelligence for India's 4.2M marine fishers.
        </p>

        {/* Hero CTA Button */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={openAuthFlow}
            className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#0474C4] via-[#0585dd] to-[#88BDF2] hover:brightness-110 text-slate-950 font-bold text-sm sm:text-base tracking-wide shadow-[0_0_30px_rgba(4,116,196,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{user ? 'Select Port & Enter Bridge' : 'Get Started Free'}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <a
            href="#features"
            className="flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#182132] hover:bg-[#202c42] border border-[#384959] text-white font-semibold text-sm sm:text-base transition-colors"
          >
            <span>Explore Platform Features</span>
            <span className="text-[#88BDF2]">↓</span>
          </a>
        </div>

        {/* ── 3 Floating Glassmorphism Hero Feature Cards (Directly matching reference image layout) ── */}
        <div id="telemetry" className="mt-14 sm:mt-18 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          
          {/* Card 1: Live Ocean Telemetry & Buoy Feeds */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#161c27]/85 backdrop-blur-xl border border-[#384959] shadow-2xl flex flex-col justify-between hover:border-[#88BDF2]/50 transition-all hover:translate-y-[-2px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  Live Ocean Telemetry
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  INCOIS LIVE
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                1.2m <span className="text-xs text-[#BDDDFC] font-sans font-normal">Wave Swell</span>
              </div>
              <p className="text-xs sm:text-sm text-[#BDDDFC]/80 mt-1">
                State 2 (Smooth Sea) · 8.2s Period · WSW
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#384959]/60 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#10141f] p-2.5 rounded-xl border border-[#384959]/40">
                <span className="text-slate-400 block text-[11px]">SST Temp</span>
                <span className="text-white font-bold text-sm">28.4°C</span>
              </div>
              <div className="bg-[#10141f] p-2.5 rounded-xl border border-[#384959]/40">
                <span className="text-slate-400 block text-[11px]">Surface Wind</span>
                <span className="text-cyan-300 font-bold text-sm">16.5 km/h</span>
              </div>
            </div>
          </div>

          {/* Card 2: PFZ Discovery & Harvest Trends */}
          <div id="pfz" className="p-5 sm:p-6 rounded-2xl bg-[#161c27]/85 backdrop-blur-xl border border-[#384959] shadow-2xl flex flex-col justify-between hover:border-cyan-400/50 transition-all hover:translate-y-[-2px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Fish className="w-4 h-4 text-cyan-400" />
                  PFZ Fronts & Harvest
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                  MODIS + OCM-3
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono tracking-tight">
                89% <span className="text-xs text-[#BDDDFC] font-sans font-normal">Harvest Match</span>
              </div>
              <p className="text-xs sm:text-sm text-[#BDDDFC]/80 mt-1">
                Thermal & Chlorophyll frontal convergence
              </p>
            </div>

            {/* Simulated trend curve */}
            <div className="mt-4 pt-3 border-t border-[#384959]/60">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Direct Fuel Savings</span>
                <span className="text-emerald-400 font-bold">+30% Efficiency</span>
              </div>
              <div className="h-2 w-full bg-[#10141f] rounded-full overflow-hidden border border-[#384959]/40">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          {/* Card 3: Autonomous Safety & NavIC Mesh */}
          <div id="safety" className="p-5 sm:p-6 rounded-2xl bg-[#161c27]/85 backdrop-blur-xl border border-[#384959] shadow-2xl flex flex-col justify-between hover:border-emerald-400/50 transition-all hover:translate-y-[-2px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Deterministic Safety
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                  VERIFIED SAFE
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                0% <span className="text-xs text-[#BDDDFC] font-sans font-normal">AI Hallucination</span>
              </div>
              <p className="text-xs sm:text-sm text-[#BDDDFC]/80 mt-1">
                Evaluated purely via deterministic physics equations
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#384959]/60 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                NavIC LoRa Mesh
              </span>
              <span className="text-emerald-400 font-bold">IMBL 48.2 km Clear</span>
            </div>
          </div>

        </div>

      </section>

      {/* ── 3. Section: Bento Grid (Inspired by Top-Right of Reference Image) ── */}
      <section id="features" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#384959]/40">
        
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Everything You Need for Safe, High-Yield Marine Operations
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#BDDDFC]/80">
            Engineered specifically to solve the core requirements of ISRO Problem Statement 26176.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Card A: Interactive Satellite Marine Chart & 3D Perspective (8 Cols) */}
          <div className="md:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#161c27] border border-[#384959] shadow-xl flex flex-col justify-between group hover:border-[#88BDF2]/60 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Nautical Cartography
                </span>
                <span className="text-xs font-mono text-slate-400">MapLibre GL · 3D Bathymetry</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Interactive Satellite Marine Chart & OpenSeaMap Integration
              </h3>
              <p className="text-sm sm:text-base text-[#BDDDFC]/80 leading-relaxed max-w-2xl">
                Explore real-time bathymetry, sovereign maritime boundaries (IMBL), Marine Protected Areas (MPAs), and official OpenSeaMap buoys, beacons, and fairways in plan or 3D perspective.
              </p>
            </div>

            {/* Visual Nautical Chart Mock Preview */}
            <div className="mt-6 rounded-xl bg-[#0f1420] border border-[#384959]/60 p-4 font-mono text-xs overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3 text-slate-400">
                <span className="flex items-center gap-2 text-white font-semibold">
                  <Anchor className="w-4 h-4 text-[#88BDF2]" />
                  Active Seaway Corridors & Depth Soundings
                </span>
                <span className="text-cyan-400 font-bold">100% Offline-Cached</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#161c27] border border-white/5">
                  <span className="text-slate-400 block text-[11px]">Sounding Depth</span>
                  <span className="text-white font-bold text-sm">34.5 Meters</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#161c27] border border-white/5">
                  <span className="text-slate-400 block text-[11px]">Seamarks</span>
                  <span className="text-emerald-400 font-bold text-sm">18 Buoys Live</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#161c27] border border-white/5">
                  <span className="text-slate-400 block text-[11px]">Fairway Status</span>
                  <span className="text-cyan-300 font-bold text-sm">Clear Channel</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#161c27] border border-white/5">
                  <span className="text-slate-400 block text-[11px]">IMBL Distance</span>
                  <span className="text-emerald-400 font-bold text-sm">48.2 km Safe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Multi-Factor Risk Assessment Engine (4 Cols) */}
          <div className="md:col-span-4 p-6 sm:p-8 rounded-2xl bg-[#161c27] border border-[#384959] shadow-xl flex flex-col justify-between hover:border-emerald-400/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Physics Matrix
                </span>
                <span className="text-xs font-mono text-slate-400">7-Factor Heuristic</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Deterministic Risk Engine
              </h3>
              <p className="text-sm text-[#BDDDFC]/80 leading-relaxed">
                Zero generative hallucination. Waves, winds, cyclone squalls, border buffer, and drift vectors mathematically weighted and auditable.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-[#0f1420] border border-[#384959]/60 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span>Calculated Safety Score</span>
                <span className="text-emerald-400 font-bold text-sm">85 / 100</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Physical Safety Verdict</span>
                <span className="text-white font-bold">SAFE TO VENTURE</span>
              </div>
            </div>
          </div>

          {/* Card C: Autonomous A* Route Planner (6 Cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 rounded-2xl bg-[#161c27] border border-[#384959] shadow-xl flex flex-col justify-between hover:border-cyan-400/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" />
                  Oceanic Guidance
                </span>
                <span className="text-xs font-mono text-slate-400">A* Graph Router</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Autonomous Nautical Corridors
              </h3>
              <p className="text-sm sm:text-base text-[#BDDDFC]/80 leading-relaxed">
                Computes optimal safe channels avoiding shallow reefs, shoals, and sovereign boundaries, with direct fuel consumption comparison against baseline rhumb lines.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#0f1420] border border-[#384959]/60">
                <span className="text-slate-400 block text-[11px]">Direct Rhumb Line</span>
                <span className="text-rose-300 font-bold text-base block mt-0.5">18.5 km</span>
                <span className="text-rose-400/90 text-[11px] block mt-1">Intersects nearshore reef</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0f1420] border border-cyan-400/30">
                <span className="text-cyan-300 block text-[11px]">AI Safe Corridor</span>
                <span className="text-emerald-400 font-bold text-base block mt-0.5">22.4 km</span>
                <span className="text-emerald-400/90 text-[11px] block mt-1">100% Hazard-Free Channel</span>
              </div>
            </div>
          </div>

          {/* Card D: Vernacular Inclusivity in 10 Languages (6 Cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 rounded-2xl bg-[#161c27] border border-[#384959] shadow-xl flex flex-col justify-between hover:border-indigo-400/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  Coastal Inclusion
                </span>
                <span className="text-xs font-mono text-slate-400">10 Indian Languages</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Accessible to Every Coastal Fishing Community
              </h3>
              <p className="text-sm sm:text-base text-[#BDDDFC]/80 leading-relaxed">
                Full vernacular voice and text translations across all major coastal states of peninsular India and island territories.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map((l) => (
                <span
                  key={l.code}
                  className="px-3 py-1.5 rounded-xl bg-[#0f1420] border border-[#384959]/60 text-xs text-white font-medium flex items-center gap-1.5"
                >
                  <span>{l.flag}</span>
                  <span>{l.nativeName}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ── 4. Section: Turn Satellite Data Into Decisions (Inspired by Bottom of Reference Image) ── */}
      <section id="dag" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#384959]/40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Feature Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-2">
                INTELLIGENT MARITIME AGENTS
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                Turn Spaceborne Data Into Confident Decisions
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#BDDDFC]/80 leading-relaxed">
                11 autonomous agents work concurrently to ingest satellite telemetry, model marine physics, and deliver instant advisory bulletins.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#161c27] border border-[#384959]/60">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">11-Agent Autonomous Orchestration DAG</h4>
                  <p className="text-xs sm:text-sm text-[#BDDDFC]/80 mt-0.5">Sub-second concurrent dispatch for weather, thermal fronts, borders, and routing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#161c27] border border-[#384959]/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">One-Touch Emergency SOS 1554</h4>
                  <p className="text-xs sm:text-sm text-[#BDDDFC]/80 mt-0.5">Emergency maritime distress broadcast to Indian Coast Guard Maritime Rescue.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#161c27] border border-[#384959]/60">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">Official PDF Advisory Bulletins</h4>
                  <p className="text-xs sm:text-sm text-[#BDDDFC]/80 mt-0.5">Generate print-ready multilingual bulletins for harbour notice boards and fleet briefings.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={openAuthFlow}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0474C4] to-[#06457F] hover:from-[#0582db] hover:to-[#08559e] text-white font-bold text-sm tracking-wide shadow-lg transition-all cursor-pointer"
              >
                <span>Launch Bridge & Select Departure Port</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: AI Assistant & Multi-Agent Mockup Preview */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#161c27] via-[#141b29] to-[#0e1320] border border-[#384959] shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#384959]/60 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">AI Maritime Copilot</h4>
                    <span className="text-xs text-slate-400 font-mono">11 AI Agents Concurrently Synced</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  98.4% Confidence
                </span>
              </div>

              {/* Chat Message Bubble */}
              <div className="space-y-3 font-sans text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-[#1e2634] text-white font-medium max-w-[85%] border border-[#384959]/50">
                  "Is it safe to venture out for tuna fishing from Fort Kochi tomorrow morning?"
                </div>
                <div className="p-4 rounded-2xl bg-[#0f1420] text-[#f1f5fb] border border-cyan-500/30 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Physical Verdict: Safe (Risk 15/100)</span>
                  </div>
                  <p>
                    Conditions are optimal. Swell wave height is 1.2m with wind gusts below 22 km/h. Nearest high-yield thermal front is located 18.5 km offshore (240° WSW) with +30% predicted fuel savings.
                  </p>
                </div>
              </div>

              {/* Rationale tags */}
              <div className="mt-5 pt-3.5 border-t border-[#384959]/60 flex flex-wrap gap-2 text-xs font-mono text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-[#161c27] border border-white/5">EOS-06 OCM-3 Verified</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#161c27] border border-white/5">IMD AWS Calm</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#161c27] border border-white/5">IMBL 48.2km Clear</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. Footer ── */}
      <footer className="relative z-10 border-t border-[#384959]/40 bg-[#0a0e17] py-10 px-4 sm:px-6 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#88BDF2]" />
            <span className="text-white font-bold font-sans">Samudra AI</span>
            <span>—</span>
            <span>Built for Smart India Hackathon (SIH 2026) · ISRO PS 26176</span>
          </div>
          <div>
            <span>Data feeds: ISRO MOSDAC · INCOIS · IMD Coastal AWS · Bhuvan</span>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* 6. ONBOARDING & SIGN-IN MODAL (2-STEP FLOW)                 */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsOnboardingModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#161c27] border border-[#384959] rounded-3xl shadow-2xl p-6 sm:p-8 z-10 text-left font-sans">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setIsOnboardingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step Indicators */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#384959]/60">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                onboardingStep === 'signin' ? 'bg-[#0474C4] text-white' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                <span>Step 1: Captain Sign In</span>
                {user && <Check className="w-3.5 h-3.5" />}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                onboardingStep === 'port' ? 'bg-[#0474C4] text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                <span>Step 2: Departure Port</span>
              </div>
            </div>

            {/* ── STEP 1: CAPTAIN SIGN-IN ── */}
            {onboardingStep === 'signin' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Captain Authentication & Vessel Registration
                  </h3>
                  <p className="text-sm text-[#BDDDFC]/80 mt-1">
                    Enter your mobile number to sign in or select one of the demo coastal captains below.
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#BDDDFC] mb-1.5 uppercase tracking-wider">
                        Captain Mobile Number
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-sm font-mono text-[#88BDF2] border-r border-[#384959] pr-2.5 font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="98470 12345"
                          className="w-full pl-16 pr-4 py-2.5 bg-[#10141f] border border-[#384959] rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#88BDF2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#BDDDFC] mb-1.5 uppercase tracking-wider">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="1234"
                        className="w-full px-3 py-2.5 bg-[#10141f] border border-[#384959] rounded-xl text-sm font-mono text-center tracking-widest text-[#88BDF2] font-bold focus:outline-none focus:border-[#88BDF2]"
                      />
                    </div>
                  </div>

                  {/* 1-Click Quick Demo Captain Selector */}
                  <div>
                    <span className="text-xs font-mono uppercase text-[#BDDDFC]/70 tracking-wider font-bold block mb-2">
                      Quick Demo Captain Profiles (1-Click Selection)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9847012345', "Capt. Xavier D'Souza", 'Matsya Sagar I', 'kochi')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Xavier')
                            ? 'bg-[#1e2634] border-[#88BDF2] text-white'
                            : 'bg-[#10141f] border-[#384959]/60 text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="font-bold text-sm text-white">Capt. Xavier D'Souza</div>
                        <div className="text-xs text-[#BDDDFC]/70 mt-0.5">Fort Kochi · Matsya Sagar I (Trawler)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9444012345', 'Capt. K. Murugan', 'Meenavan 3', 'chennai')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Murugan')
                            ? 'bg-[#1e2634] border-[#88BDF2] text-white'
                            : 'bg-[#10141f] border-[#384959]/60 text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="font-bold text-sm text-white">Capt. K. Murugan</div>
                        <div className="text-xs text-[#BDDDFC]/70 mt-0.5">Royapuram, Chennai · Meenavan 3</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9820012345', 'Capt. Ramesh Patil', 'Sagar Ratna', 'mumbai')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Ramesh')
                            ? 'bg-[#1e2634] border-[#88BDF2] text-white'
                            : 'bg-[#10141f] border-[#384959]/60 text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="font-bold text-sm text-white">Capt. Ramesh Patil</div>
                        <div className="text-xs text-[#BDDDFC]/70 mt-0.5">Sassoon Dock, Mumbai · Sagar Ratna</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9437012345', 'Capt. Somnath Jena', 'Kalinga Sea', 'paradip')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Somnath')
                            ? 'bg-[#1e2634] border-[#88BDF2] text-white'
                            : 'bg-[#10141f] border-[#384959]/60 text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="font-bold text-sm text-white">Capt. Somnath Jena</div>
                        <div className="text-xs text-[#BDDDFC]/70 mt-0.5">Paradip Harbor · Kalinga Sea</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Step 1 */}
                <div className="pt-2">
                  <button
                    onClick={handleCaptainSignIn}
                    disabled={isAuthenticating}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0474C4] to-[#06457F] hover:from-[#0582db] hover:to-[#08559e] text-white font-bold text-sm sm:text-base tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate & Proceed to Port Selection</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: SELECT DEPARTURE PORT ── */}
            {onboardingStep === 'port' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Select Departure Port / Coastal Harbor
                    </h3>
                    <button
                      onClick={() => setOnboardingStep('signin')}
                      className="text-xs text-[#88BDF2] hover:underline"
                    >
                      ← Switch Captain
                    </button>
                  </div>
                  <p className="text-sm text-[#BDDDFC]/80 mt-1">
                    Calibrates local bathymetric depth, tidal curves, and coastal radar stations.
                  </p>
                </div>

                {/* Sub-tabs: Harbors / GPS / Manual */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-[#10141f] border border-[#384959]/60 max-w-md">
                  <button
                    onClick={() => setPortTab('harbors')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      portTab === 'harbors' ? 'bg-[#0474C4] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Major Harbors
                  </button>
                  <button
                    onClick={() => setPortTab('gps')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      portTab === 'gps' ? 'bg-[#0474C4] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Detect Live GPS
                  </button>
                  <button
                    onClick={() => setPortTab('manual')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      portTab === 'manual' ? 'bg-[#0474C4] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Manual Coords
                  </button>
                </div>

                {/* Tab A: Harbors Grid */}
                {portTab === 'harbors' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search harbor name, state, or sea basin..."
                        value={harborSearch}
                        onChange={(e) => setHarborSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#10141f] border border-[#384959] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#88BDF2]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {filteredHarbors.map((h) => {
                        const isSelected = selectedHarbor.id === h.id;
                        return (
                          <div
                            key={h.id}
                            onClick={() => setSelectedHarbor(h)}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#1e2634] border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400'
                                : 'bg-[#10141f] border-[#384959]/60 hover:border-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-sm text-white">{h.name}</span>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300">
                                {h.state}
                              </span>
                            </div>
                            <div className="text-xs text-[#BDDDFC]/70 mt-1 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-[#0474C4]" />
                              <span>{h.sea} · {h.latitude.toFixed(2)}°N, {h.longitude.toFixed(2)}°E</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-2 truncate">
                              Species: {h.species.join(', ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleConfirmPort(selectedHarbor)}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Anchor className="w-5 h-5" />
                      <span>Confirm {selectedHarbor.name} & Enter Platform Bridge</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Tab B: Detect Live GPS */}
                {portTab === 'gps' && (
                  <div className="p-6 rounded-2xl bg-[#10141f] border border-[#384959] text-center space-y-4">
                    <Crosshair className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                    <h4 className="text-lg font-bold text-white">Acquire Satellite GPS Fix</h4>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                      Query your device's GPS hardware for live coastal latitude and longitude coordinates.
                    </p>

                    {gpsStatus === 'locating' && (
                      <div className="flex items-center justify-center gap-2 text-cyan-300 text-sm font-mono">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Acquiring satellite fix...</span>
                      </div>
                    )}

                    {gpsStatus === 'success' && gpsCoords && (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-sm">
                        Fix acquired: {gpsCoords.latitude}°N, {gpsCoords.longitude}°E
                      </div>
                    )}

                    {gpsStatus === 'error' && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                        {gpsErrorMsg}
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleDetectGPS}
                        className="px-5 py-2.5 rounded-xl bg-[#1e2634] hover:bg-[#253247] border border-[#384959] text-white font-semibold text-xs sm:text-sm cursor-pointer"
                      >
                        Detect Location
                      </button>

                      {gpsCoords && (
                        <button
                          onClick={handleConfirmGPS}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-md"
                        >
                          Use GPS Location & Enter Bridge →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab C: Manual Coordinates */}
                {portTab === 'manual' && (
                  <div className="p-6 rounded-2xl bg-[#10141f] border border-[#384959] space-y-4">
                    <h4 className="text-lg font-bold text-white">Enter Custom Coordinates</h4>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Specify exact decimal coordinates within the Indian Exclusive Economic Zone.
                    </p>

                    {manualError && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                        {manualError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Latitude (°N)</label>
                        <input
                          type="text"
                          value={manualLat}
                          onChange={(e) => setManualLat(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[#161c27] border border-[#384959] text-white text-sm focus:outline-none focus:border-[#88BDF2]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Longitude (°E)</label>
                        <input
                          type="text"
                          value={manualLon}
                          onChange={(e) => setManualLon(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[#161c27] border border-[#384959] text-white text-sm focus:outline-none focus:border-[#88BDF2]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmManual}
                      className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm cursor-pointer shadow-md"
                    >
                      Confirm Coordinates & Enter Bridge →
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
