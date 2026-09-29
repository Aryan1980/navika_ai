import React, { useState, useEffect } from 'react';
import {
  Compass,
  Anchor,
  Crosshair,
  MapPin,
  ArrowRight,
  AlertCircle,
  Loader2,
  Check,
  User,
  Globe,
  Radio,
  CheckCircle2,
  X,
  ChevronRight,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coordinates } from '../../types/marine';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../utils/translations';

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
    language,
    setLanguage
  } = useApp();

  const t = (key: string, fallback: string) => getTranslation(language, key, fallback);

  // Onboarding Modal Open State
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState<boolean>(false);
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

  // Active section tracker for right-hand progress indicator (Start, 01, 02, 03)
  const [activeSection, setActiveSection] = useState<'hero' | '01' | '02' | '03'>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 350;
      const f1 = document.getElementById('feature-01');
      const f2 = document.getElementById('feature-02');
      const f3 = document.getElementById('feature-03');

      if (f3 && scrollPos >= f3.offsetTop) {
        setActiveSection('03');
      } else if (f2 && scrollPos >= f2.offsetTop) {
        setActiveSection('02');
      } else if (f1 && scrollPos >= f1.offsetTop) {
        setActiveSection('01');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize onboarding step if user state changes
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

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('feature-01');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#0B131F] text-[#f1f5fb] font-['Work_Sans',sans-serif] selection:bg-[#FBD784]/20 selection:text-[#FBD784] relative overflow-x-hidden">
      
      {/* ── Fixed Minimalist Top Navigation Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B131F]/80 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Brand Logo on Top Left */}
          <div className="flex items-center gap-6">
            <a
              href="#top"
              onClick={scrollToHero}
              className="flex items-center gap-2.5 text-white tracking-wider text-xl sm:text-2xl font-bold cursor-pointer group"
            >
              <Compass className="w-5 h-5 text-[#FBD784] transition-transform duration-500 group-hover:rotate-45" />
              <span>SamudraAI</span>
              <span className="hidden md:inline-block ml-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-normal text-[#FBD784]/80 bg-[#FBD784]/10 border border-[#FBD784]/20">
                ISRO PS 26176
              </span>
            </a>

            {/* Navigation links: Home and Features */}
            <nav className="hidden sm:flex items-center gap-6 text-sm font-normal text-slate-300">
              <a
                href="#top"
                onClick={scrollToHero}
                className="hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#feature-01"
                onClick={scrollToFeatures}
                className="hover:text-white transition-colors"
              >
                Features
              </a>
            </nav>
          </div>

          {/* Top Actions: Language Selector, Sign In, Get Started */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Minimalist Language Switcher */}
            <div className="relative flex items-center gap-1.5 text-xs text-slate-300 hover:text-white">
              <Globe className="w-3.5 h-3.5 text-[#FBD784]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-300 hover:text-white text-xs font-medium focus:outline-none cursor-pointer py-1 pr-4 appearance-none"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0B131F] text-white">
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0 pointer-events-none" />
            </div>

            {user ? (
              <button
                onClick={openAuthFlow}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm tracking-wide transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#FBD784]" />
                <span className="truncate max-w-[130px]">{user.name}</span>
                <span className="text-[#FBD784]">→</span>
              </button>
            ) : (
              <>
                <button
                  onClick={openAuthFlow}
                  className="text-xs sm:text-sm font-normal text-slate-300 hover:text-white px-2 py-1 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={openAuthFlow}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-transparent hover:bg-[#FBD784] border border-[#FBD784] text-[#FBD784] hover:text-[#0B131F] font-medium text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer"
                >
                  <span>Get Started</span>
                  <span className="text-xs">→</span>
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ── Floating Side Social / Mesh Telemetry (Left Margin, like MNTN) ── */}
      <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 text-xs font-medium text-slate-400">
        <span className="[writing-mode:vertical-lr] tracking-[0.2em] uppercase text-[11px] text-slate-400 font-medium">
          NavIC · INSAT-3DR
        </span>
        <div className="w-[1px] h-12 bg-white/20 my-1" />
        <Radio className="w-4 h-4 text-[#FBD784]" />
      </div>

      {/* ── Floating Right Section Progress Indicator (Start, 01, 02, 03, like MNTN) ── */}
      <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-5 text-xs font-semibold text-slate-400">
        <a
          href="#top"
          onClick={scrollToHero}
          className={`flex items-center gap-3 transition-colors ${
            activeSection === 'hero' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>Start</span>
          <div className={`w-[2px] transition-all ${
            activeSection === 'hero' ? 'h-6 bg-white' : 'h-3 bg-white/20'
          }`} />
        </a>
        <a
          href="#feature-01"
          onClick={scrollToFeatures}
          className={`flex items-center gap-3 transition-colors ${
            activeSection === '01' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>01</span>
          <div className={`w-[2px] transition-all ${
            activeSection === '01' ? 'h-6 bg-white' : 'h-3 bg-white/20'
          }`} />
        </a>
        <a
          href="#feature-02"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('feature-02')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex items-center gap-3 transition-colors ${
            activeSection === '02' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>02</span>
          <div className={`w-[2px] transition-all ${
            activeSection === '02' ? 'h-6 bg-white' : 'h-3 bg-white/20'
          }`} />
        </a>
        <a
          href="#feature-03"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('feature-03')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`flex items-center gap-3 transition-colors ${
            activeSection === '03' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span>03</span>
          <div className={`w-[2px] transition-all ${
            activeSection === '03' ? 'h-6 bg-white' : 'h-3 bg-white/20'
          }`} />
        </a>
      </div>

      {/* ── 1. Full-Bleed Atmospheric Ocean Hero Section ── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-24 pb-20 overflow-hidden">
        
        {/* Ocean Background Image with Smooth Fading Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2400&q=85"
            alt="Atmospheric Indian Ocean Horizon"
            className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
            loading="eager"
          />
          {/* Subtle multi-layer gradient vignette fading down into #0B131F */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B131F] via-[#0B131F]/50 to-[#0B131F]/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B131F]/80 via-transparent to-[#0B131F]" />
        </div>

        {/* Hero Narrative Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* MNTN-Style Kicker with Leading Horizontal Line */}
          <div className="flex items-center gap-3 sm:gap-4 text-[#FBD784] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-6 sm:mb-8">
            <span className="w-10 sm:w-16 h-[2px] bg-[#FBD784]" />
            <span>A MARITIME INTELLIGENCE PLATFORM · ISRO PS 26176</span>
          </div>

          {/* User Requested: Original Sovereign Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white leading-[1.12] tracking-tight">
            {t('hero_headline_1', 'Oceans are')}{' '}
            <span className="italic text-[#e59883] font-serif font-normal">
              {t('hero_wild', 'wild')}
            </span>
            .<br />
            {t('hero_headline_2', 'Intelligence is sovereign.')}
          </h1>

          {/* User Requested: Original Sovereign Subtitle */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
            {t('hero_desc', 'Harnessing real-time satellite oceanography, physical wave dynamics, and biological potential fishing zones for safe and high-yield Indian Ocean voyages.')}
          </p>

          {/* Action Button & Scroll Down Indicator */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
            <button
              onClick={openAuthFlow}
              className="px-8 py-3.5 rounded-full bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-semibold text-sm sm:text-base tracking-wide transition-all shadow-xl hover:scale-102 cursor-pointer"
            >
              {user ? 'Select Port & Enter Bridge →' : 'Begin Voyage Setup →'}
            </button>

            <a
              href="#feature-01"
              onClick={scrollToFeatures}
              className="inline-flex items-center gap-2.5 text-white/90 hover:text-[#FBD784] text-sm sm:text-base font-medium tracking-wide transition-colors group cursor-pointer"
            >
              <span>scroll down</span>
              <span className="transform group-hover:translate-y-1 transition-transform">↓</span>
            </a>
          </div>

        </div>

      </section>

      {/* ── 2. Feature Story Sections (Alternating 2-Column MNTN Editorial Style) ── */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 space-y-28 sm:space-y-40">
        
        {/* ── FEATURE 01: SATELLITE OCEANOGRAPHY & SENSORS ── */}
        <section id="feature-01" className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center scroll-mt-28">
          
          {/* Left Column: Narrative with Large Ghost Numeral */}
          <div className="lg:col-span-6 relative">
            {/* Giant Ghost Numeral 01 */}
            <span className="text-[120px] sm:text-[180px] lg:text-[220px] font-bold text-white/[0.04] leading-none absolute -top-16 sm:-top-24 -left-4 sm:-left-8 select-none pointer-events-none">
              01
            </span>

            <div className="relative z-10 space-y-5">
              {/* Kicker Tag */}
              <div className="flex items-center gap-3 text-[#FBD784] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">
                <span className="w-10 h-[2px] bg-[#FBD784]" />
                <span>01 · SATELLITE OCEANOGRAPHY</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-[1.18] tracking-tight">
                What level of ocean navigator are you?
              </h2>

              {/* Narrative Text */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Determining your voyage parameters and operational sea-state thresholds is critical before casting off. SamudraAI continuously synchronizes live INSAT-3DR thermal radiometry, Sentinel-3 altimetry, and coastal radar streams to map high-resolution sea surface temperatures, chlorophyll-a plumes, and tidal drift currents across India's Exclusive Economic Zone.
              </p>

              {/* Action Link */}
              <div className="pt-2">
                <button
                  onClick={openAuthFlow}
                  className="inline-flex items-center gap-3 text-[#FBD784] hover:text-[#ffe4a0] text-sm sm:text-base font-semibold group cursor-pointer transition-colors"
                >
                  <span>explore live telemetry</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Ocean Satellite Photography Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group aspect-[4/3] bg-gradient-to-br from-[#121c2c] to-[#080d15]">
              <img
                src="/marine_ocean_satellite.jpg"
                alt="Satellite oceanography and thermal front detection"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B131F]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="bg-[#0B131F]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  INSAT-3DR · Sea State 2 (Smooth)
                </span>
                <span className="text-[#FBD784] font-medium">100% Offline-Cached</span>
              </div>
            </div>
          </div>

        </section>

        {/* ── FEATURE 02: POTENTIAL FISHING ZONES & FUEL SAVINGS (REVERSED) ── */}
        <section id="feature-02" className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center scroll-mt-28">
          
          {/* Left Column: Marine Vessel / Ocean Fronts Photography Card */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group aspect-[4/3] bg-gradient-to-br from-[#121c2c] to-[#080d15]">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85"
                alt="Open sea vessel and thermal chlorophyll fronts"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B131F]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="bg-[#0B131F]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  Thermal Upwelling · Chlorophyll-a
                </span>
                <span className="text-emerald-400 font-medium">+30% Fuel Efficiency</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative with Large Ghost Numeral */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            {/* Giant Ghost Numeral 02 */}
            <span className="text-[120px] sm:text-[180px] lg:text-[220px] font-bold text-white/[0.04] leading-none absolute -top-16 sm:-top-24 -left-4 sm:-left-8 select-none pointer-events-none">
              02
            </span>

            <div className="relative z-10 space-y-5">
              {/* Kicker Tag */}
              <div className="flex items-center gap-3 text-[#FBD784] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">
                <span className="w-10 h-[2px] bg-[#FBD784]" />
                <span>02 · BIOGEOCHEMICAL DETECTION</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-[1.18] tracking-tight">
                Picking the right Fishing Grounds!
              </h2>

              {/* Narrative Text */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Traditional artisanal voyages often waste over 180 liters of diesel steaming blindly into barren ocean waters. SamudraAI extracts biophysical thermal convergence gradients and chlorophyll frontals to direct skippers straight to pelagic shoals — slashing transit times, maximizing catch tonnage, and safeguarding small-scale coastal livelihoods.
              </p>

              {/* Action Link */}
              <div className="pt-2">
                <button
                  onClick={openAuthFlow}
                  className="inline-flex items-center gap-3 text-[#FBD784] hover:text-[#ffe4a0] text-sm sm:text-base font-semibold group cursor-pointer transition-colors"
                >
                  <span>discover fishing spots</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>

        </section>

        {/* ── FEATURE 03: DETERMINISTIC PHYSICAL SAFETY & NAVIC MESH ── */}
        <section id="feature-03" className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center scroll-mt-28">
          
          {/* Left Column: Narrative with Large Ghost Numeral */}
          <div className="lg:col-span-6 relative">
            {/* Giant Ghost Numeral 03 */}
            <span className="text-[120px] sm:text-[180px] lg:text-[220px] font-bold text-white/[0.04] leading-none absolute -top-16 sm:-top-24 -left-4 sm:-left-8 select-none pointer-events-none">
              03
            </span>

            <div className="relative z-10 space-y-5">
              {/* Kicker Tag */}
              <div className="flex items-center gap-3 text-[#FBD784] text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase">
                <span className="w-10 h-[2px] bg-[#FBD784]" />
                <span>03 · 100% NON-HALLUCINATORY SAFETY</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-[1.18] tracking-tight">
                Understanding NavIC Mesh & Sovereign Geofences
              </h2>

              {/* Narrative Text */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Maritime safety cannot tolerate generative hallucinations. Our deterministic kinematic engine mathematically models wave breaking limits, shallow shoals, and sovereign International Maritime Boundary Line (IMBL) buffer zones with 0% AI hallucination. Off-grid packets propagate automatically via resilient NavIC LoRa edge mesh devices.
              </p>

              {/* Action Link */}
              <div className="pt-2">
                <button
                  onClick={openAuthFlow}
                  className="inline-flex items-center gap-3 text-[#FBD784] hover:text-[#ffe4a0] text-sm sm:text-base font-semibold group cursor-pointer transition-colors"
                >
                  <span>inspect safety engine</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Coastal Headland / Lighthouse Photography Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group aspect-[4/3] bg-gradient-to-br from-[#121c2c] to-[#080d15]">
              <img
                src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85"
                alt="Coastal beacon and deterministic safe navigational fairway"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B131F]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="bg-[#0B131F]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  NavIC Mesh · LoRa Sync
                </span>
                <span className="text-[#FBD784] font-medium">IMBL 48.2 km Buffer</span>
              </div>
            </div>
          </div>

        </section>

        {/* ── 3. Bottom Minimalist Call to Action ── */}
        <section className="pt-10 pb-8 text-center border-t border-white/10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-center gap-3 text-[#FBD784] text-xs font-semibold tracking-[0.25em] uppercase">
              <span className="w-8 h-[1px] bg-[#FBD784]" />
              <span>READY TO CAST OFF?</span>
              <span className="w-8 h-[1px] bg-[#FBD784]" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-normal text-white">
              Launch Your Vessel Setup
            </h3>
            <p className="text-slate-400 text-sm sm:text-base font-light">
              Select your coastal harbor, inspect real-time satellite telemetry, and evaluate safe waypoint routes.
            </p>
            <div className="pt-2">
              <button
                onClick={openAuthFlow}
                className="px-8 py-3.5 rounded-full bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-semibold text-sm sm:text-base tracking-wide transition-all shadow-xl hover:scale-102 cursor-pointer"
              >
                {user ? 'Select Port & Enter Dashboard →' : 'Sign In & Select Port →'}
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ── Minimalist Clean Footer ── */}
      <footer className="relative z-10 border-t border-white/5 bg-[#080d15] py-12 px-4 sm:px-8 lg:px-12 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-[#FBD784]" />
            <span className="text-white font-bold text-base tracking-tight">SamudraAI</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">ISRO Problem Statement 26176 · SIH 2026</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#top" onClick={scrollToHero} className="hover:text-white transition-colors">Home</a>
            <a href="#feature-01" onClick={scrollToFeatures} className="hover:text-white transition-colors">Features</a>
            <button onClick={openAuthFlow} className="hover:text-white transition-colors cursor-pointer">
              {user ? 'Dashboard' : 'Sign In'}
            </button>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Data Sources: MOSDAC · INCOIS · IMD Coastal AWS · Bhuvan
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ONBOARDING & SIGN-IN MODAL (2-STEP MINIMALIST FLOW)         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Minimalist Backdrop */}
          <div
            className="fixed inset-0 bg-[#060a12]/85 backdrop-blur-md transition-opacity"
            onClick={() => setIsOnboardingModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0E1726] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 text-left font-['Work_Sans',sans-serif]">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setIsOnboardingModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step Indicators */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                onboardingStep === 'signin' ? 'bg-[#FBD784] text-[#0B131F]' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                <span>Step 1: Captain Sign In</span>
                {user && <Check className="w-3.5 h-3.5" />}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                onboardingStep === 'port' ? 'bg-[#FBD784] text-[#0B131F]' : 'bg-slate-800 text-slate-400'
              }`}>
                <span>Step 2: Select Port</span>
              </div>
            </div>

            {/* ── STEP 1: CAPTAIN SIGN-IN ── */}
            {onboardingStep === 'signin' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-normal text-white tracking-tight">
                    Captain Authentication & Vessel Registration
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
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
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                        Captain Mobile Number
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-sm font-mono text-[#FBD784] border-r border-white/10 pr-2.5 font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="98470 12345"
                          className="w-full pl-16 pr-4 py-2.5 bg-[#0B131F] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#FBD784]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="1234"
                        className="w-full px-3 py-2.5 bg-[#0B131F] border border-white/10 rounded-xl text-sm font-mono text-center tracking-widest text-[#FBD784] font-bold focus:outline-none focus:border-[#FBD784]"
                      />
                    </div>
                  </div>

                  {/* 1-Click Quick Demo Captain Profiles */}
                  <div>
                    <span className="text-xs uppercase text-slate-400 tracking-wider font-semibold block mb-2">
                      Quick Demo Captain Profiles (1-Click Selection)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9847012345', "Capt. Xavier D'Souza", 'Matsya Sagar I', 'kochi')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Xavier')
                            ? 'bg-[#152238] border-[#FBD784] text-white'
                            : 'bg-[#0B131F] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="font-semibold text-sm text-white">Capt. Xavier D'Souza</div>
                        <div className="text-xs text-slate-400 mt-0.5">Fort Kochi · Matsya Sagar I (Trawler)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9444012345', 'Capt. K. Murugan', 'Meenavan 3', 'chennai')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Murugan')
                            ? 'bg-[#152238] border-[#FBD784] text-white'
                            : 'bg-[#0B131F] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="font-semibold text-sm text-white">Capt. K. Murugan</div>
                        <div className="text-xs text-slate-400 mt-0.5">Royapuram, Chennai · Meenavan 3</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9820012345', 'Capt. Ramesh Patil', 'Sagar Ratna', 'mumbai')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Ramesh')
                            ? 'bg-[#152238] border-[#FBD784] text-white'
                            : 'bg-[#0B131F] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="font-semibold text-sm text-white">Capt. Ramesh Patil</div>
                        <div className="text-xs text-slate-400 mt-0.5">Sassoon Dock, Mumbai · Sagar Ratna</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9437012345', 'Capt. Somnath Jena', 'Kalinga Sea', 'paradip')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Somnath')
                            ? 'bg-[#152238] border-[#FBD784] text-white'
                            : 'bg-[#0B131F] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="font-semibold text-sm text-white">Capt. Somnath Jena</div>
                        <div className="text-xs text-slate-400 mt-0.5">Paradip Harbor · Kalinga Sea</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Step 1 */}
                <div className="pt-2">
                  <button
                    onClick={handleCaptainSignIn}
                    disabled={isAuthenticating}
                    className="w-full py-3.5 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-semibold text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                    <h3 className="text-2xl font-normal text-white tracking-tight">
                      Select Departure Port / Coastal Harbor
                    </h3>
                    <button
                      onClick={() => setOnboardingStep('signin')}
                      className="text-xs text-[#FBD784] hover:underline"
                    >
                      ← Switch Captain
                    </button>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Calibrates local bathymetric depth, tidal curves, and coastal radar stations.
                  </p>
                </div>

                {/* Sub-tabs: Harbors / GPS / Manual */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0B131F] border border-white/10 max-w-md">
                  <button
                    onClick={() => setPortTab('harbors')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      portTab === 'harbors' ? 'bg-[#FBD784] text-[#0B131F]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Major Harbors
                  </button>
                  <button
                    onClick={() => setPortTab('gps')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      portTab === 'gps' ? 'bg-[#FBD784] text-[#0B131F]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Detect Live GPS
                  </button>
                  <button
                    onClick={() => setPortTab('manual')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      portTab === 'manual' ? 'bg-[#FBD784] text-[#0B131F]' : 'text-slate-400 hover:text-white'
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
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0B131F] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FBD784]"
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
                                ? 'bg-[#152238] border-[#FBD784] shadow-md ring-1 ring-[#FBD784]'
                                : 'bg-[#0B131F] border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-sm text-white">{h.name}</span>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#FBD784]">
                                {h.state}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-[#FBD784]" />
                              <span>{h.sea} · {h.latitude.toFixed(2)}°N, {h.longitude.toFixed(2)}°E</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-2 truncate">
                              Species: {h.species.join(', ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleConfirmPort(selectedHarbor)}
                      className="w-full py-3.5 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-semibold text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Anchor className="w-5 h-5" />
                      <span>Confirm {selectedHarbor.name} & Enter Platform Bridge</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Tab B: Detect Live GPS */}
                {portTab === 'gps' && (
                  <div className="p-6 rounded-2xl bg-[#0B131F] border border-white/10 text-center space-y-4">
                    <Crosshair className="w-10 h-10 text-[#FBD784] mx-auto animate-pulse" />
                    <h4 className="text-lg font-semibold text-white">Acquire Satellite GPS Fix</h4>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                      Query your device's GPS hardware for live coastal latitude and longitude coordinates.
                    </p>

                    {gpsStatus === 'locating' && (
                      <div className="flex items-center justify-center gap-2 text-[#FBD784] text-sm font-mono">
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
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs sm:text-sm cursor-pointer"
                      >
                        Detect Location
                      </button>

                      {gpsCoords && (
                        <button
                          onClick={handleConfirmGPS}
                          className="px-5 py-2.5 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-semibold text-xs sm:text-sm cursor-pointer shadow-md"
                        >
                          Use GPS Location & Enter Bridge →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab C: Manual Coordinates */}
                {portTab === 'manual' && (
                  <div className="p-6 rounded-2xl bg-[#0B131F] border border-white/10 space-y-4">
                    <h4 className="text-lg font-semibold text-white">Enter Custom Coordinates</h4>
                    <p className="text-xs sm:text-sm text-slate-400">
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
                          className="w-full p-2.5 rounded-xl bg-[#162132] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBD784]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Longitude (°E)</label>
                        <input
                          type="text"
                          value={manualLon}
                          onChange={(e) => setManualLon(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[#162132] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBD784]"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmManual}
                      className="w-full py-3 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-semibold text-sm cursor-pointer shadow-md"
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
