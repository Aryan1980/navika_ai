import React, { useState } from 'react';
import {
  X,
  User,
  Ship,
  Anchor,
  Compass,
  MapPin,
  Calendar,
  Fuel,
  Fish,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  Clock,
  FileText,
  LogOut,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VoyageLog } from '../../types/marine';

export const CaptainProfileModal: React.FC = () => {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    user,
    voyages,
    updateProfile,
    logout,
    logNewVoyage,
    setIsAuthModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'log_new' | 'edit'>('history');

  // Edit profile form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editVessel, setEditVessel] = useState(user?.vessel_name || '');
  const [editType, setEditType] = useState(user?.vessel_type || '');
  const [editPort, setEditPort] = useState(user?.home_port || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // New voyage form state
  const [newVoyageDate, setNewVoyageDate] = useState(new Date().toISOString().split('T')[0]);
  const [originName, setOriginName] = useState(user?.home_port || 'Fort Kochi Coastal Harbor');
  const [destName, setDestName] = useState('Chellanam PFZ Sector 3');
  const [distNm, setDistNm] = useState('24.5');
  const [durationHours, setDurationHours] = useState('5.5');
  const [fuelLiters, setFuelLiters] = useState('85');
  const [catchKg, setCatchKg] = useState('620');
  const [catchSpecies, setCatchSpecies] = useState('Indian Mackerel & Oil Sardine');
  const [safetyRating, setSafetyRating] = useState('SAFE');
  const [captainNotes, setCaptainNotes] = useState('Followed Samudra thermal front line. Moderate 1.2m swell, calm winds.');
  const [isSubmittingVoyage, setIsSubmittingVoyage] = useState(false);
  const [logSuccessMsg, setLogSuccessMsg] = useState(false);

  if (!isProfileModalOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-sans animate-fade-in">
        <div className="w-full max-w-md bg-[#161c27] border border-[#384959] rounded-2xl p-6 text-center text-slate-100 space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#384959]/50 border border-[#6A89A7]/40 mx-auto flex items-center justify-center text-[#88BDF2]">
            <Ship className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-[#BDDDFC]">No Captain Profile Active</h3>
          <p className="text-xs text-[#6A89A7] leading-relaxed">
            Please sign in with your mobile number to view your registered vessel credentials, past voyages, and recorded fishing yields.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="flex-1 py-2 px-4 rounded-xl border border-[#384959] text-xs text-slate-300 hover:bg-[#384959]/40"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-2 px-4 rounded-xl bg-[#6A89A7] hover:bg-[#88BDF2] text-[#0f141d] font-semibold text-xs shadow-md transition-colors"
            >
              Sign In with Mobile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate lifetime metrics
  const totalNm = voyages.reduce((sum, v) => sum + (v.distance_nm || 0), 0);
  const totalCatchKg = voyages.reduce((sum, v) => sum + (v.catch_kg || 0), 0);
  const totalFuel = voyages.reduce((sum, v) => sum + (v.fuel_liters || 0), 0);
  const totalVoyagesCount = voyages.length;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateProfile({
      phone: user.phone,
      name: editName,
      vessel_name: editVessel,
      vessel_type: editType,
      home_port: editPort
    });
    setIsSavingProfile(false);
    setActiveTab('history');
  };

  const handleLogVoyage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingVoyage(true);
    const nm = parseFloat(distNm) || 20;
    const durMins = Math.round((parseFloat(durationHours) || 4) * 60);

    const success = await logNewVoyage({
      user_phone: user.phone,
      voyage_date: newVoyageDate,
      origin_name: originName,
      destination_name: destName,
      distance_nm: nm,
      distance_km: Math.round(nm * 1.852 * 10) / 10,
      duration_mins: durMins,
      fuel_liters: parseFloat(fuelLiters) || 70,
      catch_kg: parseFloat(catchKg) || 500,
      catch_species: catchSpecies,
      safety_rating: safetyRating,
      notes: captainNotes
    });

    setIsSubmittingVoyage(false);
    if (success) {
      setLogSuccessMsg(true);
      setTimeout(() => {
        setLogSuccessMsg(false);
        setActiveTab('history');
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#161c27] border border-[#384959] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top colored accent line (Stormy morning palette) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#384959] via-[#6A89A7] to-[#88BDF2]" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#384959]/60 flex items-center justify-between bg-[#19212f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#384959]/60 border border-[#6A89A7]/40 flex items-center justify-center text-[#88BDF2]">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-lg text-[#BDDDFC]">{user.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#384959]/60 text-[#88BDF2] border border-[#6A89A7]/30">
                  {user.phone}
                </span>
              </div>
              <p className="text-xs text-[#6A89A7]">
                {user.vessel_name} • {user.home_port}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                setIsProfileModalOpen(false);
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#384959]/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lifetime Statistics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-[#111721] border-b border-[#384959]/50">
          <div className="p-3 rounded-xl bg-[#161c27] border border-[#384959]/50">
            <span className="text-[10px] uppercase tracking-wider text-[#6A89A7] font-semibold block">Total Voyages</span>
            <div className="text-xl font-mono font-bold text-white mt-0.5">{totalVoyagesCount}</div>
            <span className="text-[10px] text-emerald-400">100% Incident-free</span>
          </div>

          <div className="p-3 rounded-xl bg-[#161c27] border border-[#384959]/50">
            <span className="text-[10px] uppercase tracking-wider text-[#6A89A7] font-semibold block">Distance Logged</span>
            <div className="text-xl font-mono font-bold text-[#88BDF2] mt-0.5">{totalNm.toFixed(1)} <span className="text-xs font-normal text-[#6A89A7]">NM</span></div>
            <span className="text-[10px] text-[#6A89A7]">{(totalNm * 1.852).toFixed(0)} km covered</span>
          </div>

          <div className="p-3 rounded-xl bg-[#161c27] border border-[#384959]/50">
            <span className="text-[10px] uppercase tracking-wider text-[#6A89A7] font-semibold block">Catch Weight</span>
            <div className="text-xl font-mono font-bold text-white mt-0.5">{totalCatchKg >= 1000 ? `${(totalCatchKg / 1000).toFixed(2)} T` : `${totalCatchKg} kg`}</div>
            <span className="text-[10px] text-[#BDDDFC]">High biological yield</span>
          </div>

          <div className="p-3 rounded-xl bg-[#161c27] border border-[#384959]/50">
            <span className="text-[10px] uppercase tracking-wider text-[#6A89A7] font-semibold block">Fuel Consumed</span>
            <div className="text-xl font-mono font-bold text-slate-200 mt-0.5">{totalFuel.toFixed(0)} <span className="text-xs font-normal text-[#6A89A7]">L</span></div>
            <span className="text-[10px] text-emerald-400">~18% saved via AI</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-[#384959]/60 bg-[#161c27]">
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-[#88BDF2] text-[#88BDF2]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Past Voyages & Experiences ({voyages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('log_new')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'log_new'
                ? 'border-[#88BDF2] text-[#88BDF2]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Sea Experience</span>
          </button>

          <button
            onClick={() => {
              setEditName(user.name);
              setEditVessel(user.vessel_name);
              setEditType(user.vessel_type);
              setEditPort(user.home_port);
              setActiveTab('edit');
            }}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'edit'
                ? 'border-[#88BDF2] text-[#88BDF2]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Vessel Registration</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* TAB 1: Past Voyages */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {voyages.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-[#111721] border border-[#384959]/50">
                  <p className="text-xs text-[#6A89A7]">No recorded voyages yet for this phone number.</p>
                  <button
                    onClick={() => setActiveTab('log_new')}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-[#384959] hover:bg-[#6A89A7] text-white text-xs font-medium"
                  >
                    Log First Voyage Experience
                  </button>
                </div>
              ) : (
                voyages.map((voyage) => (
                  <div
                    key={voyage.id}
                    className="p-4 rounded-xl bg-[#19212f]/80 border border-[#384959]/60 hover:border-[#6A89A7] transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-[#88BDF2] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#6A89A7]" />
                            {voyage.voyage_date}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                            {voyage.safety_rating || 'SAFE'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1">
                          {voyage.origin_name} → {voyage.destination_name}
                        </h4>
                      </div>

                      {/* Voyage key stats */}
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div className="text-right">
                          <span className="text-[10px] text-[#6A89A7] block uppercase">Distance</span>
                          <span className="text-[#BDDDFC] font-semibold">{voyage.distance_nm} NM</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#6A89A7] block uppercase">Catch</span>
                          <span className="text-emerald-400 font-semibold">{voyage.catch_kg} kg</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#6A89A7] block uppercase">Fuel</span>
                          <span className="text-slate-300">{voyage.fuel_liters} L</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#384959]/40 flex flex-wrap items-center justify-between text-xs text-[#6A89A7] gap-2">
                      <div className="flex items-center gap-1.5 text-[#BDDDFC]">
                        <Fish className="w-3.5 h-3.5 text-[#88BDF2]" />
                        <span>Species: <strong className="text-white font-medium">{voyage.catch_species}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#6A89A7]" />
                        <span>Duration: {Math.floor(voyage.duration_mins / 60)}h {voyage.duration_mins % 60}m</span>
                      </div>
                    </div>

                    {voyage.notes && (
                      <div className="p-2.5 rounded-lg bg-[#111721] border border-[#384959]/40 text-xs text-slate-300 font-mono italic">
                        "{voyage.notes}"
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Log New Sea Experience */}
          {activeTab === 'log_new' && (
            <form onSubmit={handleLogVoyage} className="space-y-4">
              {logSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Voyage log saved successfully to your captain profile!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Voyage Date</label>
                  <input
                    type="date"
                    value={newVoyageDate}
                    onChange={(e) => setNewVoyageDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Safety Rating</label>
                  <select
                    value={safetyRating}
                    onChange={(e) => setSafetyRating(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                  >
                    <option value="SAFE">SAFE (Optimal Ocean Conditions)</option>
                    <option value="CAUTION">CAUTION (Moderate Swells)</option>
                    <option value="AVOID">ROUGH (High Sea State)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Origin Port</label>
                  <input
                    type="text"
                    value={originName}
                    onChange={(e) => setOriginName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Destination / Target Zone</label>
                  <input
                    type="text"
                    value={destName}
                    onChange={(e) => setDestName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#BDDDFC]/80 mb-1">Distance (NM)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={distNm}
                    onChange={(e) => setDistNm(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#BDDDFC]/80 mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#BDDDFC]/80 mb-1">Catch (kg)</label>
                  <input
                    type="number"
                    value={catchKg}
                    onChange={(e) => setCatchKg(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs font-mono text-emerald-400 focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#BDDDFC]/80 mb-1">Fuel Used (L)</label>
                  <input
                    type="number"
                    value={fuelLiters}
                    onChange={(e) => setFuelLiters(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Target Species Harvested</label>
                <input
                  type="text"
                  value={catchSpecies}
                  onChange={(e) => setCatchSpecies(e.target.value)}
                  placeholder="e.g. Oil Sardine, Indian Mackerel, Yellowfin Tuna"
                  className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">
                  Captain's Logbook & Sea State Observations
                </label>
                <textarea
                  rows={3}
                  value={captainNotes}
                  onChange={(e) => setCaptainNotes(e.target.value)}
                  placeholder="Record observations on ocean currents, sea thermal lines, wave conditions, or gear performance..."
                  className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingVoyage}
                className="w-full py-2.5 px-4 bg-[#6A89A7] hover:bg-[#88BDF2] text-[#0f141d] font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Voyage to Maritime History</span>
              </button>
            </form>
          )}

          {/* TAB 3: Edit Vessel Details */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Captain Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Vessel Name</label>
                  <input
                    type="text"
                    value={editVessel}
                    onChange={(e) => setEditVessel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Vessel Type & Length</label>
                  <input
                    type="text"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#BDDDFC]/80 mb-1">Home Port / Coastal Base</label>
                <input
                  type="text"
                  value={editPort}
                  onChange={(e) => setEditPort(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f141d] border border-[#384959] rounded-xl text-xs text-white focus:outline-none focus:border-[#88BDF2]"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[#111721] border border-[#384959]/50 flex items-center justify-between text-xs">
                <span className="text-[#6A89A7]">Registered Mobile Number:</span>
                <span className="font-mono text-[#88BDF2] font-semibold">{user.phone}</span>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-2.5 px-4 bg-[#6A89A7] hover:bg-[#88BDF2] text-[#0f141d] font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
