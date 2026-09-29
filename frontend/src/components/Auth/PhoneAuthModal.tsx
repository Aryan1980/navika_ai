import React, { useState } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  Anchor,
  Ship,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Loader2,
  KeyRound,
  UserCheck,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../utils/translations';

export const PhoneAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithPhone, user, language, setLanguage } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [vesselType, setVesselType] = useState('Mechanized Gillnetter / Trawler (18m)');
  const [homePort, setHomePort] = useState('Fort Kochi Coastal Harbor, Kerala');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg('');
    setStep('phone');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setOtp('1234'); // Pre-fill test OTP for frictionless experience
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMsg('Please enter the 4-digit code (use 1234).');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    const success = await loginWithPhone(
      phoneNumber,
      otp,
      name || undefined,
      vesselName || undefined,
      vesselType || undefined,
      homePort || undefined
    );
    setIsLoading(false);

    if (success) {
      handleClose();
    } else {
      setErrorMsg('Unable to verify OTP. Please try again.');
    }
  };

  const selectDemoCaptain = (phone: string, capName: string, boat: string, port: string) => {
    setPhoneNumber(phone);
    setName(capName);
    setVesselName(boat);
    setHomePort(port);
    setStep('otp');
    setOtp('1234');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-[#161c27] border border-[#384959] rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header decoration bar with Stormy morning palette */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#384959] via-[#6A89A7] to-[#88BDF2]" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#384959]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#384959]/50 border border-[#6A89A7]/40 flex items-center justify-center text-[#88BDF2]">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-[#BDDDFC]">
                {getTranslation('captain_sign_in', language)}
              </h3>
              <p className="text-xs text-[#6A89A7]">
                {getTranslation('sync_voyages', language)}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#384959]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Language Selection Grid */}
          <div className="p-3 rounded-xl bg-[#12161f] border border-[#384959]/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#6A89A7] uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#88BDF2]" />
                <span>{getTranslation('select_language', language)}</span>
              </span>
              <span className="text-[10px] font-mono text-[#88BDF2]">
                {SUPPORTED_LANGUAGES.find(l => l.code === language)?.nativeName}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                    language === l.code
                      ? 'bg-[#384959] border-[#88BDF2] text-white shadow-sm'
                      : 'bg-[#161c27] border-[#384959]/60 text-[#BDDDFC]/70 hover:text-white hover:bg-[#20273a]'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span className="truncate">{l.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1.5 uppercase tracking-wider">
                  {getTranslation('phone_number_label', language)}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-mono text-[#6A89A7] border-r border-[#384959] pr-2.5">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98470 12345"
                    className="w-full pl-16 pr-4 py-2.5 bg-[#0f141d] border border-[#384959] rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2] transition-colors"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-[#6A89A7] mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#88BDF2]" />
                  A single OTP logs you into your vessel's maritime logbook.
                </p>
              </div>

              {/* Quick Profile Presets for Demonstration */}
              <div className="pt-1">
                <span className="text-[11px] uppercase tracking-wider text-[#6A89A7] font-semibold block mb-2">
                  {getTranslation('quick_captains_label', language)}
                </span>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => selectDemoCaptain('9847012345', "Capt. Xavier D'Souza", 'Matsya Sagar I', 'Fort Kochi Coastal Harbor')}
                    className="w-full text-left p-2.5 rounded-xl bg-[#1e2634]/60 hover:bg-[#384959]/50 border border-[#384959]/60 hover:border-[#6A89A7] transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-medium text-[#BDDDFC] group-hover:text-white">Capt. Xavier D'Souza</div>
                      <div className="text-[11px] text-[#6A89A7]">Fort Kochi • Matsya Sagar I (Trawler)</div>
                    </div>
                    <span className="text-xs font-mono text-[#88BDF2] group-hover:translate-x-0.5 transition-transform">98470 12345 →</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectDemoCaptain('9446289012', 'Capt. Mohan Raj', 'Neela Nayaki', 'Royapuram, Chennai')}
                    className="w-full text-left p-2.5 rounded-xl bg-[#1e2634]/60 hover:bg-[#384959]/50 border border-[#384959]/60 hover:border-[#6A89A7] transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-medium text-[#BDDDFC] group-hover:text-white">Capt. Mohan Raj</div>
                      <div className="text-[11px] text-[#6A89A7]">Chennai • Neela Nayaki (Fiberglass 12m)</div>
                    </div>
                    <span className="text-xs font-mono text-[#88BDF2] group-hover:translate-x-0.5 transition-transform">94462 89012 →</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-2.5 px-4 bg-[#6A89A7] hover:bg-[#88BDF2] text-[#0f141d] font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Proceed with OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-[#1e2634]/60 border border-[#384959] flex items-center justify-between text-xs">
                <span className="text-[#6A89A7]">Signing in as:</span>
                <span className="font-mono text-[#88BDF2] font-semibold">+91 {phoneNumber}</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1.5 uppercase tracking-wider">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full px-4 py-2.5 bg-[#0f141d] border border-[#384959] rounded-xl text-base font-mono tracking-widest text-center text-white placeholder-slate-500 focus:outline-none focus:border-[#88BDF2] focus:ring-1 focus:ring-[#88BDF2]"
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-[#6A89A7]">
                  <span>Demo Code: <strong className="text-[#88BDF2] font-mono">1234</strong></span>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[#88BDF2] hover:underline"
                  >
                    Change Number
                  </button>
                </div>
              </div>

              {/* Optional Vessel Customization */}
              <div className="pt-2 border-t border-[#384959]/50 space-y-2.5">
                <span className="text-[11px] font-semibold text-[#BDDDFC] uppercase tracking-wider block">
                  Captain & Vessel Details
                </span>
                <div>
                  <input
                    type="text"
                    placeholder="Captain Full Name (e.g. Xavier D'Souza)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#0f141d] border border-[#384959] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#88BDF2]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Vessel Name (e.g. Matsya Sagar)"
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-[#0f141d] border border-[#384959] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#88BDF2]"
                  />
                  <input
                    type="text"
                    placeholder="Home Port (e.g. Kochi)"
                    value={homePort}
                    onChange={(e) => setHomePort(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-[#0f141d] border border-[#384959] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#88BDF2]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-2.5 px-4 bg-[#6A89A7] hover:bg-[#88BDF2] text-[#0f141d] font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Confirm & Access Maritime Profile</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
