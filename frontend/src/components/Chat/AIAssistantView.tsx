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
  WifiOff,
  Volume2,
  VolumeX,
  Languages,
  GitCommit,
  Terminal,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { voiceService } from '../../services/voice';
import { mobileWebLLM, ModelProgress } from '../../services/webllm';
import { ChatMessage } from '../../types/marine';
import { AgentDAGFlowDiagram } from '../Observability/AgentDAGFlowDiagram';
import { LiveTerminalTrace } from '../Observability/LiveTerminalTrace';
import { ReasoningTerminal } from '../Observability/ReasoningTerminal';
import { getLocalizedPortName } from '../../utils/locationTranslations';

const BHASHINI_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'en', name: 'English', native: 'English' }
];

const GET_STARTER_PROMPTS = (lang: string) => {
  const isHi = lang === 'hi';
  const isMl = lang === 'ml';
  const isTa = lang === 'ta';
  const isTe = lang === 'te';
  const isBn = lang === 'bn';

  return [
    {
      icon: Fish,
      tag: isHi ? 'मत्स्य क्षेत्र' : isMl ? 'മത്സ്യ മേഖല' : isTa ? 'மீன்பிடி மண்டலம்' : isTe ? 'చేపల వేట' : isBn ? 'মৎস্য জোন' : 'PFZ DETECTION',
      title: isHi ? 'उच्च उत्पादक मत्स्य क्षेत्र' : isMl ? 'സമൃദ്ധമായ മത്സ്യ മേഖലകൾ' : isTa ? 'அதிக மகசூல் மீன்பிடி பகுதிகள்' : isTe ? 'అధిక దిగుబడి చేపల వేట' : isBn ? 'উচ্চ ফলনশীল মাছ ধরার ফ্রন্ট' : 'High-Yield Fishing Fronts',
      prompt: isHi
        ? 'सक्रिय बंदरगाह के 25 किमी के भीतर सार्डिन और टूना के लिए सर्वोत्तम थर्मल क्लोरोफिल कन्वर्जेंस ज़ोन खोजें।'
        : isMl
        ? 'തുറമുഖത്തിന് 25 കിലോമീറ്ററിനുള്ളിൽ മത്തി, ചൂര എന്നിവയ്ക്കുള്ള മികച്ച തെർമൽ ക്ലോറോഫിൽ മത്സ്യബന്ധന മേഖലകൾ കണ്ടെത്തുക.'
        : isTa
        ? 'எங்கள் துறைமுகத்திலிருந்து 25 கி.மீ எல்லைக்குள் மத்தி மற்றும் சூரை மீன்களுக்கான சிறந்த வெப்பமண்டல மீன்பிடி பகுதிகளைக் கண்டறியவும்.'
        : isTe
        ? 'మా పోర్టు నుండి 25 కి.మీ పరిధిలో సార్డిన్ మరియు ట్యూనా కోసం ఉత్తమ చేపల వేట మండలాలను గుర్తించండి.'
        : isBn
        ? 'আমাদের বন্দরের ২৫ কিমি মধ্যে সার্ডিন ও টুনা মাছের জন্য সর্বোত্তম থার্মাল ক্লোরোফিল ফ্রন্ট অঞ্চল চিহ্নিত করুন।'
        : 'Identify the best thermal chlorophyll convergence zones for sardine and tuna within 25 km of our active port.',
      badge: isHi ? 'इष्टतम कैच' : 'OPTIMAL CATCH',
      color: 'text-emerald-400',
      border: 'hover:border-[#0474C4]/50'
    },
    {
      icon: Waves,
      tag: isHi ? 'जलगतिकी' : isMl ? 'കടൽ സ്ഥിതി' : isTa ? 'கடல் இயக்கம்' : isTe ? 'హైడ్రోడైనమిక్స్' : isBn ? 'হাইড্রোডাইনামিক্স' : 'HYDRODYNAMICS',
      title: isHi ? 'लहर की ऊंचाई व जोखिम' : isMl ? 'തിരമാല ഉയരവും അപകട സാധ്യതയും' : isTa ? 'அலை உயரம் & ஆபத்து பகுப்பாய்வு' : isTe ? 'అలల ఎత్తు & ప్రమాద హెచ్చరిక' : isBn ? 'ঢেউয়ের উচ্চতা ও ঝুঁকির ঝুঁকি' : 'Wave Swell & Hazard Risk',
      prompt: isHi
        ? 'आज रात के लिए वर्तमान लहर ऊंचाई, तरंग गतिशीलता, समुद्र की स्थिति और तूफान संबंधी सलाह का विश्लेषण करें।'
        : isMl
        ? 'ഇന്നത്തെ തിരമാല ഉയരം, കടൽ പ്രക്ഷുബ്ധത, ചുഴലിക്കാറ്റ് മുന്നറിയിപ്പുകൾ എന്നിവ വിശകലനം ചെയ്യുക.'
        : isTa
        ? 'இன்றைய அலை உயரம், கடல் கொந்தளிப்பு மற்றும் சூறாவளி எச்சரிக்கைகளை பகுப்பாய்வு செய்யவும்.'
        : isTe
        ? 'నేటి రాత్రికి ప్రస్తుత అలల ఎత్తు, సముద్ర స్థితి మరియు తుఫాను హెచ్చరికలను విశ్లేషించండి.'
        : isBn
        ? 'আজ রাতের জন্য বর্তমান ঢেউয়ের উচ্চতা, সমুদ্রের অবস্থা এবং ঝড়ের সতর্কতা বিশ্লেষণ করুন।'
        : 'Analyze current wave height, swell kinematics, sea state, and squall advisories for tonight.',
      badge: isHi ? 'सुरक्षा प्रथम' : 'SAFETY 1ST',
      color: 'text-[#A8C4EC]',
      border: 'hover:border-[#0474C4]/50'
    },
    {
      icon: ShieldAlert,
      tag: isHi ? 'जियो-फेंस' : isMl ? 'അതിർത്തി സുരക്ഷ' : isTa ? 'எல்லை வேலி' : isTe ? 'జియో ఫెన్సింగ్' : isBn ? 'জিও-ফেনসিং' : 'GEO-FENCING',
      title: isHi ? 'आईएमबीएल संप्रभु सीमा दूरी' : isMl ? 'അന്താരാഷ്ട്ര സമുദ്രാതിർത്തി (IMBL)' : isTa ? 'சர்வதேச எல்லை (IMBL) பாதுகாப்பு' : isTe ? 'IMBL సరిహద్దు క్లియరెన్స్' : isBn ? 'আন্তর্জাতিক সীমান্ত (IMBL) ক্লিয়ারেন্স' : 'IMBL Sovereign Border Clearance',
      prompt: isHi
        ? 'अंतर्राष्ट्रीय समुद्री सीमा रेखा (IMBL) से हमारी दूरी की जांच करें और सुरक्षित बफर दूरी सुनिश्चित करें।'
        : isMl
        ? 'അന്താരാഷ്ട്ര സമുദ്രാതിർത്തിയിൽ (IMBL) നിന്നുള്ള അകലം പരിശോധിച്ച് സുരക്ഷിതമായ അകലം ഉറപ്പാക്കുക.'
        : isTa
        ? 'சர்வதேச கடல் எல்லைக் கோட்டிற்கான (IMBL) தூரத்தை சரிபார்த்து பாதுகாப்பான இடைவெளியை உறுதி செய்யவும்.'
        : isTe
        ? 'అంతర్జాతీయ సముద్ర సరిహద్దు రేఖ (IMBL) నుండి దూరాన్ని తనిఖీ చేసి సురక్షిత క్లియరెన్స్ నిర్ధారించండి.'
        : isBn
        ? 'আন্তর্জাতিক সামুদ্রিক সীমানা রেখা (IMBL) থেকে দূরত্ব পরীক্ষা করুন এবং নিরাপদ বাফার দূরত্ব নিশ্চিত করুন।'
        : 'Check our proximity to the International Maritime Boundary Line (IMBL) and ensure safe buffer clearance.',
      badge: isHi ? 'सीमा सुरक्षा' : 'BORDER SAFETY',
      color: 'text-[#e59883]',
      border: 'hover:border-[#e59883]/40'
    },
    {
      icon: Navigation,
      tag: isHi ? 'नेविगेशन' : isMl ? 'യാത്രാ പ്ലാൻ' : isTa ? 'பயண வழிகாட்டல்' : isTe ? 'నావిగేషన్' : isBn ? 'ন্যাভিগেশন' : 'DISPATCH',
      title: isHi ? 'ईंधन व सुरक्षित पारगमन योजना' : isMl ? 'ഇന്ധനവും യാത്രാ ആസൂത്രണവും' : isTa ? 'எரிபொருள் & பயணத் திட்டம்' : isTe ? 'ఇంధనం & ప్రయాణ ప్రణాళిక' : isBn ? 'জ্বালানী ও ট্রানজিট পরিকল্পনা' : 'Fuel & Transit Planning',
      prompt: isHi
        ? 'अनुमानित पारगमन समय और ईंधन खपत के साथ स्पॉट 1 के लिए सबसे सुरक्षित समुद्री मार्ग की गणना करें।'
        : isMl
        ? 'പ്രതീക്ഷിത യാത്രാ സമയവും ഇന്ധന ഉപഭോഗവും സഹിതം സ്പോട്ട് 1-ലേക്കുള്ള ഏറ്റവും സുരക്ഷിതമായ കടൽ പാത കണക്കാക്കുക.'
        : isTa
        ? 'மதிப்பிடப்பட்ட பயண நேரம் மற்றும் எரிபொருள் பயன்பாட்டுடன் பகுதி 1-க்கான பாதுகாப்பான கடல் வழியைக் கணக்கிடுங்கள்.'
        : isTe
        ? 'అంచనా ప్రయాణ సమయం మరియు ఇంధన వినియోగంతో స్పాట్ 1 కి అత్యంత సురక్షితమైన సముద్ర మార్గాన్ని లెక్కించండి.'
        : isBn
        ? 'আনুমানিক যাত্রার সময় এবং জ্বালানী খরচ সহ স্পট ১-এর নিরাপদ সামুদ্রিক রুট গণনা করুন।'
        : 'Calculate the safest seaward route to Spot 1 with estimated transit time and fuel consumption.',
      badge: isHi ? 'वेपॉइंट्स' : 'WAYPOINTS',
      color: 'text-[#5379AE]',
      border: 'hover:border-[#5379AE]/50'
    }
  ];
};

