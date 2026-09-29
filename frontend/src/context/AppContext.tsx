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
  CoastalPreset
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
  soundEnabled: boolean;
  coastalPresets: CoastalPreset[];
  
  // Actions
  confirmLocation: (coords: Coordinates, name?: string) => void;
  resetLocation: () => void;
  setActiveLocation: (coords: Coordinates, name?: string) => void;
  setLanguage: (lang: string) => void;
  setActiveCommandTab: (tab: 'conditions' | 'pfz' | 'route' | 'chat') => void;
  toggleMapLayer: (layerId: string) => void;
  setSoundEnabled: (val: boolean) => void;
  sendQuery: (queryText: string) => Promise<void>;
  openRouteForPFZ: (pfz: PFZZone) => Promise<void>;
  routeToPFZ: (pfz: PFZZone) => Promise<void>;
  clearRoute: () => void;
  clearChat: () => void;
  setActiveEvidence: (ev: EvidenceDetails | null) => void;
  refreshConditions: () => Promise<void>;
}

import { getFallbackPFZs } from '../services/fallbackData';

const DEFAULT_COORDS: Coordinates = { latitude: 9.9312, longitude: 76.2673 };
const DEFAULT_NAME = 'Kochi (Cochin), Kerala';
const DEFAULT_LAYERS = ['pfz', 'waves', 'imbl', 'risk_zones', 'simulated_vessel'];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);
  const [activeLocation, setActiveLocationState] = useState<Coordinates>(DEFAULT_COORDS);
  const [activeLocationName, setActiveLocationName] = useState<string>(DEFAULT_NAME);
  const [language, setLanguage] = useState<string>('en');
  const [activeCommandTab, setActiveCommandTab] = useState<'conditions' | 'pfz' | 'route' | 'chat'>('pfz');
  const [activeMapLayers, setActiveMapLayers] = useState<string[]>(DEFAULT_LAYERS);
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [ocean, setOcean] = useState<MarineObservation | null>(null);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [pfzs, setPfzs] = useState<PFZZone[]>(() => getFallbackPFZs(DEFAULT_COORDS));
  const [alerts, setAlerts] = useState<MarineAlert[]>([]);
  const [routeComparison, setRouteComparison] = useState<RouteComparison | null>(null);
  const [selectedPFZForRoute, setSelectedPFZForRoute] = useState<PFZZone | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Welcome to SamudraAI. Ask any question about potential fishing zones, marine weather forecasts, safe routing, or sovereign boundary geofences.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      risk_level: 'LOW',
      safety_verdict: 'SAFE'
    }
  ]);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceDetails | null>(null);
  const [agentTraces, setAgentTraces] = useState<AgentTrace[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [coastalPresets, setCoastalPresets] = useState<CoastalPreset[]>([]);

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
        if (data.pfzs && Array.isArray(data.pfzs) && data.pfzs.length > 0) {
          setPfzs(data.pfzs);
        }
      }

      if (pfzRes.status === 'fulfilled' && pfzRes.value && pfzRes.value.length > 0) {
        setPfzs(pfzRes.value);
      } else {
        setPfzs((prev) => (prev.length > 0 ? prev : getFallbackPFZs(loc)));
      }
    } catch (err) {
      console.warn('Notice refreshing marine conditions:', err);
      setPfzs((prev) => (prev.length > 0 ? prev : getFallbackPFZs(loc)));
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
    setPfzs(generateFallbackPFZs(coords));
    setIsLocationSelected(true);
  };

  const resetLocation = () => {
    setIsLocationSelected(false);
    setRouteComparison(null);
    setSelectedPFZForRoute(null);
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

      // Responses are kept in text only (voice speech removed per user request)
    } catch (err) {
      console.error('Chat error:', err);
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'System error connecting to agent orchestration pipeline. Please verify the backend service is active.',
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
    setActiveMapLayers((prev) => prev.filter((l) => l !== 'route'));
    setActiveCommandTab('pfz');
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: 'Welcome to SamudraAI. Ask any question about potential fishing zones, marine weather forecasts, safe routing, or sovereign boundary geofences.',
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
        soundEnabled,
        coastalPresets,
        confirmLocation,
        resetLocation,
        setActiveLocation,
        setLanguage,
        setActiveCommandTab,
        toggleMapLayer,
        setSoundEnabled,
        sendQuery,
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
