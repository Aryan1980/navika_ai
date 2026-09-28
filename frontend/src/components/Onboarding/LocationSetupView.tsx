import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coordinates } from '../../types/marine';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../utils/translations';

interface HarborOption {
  id: string;
  name: string;
  state: string;
  sea: string;
  latitude: number;
  longitude: number;
  species: string[];
}

const MAJOR_HARBORS: HarborOption[] = [
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

  // Location Calibration Sub-tab (Port / GPS / Manual)
  const [activeTab, setActiveTab] = useState<'harbor' | 'gps' | 'manual'>('harbor');
  const [selectedHarbor, setSelectedHarbor] = useState<HarborOption>(MAJOR_HARBORS[0]);
  
  // GPS State
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsCoords, setGpsCoords] = useState<Coordinates | null>(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string>('');

  // Manual Coordinates State
  const [manualLat, setManualLat] = useState<string>('9.9650');
  const [manualLon, setManualLon] = useState<string>('76.2220');
  const [manualError, setManualError] = useState<string>('');

  // Step 1: Sign-In Form State
  const [phoneInput, setPhoneInput] = useState('9847012345');
  const [otpInput, setOtpInput] = useState('1234');
  const [captainNameInput, setCaptainNameInput] = useState("Capt. Xavier D'Souza");
  const [vesselNameInput, setVesselNameInput] = useState('Matsya Sagar I');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  // Quick selection helper for demonstration
  const selectQuickSkipper = (phone: string, capName: string, boat: string, harborId: string) => {
    setPhoneInput(phone);
    setCaptainNameInput(capName);
    setVesselNameInput(boat);
    setOtpInput('1234');
    const match = MAJOR_HARBORS.find(h => h.id === harborId);
    if (match) setSelectedHarbor(match);
  };

  // Step 1 -> Step 2 transition: Authenticate captain
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

    if (!success) {
      setAuthError('Authentication failed. Please verify code or try again.');
    }
    // Note: Upon success, user is set, transitioning view to Step 2 (Port Selection)!
  };

  // Step 2 Action: Harbor Selection Confirmation
  const handleConfirmHarbor = (harbor: HarborOption) => {
    setSelectedHarbor(harbor);
    confirmLocation(
      { latitude: harbor.latitude, longitude: harbor.longitude },
      `${harbor.name}, ${harbor.state}`
    );
  };

  // Step 2 Action: GPS Detection
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
        if (error.code === error.PERMISSION_DENIED) {
          setGpsErrorMsg('Location permission was denied. You can select a coastal harbor or enter coordinates manually.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsErrorMsg('Satellite GPS signal unavailable. Please select a harbor or enter coordinates.');
        } else {
          setGpsErrorMsg(`GPS acquisition timed out (${error.message}).`);
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  // Step 2 Action: GPS Confirmation
  const handleConfirmGPS = () => {
    if (gpsCoords) {
      confirmLocation(gpsCoords, `GPS Fix (${gpsCoords.latitude}°N, ${gpsCoords.longitude}°E)`);
    }
  };

  // Step 2 Action: Manual Coordinates Confirmation
  const handleConfirmManual = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || isNaN(lon)) {
      setManualError('Please enter valid numerical coordinates.');
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setManualError('Latitude must be between -90 and 90, Longitude between -180 and 180.');
      return;
    }

    setManualError('');
    confirmLocation({ latitude: lat, longitude: lon }, `Custom: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`);
  };

  return (
    <div className="min-h-screen text-[#f1f5fb] flex flex-col justify-between selection:bg-[#384959] selection:text-[#BDDDFC] bg-[#151926] font-sans">
      
      {/* ── Ambient Background Glow (Stormy morning tones) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#384959]/20 via-[#6A89A7]/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[#384959]/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-[#6A89A7]/10 rounded-full blur-[140px]" />
      </div>

      {/* ── Top Navigation Bar ── */}
      <header className="relative z-20 border-b border-[#384959]/60 bg-[#161c27]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#384959] border border-[#6A89A7]/40 flex items-center justify-center text-[#88BDF2] shadow-sm">
              <Compass className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-heading font-bold text-base tracking-tight text-white flex items-center gap-1">
                Samudra<span className="text-[#88BDF2] font-semibold">AI</span>
              </div>
              <p className="text-[10px] text-[#BDDDFC]/70 font-mono tracking-wider">
                {getTranslation('maritime_platform', language)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e2634] border border-[#384959] text-xs">
              <Globe className="w-3.5 h-3.5 text-[#88BDF2]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[#BDDDFC] text-xs font-medium focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#161c27] text-white">
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Captain Header State */}
            {user && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#262B40] hover:bg-[#384959] border border-[#6A89A7]/40 text-xs text-white transition-all shadow-sm cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#88BDF2]" />
                  <span className="font-medium">{user.name}</span>
                </button>
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 rounded-xl border border-[#384959] hover:border-rose-700/60 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 transition-colors cursor-pointer flex items-center gap-1"
                  title={getTranslation('switch_captain', language)}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{getTranslation('switch_captain', language)}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Viewport Content ── */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* STEP 1: CAPTAIN SIGN-IN & AUTHENTICATION (When !user)       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {!user ? (
          <div className="space-y-12">
            
            {/* Hero Editorial Branding (Glitch-free headline) */}
            <section className="text-center pt-4 pb-2 space-y-4">
              <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-white leading-[1.15] tracking-tight max-w-5xl mx-auto">
                <span>{getTranslation('hero_headline_1', language)} <span className="italic text-[#e59883] font-editorial">{getTranslation('hero_wild', language)}</span>.</span>
                <br />
                <span className="block mt-1">{getTranslation('hero_headline_2', language)}</span>
              </h1>

              <p className="text-sm sm:text-base text-[#BDDDFC]/90 max-w-2xl mx-auto font-light leading-relaxed">
                {getTranslation('hero_desc', language)}
              </p>
            </section>

            {/* Step 1 Sign-In Card */}
            <section className="max-w-3xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#1a222f] border border-[#384959] shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#384959]/60">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#384959]/60 border border-[#88BDF2]/40 text-[#88BDF2] text-xs font-mono mb-2">
                    <Ship className="w-3.5 h-3.5 text-[#88BDF2]" />
                    <span>{getTranslation('step_1_captain_signin', language)}</span>
                  </div>
                  <h2 className="font-editorial text-2xl text-white font-normal">
                    {getTranslation('mobile_sign_in_card_title', language)}
                  </h2>
                  <p className="text-xs text-[#BDDDFC]/80 mt-1">
                    {getTranslation('mobile_sign_in_card_desc', language)}
                  </p>
                </div>

                {/* Operating Language Selector Pills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-[#BDDDFC]/70 uppercase tracking-wider block font-semibold">
                    {getTranslation('select_language', language)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setLanguage(l.code)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                          language === l.code
                            ? 'bg-[#384959] border-[#88BDF2] text-white shadow-sm'
                            : 'bg-[#12161f] border-[#384959]/60 text-[#BDDDFC]/70 hover:text-white hover:bg-[#20273a]'
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Mobile + OTP Input */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[#BDDDFC] mb-1.5 uppercase tracking-wider">
                      {getTranslation('phone_number_label', language)}
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
                        className="w-full pl-16 pr-4 py-2.5 bg-[#12161f] border border-[#384959] rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#88BDF2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#BDDDFC] mb-1.5 uppercase tracking-wider">
                      {getTranslation('otp_code_label', language)}
                    </label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="1234"
                      className="w-full px-3 py-2.5 bg-[#12161f] border border-[#384959] rounded-xl text-sm font-mono text-center tracking-widest text-[#88BDF2] font-bold focus:outline-none focus:border-[#88BDF2]"
                    />
                  </div>
                </div>

                {/* Quick Profile Presets */}
                <div className="pt-2">
                  <span className="text-xs uppercase tracking-wider text-[#BDDDFC] font-semibold block mb-2.5">
                    {getTranslation('quick_captains_label', language)}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => selectQuickSkipper('9847012345', "Capt. Xavier D'Souza", 'Matsya Sagar I', 'kochi')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        phoneInput === '9847012345'
                          ? 'bg-[#384959]/80 border-[#88BDF2] shadow-sm'
                          : 'bg-[#12161f] border-[#384959] hover:border-[#6A89A7]'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold text-white">Capt. Xavier D'Souza</div>
                      <div className="text-xs text-[#BDDDFC]/80 truncate mt-0.5">Fort Kochi • Matsya Sagar I</div>
                      <div className="text-xs font-mono text-[#88BDF2] mt-1 font-semibold">+91 98470 12345</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectQuickSkipper('9446289012', 'Capt. Mohan Raj', 'Neela Nayaki', 'chennai')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        phoneInput === '9446289012'
                          ? 'bg-[#384959]/80 border-[#88BDF2] shadow-sm'
                          : 'bg-[#12161f] border-[#384959] hover:border-[#6A89A7]'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold text-white">Capt. Mohan Raj</div>
                      <div className="text-xs text-[#BDDDFC]/80 truncate mt-0.5">Chennai • Neela Nayaki</div>
                      <div className="text-xs font-mono text-[#88BDF2] mt-1 font-semibold">+91 94462 89012</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectQuickSkipper('9820011223', 'Capt. Ramesh Patil', 'Sagar Jyoti', 'mumbai')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        phoneInput === '9820011223'
                          ? 'bg-[#384959]/80 border-[#88BDF2] shadow-sm'
                          : 'bg-[#12161f] border-[#384959] hover:border-[#6A89A7]'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold text-white">Capt. Ramesh Patil</div>
                      <div className="text-xs text-[#BDDDFC]/80 truncate mt-0.5">Mumbai • Sagar Jyoti</div>
                      <div className="text-xs font-mono text-[#88BDF2] mt-1 font-semibold">+91 98200 11223</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button to advance to Step 2 */}
              <div className="pt-3 border-t border-[#384959]/60 flex justify-end">
                <button
                  type="button"
                  disabled={isAuthenticating}
                  onClick={handleCaptainSignIn}
                  className="btn-signature w-full sm:w-auto px-7 py-3.5 cursor-pointer group shadow-lg text-sm"
                >
                  {isAuthenticating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#BDDDFC]" />
                  ) : (
                    <>
                      <span>{getTranslation('enter_app_button', language)}</span>
                      <span className="text-[#BDDDFC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Marine Satellite Hero Banner (Stormy morning colors) */}
            <section className="relative rounded-2xl overflow-hidden border border-[#384959] shadow-xl bg-[#191F30]">
              <div className="relative h-56 sm:h-72 w-full overflow-hidden">
                <img
                  src="/marine_ocean_satellite.jpg"
                  alt="Deep Sapphire Ocean Currents"
                  className="w-full h-full object-cover object-center opacity-85 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151926] via-transparent to-[#151926]/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#151926]/80 via-transparent to-[#151926]/80" />

                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2.5">
                  <div className="px-3 py-1.5 rounded-lg bg-[#151926]/90 backdrop-blur-md border border-[#384959] text-xs font-mono text-[#BDDDFC] flex items-center gap-1.5 font-semibold">
                    <Waves className="w-3.5 h-3.5 text-[#88BDF2]" />
                    <span>Oceansat-3 Multi-spectral Swath</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#151926]/90 backdrop-blur-md border border-[#384959] text-xs font-mono text-[#88BDF2] flex items-center gap-1.5 font-semibold">
                    <Fish className="w-3.5 h-3.5 text-[#88BDF2]" />
                    <span>8 Ranked Seaward PFZ Zones</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-lg">
                  <span className="text-[10px] font-mono text-[#88BDF2] tracking-wider uppercase block font-bold">
                    {getTranslation('telemetry_live', language)}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-white mt-1">
                    Sub-kilometer SST thermal fronts & coastal upwelling convergence zones calibrated every 6 hours.
                  </p>
                </div>
              </div>
            </section>

          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════ */
          /* STEP 2: DEPARTURE PORT & LOCATION SELECTION (When user set) */
          /* ═══════════════════════════════════════════════════════════ */
          <div className="space-y-8 max-w-4xl mx-auto w-full">
            
            {/* Header / Intro for Step 2 */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#384959]/60 border border-[#88BDF2]/40 text-[#88BDF2] text-xs font-mono font-semibold">
                <Crosshair className="w-3.5 h-3.5 text-[#88BDF2]" />
                <span>{getTranslation('step_2_select_port', language)}</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
                {getTranslation('calibrate_port_step2_title', language)}
              </h2>
              <p className="text-xs sm:text-sm text-[#BDDDFC] max-w-xl mx-auto leading-relaxed">
                {getTranslation('calibrate_port_step2_desc', language)}
              </p>

              {/* Authenticated Captain Pill */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1a222f] border border-[#384959] text-xs text-[#BDDDFC]">
                <div className="w-6 h-6 rounded-full bg-[#384959] text-[#88BDF2] flex items-center justify-center font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>
                  Signed in as <strong className="text-white font-semibold">{user.name}</strong> ({user.vessel_name})
                </span>
                <span className="text-[#384959]">|</span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-rose-300 hover:text-rose-200 underline cursor-pointer font-medium"
                >
                  {getTranslation('switch_captain', language)}
                </button>
              </div>
            </div>

            {/* Calibration Module Container */}
            <div className="rounded-2xl shadow-2xl overflow-hidden bg-[#1a222f] border border-[#384959]">
              
              {/* Navigation Tabs */}
              <div className="flex border-b border-[#384959]/60 bg-[#12161f] p-2 gap-2 text-xs sm:text-sm font-medium">
                <button
                  onClick={() => setActiveTab('harbor')}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'harbor'
                      ? 'bg-[#384959] text-white font-bold border border-[#88BDF2]/40 shadow-sm'
                      : 'text-[#BDDDFC]/70 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <Anchor className="w-4 h-4 text-[#88BDF2]" />
                  <span>{getTranslation('select_harbor', language)}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('gps');
                    if (gpsStatus === 'idle') handleDetectGPS();
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'gps'
                      ? 'bg-[#384959] text-white font-bold border border-[#88BDF2]/40 shadow-sm'
                      : 'text-[#BDDDFC]/70 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <Navigation className="w-4 h-4 text-[#88BDF2]" />
                  <span>{getTranslation('use_gps', language)}</span>
                </button>

                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'manual'
                      ? 'bg-[#384959] text-white font-bold border border-[#88BDF2]/40 shadow-sm'
                      : 'text-[#BDDDFC]/70 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#88BDF2]" />
                  <span>{getTranslation('custom_coords', language)}</span>
                </button>
              </div>

              {/* Mode 1: Major Coastal Harbors */}
              {activeTab === 'harbor' && (
                <div className="p-6">
                  <div className="text-xs text-[#BDDDFC] mb-4 flex items-center justify-between font-mono">
                    <span className="font-semibold">Select departure harbor along the Indian coastline:</span>
                    <span className="text-[#88BDF2] font-bold">{MAJOR_HARBORS.length} Coastal Ports</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                    {MAJOR_HARBORS.map((h) => {
                      const isSelected = selectedHarbor.id === h.id;
                      return (
                        <div
                          key={h.id}
                          onClick={() => setSelectedHarbor(h)}
                          onDoubleClick={() => handleConfirmHarbor(h)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#222d3d] border-[#88BDF2] shadow-[0_0_18px_rgba(136,189,242,0.18)] ring-1 ring-[#88BDF2]/50'
                              : 'bg-[#151a24] border-[#384959] hover:bg-[#1d2533] hover:border-[#6A89A7]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold text-sm text-white flex items-center gap-2">
                                <Anchor className={`w-4 h-4 ${isSelected ? 'text-[#88BDF2]' : 'text-[#6A89A7]'}`} />
                                <span>{h.name}</span>
                              </div>
                              <div className="text-xs text-[#BDDDFC]/80 mt-1">
                                {h.state} • <span className="text-[#88BDF2] font-medium">{h.sea}</span>
                              </div>
                            </div>

                            <span className="font-mono text-xs text-[#BDDDFC] px-2 py-0.5 rounded bg-[#263140] border border-[#6A89A7]/40 font-semibold">
                              {h.latitude.toFixed(2)}°N, {h.longitude.toFixed(2)}°E
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-[#384959]/50 flex items-center justify-between text-xs">
                            <span className="text-[#BDDDFC]/80 flex items-center gap-1.5">
                              <Fish className="w-3.5 h-3.5 text-[#88BDF2]" />
                              <span className="truncate max-w-[160px] text-slate-300 font-mono text-[11px]">{h.species.slice(0, 2).join(', ')}</span>
                            </span>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmHarbor(h);
                              }}
                              className="btn-signature btn-signature-sm !py-1.5 !px-3 !text-xs group"
                            >
                              <span>Select Port</span>
                              <span className="transition-transform group-hover:translate-x-0.5 font-sans">→</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Confirm Bar */}
                  <div className="mt-6 pt-4 border-t border-[#384959]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs sm:text-sm text-[#BDDDFC] font-mono">
                      Selected: <strong className="font-bold text-white">{selectedHarbor.name}</strong> ({selectedHarbor.state})
                    </div>
                    <button
                      onClick={() => handleConfirmHarbor(selectedHarbor)}
                      className="btn-signature w-full sm:w-auto px-6 py-3 cursor-pointer group shadow-lg text-xs sm:text-sm"
                    >
                      <span>{getTranslation('launch_navigation_button', language)}</span>
                      <span className="text-[#BDDDFC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 2: Live GPS */}
              {activeTab === 'gps' && (
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[340px]">
                  {gpsStatus === 'locating' && (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#384959]/60 border border-[#88BDF2]/50 flex items-center justify-center mx-auto text-[#88BDF2]">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">Acquiring High-Precision GPS Fix...</h4>
                        <p className="text-xs sm:text-sm text-[#BDDDFC] mt-1 max-w-sm mx-auto">
                          Connecting to device GNSS receiver to resolve vessel latitude and longitude.
                        </p>
                      </div>
                    </div>
                  )}

                  {gpsStatus === 'success' && gpsCoords && (
                    <div className="space-y-5 max-w-md w-full">
                      <div className="w-16 h-16 rounded-2xl bg-[#384959] border border-[#88BDF2]/60 flex items-center justify-center mx-auto text-[#88BDF2] shadow-md">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Satellite Position Acquired</h4>
                        <p className="text-xs sm:text-sm text-[#BDDDFC] mt-1">Live coordinates verified with high GNSS accuracy.</p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#12161f] border border-[#384959] font-mono text-center shadow-inner">
                        <div className="text-xs text-[#BDDDFC]/70 mb-1 font-semibold uppercase">Vessel Position:</div>
                        <div className="text-2xl font-bold text-[#BDDDFC]">
                          {gpsCoords.latitude.toFixed(4)}°N, {gpsCoords.longitude.toFixed(4)}°E
                        </div>
                      </div>

                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          onClick={handleDetectGPS}
                          className="px-4 py-2.5 rounded-xl bg-[#263140] hover:bg-[#384959] text-xs sm:text-sm text-[#BDDDFC] hover:text-white border border-[#6A89A7]/40 cursor-pointer transition-colors"
                        >
                          Re-scan GPS
                        </button>
                        <button
                          onClick={handleConfirmGPS}
                          className="btn-signature group text-xs sm:text-sm px-5 py-2.5"
                        >
                          <span>{getTranslation('launch_navigation_button', language)}</span>
                          <span className="text-[#BDDDFC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {gpsStatus === 'error' && (
                    <div className="space-y-4 max-w-md">
                      <div className="w-16 h-16 rounded-2xl bg-[#384959]/60 border border-rose-800/50 flex items-center justify-center mx-auto text-rose-300">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">GPS Unavailable</h4>
                        <p className="text-xs sm:text-sm text-rose-200 mt-1.5 leading-relaxed bg-rose-950/40 border border-rose-800/40 p-3.5 rounded-xl">
                          {gpsErrorMsg}
                        </p>
                      </div>
                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          onClick={handleDetectGPS}
                          className="px-4 py-2 rounded-xl bg-[#263140] hover:bg-[#384959] text-xs sm:text-sm text-[#BDDDFC] border border-[#6A89A7]/40 cursor-pointer"
                        >
                          Try Again
                        </button>
                        <button
                          onClick={() => setActiveTab('harbor')}
                          className="px-4 py-2 rounded-xl bg-[#384959] hover:bg-[#6A89A7] text-xs sm:text-sm text-white cursor-pointer font-semibold"
                        >
                          Select Coastal Harbor
                        </button>
                      </div>
                    </div>
                  )}

                  {gpsStatus === 'idle' && (
                    <div className="space-y-4">
                      <p className="text-xs sm:text-sm text-[#BDDDFC]">Click below to fetch your vessel GPS fix via browser GNSS API.</p>
                      <button
                        onClick={handleDetectGPS}
                        className="btn-signature text-xs sm:text-sm px-5 py-2.5"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Detect Live Position</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 3: Manual Coordinates */}
              {activeTab === 'manual' && (
                <form onSubmit={handleConfirmManual} className="p-8 max-w-md mx-auto space-y-4">
                  <div className="text-center space-y-1 mb-4">
                    <h4 className="text-base font-bold text-white">Enter Direct Nautical Coordinates</h4>
                    <p className="text-xs sm:text-sm text-[#BDDDFC]">
                      Provide target decimal degrees for offshore operations.
                    </p>
                  </div>

                  {manualError && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
                      {manualError}
                    </div>
                  )}

                  <div className="space-y-3 font-mono">
                    <div>
                      <label className="block text-xs font-semibold text-[#BDDDFC] uppercase mb-1.5">Latitude (°N)</label>
                      <input
                        type="text"
                        value={manualLat}
                        onChange={(e) => setManualLat(e.target.value)}
                        placeholder="e.g. 9.9650"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#12161f] border border-[#384959] text-white text-sm focus:outline-none focus:border-[#88BDF2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#BDDDFC] uppercase mb-1.5">Longitude (°E)</label>
                      <input
                        type="text"
                        value={manualLon}
                        onChange={(e) => setManualLon(e.target.value)}
                        placeholder="e.g. 76.2220"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#12161f] border border-[#384959] text-white text-sm focus:outline-none focus:border-[#88BDF2]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn-signature w-full py-3 group text-xs sm:text-sm"
                    >
                      <span>{getTranslation('launch_navigation_button', language)}</span>
                      <span className="text-[#BDDDFC] transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </main>

      {/* ── Minimalist Clean Footer ── */}
      <footer className="border-t border-[#384959]/60 bg-[#12161f] py-5 px-6 text-center text-xs text-[#BDDDFC]/70 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>SamudraAI • Operational Oceanography & AI Navigation Platform</span>
          <span>Calibrated for Indian Exclusive Economic Zone (EEZ)</span>
        </div>
      </footer>

    </div>
  );
};
