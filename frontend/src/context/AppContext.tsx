import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Coordinates,
  MarineObservation,
  WeatherReport,
  PFZZone,
  MarineAlert,
  RiskAssessment,
  RouteComparison,
  ChatMessage,
  EvidenceDetails,
  AgentTrace,
  CoastalPreset,
  UserProfile,
  VoyageLog
} from '../types/marine';
import { api, generateFallbackPFZs } from '../services/api';
import { voiceService } from '../services/voice';

export interface AppContextType {
  isLocationSelected: boolean;
  activeLocation: Coordinates;
  activeLocationName: string;
  language: string;
  activeCommandTab: 'conditions' | 'pfz' | 'route' | 'chat';
  activeMapLayers: string[];
  weather: WeatherReport | null;
  ocean: MarineObservation | null;
  risk: RiskAssessment | null;
  pfzs: PFZZone[];
  alerts: MarineAlert[];
  routeComparison: RouteComparison | null;
  selectedPFZForRoute: PFZZone | null;
  chatMessages: ChatMessage[];
  activeEvidence: EvidenceDetails | null;
  agentTraces: AgentTrace[];
  isAnalyzing: boolean;
  isVoiceActive: boolean;
  isAiSpeaking: boolean;
  soundEnabled: boolean;
  coastalPresets: CoastalPreset[];
  activeNav: string;
  isRouteDrawerOpen: boolean;
  syncMode: 'cloud' | 'edge';
  setSyncMode: (mode: 'cloud' | 'edge') => void;
  setIsVoiceActive: (val: boolean) => void;
  stopSpeech: () => void;
  setActiveNav: (nav: string) => void;
  setIsRouteDrawerOpen: (open: boolean) => void;

