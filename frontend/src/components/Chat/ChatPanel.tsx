import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  HelpCircle,
  Shield,
  Volume2,
  VolumeX,
  Activity,
  Radio,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoQueries } from './DemoQueries';
import { EvidenceDrawer } from './EvidenceDrawer';
import { voiceService } from '../../services/voice';
import { EvidenceDetails, AgentTrace } from '../../types/marine';

export const ChatPanel: React.FC = () => {
  const {
    chatMessages,
    isAnalyzing,
    language,
    soundEnabled,
    sendQuery,
    isVoiceActive,
    isAiSpeaking,
    setIsVoiceActive,
    stopSpeech
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState<EvidenceDetails | null>(null);
  const [activeTraces, setActiveTraces] = useState<AgentTrace[] | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAnalyzing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAnalyzing) return;
    const q = inputQuery;
    setInputQuery('');
    sendQuery(q);
  };

  const startMic = (autoSend: boolean = false) => {
    setIsListening(true);
    voiceService.startListening(
      language,
      (transcript) => {
        setIsListening(false);
        if (autoSend || isVoiceActive) {
          // In hands-free voice mode: immediately clear text box and send
          setInputQuery('');
          sendQuery(transcript);
        } else {
          // Standard mic button: transcribe into input box so user can review and edit before sending
          setInputQuery(transcript);
        }
      },
      (err) => {
        console.warn('Voice recognition error:', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      // Normal mic click: transcribes text into input box without auto-sending
      startMic(false);
    }
  };

  const toggleHandsFreeMode = () => {
    const nextMode = !isVoiceActive;
    setIsVoiceActive(nextMode);
    voiceService.setVoiceMode(nextMode);
    if (nextMode) {
      startMic(true);
    } else {
      voiceService.stopListening();
      voiceService.stopSpeaking();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] rounded-2xl border border-white/[0.07] overflow-hidden">
      
      {/* 1. Voice Mode Status & Controls Header */}
      <div className="px-4 py-2 bg-[#0c1220] border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleHandsFreeMode}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isVoiceActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20'
                : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/[0.08]'
            }`}
            title="Toggle Hands-Free Regional Voice Chat"
          >
            <Radio className={`w-3.5 h-3.5 ${isVoiceActive ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{isVoiceActive ? 'Hands-Free Voice ON' : 'Hands-Free Voice'}</span>
          </button>

          {isAiSpeaking && (
            <button
              onClick={stopSpeech}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 cursor-pointer hover:bg-cyan-500/25"
              title="Stop Speaking"
            >
              <VolumeX className="w-3.5 h-3.5 text-cyan-400" />
              <span>Stop Audio</span>
            </button>
          )}
        </div>

        {/* Animated Audio Equalizer Waveform */}
        <div className="flex items-center gap-1 h-4">
          {(isListening || isAiSpeaking) ? (
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-cyan-400 font-mono mr-1.5 animate-pulse">
                {isListening ? 'Listening...' : 'AI Speaking...'}
              </span>
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-3"></span>
              <span className="w-1 bg-cyan-300 rounded-full animate-bounce h-4" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0.3s' }}></span>
              <span className="w-1 bg-cyan-200 rounded-full animate-bounce h-4" style={{ animationDelay: '0.45s' }}></span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">10 Indian Languages</span>
          )}
        </div>
      </div>

      {/* 2. Minimalist Query Suggestions */}
      <DemoQueries />

      {/* 3. Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? 'bg-white/10 text-white'
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] rounded-xl p-3.5 ${
                  isUser
                    ? 'bg-white/[0.08] text-white border border-white/[0.08]'
                    : 'bg-white/[0.02] border border-white/[0.06] text-slate-200'
                }`}
              >
                {/* Safety verdict header */}
                {!isUser && msg.safety_verdict && (
                  <div className="mb-2 flex items-center justify-between gap-2 pb-1.5 border-b border-white/[0.05]">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wide ${
                        msg.safety_verdict === 'SAFE'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : msg.safety_verdict === 'SAFE_WITH_CAUTION'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {msg.safety_verdict.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                  </div>
                )}

                {/* Message Content */}
                <div className="whitespace-pre-line leading-relaxed text-[11px] font-normal text-slate-300">
                  {msg.content}
                </div>

                {/* Attached Actions */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between gap-2">
                    {msg.evidence ? (
                      <button
                        onClick={() => {
                          setActiveEvidence(msg.evidence || null);
                          setActiveTraces(msg.traces);
                        }}
                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] px-2 py-1 rounded transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3 text-cyan-400" />
                        <span>Evidence & Reasoning</span>
                      </button>
                    ) : <div />}

                    <button
                      onClick={() => voiceService.speak(msg.content, language)}
                      className="text-slate-400 hover:text-cyan-300 p-1 rounded transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                      title="Listen aloud in Indian regional language"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Speak</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Multi-Agent Orchestration Loading Indicator */}
        {isAnalyzing && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-xs text-slate-300 max-w-[85%]">
              <div className="flex items-center gap-2 font-medium text-cyan-300 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Multi-Agent Swarm analyzing satellite telemetry & nautical routes...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Input Form */}
      <div className="p-3 border-t border-white/[0.06] bg-[#070a12]/80">
        {isListening && (
          <div className="mb-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs text-rose-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Listening to voice in your language... speak clearly now.</span>
            </span>
            <button
              onClick={() => { voiceService.stopListening(); setIsListening(false); }}
              className="text-[10px] text-rose-400 hover:text-white underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? 'Stop Listening' : 'Voice Chat Input'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isListening ? 'Listening to speech...' : 'Speak or type: Where is safe fishing spot, weather, route...'}
            disabled={isAnalyzing}
            className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-cyan-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isAnalyzing}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-colors cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Evidence Modal */}
      <EvidenceDrawer
        evidence={activeEvidence}
        traces={activeTraces}
        onClose={() => setActiveEvidence(null)}
      />

    </div>
  );
};