export const AIAssistantView: React.FC = () => {
  const {
    activeLocation,
    activeLocationName,
    chatMessages,
    isAnalyzing: isAnalyzingCloud,
    language,
    setLanguage,
    sendQuery,
    addChatMessage,
    clearChat
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'observability'>('chat');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [inferenceMode, setInferenceMode] = useState<'cloud' | 'offline'>('cloud');
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isModelDownloading, setIsModelDownloading] = useState<boolean>(false);
  const [modelProgress, setModelProgress] = useState<ModelProgress>({ progress: 0, text: '' });
  const [hasWebGPU, setHasWebGPU] = useState<boolean | null>(null);
  const [isAnalyzingLocal, setIsAnalyzingLocal] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

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
        const localizedPort = getLocalizedPortName(activeLocationName, language);
        const localReply = await mobileWebLLM.generateOfflineAdvice(
          text,
          `Vessel Departure Fix: ${localizedPort} (${activeLocation.latitude.toFixed(4)}°N, ${activeLocation.longitude.toFixed(4)}°E).`,
          language
        );

        const assistantMsg: ChatMessage = {
          id: `asst_${Date.now()}`,
          role: 'assistant',
          content: localReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          safety_verdict: 'SAFE'
        };
        addChatMessage(assistantMsg);

        // Vocalize response if TTS enabled
        if (ttsEnabled) {
          voiceService.speak(localReply, language);
        }
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
      
      {/* ── Ambient Sapphire Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#06457F]/25 via-[#0474C4]/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-10 w-[400px] h-[400px] bg-[#2C444C]/20 rounded-full blur-[120px]" />
      </div>

      {/* ── Top Unified AI Bar: Mode Switcher & Observability Tabs ── */}
      <div className="relative z-20 px-4 py-2.5 bg-[#181e2e]/95 backdrop-blur-md border-b border-[#384959] flex-shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          {/* Main View Switcher: Chat vs LangGraph Observability */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#12161f] border border-[#384959]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#0474C4] text-white shadow-md'
                  : 'text-[#BDDDFC]/70 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Helmsman Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('observability')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'observability'
                  ? 'bg-gradient-to-r from-indigo-600 to-[#0474C4] text-white shadow-md'
                  : 'text-[#BDDDFC]/70 hover:text-white'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5 text-cyan-300" />
              <span>LangGraph Architecture</span>
              <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded border border-indigo-400/30 font-mono">
                5 Nodes
              </span>
            </button>
          </div>

          {/* Engine Selector: Cloud vs On-Device */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#12161f] border border-[#384959]/70 text-xs">
              <button
                onClick={() => setInferenceMode('cloud')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                  inferenceMode === 'cloud'
                    ? 'bg-[#1E2632] text-white border border-white/10'
                    : 'text-[#BDDDFC]/60 hover:text-white'
                }`}
              >
                Cloud (Gemini 2.5)
              </button>
              <button
                onClick={() => setInferenceMode('offline')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                  inferenceMode === 'offline'
                    ? 'bg-[#1E2632] text-[#88BDF2] border border-[#88BDF2]/40'
                    : 'text-[#BDDDFC]/60 hover:text-white'
                }`}
              >
                On-Device WebLLM
              </button>
            </div>

            {/* Offline Model Download Status */}
            {inferenceMode === 'offline' && !isModelLoaded && (
              <button
                onClick={handleDownloadModel}
                disabled={isModelDownloading}
                className="px-2.5 py-1 bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#0f141d] font-bold rounded-xl text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {isModelDownloading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>{modelProgress.progress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3" />
                    <span>Cache Model (210MB)</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* Progress Bar for Model Download */}
        {isModelDownloading && (
          <div className="max-w-4xl mx-auto mt-2 space-y-1">
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

      {/* ── Bhashini Audio UX Panel ── */}
      <div className="relative z-15 px-4 py-2 bg-gradient-to-r from-[#21160e] via-[#1a1f2c] to-[#12161f] border-b border-amber-500/25 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            {/* Left: Saffron Bhashini Badge & Voice Input Action */}
            <div className="flex items-center flex-wrap gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-amber-600 text-white font-bold text-[11px] font-mono shadow-sm">
                <span>🇮🇳</span>
                <span>Bhashini</span>
              </div>

              {/* Hands-Free Vernacular Input Mic Button */}
              <button
                onClick={toggleVoice}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-sm'
                }`}
                title="Tap to speak hands-free in your native maritime dialect"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isListening ? 'Listening (Speak now)...' : 'Hands-Free Vernacular Input'}</span>
              </button>

              {/* Active TTS Badge */}
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-mono cursor-pointer border transition-colors ${
                  ttsEnabled
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-white/5 text-slate-400 border-white/10'
                }`}
                title="Toggle Natural Vernacular Voice Synthesis"
              >
                {ttsEnabled ? <Volume2 className="w-3 h-3 text-emerald-400" /> : <VolumeX className="w-3 h-3" />}
                <span>{ttsEnabled ? 'TTS Active: Natural Indian Accent' : 'TTS Muted'}</span>
              </button>
            </div>

            {/* Language Chips (Tamil, Telugu, Malayalam, Gujarati, Bengali, Marathi) */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 text-[11px]">
              {BHASHINI_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                    language === lang.code
                      ? 'bg-amber-500 text-[#12161f] font-bold shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                  title={`Switch to ${lang.name}`}
                >
                  <span>{lang.native}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Official GoI Bhashini Mission Disclaimer */}
          <div className="text-[10px] text-amber-200/70 font-mono flex items-center justify-between border-t border-amber-500/15 pt-1">
            <span>
              Bhashini (National Language Translation Mission, MeitY, Govt of India) · Voice recognition running local offshore fallback models
            </span>
            <span className="hidden md:inline text-slate-500">
              Zero cloud telemetry required for acoustic features
            </span>
          </div>

        </div>
      </div>

      {/* ── Main Tab Content ── */}
      {activeTab === 'observability' ? (
        /* Observability & LangGraph Full View */
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
          <AgentDAGFlowDiagram />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LiveTerminalTrace />
            <ReasoningTerminal />
          </div>
        </div>
      ) : (
        /* Helmsman Conversation View */
        <>
          {/* Central Conversation Stream */}
          <div
            ref={scrollContainerRef}
            className="relative z-10 flex-1 overflow-y-auto px-4 py-6"
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
                      {language === 'hi' ? 'नाविक ' : language === 'ml' ? 'നാവിഗേഷൻ ' : language === 'ta' ? 'மாலுமி ' : language === 'te' ? 'నావిగేషన్ ' : language === 'bn' ? 'ন্যাভিগেশন ' : 'Ask the '}
                      <span className="italic text-[#88BDF2] font-editorial">
                        {language === 'hi' ? 'सहायक से पूछें' : language === 'ml' ? 'സഹായിയോട് ചോദിക്കുക' : language === 'ta' ? 'உதவியாளரிடம் கேளுங்கள்' : language === 'te' ? 'సహాయకుడిని అడగండి' : language === 'bn' ? 'সহকারীকে জিজ্ঞাসা করুন' : 'Helmsman'}
                      </span>
                      {language === 'hi' ? '।' : '.'}
                    </h1>
                    <p className="text-sm sm:text-base text-[#A8C4EC]/85 max-w-xl mx-auto font-light leading-relaxed">
                      {language === 'hi' ? (
                        <>
                          <span className="text-white font-medium">{getLocalizedPortName(activeLocationName, language).split(',')[0]}</span> के तट पर उपग्रह टेलीमेट्री, तरंग गतिशीलता और जैविक मत्स्य क्षेत्रों का समन्वय।
                        </>
                      ) : language === 'ml' ? (
                        <>
                          <span className="text-white font-medium">{getLocalizedPortName(activeLocationName, language).split(',')[0]}</span> തീരത്തെ ഉപഗ്രഹ നിരീക്ഷണം, തിരമാല വിവരങ്ങൾ, മത്സ്യബന്ധന മേഖലകൾ എന്നിവ ലഭ്യമാണ്.
                        </>
                      ) : (
                        <>
                          Autonomous multi-agent intelligence synthesizing satellite telemetry, physical wave kinematics, and biological fishing zones off{' '}
                          <span className="text-white font-medium">{getLocalizedPortName(activeLocationName, language).split(',')[0]}</span>.
                        </>
                      )}
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
                    {GET_STARTER_PROMPTS(language).map((starter, i) => {
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
                              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold tracking-wider bg-[#262B40] text-[#5379AE] border border-[#5379AE]/25 uppercase">
                                {starter.tag}
                              </span>
                            </div>
                            <h3 className="font-editorial text-xl text-white font-normal group-hover:text-[#A8C4EC] transition-colors">
                              {starter.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#A8C4EC]/85 font-light mt-1.5 leading-relaxed">
                              {starter.prompt}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#5379AE]/15 flex items-center justify-between text-xs font-mono text-[#A8C4EC] group-hover:text-white uppercase tracking-wider">
                            <span>
                              {language === 'hi' ? 'पूछताछ शुरू करें' : language === 'ml' ? 'ചോദിക്കുക' : language === 'ta' ? 'கேளுங்கள்' : language === 'te' ? 'ప్రశ్నించండి' : language === 'bn' ? 'জিজ্ঞাসা করুন' : 'Execute inquiry'}
                            </span>
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
                            className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              msg.safety_verdict === 'SAFE'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : msg.safety_verdict === 'CAUTION'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {msg.safety_verdict === 'SAFE' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5" />
                            )}
                            Operational Status: {msg.safety_verdict || 'ACTIVE'}
                          </span>

                          <button
                            onClick={() => setActiveTab('observability')}
                            className="text-xs font-mono text-[#88BDF2] hover:text-white flex items-center gap-1 cursor-pointer underline"
                            title="Inspect LangGraph State Traces"
                          >
                            <GitCommit className="w-3.5 h-3.5" />
                            <span>Inspect LangGraph Trace</span>
                          </button>
                        </div>
                      )}

                      {/* Message Content */}
                      <div className="text-[#f1f5fb] whitespace-pre-line text-sm sm:text-base leading-relaxed font-sans font-light">
                        {msg.content}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#5379AE]/15 text-xs text-[#88BDF2] font-mono">
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
                  <span className="font-mono text-xs sm:text-sm text-[#A8C4EC]">
                    {inferenceMode === 'offline'
                      ? 'Executing on-device WebGPU inference on mobile hardware...'
                      : 'Executing LangGraph agent DAG: Ocean, Meteo, Kinematics & Conflict Resolution Engine...'}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Floating Input Dock */}
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
                    language === 'hi'
                      ? (inferenceMode === 'offline'
                          ? 'ऑफ़लाइन नाविक से पूछें (0% इंटरनेट, सीधे फ़ोन GPU पर चलता है)...'
                          : 'मत्स्य क्षेत्र, मौसम, समुद्री स्थिति, चक्रवात या सुरक्षित मार्ग के बारे में पूछें...')
                      : language === 'ml'
                      ? (inferenceMode === 'offline'
                          ? 'ഓഫ്‌ലൈൻ നാവിക സഹായിയോട് ചോദിക്കുക (0% ഇന്റർനെറ്റ്)...'
                          : 'മത്സ്യ മേഖലകൾ, കാലാവസ്ഥ, തിരമാല, അല്ലെങ്കിൽ റൂട്ട് വിവരങ്ങൾ ചോദിക്കുക...')
                      : (inferenceMode === 'offline'
                          ? 'Ask offline helmsman (runs 100% on phone GPU with 0 internet)...'
                          : 'Ask anything about fishing spots, sea state, cyclone warnings, or route safety...')
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
                  title={isListening ? 'Stop Listening' : 'Hands-Free Vernacular Voice Input'}
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
                    : 'Press Enter to send · Multilingual Bhashini Voice Input Active'}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('observability')}
                    className="text-[#88BDF2] hover:text-white transition-colors flex items-center gap-1 cursor-pointer outline-none"
                  >
                    <GitCommit className="w-3.5 h-3.5" />
                    <span>View DAG Observability</span>
                  </button>
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
        </>
      )}

    </div>
  );
};
