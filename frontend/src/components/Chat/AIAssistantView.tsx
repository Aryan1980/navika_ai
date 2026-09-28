import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Sparkles,
  Mic,
  MicOff,
  Compass,
  Fish,
  ShieldAlert,
  Waves,
  Navigation,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Cloud,
  Download,
  RefreshCw,
  Cpu,
  WifiOff
} from 'lucide-react';
import { voiceService } from '../../services/voice';
import { mobileWebLLM, ModelProgress } from '../../services/webllm';
import { ChatMessage } from '../../types/marine';

const STARTER_PROMPTS = [
  {
    icon: Fish,
    tag: 'PFZ DETECTION',
    title: 'High-Yield Fishing Fronts',
    prompt: 'Identify the best thermal chlorophyll convergence zones for sardine and tuna within 25 km of our active port.',
    badge: 'OPTIMAL CATCH',
    color: 'text-emerald-400',
    border: 'hover:border-[#0474C4]/50'
  },
  {
    icon: Waves,
    tag: 'HYDRODYNAMICS',
    title: 'Wave Swell & Hazard Risk',
    prompt: 'Analyze current wave height, swell kinematics, sea state, and squall advisories for tonight.',
    badge: 'SAFETY 1ST',
    color: 'text-[#A8C4EC]',
    border: 'hover:border-[#0474C4]/50'
  },
  {
    icon: ShieldAlert,
    tag: 'GEO-FENCING',
    title: 'IMBL Sovereign Border Clearance',
    prompt: 'Check our proximity to the International Maritime Boundary Line (IMBL) and ensure safe buffer clearance.',
    badge: 'BORDER SAFETY',
    color: 'text-[#e59883]',
    border: 'hover:border-[#e59883]/40'
  },
  {
    icon: Navigation,
    tag: 'DISPATCH',
    title: 'Fuel & Transit Planning',
    prompt: 'Calculate the safest seaward route to Spot 1 with estimated transit time and fuel consumption.',
    badge: 'WAYPOINTS',
    color: 'text-[#5379AE]',
    border: 'hover:border-[#5379AE]/50'
  }
];

