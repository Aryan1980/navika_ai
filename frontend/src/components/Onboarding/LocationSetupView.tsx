import React, { useState, useEffect, useRef } from 'react';
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
  X,
  ChevronRight,
  Search,
  ChevronDown,
  Menu
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
    language,
    setLanguage
  } = useApp();

  const t = (key: string, fallback?: string) => getTranslation(key, language, fallback);

  // Onboarding Modal Open State
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<'signin' | 'port'>(user ? 'port' : 'signin');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

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

  // Active section tracker for right-hand dynamic progress indicator (Start, 01, 02, 03)
  const [activeSection, setActiveSection] = useState<'hero' | '01' | '02' | '03'>('hero');

  // Dynamic Scroll & Intersection Observer for right-hand navigation indicator
  useEffect(() => {
    // 1. Precise real-time scroll calculation
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
      // If close to top, active is always Start/Hero
      if (scrollY < 260) {
        setActiveSection('hero');
        return;
      }

      const vh = window.innerHeight || 800;
      const viewportCenter = vh * 0.45;

      const f1 = document.getElementById('feature-01');
      const f2 = document.getElementById('feature-02');
      const f3 = document.getElementById('feature-03');

      // Check sections from bottom to top
      if (f3) {
        const r3 = f3.getBoundingClientRect();
        if (r3.top <= viewportCenter && r3.bottom >= 120) {
          setActiveSection('03');
          return;
        }
      }

      if (f2) {
        const r2 = f2.getBoundingClientRect();
        if (r2.top <= viewportCenter && r2.bottom >= 120) {
          setActiveSection('02');
          return;
        }
      }

      if (f1) {
        const r1 = f1.getBoundingClientRect();
        if (r1.top <= viewportCenter && r1.bottom >= 120) {
          setActiveSection('01');
          return;
        }
      }

      // If past bottom of feature 3
      if (f3 && f3.getBoundingClientRect().bottom < viewportCenter) {
        setActiveSection('03');
      } else if (f1 && f1.getBoundingClientRect().top > viewportCenter) {
        setActiveSection('hero');
      }
    };

    // 2. High-performance native IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        // Sort visible entries by intersection ratio
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topVisible = visible[0];
          if (topVisible.target.id === 'hero-section') {
            setActiveSection('hero');
          } else if (topVisible.target.id === 'feature-01') {
            setActiveSection('01');
          } else if (topVisible.target.id === 'feature-02') {
            setActiveSection('02');
          } else if (topVisible.target.id === 'feature-03') {
            setActiveSection('03');
          }
        }
      },
      {
        root: null,
        threshold: [0.15, 0.4, 0.7],
        rootMargin: '-10% 0px -25% 0px'
      }
    );

    const heroEl = document.getElementById('hero-section');
    const f1 = document.getElementById('feature-01');
    const f2 = document.getElementById('feature-02');
    const f3 = document.getElementById('feature-03');

    if (heroEl) observer.observe(heroEl);
    if (f1) observer.observe(f1);
    if (f2) observer.observe(f2);
    if (f3) observer.observe(f3);

    // Listen across window, document, and documentElement
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
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

  const filteredHarbors = MAJOR_HARBORS.filter(h => {
    const search = harborSearch.toLowerCase();
    const locName = getLocalizedPortName(h.id, language).toLowerCase();
    const locState = getLocalizedState(h.state, language).toLowerCase();
    const locSea = getLocalizedSea(h.sea, language).toLowerCase();
    return (
      h.name.toLowerCase().includes(search) ||
      h.state.toLowerCase().includes(search) ||
      h.sea.toLowerCase().includes(search) ||
      locName.includes(search) ||
      locState.includes(search) ||
      locSea.includes(search)
    );
  });

  const openAuthFlow = () => {
    setIsOnboardingModalOpen(true);
    setOnboardingStep(user ? 'port' : 'signin');
  };

  const scrollToHero = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveSection('hero');

    const heroEl = document.getElementById('hero-section');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (err) {}
    try {
      (document.scrollingElement || document.documentElement || document.body).scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (err) {}
  };

  const scrollToSection = (e: React.MouseEvent, sectionId: string, sectionKey: 'hero' | '01' | '02' | '03') => {
    e.preventDefault();
    e.stopPropagation();

    setActiveSection(sectionKey);

    if (sectionKey === 'hero' || sectionId === 'hero-section' || sectionId === 'top') {
      scrollToHero();
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#0B131F] text-[#f1f5fb] font-['Work_Sans',sans-serif] selection:bg-[#FBD784]/20 selection:text-[#FBD784] relative overflow-x-hidden">
      
      {/* ── Fixed Minimalist Top Navigation Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B131F]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo & Navigation on Left */}
          <div className="flex items-center gap-4 sm:gap-8">
            <a
              href="#top"
              onClick={scrollToHero}
              className="flex items-center gap-2.5 text-white tracking-wider text-xl sm:text-2xl font-bold cursor-pointer group"
            >
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#FBD784] transition-transform duration-500 group-hover:rotate-45 flex-shrink-0" />
              <span>NavikaAI</span>
            </a>

            {/* Navigation links: Home and Features (Desktop only) */}
            <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-sm sm:text-base font-medium text-slate-300">
              <a
                href="#top"
                onClick={scrollToHero}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t('nav_home', 'Home')}
              </a>
              <a
                href="#feature-01"
                onClick={(e) => scrollToSection(e, 'feature-01', '01')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t('nav_features', 'Features')}
              </a>
            </nav>
          </div>

          {/* Top Actions: Language Selector, Sign In, Get Started, Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Minimalist Language Switcher */}
            <div className="relative flex items-center gap-1 text-xs sm:text-sm text-slate-300 hover:text-white bg-white/5 px-2.5 py-1.5 rounded-full border border-white/10">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FBD784] flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-200 hover:text-white text-xs sm:text-sm font-medium focus:outline-none cursor-pointer pr-3 appearance-none max-w-[85px] sm:max-w-none"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0B131F] text-white">
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 pointer-events-none" />
            </div>

            {user ? (
              <button
                onClick={openAuthFlow}
                className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm tracking-wide transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#FBD784]" />
                <span className="truncate max-w-[100px] sm:max-w-[140px]">{user.name}</span>
                <span className="text-[#FBD784]">→</span>
              </button>
            ) : (
              <>
                <button
                  onClick={openAuthFlow}
                  className="hidden md:inline-block text-sm font-medium text-slate-300 hover:text-white px-2 py-1 transition-colors cursor-pointer"
                >
                  {t('sign_in_nav', 'Sign In')}
                </button>
                <button
                  onClick={openAuthFlow}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-transparent hover:bg-[#FBD784] border border-[#FBD784] text-[#FBD784] hover:text-[#0B131F] font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer"
                >
                  <span>{t('get_started_nav', 'Get Started')}</span>
                  <span className="text-xs">→</span>
                </button>
              </>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {isMobileNavOpen ? <X className="w-5 h-5 text-[#FBD784]" /> : <Menu className="w-5 h-5 text-[#FBD784]" />}
            </button>
          </div>

        </div>

        {/* ── Mobile Slide-Down Nav Drawer ── */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0B131F]/95 backdrop-blur-xl px-5 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2 text-base font-medium text-slate-200">
              <a
                href="#top"
                onClick={(e) => {
                  scrollToHero(e);
                  setIsMobileNavOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span>{t('nav_home', 'Home')}</span>
                <span className="text-xs text-slate-500 font-mono">00</span>
              </a>
              <a
                href="#feature-01"
                onClick={(e) => {
                  scrollToSection(e, 'feature-01', '01');
                  setIsMobileNavOpen(false);
                }}
                className="py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span>{t('nav_features', 'Features')}</span>
                <span className="text-xs text-slate-500 font-mono">01-03</span>
              </a>
              {user ? (
                <button
                  onClick={() => {
                    openAuthFlow();
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/5 text-white"
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FBD784]" />
                    <span className="font-semibold">{user.name}</span>
                  </span>
                  <span className="text-[#FBD784] font-bold">→</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      openAuthFlow();
                      setIsMobileNavOpen(false);
                    }}
                    className="w-full text-center py-3 text-slate-200 hover:text-white rounded-xl border border-white/15 bg-white/5 font-medium cursor-pointer"
                  >
                    {t('sign_in_nav', 'Sign In')}
                  </button>
                  <button
                    onClick={() => {
                      openAuthFlow();
                      setIsMobileNavOpen(false);
                    }}
                    className="w-full text-center py-3 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-bold shadow-md cursor-pointer"
                  >
                    {t('get_started_nav', 'Get Started')} →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Floating Side Social / Telemetry (Left Margin) ── */}
      <div className="hidden 2xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 text-xs font-medium text-slate-400 select-none pointer-events-none">
        <span className="[writing-mode:vertical-lr] tracking-[0.25em] uppercase text-xs text-slate-400 font-semibold">
          {t('sidebar_navic_status', 'NavIC · INSAT-3DR')}
        </span>
        <div className="w-[1px] h-14 bg-white/20 my-1" />
        <Radio className="w-4 h-4 text-[#FBD784]" />
      </div>

      {/* ── User Requested: Floating Right Section Progress Indicator (Start, 01, 02, 03) ── */}
      {/* Prominently scaled, clear click targets, and dynamically tracked on scroll across desktop and mobile */}
      <aside
        aria-label="Section Navigation"
        className="fixed right-1 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-3 sm:gap-8 select-none pointer-events-auto"
      >
        {/* Item: Start */}
        <button
          type="button"
          onClick={(e) => scrollToSection(e, 'hero-section', 'hero')}
          className="group flex items-center gap-1.5 sm:gap-4 py-1 sm:py-2 px-1 sm:px-2.5 cursor-pointer transition-all duration-300"
        >
          <span
            className={`text-[10px] sm:text-base tracking-wider font-bold font-mono px-1 py-0.5 rounded bg-[#0B131F]/70 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none transition-all duration-300 ${
              activeSection === 'hero'
                ? 'text-white scale-105 sm:scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.45)]'
                : 'text-slate-400 group-hover:text-slate-200'
            }`}
          >
            Start
          </span>
          <div
            className={`rounded-full transition-all duration-300 ${
              activeSection === 'hero'
                ? 'w-[2.5px] sm:w-[4px] h-6 sm:h-12 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                : 'w-[2px] h-3.5 sm:h-6 bg-white/25 group-hover:bg-white/50'
            }`}
          />
        </button>

        {/* Item: 01 */}
        <button
          type="button"
          onClick={(e) => scrollToSection(e, 'feature-01', '01')}
          className="group flex items-center gap-1.5 sm:gap-4 py-1 sm:py-2 px-1 sm:px-2.5 cursor-pointer transition-all duration-300"
        >
          <span
            className={`text-[10px] sm:text-base tracking-wider font-bold font-mono px-1 py-0.5 rounded bg-[#0B131F]/70 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none transition-all duration-300 ${
              activeSection === '01'
                ? 'text-white scale-105 sm:scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.45)]'
                : 'text-slate-400 group-hover:text-slate-200'
            }`}
          >
            01
          </span>
          <div
            className={`rounded-full transition-all duration-300 ${
              activeSection === '01'
                ? 'w-[2.5px] sm:w-[4px] h-6 sm:h-12 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                : 'w-[2px] h-3.5 sm:h-6 bg-white/25 group-hover:bg-white/50'
            }`}
          />
        </button>

        {/* Item: 02 */}
        <button
          type="button"
          onClick={(e) => scrollToSection(e, 'feature-02', '02')}
          className="group flex items-center gap-1.5 sm:gap-4 py-1 sm:py-2 px-1 sm:px-2.5 cursor-pointer transition-all duration-300"
        >
          <span
            className={`text-[10px] sm:text-base tracking-wider font-bold font-mono px-1 py-0.5 rounded bg-[#0B131F]/70 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none transition-all duration-300 ${
              activeSection === '02'
                ? 'text-white scale-105 sm:scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.45)]'
                : 'text-slate-400 group-hover:text-slate-200'
            }`}
          >
            02
          </span>
          <div
            className={`rounded-full transition-all duration-300 ${
              activeSection === '02'
                ? 'w-[2.5px] sm:w-[4px] h-6 sm:h-12 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                : 'w-[2px] h-3.5 sm:h-6 bg-white/25 group-hover:bg-white/50'
            }`}
          />
        </button>

        {/* Item: 03 */}
        <button
          type="button"
          onClick={(e) => scrollToSection(e, 'feature-03', '03')}
          className="group flex items-center gap-1.5 sm:gap-4 py-1 sm:py-2 px-1 sm:px-2.5 cursor-pointer transition-all duration-300"
        >
          <span
            className={`text-[10px] sm:text-base tracking-wider font-bold font-mono px-1 py-0.5 rounded bg-[#0B131F]/70 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none transition-all duration-300 ${
              activeSection === '03'
                ? 'text-white scale-105 sm:scale-110 drop-shadow-[0_2px_8px_rgba(255,255,255,0.45)]'
                : 'text-slate-400 group-hover:text-slate-200'
            }`}
          >
            03
          </span>
          <div
            className={`rounded-full transition-all duration-300 ${
              activeSection === '03'
                ? 'w-[2.5px] sm:w-[4px] h-6 sm:h-12 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                : 'w-[2px] h-3.5 sm:h-6 bg-white/25 group-hover:bg-white/50'
            }`}
          />
        </button>
      </aside>

      {/* ── 1. Full-Bleed Atmospheric Ocean Hero Section ── */}
      <section id="hero-section" className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center text-center pl-4 pr-12 sm:pr-16 md:px-6 pt-24 sm:pt-28 pb-16 overflow-hidden scroll-mt-20">
        
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
          
          {/* Kicker with Leading Horizontal Line */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-[#FBD784] text-[11px] sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-5 sm:mb-8">
            <span className="w-6 sm:w-16 h-[2px] bg-[#FBD784] flex-shrink-0" />
            <span className="truncate sm:overflow-visible">{t('kicker_maritime_intelligence', 'A MARITIME INTELLIGENCE PLATFORM')}</span>
          </div>

          {/* User Requested: Original Sovereign Headline */}
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white leading-[1.14] sm:leading-[1.12] tracking-tight break-words">
            {t('hero_headline_1', 'Oceans are')}{' '}
            <span className="italic text-[#e59883] font-serif font-normal">
              {t('hero_wild', 'wild')}
            </span>
            .<br />
            {t('hero_headline_2', 'Intelligence is sovereign.')}
          </h1>

          {/* User Requested: Original Sovereign Subtitle */}
          <p className="mt-5 sm:mt-8 text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl font-normal leading-relaxed">
            {t('hero_desc', 'Harnessing real-time satellite oceanography, physical wave dynamics, and biological potential fishing zones for safe and high-yield Indian Ocean voyages.')}
          </p>

          {/* Action Button */}
          <div className="mt-7 sm:mt-10 w-full flex justify-center">
            <button
              onClick={openAuthFlow}
              className="w-full sm:w-auto max-w-[280px] sm:max-w-none px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-bold text-sm sm:text-lg tracking-wide transition-all shadow-xl hover:scale-102 active:scale-98 cursor-pointer"
            >
              {user ? `${t('change_port', 'Select Port & Enter Bridge')} →` : `${t('begin_voyage_btn', 'Begin Voyage Setup')} →`}
            </button>
          </div>

        </div>

      </section>

      {/* ── 2. Feature Story Sections (Alternating 2-Column MNTN Editorial Style) ── */}
      <main className="relative z-10 max-w-6xl mx-auto pl-4 pr-12 sm:pr-16 md:px-8 lg:px-12 py-16 sm:py-24 space-y-20 sm:space-y-36 overflow-x-hidden">
        
        {/* ── FEATURE 01: SATELLITE OCEANOGRAPHY & SENSORS ── */}
        <section id="feature-01" className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center scroll-mt-24">
          
          {/* Left Column: Narrative with Large Ghost Numeral */}
          <div className="lg:col-span-6 relative">
            {/* Giant Ghost Numeral 01 */}
            <span className="text-[72px] sm:text-[180px] lg:text-[220px] font-bold text-white/[0.05] leading-none absolute -top-8 sm:-top-24 left-0 sm:-left-8 select-none pointer-events-none max-w-full overflow-hidden">
              01
            </span>

            <div className="relative z-10 space-y-3.5 sm:space-y-5">
              {/* Kicker Tag */}
              <div className="flex items-center gap-2.5 sm:gap-3 text-[#FBD784] text-[11px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase">
                <span className="w-6 sm:w-10 h-[2px] bg-[#FBD784] flex-shrink-0" />
                <span>{t('feat_01_tag', '01 · SATELLITE OCEANOGRAPHY')}</span>
              </div>

              {/* Headline */}
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-[1.2] tracking-tight">
                {t('feat_01_title', 'What level of ocean navigator are you?')}
              </h2>

              {/* Narrative Text */}
              <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                {t('feat_01_desc', 'Determining your voyage parameters and operational sea-state thresholds is critical before casting off. NavikaAI continuously synchronizes live INSAT-3DR thermal radiometry, Sentinel-3 altimetry, and coastal radar streams to map high-resolution sea surface temperatures, chlorophyll-a plumes, and tidal drift currents across India\'s Exclusive Economic Zone.')}
              </p>

              {/* Action Link */}
              <div className="pt-1 sm:pt-2">
                <button
                  onClick={openAuthFlow}
                  className="inline-flex items-center gap-2.5 sm:gap-3 text-[#FBD784] hover:text-[#ffe4a0] text-sm sm:text-base md:text-lg font-bold group cursor-pointer transition-colors"
                >
                  <span>{t('feat_01_cta', 'explore live telemetry')}</span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Ocean Satellite Photography Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group aspect-[16/10] sm:aspect-[4/3] bg-gradient-to-br from-[#121c2c] to-[#080d15]">
              <img
                src="/marine_ocean_satellite.jpg"
                alt="Satellite oceanography and thermal front detection"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B131F]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-mono text-slate-200 pointer-events-none">
                <span className="bg-[#0B131F]/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/15">
                  INSAT-3DR · Sea State 2 (Smooth)
                </span>
                <span className="text-[#FBD784] font-bold bg-[#0B131F]/80 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded">100% Offline-Cached</span>
              </div>
            </div>
          </div>

        </section>

        {/* ── FEATURE 02: POTENTIAL FISHING ZONES & FUEL SAVINGS (REVERSED) ── */}
        <section id="feature-02" className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center scroll-mt-24">
          
          {/* Left Column: Marine Vessel / Ocean Fronts Photography Card */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group aspect-[16/10] sm:aspect-[4/3] bg-gradient-to-br from-[#121c2c] to-[#080d15]">
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85"
                alt="Open sea vessel and thermal chlorophyll fronts"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B131F]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-mono text-slate-200 pointer-events-none">
                <span className="bg-[#0B131F]/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/15">
                  Thermal Upwelling · Chlorophyll-a
                </span>
                <span className="text-emerald-400 font-bold bg-[#0B131F]/80 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded">+30% Fuel Savings</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative with Large Ghost Numeral */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            {/* Giant Ghost Numeral 02 */}
            <span className="text-[72px] sm:text-[180px] lg:text-[220px] font-bold text-white/[0.05] leading-none absolute -top-8 sm:-top-24 left-0 sm:-left-8 select-none pointer-events-none max-w-full overflow-hidden">
              02
            </span>

            <div className="relative z-10 space-y-3.5 sm:space-y-5">
              {/* Kicker Tag */}
              <div className="flex items-center gap-2.5 sm:gap-3 text-[#FBD784] text-[11px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase">
                <span className="w-6 sm:w-10 h-[2px] bg-[#FBD784] flex-shrink-0" />
                <span>{t('feat_02_tag', '02 · BIOGEOCHEMICAL DETECTION')}</span>
              </div>

              {/* Headline */}
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-[1.2] tracking-tight">
                {t('feat_02_title', 'Picking the right Fishing Grounds!')}
              </h2>

              {/* Narrative Text */}
              <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                {t('feat_02_desc', 'Traditional artisanal voyages often waste over 180 liters of diesel steaming blindly into barren ocean waters. NavikaAI extracts biophysical thermal convergence gradients and chlorophyll frontals to direct skippers straight to pelagic shoals - slashing transit times, maximizing catch tonnage, and safeguarding small-scale coastal livelihoods.')}
              </p>

              {/* Action Link */}
              <div className="pt-1 sm:pt-2">
                <button
                  onClick={openAuthFlow}
                  className="inline-flex items-center gap-2.5 sm:gap-3 text-[#FBD784] hover:text-[#ffe4a0] text-sm sm:text-base md:text-lg font-bold group cursor-pointer transition-colors"
                >
                  <span>{t('feat_02_cta', 'discover fishing spots')}</span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>

        </section>

        {/* ── FEATURE 03: DETERMINISTIC PHYSICAL SAFETY & NAVIC MESH ── */}
        <section id="feature-03" className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center scroll-mt-24">
          
          {/* Left Column: Narrative with Large Ghost Numeral */}
          <div className="lg:col-span-6 relative">
            {/* Giant Ghost Numeral 03 */}
            <span className="text-[72px] sm:text-[180px] lg:text-[220px] font-bold text-white/[0.05] leading-none absolute -top-8 sm:-top-24 left-0 sm:-left-8 select-none pointer-events-none max-w-full overflow-hidden">
              03
            </span>

            <div className="relative z-10 space-y-3.5 sm:space-y-5">
              {/* Kicker Tag */}
              <div className="flex items-center gap-2.5 sm:gap-3 text-[#FBD784] text-[11px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase">
                <span className="w-6 sm:w-10 h-[2px] bg-[#FBD784] flex-shrink-0" />
                <span>{t('feat_03_tag', '03 · 100% NON-HALLUCINATORY SAFETY')}</span>
              </div>

              {/* Headline */}
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-[1.2] tracking-tight">
                {t('feat_03_title', 'Understanding NavIC Mesh & Sovereign Geofences')}
              </h2>

              {/* Narrative Text */}
              <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                {t('feat_03_desc', 'Maritime safety cannot tolerate generative hallucinations. Our deterministic kinematic engine mathematically models wave breaking limits, shallow shoals, and sovereign International Maritime Boundary Line (IMBL) buffer zones with 0% AI hallucination. Off-grid packets propagate automatically via resilient NavIC LoRa edge mesh devices.')}
              </p>

              {/* Action Link */}
              <div className="pt-1 sm:pt-2">
                <button
                  onClick={openAuthFlow}
                  className="inline-flex items-center gap-2.5 sm:gap-3 text-[#FBD784] hover:text-[#ffe4a0] text-sm sm:text-base md:text-lg font-bold group cursor-pointer transition-colors"
                >
                  <span>{t('feat_03_cta', 'inspect safety engine')}</span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Coastal Headland / Lighthouse Photography Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group aspect-[16/10] sm:aspect-[4/3] bg-gradient-to-br from-[#121c2c] to-[#080d15]">
              <img
                src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85"
                alt="Coastal beacon and deterministic safe navigational fairway"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B131F]/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-mono text-slate-200 pointer-events-none">
                <span className="bg-[#0B131F]/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/15">
                  NavIC Mesh · LoRa Sync
                </span>
                <span className="text-[#FBD784] font-bold bg-[#0B131F]/80 sm:bg-transparent px-2 py-0.5 sm:p-0 rounded">IMBL 48.2 km Buffer</span>
              </div>
            </div>
          </div>

        </section>

        {/* ── 3. Bottom Minimalist Call to Action ── */}
        <section className="pt-8 pb-4 text-center border-t border-white/10">
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className="flex items-center justify-center gap-3 text-[#FBD784] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">
              <span className="w-8 h-[1px] bg-[#FBD784]" />
              <span>{t('cta_ready_tag', 'READY TO CAST OFF?')}</span>
              <span className="w-8 h-[1px] bg-[#FBD784]" />
            </div>
            <h3 className="text-xl sm:text-3xl md:text-4xl font-medium text-white">
              {t('cta_launch_title', 'Launch Your Vessel Setup')}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base md:text-lg font-normal">
              {t('cta_launch_desc', 'Select your coastal harbor, inspect real-time satellite telemetry, and evaluate safe waypoint routes.')}
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={openAuthFlow}
                className="w-full sm:w-auto max-w-[280px] sm:max-w-none px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-bold text-sm sm:text-lg tracking-wide transition-all shadow-xl hover:scale-102 cursor-pointer"
              >
                {t('cta_launch_btn', 'Sign In & Select Port')} →
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ── Minimalist Clean Footer ── */}
      <footer className="relative z-10 border-t border-white/5 bg-[#080d15] py-8 sm:py-10 px-4 sm:px-8 lg:px-12 text-sm text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#FBD784]" />
              <span className="text-white font-bold text-base tracking-tight">NavikaAI</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300 text-xs sm:text-sm">Autonomous Marine Intelligence Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-medium text-slate-300">
            <a href="#top" onClick={scrollToHero} className="hover:text-white transition-colors">{t('nav_home', 'Home')}</a>
            <a href="#feature-01" onClick={(e) => scrollToSection(e, 'feature-01', '01')} className="hover:text-white transition-colors">{t('nav_features', 'Features')}</a>
            <button onClick={openAuthFlow} className="hover:text-white transition-colors cursor-pointer">
              {user ? t('nav_dashboard', 'Dashboard') : t('sign_in_nav', 'Sign In')}
            </button>
          </div>

          <div className="text-slate-400 font-mono text-xs text-center md:text-right">
            Data Feeds: MOSDAC · INCOIS · Coastal AWS · Bhuvan
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ONBOARDING & SIGN-IN MODAL (2-STEP MINIMALIST FLOW)         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {isOnboardingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Minimalist Backdrop */}
          <div
            className="fixed inset-0 bg-[#060a12]/85 backdrop-blur-md transition-opacity"
            onClick={() => setIsOnboardingModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0E1726] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 z-10 text-left font-['Work_Sans',sans-serif]">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setIsOnboardingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step Indicators */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                onboardingStep === 'signin' ? 'bg-[#FBD784] text-[#0B131F]' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                <span>{t('step_1_captain_signin', 'Step 1: Captain Sign In')}</span>
                {user && <Check className="w-3.5 h-3.5" />}
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                onboardingStep === 'port' ? 'bg-[#FBD784] text-[#0B131F]' : 'bg-slate-800 text-slate-400'
              }`}>
                <span>{t('step_2_select_port', 'Step 2: Select Port')}</span>
              </div>
            </div>

            {/* ── STEP 1: CAPTAIN SIGN-IN ── */}
            {onboardingStep === 'signin' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                    {t('mobile_sign_in_card_title', 'Captain Authentication & Vessel Registration')}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 mt-1">
                    {t('mobile_sign_in_card_desc', 'Enter your mobile number to sign in or select one of the demo coastal captains below.')}
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                        {t('phone_number_label', 'Captain Mobile Number (+91)')}
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-base font-mono text-[#FBD784] border-r border-white/10 pr-2.5 font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="98470 12345"
                          className="w-full pl-16 pr-4 py-3 bg-[#0B131F] border border-white/10 rounded-xl text-base font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#FBD784]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 uppercase tracking-wider">
                        {t('otp_code_label', 'OTP Code')}
                      </label>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="1234"
                        className="w-full px-3 py-3 bg-[#0B131F] border border-white/10 rounded-xl text-base font-mono text-center tracking-widest text-[#FBD784] font-bold focus:outline-none focus:border-[#FBD784]"
                      />
                    </div>
                  </div>

                  {/* 1-Click Quick Demo Captain Profiles */}
                  <div>
                    <span className="text-xs sm:text-sm uppercase text-slate-300 tracking-wider font-semibold block mb-2">
                      {t('quick_captains_label', 'Quick Demo Captain Profiles (1-Click Selection)')}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9847012345', "Capt. Xavier D'Souza", 'Matsya Sagar I', 'kochi')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Xavier')
                            ? 'bg-[#152238] border-[#FBD784] text-white'
                            : 'bg-[#0B131F] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="font-bold text-sm sm:text-base text-white">Capt. Xavier D'Souza</div>
                        <div className="text-xs sm:text-sm text-slate-300 mt-0.5">Fort Kochi · Matsya Sagar I (Trawler)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9444012345', 'Capt. K. Murugan', 'Meenavan 3', 'chennai')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Murugan')
                            ? 'bg-[#152238] border-[#FBD784] text-white'
                            : 'bg-[#0B131F] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="font-bold text-sm sm:text-base text-white">Capt. K. Murugan</div>
                        <div className="text-xs sm:text-sm text-slate-300 mt-0.5">Royapuram, Chennai · Meenavan 3</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9820012345', 'Capt. Ramesh Patil', 'Sagar Ratna', 'mumbai')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Ramesh')
                            ? 'bg-[#152238] border-[#FBD784] text-white'
                            : 'bg-[#0B131F] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="font-bold text-sm sm:text-base text-white">Capt. Ramesh Patil</div>
                        <div className="text-xs sm:text-sm text-slate-300 mt-0.5">Sassoon Dock, Mumbai · Sagar Ratna</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => selectQuickSkipper('9437012345', 'Capt. Somnath Jena', 'Kalinga Sea', 'paradip')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          captainNameInput.includes('Somnath')
                            ? 'bg-[#152238] border-[#FBD784] text-white'
                            : 'bg-[#0B131F] border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                      >
                        <div className="font-bold text-sm sm:text-base text-white">Capt. Somnath Jena</div>
                        <div className="text-xs sm:text-sm text-slate-300 mt-0.5">Paradip Harbor · Kalinga Sea</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Step 1 */}
                <div className="pt-2">
                  <button
                    onClick={handleCaptainSignIn}
                    disabled={isAuthenticating}
                    className="w-full py-4 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-bold text-base tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>{t('enter_app_button', 'Authenticate & Proceed to Port Selection')}</span>
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
                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      {t('port_selection_heading', 'Select Departure Port / Coastal Harbor')}
                    </h3>
                    <button
                      onClick={() => setOnboardingStep('signin')}
                      className="text-xs sm:text-sm text-[#FBD784] hover:underline cursor-pointer"
                    >
                      ← {t('switch_captain', 'Switch Captain')}
                    </button>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 mt-1">
                    {t('port_selection_sub', 'Calibrate departure harbor or acquire live GPS coordinates.')}
                  </p>
                </div>

                {/* Sub-tabs: Harbors / GPS / Manual */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0B131F] border border-white/10 max-w-md">
                  <button
                    onClick={() => setPortTab('harbors')}
                    className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      portTab === 'harbors' ? 'bg-[#FBD784] text-[#0B131F]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('select_harbor', 'Major Harbors')}
                  </button>
                  <button
                    onClick={() => setPortTab('gps')}
                    className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      portTab === 'gps' ? 'bg-[#FBD784] text-[#0B131F]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('use_gps', 'Detect Live GPS')}
                  </button>
                  <button
                    onClick={() => setPortTab('manual')}
                    className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      portTab === 'manual' ? 'bg-[#FBD784] text-[#0B131F]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t('custom_coords', 'Manual Coords')}
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
                        className="w-full pl-10 pr-4 py-3 bg-[#0B131F] border border-white/10 rounded-xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-[#FBD784]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {filteredHarbors.map((h) => {
                        const isSelected = selectedHarbor.id === h.id;
                        const localizedPort = getLocalizedPortName(h.id, language);
                        const localizedState = getLocalizedState(h.state, language);
                        const localizedSea = getLocalizedSea(h.sea, language);

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
                              <span className="font-bold text-sm sm:text-base text-white">{localizedPort}</span>
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 text-[#FBD784]">
                                {localizedState}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#FBD784]" />
                              <span>{localizedSea} · {h.latitude.toFixed(2)}°N, {h.longitude.toFixed(2)}°E</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-2 truncate">
                              Species: {getLocalizedSpecies(h.species, language).join(', ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleConfirmPort(selectedHarbor)}
                      className="w-full py-4 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-bold text-base tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Anchor className="w-5 h-5" />
                      <span>{t('launch_navigation_button', 'Confirm Port & Launch Navigation')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Tab B: Detect Live GPS */}
                {portTab === 'gps' && (
                  <div className="p-6 rounded-2xl bg-[#0B131F] border border-white/10 text-center space-y-4">
                    <Crosshair className="w-10 h-10 text-[#FBD784] mx-auto animate-pulse" />
                    <h4 className="text-lg font-semibold text-white">Acquire Satellite GPS Fix</h4>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
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
                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm cursor-pointer"
                      >
                        Detect Location
                      </button>

                      {gpsCoords && (
                        <button
                          onClick={handleConfirmGPS}
                          className="px-5 py-2.5 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-bold text-sm cursor-pointer shadow-md"
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
                    <p className="text-sm text-slate-300">
                      Specify exact decimal coordinates within the Indian Exclusive Economic Zone.
                    </p>

                    {manualError && (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                        {manualError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Latitude (°N)</label>
                        <input
                          type="text"
                          value={manualLat}
                          onChange={(e) => setManualLat(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[#162132] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FBD784]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Longitude (°E)</label>
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
                      className="w-full py-3.5 rounded-xl bg-[#FBD784] hover:bg-[#ffe29a] text-[#0B131F] font-bold text-base cursor-pointer shadow-md"
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
