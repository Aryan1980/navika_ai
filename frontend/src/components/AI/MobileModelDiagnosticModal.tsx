import React, { useState, useEffect } from 'react';
import { X, Cpu, Download, CheckCircle, AlertTriangle, Send, WifiOff, HardDrive, Smartphone, Sparkles, RefreshCw } from 'lucide-react';
import { mobileWebLLM, ModelProgress } from '../../services/webllm';

interface MobileModelDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileModelDiagnosticModal: React.FC<MobileModelDiagnosticModalProps> = ({
  isOpen,
  onClose
}) => {
  const [hasWebGPU, setHasWebGPU] = useState<boolean | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [progress, setProgress] = useState<ModelProgress>({ progress: 0, text: '' });
  const [testQuery, setTestQuery] = useState<string>('Is it safe to navigate 15 nautical miles offshore from Kochi tonight?');
  const [inferenceResult, setInferenceResult] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [inferenceTimeMs, setInferenceTimeMs] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      mobileWebLLM.isWebGPUSupported().then(setHasWebGPU);
      const status = mobileWebLLM.getStatus();
      setIsLoaded(status.isLoaded);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadModel = async () => {
    setIsDownloading(true);
    setProgress({ progress: 1, text: 'Connecting to HuggingFace / WebLLM CDN...' });

    const success = await mobileWebLLM.initializeModel((p) => {
      setProgress(p);
    });

    setIsDownloading(false);
    setIsLoaded(success);
    if (success) {
      setProgress({ progress: 100, text: 'Model successfully cached in mobile IndexedDB!' });
    } else {
      setProgress({ progress: 0, text: 'Download failed or WebGPU initialization timeout.' });
    }
  };

  const handleRunInference = async () => {
    if (!testQuery.trim() || isGenerating) return;
    setIsGenerating(true);
    setInferenceResult('');
    const startTime = performance.now();

    try {
      const response = await mobileWebLLM.generateOfflineAdvice(
        testQuery,
        'Departure port: Kochi Coastal Harbor. Sea state: Moderate. Wind: 14 knots WSW.'
      );
      const duration = Math.round(performance.now() - startTime);
      setInferenceTimeMs(duration);
      setInferenceResult(response);
    } catch (err: any) {
      setInferenceResult(`Inference Error: ${err.message || 'Failed to process on-device query'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-[#161c27] rounded-3xl border border-[#384959] shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col max-h-[90vh] overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-[#384959] flex items-center justify-between bg-[#1E2632]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0474C4]/20 border border-[#88BDF2]/40 flex items-center justify-center text-[#88BDF2]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Mobile On-Device AI Helmsman</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#384959] text-[#88BDF2] border border-[#88BDF2]/30 uppercase">
                  WebLLM / WebGPU
                </span>
              </h2>
              <p className="text-xs text-[#BDDDFC]/70 mt-0.5">
                Zero-Internet edge inference running directly inside mobile browser (Chrome/Safari)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242E3B] border border-[#384959] text-[#BDDDFC] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 font-sans text-xs">
          
          {/* Hardware & WebGPU Status Card */}
          <div className="p-4 rounded-2xl bg-[#1E2632] border border-[#384959] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-[#88BDF2]" />
              <div>
                <span className="font-bold text-white block">Device WebGPU Hardware Acceleration</span>
                <span className="text-[#BDDDFC]/70 text-[11px]">
                  {hasWebGPU ? 'Supported by browser/mobile device GPU pipeline.' : 'Checking WebGPU API availability...'}
                </span>
              </div>
            </div>
            <div>
              {hasWebGPU ? (
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>WEBGPU READY</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>CPU / FALLBACK</span>
                </span>
              )}
            </div>
          </div>

          {/* Model Cache Section */}
          <div className="p-4 rounded-2xl bg-[#12161f] border border-[#384959] space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-white text-sm block">Model: SmolLM2-360M-Instruct-q4f16</span>
                <span className="text-[11px] text-[#BDDDFC]/70 mt-0.5 block">
                  Optimized 4-bit quantized model (~210 MB). One-time download cached in phone's IndexedDB.
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-[#88BDF2] font-semibold">210 MB</span>
                <span className="block text-[9px] text-[#BDDDFC]/50 uppercase font-mono">Size</span>
              </div>
            </div>

            {/* Download Progress Bar */}
            {isDownloading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono text-[#BDDDFC]">
                  <span>{progress.text}</span>
                  <span className="font-bold text-white">{progress.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1E2632] overflow-hidden border border-[#384959]">
                  <div
                    className="h-full bg-gradient-to-r from-[#6A89A7] via-[#88BDF2] to-[#BDDDFC] rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[11px] text-[#BDDDFC]/80 font-mono">
                <HardDrive className="w-3.5 h-3.5 text-[#88BDF2]" />
                <span>Status: {isLoaded ? 'Cached in Device Storage' : 'Not Cached'}</span>
              </div>

              {!isLoaded ? (
                <button
                  onClick={handleDownloadModel}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-[#88BDF2] hover:bg-[#BDDDFC] text-[#0f141d] font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Downloading Model...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download & Cache to Phone</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Ready for Deep-Sea Offline Use</span>
                </span>
              )}
            </div>
          </div>

          {/* Deep-Sea Offline Test Console */}
          <div className="p-4 rounded-2xl bg-[#1E2632] border border-[#384959] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                  Test Deep-Sea Offline Inference
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#BDDDFC]/60">0% Internet Simulated</span>
            </div>

            <p className="text-[11px] text-[#BDDDFC]/70 leading-relaxed">
              Test asking nautical questions without sending any packets to the cloud:
            </p>

            <div className="space-y-2">
              <textarea
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                rows={2}
                placeholder="Ask maritime question..."
                className="w-full p-3 rounded-xl bg-[#12161f] border border-[#384959] text-white placeholder-[#BDDDFC]/40 text-xs font-mono focus:outline-none focus:border-[#88BDF2] resize-none"
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTestQuery('What is the safest port of refuge near Kollam during high swells?')}
                    className="text-[10px] px-2 py-1 rounded-lg bg-[#242E3B] hover:bg-[#384959] text-[#BDDDFC] border border-[#384959] transition-all cursor-pointer"
                  >
                    Port of Refuge?
                  </button>
                  <button
                    onClick={() => setTestQuery('Is Wadge Bank fishing safe tonight?')}
                    className="text-[10px] px-2 py-1 rounded-lg bg-[#242E3B] hover:bg-[#384959] text-[#BDDDFC] border border-[#384959] transition-all cursor-pointer"
                  >
                    Wadge Bank?
                  </button>
                </div>

                <button
                  onClick={handleRunInference}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-[#0474C4] hover:bg-[#06457f] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-[#88BDF2]" />
                      <span>Generating on GPU...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Run Offline On-Device</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Inference Output */}
            {inferenceResult && (
              <div className="mt-3 p-3.5 rounded-xl bg-[#12161f] border border-[#88BDF2]/40 text-[#BDDDFC] space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#384959]/60 pb-1.5">
                  <span className="font-mono text-[10px] text-[#88BDF2] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Edge Response (Zero Internet)</span>
                  </span>
                  {inferenceTimeMs !== null && (
                    <span className="text-[10px] font-mono text-[#BDDDFC]/60">
                      Latency: <strong className="text-white">{inferenceTimeMs}ms</strong>
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-white whitespace-pre-line font-sans">
                  {inferenceResult}
                </p>
              </div>
            )}
          </div>

          {/* User Guide: What would the user need? */}
          <div className="p-4 rounded-2xl bg-[#12161f]/80 border border-[#384959]/60 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono text-[#88BDF2]">
              What Does a Skipper Need to Use This?
            </h4>
            <ul className="space-y-1.5 text-[11px] text-[#BDDDFC]/80 list-disc list-inside">
              <li>
                <strong className="text-white">Mobile Device:</strong> Any modern smartphone (Android with Chrome/Brave/Edge or iPhone with iOS 17.4+ on Safari).
              </li>
              <li>
                <strong className="text-white">Zero App Installation:</strong> Works directly in the browser as a Progressive Web App (PWA) with zero App Store / Play Store friction.
              </li>
              <li>
                <strong className="text-white">One-Time Harbor Setup:</strong> Skipper taps "Download & Cache" while docked at harbor Wi-Fi or 4G (~210 MB).
              </li>
              <li>
                <strong className="text-white">Deep-Sea Execution:</strong> Once cached, the model runs 100% offline on the phone’s GPU when 20+ NM offshore with 0 cellular network.
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#384959] bg-[#1E2632]/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#242E3B] hover:bg-[#384959] text-white font-medium text-xs border border-[#384959] transition-all cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
};