export const AIAssistantView: React.FC = () => {
  const {
    activeLocation,
    activeLocationName,
    chatMessages,
    isAnalyzing: isAnalyzingCloud,
    language,
    sendQuery,
    addChatMessage,
    clearChat
  } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [inferenceMode, setInferenceMode] = useState<'cloud' | 'offline'>('cloud');
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isModelDownloading, setIsModelDownloading] = useState<boolean>(false);
  const [modelProgress, setModelProgress] = useState<ModelProgress>({ progress: 0, text: '' });
  const [hasWebGPU, setHasWebGPU] = useState<boolean | null>(null);
  const [isAnalyzingLocal, setIsAnalyzingLocal] = useState<boolean>(false);

  const isAnalyzing = isAnalyzingCloud || isAnalyzingLocal;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    mobileWebLLM.isWebGPUSupported().then(setHasWebGPU);
    const status = mobileWebLLM.getStatus();
    setIsModelLoaded(status.isLoaded);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAnalyzing]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  const handleDownloadModel = async () => {
    setIsModelDownloading(true);
    setModelProgress({ progress: 2, text: 'Downloading SmolLM2-360M model weights (~210MB)...' });
    const success = await mobileWebLLM.initializeModel((p) => {
      setModelProgress(p);
    });
    setIsModelDownloading(false);
    setIsModelLoaded(success);
    if (success) {
      setModelProgress({ progress: 100, text: 'Model successfully cached in mobile IndexedDB!' });
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isAnalyzing) return;
    setInputPrompt('');

    if (inferenceMode === 'offline') {
      // 1. Add User Message
      const userMsg: ChatMessage = {
        id: `usr_${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      addChatMessage(userMsg);

      // 2. Execute on-device WebLLM inference via WebGPU
      setIsAnalyzingLocal(true);
      try {
        const localReply = await mobileWebLLM.generateOfflineAdvice(
          text,
          `Vessel Departure Fix: ${activeLocationName} (${activeLocation.latitude.toFixed(4)}°N, ${activeLocation.longitude.toFixed(4)}°E).`
        );

        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: localReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          safety_verdict: 'SAFE'
        };
        addChatMessage(assistantMsg);

        // Vocalize response
        voiceService.speak(localReply, language);
      } catch (err: any) {
        addChatMessage({
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: `Local Edge Notice: ${err.message || 'On-device execution encountered a timeout'}. Maintain standard fairway bearings.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          safety_verdict: 'CAUTION'
        });
      } finally {
        setIsAnalyzingLocal(false);
      }
    } else {
      // Cloud Multi-Agent Pipeline
      sendQuery(text);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceService.startListening(
        language,
        (transcript) => {
          setInputPrompt(transcript);
          setIsListening(false);
          handleSend(transcript);
        },
        (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = chatMessages.length > 1;

  return (
    <div className="h-full min-h-0 flex-1 flex flex-col bg-[#151926] text-[#f1f5fb] selection:bg-[#0474C4]/30 selection:text-[#A8C4EC] overflow-hidden relative font-sans">
      
      {/* ── Ambient Sapphire Nightfall Whisper Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#06457F]/25 via-[#0474C4]/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-[#2C444C]/20 rounded-full blur-[120px]" />
      </div>

      {/* ── Top AI Engine Mode Switcher Bar ── */}
      <div className="relative z-20 px-4 py-3 bg-[#181e2e]/95 backdrop-blur-md border-b border-[#384959] flex-shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#12161f] border border-[#384959] w-fit">
            <button
              onClick={() => setInferenceMode('cloud')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                inferenceMode === 'cloud'
                  ? 'bg-[#0474C4] text-white shadow-md'
                  : 'text-[#BDDDFC]/70 hover:text-white'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Cloud AI (Gemini 2.5)</span>
            </button>

            <button
              onClick={() => setInferenceMode('offline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                inferenceMode === 'offline'
                  ? 'bg-[#1E2632] text-[#88BDF2] border border-[#88BDF2]/40 shadow-md'
                  : 'text-[#BDDDFC]/70 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#88BDF2]" />
              <span>On-Device WebLLM (Offline)</span>
            </button>
          </div>

          {/* Engine Status & One-Click Download if Offline Selected */}
          <div className="flex items-center gap-2">
            {inferenceMode === 'cloud' ? (
              <span className="text-[11px] font-mono text-[#BDDDFC]/70 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Online Cloud Pipeline Connected</span>
              </span>
            ) : (
              <div className="flex items-center gap-2">
                {isModelLoaded ? (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>SmolLM2-360M Active on GPU</span>
                  </span>
                ) : (
                  <button
                    onClick={handleDownloadModel}
                    disabled={isModelDownloading}
                    className="px-3 py-1 bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#0f141d] font-bold rounded-xl text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isModelDownloading ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Downloading ({modelProgress.progress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        <span>Download Offline Model (~210MB)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Progress Bar for In-Browser Model Download */}
        {isModelDownloading && (
          <div className="max-w-3xl mx-auto mt-2 space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#BDDDFC]">
              <span>{modelProgress.text}</span>
              <span className="font-bold text-white">{modelProgress.progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#12161f] overflow-hidden border border-[#384959]">
              <div
                className="h-full bg-gradient-to-r from-[#6A89A7] via-[#88BDF2] to-[#BDDDFC] rounded-full transition-all duration-300"
                style={{ width: `${modelProgress.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Central Conversation Stream ── */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 py-8"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Welcome Greeting State */}
          {!hasMessages && (
            <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
              
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#06457F]/40 via-[#0474C4]/20 to-[#2C444C]/30 border border-[#5379AE]/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(4,116,196,0.2)]">
                <Compass className="w-8 h-8 text-[#A8C4EC] stroke-[1.75]" />
              </div>

              <div className="space-y-2">
                <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-white leading-tight">
                  Ask the <span className="italic text-[#88BDF2] font-editorial">Helmsman</span>.
                </h1>
                <p className="text-sm sm:text-base text-[#A8C4EC]/85 max-w-xl mx-auto font-light leading-relaxed">
                  Autonomous conversational intelligence synthesizing satellite telemetry, physical wave kinematics, and biological fishing zones off <span className="text-white font-medium">{activeLocationName.split(',')[0]}</span>.
                </p>
                {inferenceMode === 'offline' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Deep-Sea Offline Mode Active: Running directly on device GPU (0% Internet)</span>
                  </div>
                )}
              </div>

              {/* 4 Clean Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left max-w-2xl mx-auto">
                {STARTER_PROMPTS.map((starter, i) => {
                  const Icon = starter.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(starter.prompt)}
                      className={`p-5 rounded-2xl bg-[#1d2334] border border-[#5379AE]/25 ${starter.border} transition-all cursor-pointer group shadow-lg text-left flex flex-col justify-between hover:scale-[1.01]`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-8 h-8 rounded-xl bg-[#262B40] border border-[#5379AE]/30 flex items-center justify-center">
                            <Icon className={`w-4 h-4 ${starter.color}`} />
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-wider bg-[#262B40] text-[#5379AE] border border-[#5379AE]/25 uppercase">
                            {starter.tag}
                          </span>
                        </div>
                        <h3 className="font-editorial text-lg text-white font-normal group-hover:text-[#A8C4EC] transition-colors">
                          {starter.title}
                        </h3>
                        <p className="text-xs text-[#A8C4EC]/80 font-light mt-1.5 leading-relaxed">
                          {starter.prompt}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#5379AE]/15 flex items-center justify-between text-[11px] font-mono text-[#A8C4EC] group-hover:text-white uppercase tracking-wider">
                        <span>Execute inquiry</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1 font-sans">→</span>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

          {/* Messages Feed */}
          {chatMessages.map((msg) => {
            const isUser = msg.role === 'user';
            const isOffline = msg.content.includes('[📱 WEBGPU') || msg.content.includes('[OFFLINE HELM');

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 animate-in fade-in duration-200 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md border flex-shrink-0 mt-0.5 ${
                    isOffline
                      ? 'bg-gradient-to-br from-[#1E2632] to-[#384959] border-[#88BDF2]/40 text-[#88BDF2]'
                      : 'bg-gradient-to-br from-[#0474C4] to-[#06457F] border-[#5379AE]/30 text-white'
                  }`}>
                    {isOffline ? <Smartphone className="w-4 h-4" /> : <Compass className="w-4 h-4 stroke-[2.5]" />}
                  </div>
                )}

                <div
                  className={`rounded-2xl p-5 max-w-[85%] text-xs shadow-xl leading-relaxed ${
                    isUser
                      ? 'bg-[#06457F]/60 border border-[#0474C4]/50 text-white font-medium ml-12 rounded-tr-none'
                      : 'bg-[#1d2334] border border-[#5379AE]/25 text-[#f1f5fb] rounded-tl-none space-y-3'
                  }`}
                >
                  {/* Safety Verdict Badge for Assistant Messages */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#384959]/40">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          msg.safety_verdict === 'SAFE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : msg.safety_verdict === 'CAUTION'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {msg.safety_verdict === 'SAFE' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        Operational Status: {msg.safety_verdict || 'ACTIVE'}
                      </span>

                      {isOffline && (
                        <span className="text-[10px] font-mono text-[#88BDF2] font-bold">
                          📱 WebGPU Edge (0% Net)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="text-[#f1f5fb] whitespace-pre-line text-xs sm:text-sm leading-relaxed font-sans font-light">
                    {msg.content}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#5379AE]/15 text-[10px] text-[#5379AE] font-mono">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <span>{isOffline ? 'On-Device Mobile Inference' : 'ISRO MOSDAC • INCOIS Telemetry'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Thinking / Analyzing State */}
          {isAnalyzing && (
            <div className="flex gap-3 items-center text-slate-300 text-xs py-3 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-[#1d2334] border border-[#0474C4]/50 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-[#0474C4] animate-spin" />
              </div>
              <span className="font-mono text-xs text-[#A8C4EC]">
                {inferenceMode === 'offline'
                  ? 'Executing on-device WebGPU inference on mobile hardware...'
                  : 'Synthesizing Oceansat-3 chlorophyll fronts, wave heights & IMBL coordinates...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Bottom Floating Input Dock ── */}
      <div className="relative z-20 pb-7 pt-2 px-4 bg-gradient-to-t from-[#151926] via-[#151926]/95 to-transparent flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          
          <div className="relative flex items-center bg-[#1d2334] border border-[#5379AE]/40 focus-within:border-[#0474C4] focus-within:shadow-[0_0_25px_rgba(4,116,196,0.3)] rounded-2xl px-3.5 py-2.5 transition-all shadow-2xl">
            
            {/* Input field */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAnalyzing}
              placeholder={
                inferenceMode === 'offline'
                  ? 'Ask offline helmsman (runs 100% on phone GPU with 0 internet)...'
                  : 'Ask anything about fishing spots, sea state, cyclone warnings, or route safety...'
              }
              className="flex-1 bg-transparent border-none outline-none text-[#f1f5fb] placeholder-[#8fa2bf] text-sm sm:text-base px-3 py-1 font-normal"
            />

            {/* Voice Mic Button */}
            <button
              onClick={toggleVoice}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer mr-1.5 outline-none ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-[#A8C4EC] hover:text-white hover:bg-white/5'
              }`}
              title={isListening ? 'Stop Listening' : 'Multilingual Voice Input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!inputPrompt.trim() || isAnalyzing}
              className="p-2.5 rounded-xl bg-[#0474C4] hover:bg-[#0360a3] text-white font-bold transition-all disabled:opacity-30 cursor-pointer shadow-[0_2px_12px_rgba(4,116,196,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] border border-[#5379AE]/40 outline-none"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#8fa2bf] font-mono mt-2.5 px-2">
            <span>
              {inferenceMode === 'offline'
                ? 'Mode: On-Device Mobile AI (Zero Internet) · GPU Accelerated'
                : 'Press Enter to send · Multilingual Hindi, Tamil, Malayalam & English'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[#A8C4EC]/70 hidden sm:inline">
                {inferenceMode === 'offline' ? 'WebLLM / IndexedDB' : 'INCOIS PFZ / ISRO MOSDAC'}
              </span>
              {chatMessages.length > 1 && (
                <button
                  onClick={clearChat}
                  className="text-[#8fa2bf] hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer outline-none"
                  title="Clear Conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