  // Profile & Voyage Auth State
  user: UserProfile | null;
  voyages: VoyageLog[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  loginWithPhone: (phone: string, otp: string, name?: string, vessel_name?: string, vessel_type?: string, home_port?: string) => Promise<boolean>;
  updateProfile: (profile: UserProfile) => Promise<boolean>;
  logout: () => void;
  logNewVoyage: (voyageData: Partial<VoyageLog>) => Promise<boolean>;
  refreshVoyages: () => Promise<void>;
  
  // Actions
  confirmLocation: (coords: Coordinates, name?: string) => void;
  resetLocation: () => void;
  setActiveLocation: (coords: Coordinates, name?: string) => void;
  setLanguage: (lang: string) => void;
  setActiveCommandTab: (tab: 'conditions' | 'pfz' | 'route' | 'chat') => void;
  toggleMapLayer: (layerId: string) => void;
  setSoundEnabled: (val: boolean) => void;
  sendQuery: (queryText: string) => Promise<void>;
  addChatMessage: (msg: ChatMessage) => void;
  openRouteForPFZ: (pfz: PFZZone) => Promise<void>;
  routeToPFZ: (pfz: PFZZone) => Promise<void>;
  clearRoute: () => void;
  clearChat: () => void;
  setActiveEvidence: (ev: EvidenceDetails | null) => void;
  refreshConditions: () => Promise<void>;
}

import { getFallbackPFZs } from '../services/fallbackData';

const DEFAULT_COORDS: Coordinates = { latitude: 9.9650, longitude: 76.2220 };
const DEFAULT_NAME = 'Fort Kochi Coastal Harbor, Kerala';
const DEFAULT_LAYERS = ['pfz', 'waves', 'imbl', 'risk_zones', 'simulated_vessel'];

const AppContext = createContext<AppContextType | undefined>(undefined);

const WELCOME_MESSAGES: Record<string, string> = {
  hi: 'समुद्र एआई में आपका स्वागत है। संभावित मत्स्य पालन क्षेत्रों (PFZ), समुद्री मौसम पूर्वानुमान, सुरक्षित मार्ग या संप्रभु समुद्री सीमा (IMBL) के बारे में कोई भी प्रश्न पूछें।',
  ml: 'സമുദ്ര എഐയിലേക്ക് സ്വാഗതം. മത്സ്യബന്ധന മേഖലകൾ, കാലാവസ്ഥാ പ്രവചനം, സുരക്ഷിത പാത, സമുദ്രാതിർത്തി (IMBL) എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കാം.',
  ta: 'சமுத்ரா ஏஐ-க்கு வரவேற்கிறோம். மீன்பிடி மண்டலங்கள், கடல் வானிலை முன்னறிவிப்பு, பாதுகாப்பான வழிகள் அல்லது சர்வதேச கடல் எல்லை (IMBL) பற்றி ஏதேனும் கேளுங்கள்.',
  te: 'సముద్ర AI కి స్వాగతం. చేపల వేట మండలాలు, సముద్ర వాతావరణ సూచనలు, సురక్షిత మార్గాలు లేదా అంతర్జాతీయ సరిహద్దు (IMBL) గురించి ఏదైనా అడగండి.',
  bn: 'সমুদ্র এআই-তে স্বাগতম। সম্ভাব্য মাছ ধরার অঞ্চল, সামুদ্রিক আবহাওয়ার পূর্বাভাস, নিরাপদ নৌপথ বা আন্তর্জাতিক সীমান্ত (IMBL) সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।',
  en: 'Welcome to SamudraAI. Ask any question about potential fishing zones, marine weather forecasts, safe routing, or sovereign boundary geofences.'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(() => {
    return localStorage.getItem('samudra_location_confirmed') === 'true';
  });
  const [activeLocation, setActiveLocationState] = useState<Coordinates>(DEFAULT_COORDS);
  const [activeLocationName, setActiveLocationName] = useState<string>(DEFAULT_NAME);
  const [language, setLanguage] = useState<string>('en');
  const [activeCommandTab, setActiveCommandTab] = useState<'conditions' | 'pfz' | 'route' | 'chat'>('pfz');
  const [activeMapLayers, setActiveMapLayers] = useState<string[]>(DEFAULT_LAYERS);
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [ocean, setOcean] = useState<MarineObservation | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [pfzs, setPfzs] = useState<PFZZone[]>([]);
  const [alerts, setAlerts] = useState<MarineAlert[]>([]);
  const [routeComparison, setRouteComparison] = useState<RouteComparison | null>(null);
  const [selectedPFZForRoute, setSelectedPFZForRoute] = useState<PFZZone | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: WELCOME_MESSAGES.en,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      risk_level: 'LOW',
      safety_verdict: 'SAFE'
    }
  ]);

  // Synchronize initial welcome message reactively when language changes
  useEffect(() => {
    setChatMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome-msg') {
        return [
          {
            ...prev[0],
            content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en
          }
        ];
      }
      return prev;
    });
  }, [language]);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceDetails | null>(null);
  const [agentTraces, setAgentTraces] = useState<AgentTrace[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [coastalPresets, setCoastalPresets] = useState<CoastalPreset[]>([]);
  const [activeNav, setActiveNav] = useState<string>('map');
  const [isRouteDrawerOpen, setIsRouteDrawerOpen] = useState<boolean>(false);
  const [syncMode, setSyncMode] = useState<'cloud' | 'edge'>('edge');

  // User Profile & Voyage States
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('samudra_captain_profile');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [voyages, setVoyages] = useState<VoyageLog[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Restore or sync user & voyages on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem('samudra_captain_phone');
    if (savedPhone) {
      api.getUserProfile(savedPhone).then((profile) => {
        if (profile) {
          setUser(profile);
          localStorage.setItem('samudra_captain_profile', JSON.stringify(profile));
        }
      }).catch(console.error);

      api.getUserVoyages(savedPhone).then((vLogs) => {
        if (vLogs && vLogs.length > 0) {
          setVoyages(vLogs);
        }
      }).catch(console.error);
    }
  }, []);

  const loginWithPhone = async (
    phone: string,
    otp: string,
    name?: string,
    vessel_name?: string,
    vessel_type?: string,
    home_port?: string
  ): Promise<boolean> => {
    try {
      const res = await api.phoneLogin({ phone, otp, name, vessel_name, vessel_type, home_port });
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('samudra_captain_phone', res.user.phone);
        localStorage.setItem('samudra_captain_profile', JSON.stringify(res.user));
        const vLogs = await api.getUserVoyages(res.user.phone);
        setVoyages(vLogs);
        setIsAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const updateProfile = async (profile: UserProfile): Promise<boolean> => {
    try {
      const res = await api.saveUserProfile(profile);
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('samudra_captain_profile', JSON.stringify(res.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update profile error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setVoyages([]);
    setIsLocationSelected(false);
    localStorage.removeItem('samudra_captain_phone');
    localStorage.removeItem('samudra_captain_profile');
    localStorage.removeItem('samudra_location_confirmed');
  };

  const logNewVoyage = async (voyageData: Partial<VoyageLog>): Promise<boolean> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }
    try {
      const res = await api.logVoyage({ ...voyageData, user_phone: user.phone });
      if (res && res.voyage) {
        setVoyages((prev) => [res.voyage, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error logging voyage:', err);
      return false;
    }
  };

  const refreshVoyages = async () => {
    if (user) {
      const vLogs = await api.getUserVoyages(user.phone);
      setVoyages(vLogs);
    }
  };

  const stopSpeech = () => {
    voiceService.stopSpeaking();
    setIsAiSpeaking(false);
  };

  // Load geofences & coastal presets
  useEffect(() => {
    api.getGeofences().then((data) => {
      if (data && data.coastal_presets) {
        setCoastalPresets(data.coastal_presets);
      }
    }).catch(console.error);
  }, []);

  // Refresh marine conditions whenever active location changes
  const refreshConditions = async (loc = activeLocation) => {
    setIsAnalyzing(true);
    try {
      const [conditionsRes, pfzRes] = await Promise.allSettled([
        api.getMarineConditions(loc),
        api.getPFZs(loc)
      ]);

      if (conditionsRes.status === 'fulfilled' && conditionsRes.value) {
        const data = conditionsRes.value;
        if (data.weather) setWeather(data.weather);
        if (data.ocean) setOcean(data.ocean);
        if (data.risk) setRisk(data.risk);
        if (data.active_alerts) setAlerts(data.active_alerts);
      }

      if (pfzRes.status === 'fulfilled' && pfzRes.value && pfzRes.value.length > 0) {
        setPfzs(pfzRes.value);
      }
    } catch (err) {
      console.warn('Notice refreshing marine conditions:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isLocationSelected) {
      refreshConditions(activeLocation);
    }
  }, [activeLocation.latitude, activeLocation.longitude, isLocationSelected]);

  const confirmLocation = (coords: Coordinates, name?: string) => {
    setActiveLocationState(coords);
    if (name) {
      setActiveLocationName(name);
    } else {
      setActiveLocationName(`${coords.latitude.toFixed(4)}°N, ${coords.longitude.toFixed(4)}°E`);
    }
    setPfzs([]);
    localStorage.setItem('samudra_location_confirmed', 'true');
    setIsLocationSelected(true);
  };

  const resetLocation = () => {
    localStorage.removeItem('samudra_location_confirmed');
    setIsLocationSelected(false);
    setRouteComparison(null);
    setSelectedPFZForRoute(null);
    setPfzs([]);
  };

  const toggleMapLayer = (layerId: string) => {
    setActiveMapLayers((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsAnalyzing(true);

    try {
      const resp = await api.sendChat(queryText, activeLocation, language, activeMapLayers);

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: resp.direct_answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk_level: resp.risk_level,
        safety_verdict: resp.safety_verdict,
        evidence: resp.evidence,
        traces: resp.agent_traces,
        pfzs: resp.relevant_pfz || undefined,
        route: resp.route_comparison || undefined
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
      setActiveEvidence(resp.evidence);
      setAgentTraces(resp.agent_traces);

      if (resp.relevant_pfz && resp.relevant_pfz.length > 0) {
        setPfzs(resp.relevant_pfz);
      }
      if (resp.route_comparison) {
        setRouteComparison(resp.route_comparison);
        if (resp.relevant_pfz && resp.relevant_pfz[0]) {
          setSelectedPFZForRoute(resp.relevant_pfz[0]);
        }
        setActiveCommandTab('route');
        if (!activeMapLayers.includes('route')) {
          setActiveMapLayers((prev) => [...prev, 'route']);
        }
      }
      if (resp.alerts) {
        setAlerts(resp.alerts);
      }

      if (resp.active_map_layers && resp.active_map_layers.length > 0) {
        setActiveMapLayers((prev) => Array.from(new Set([...prev, ...resp.active_map_layers])));
      }

      // Speak AI response aloud through Web SpeechSynthesis in selected Indian regional language
      if ((soundEnabled || isVoiceActive) && resp.direct_answer) {
        setIsAiSpeaking(true);
        voiceService.speak(
          resp.direct_answer,
          language,
          () => setIsAiSpeaking(true),
          () => setIsAiSpeaking(false)
        );
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessages: Record<string, string> = {
        hi: 'एजेंट ऑर्केस्ट्रेशन पाइपलाइन से कनेक्ट करने में सिस्टम त्रुटि। कृपया सुनिश्चित करें कि बैकएंड सेवा सक्रिय है।',
        ml: 'ഏജന്റ് ഓർക്കസ്ട്രേഷൻ പൈപ്പ്‌ലൈനിലേക്ക് കണക്റ്റുചെയ്യുന്നതിൽ സിസ്റ്റം പിശക്. ബാക്കെൻഡ് പ്രവർത്തിക്കുന്നുണ്ടെന്ന് ഉറപ്പാക്കുക.',
        ta: 'கணினி பிழை. பின்னணி சேவை செயலில் உள்ளதா என்பதை உறுதிப்படுத்தவும்.',
        te: 'సిస్టమ్ ఎర్రర్. దయచేసి బ్యాకెండ్ సేవ సక్రియంగా ఉందో లేదో తనిఖీ చేయండి.',
        bn: 'সিস্টেম ত্রুটি। অনুগ্রহ করে ব্যাকএন্ড পরিষেবা সক্রিয় আছে কিনা তা পরীক্ষা করুন।',
        en: 'System error connecting to agent orchestration pipeline. Please verify the backend service is active.'
      };
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: errorMessages[language] || errorMessages.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk_level: 'HIGH',
        safety_verdict: 'UNSAFE'
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openRouteForPFZ = async (pfz: PFZZone) => {
    setSelectedPFZForRoute(pfz);
    setIsAnalyzing(true);
    try {
      const routeRes = await api.calculateRoute(activeLocation, pfz.location);
      setRouteComparison(routeRes);
      setActiveCommandTab('route');
      setIsRouteDrawerOpen(true);
      if (!activeMapLayers.includes('route')) {
        setActiveMapLayers((prev) => [...prev, 'route']);
      }
    } catch (err) {
      console.error('Routing failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearRoute = () => {
    setRouteComparison(null);
    setSelectedPFZForRoute(null);
    setIsRouteDrawerOpen(false);
    setActiveMapLayers((prev) => prev.filter((l) => l !== 'route'));
    setActiveCommandTab('pfz');
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        risk_level: 'LOW',
        safety_verdict: 'SAFE'
      }
    ]);
  };

  const setActiveLocation = confirmLocation;
  const routeToPFZ = openRouteForPFZ;

  return (
    <AppContext.Provider
      value={{
        isLocationSelected,
        activeLocation,
        activeLocationName,
        language,
        activeCommandTab,
        activeMapLayers,
        weather,
        ocean,
        risk,
        pfzs,
        alerts,
        routeComparison,
        selectedPFZForRoute,
        chatMessages,
        activeEvidence,
        agentTraces,
        isAnalyzing,
        isVoiceActive,
        isAiSpeaking,
        soundEnabled,
        coastalPresets,
        activeNav,
        isRouteDrawerOpen,
        syncMode,
        setSyncMode,
        setIsVoiceActive,
        stopSpeech,
        setActiveNav,
        setIsRouteDrawerOpen,
        user,
        voyages,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        loginWithPhone,
        updateProfile,
        logout,
        logNewVoyage,
        refreshVoyages,
        confirmLocation,
        resetLocation,
        setActiveLocation,
        setLanguage,
        setActiveCommandTab,
        toggleMapLayer,
        setSoundEnabled,
        sendQuery,
        addChatMessage,
        openRouteForPFZ,
        routeToPFZ,
        clearRoute,
        clearChat,
        setActiveEvidence,
        refreshConditions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
