// Enhanced Voice service supporting hands-free Web Speech API (STT) and Web SpeechSynthesis (TTS)
const LANG_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  or: 'or-IN'
};

export class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private isCurrentlySpeaking: boolean = false;
  private voiceModeActive: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  isSupported(): boolean {
    return !!this.recognition;
  }

  isTTSAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.speechSynthesis;
  }

  isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  isVoiceModeActive(): boolean {
    return this.voiceModeActive;
  }

  setVoiceMode(active: boolean) {
    this.voiceModeActive = active;
    if (!active) {
      this.stopListening();
      this.stopSpeaking();
    }
  }

  startListening(
    lang: string,
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }

    // Stop speaking before listening
    this.stopSpeaking();

    const targetLang = LANG_MAP[lang] || 'en-IN';
    this.recognition.lang = targetLang;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.isListening = false;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error || 'Microphone capture error');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      this.isListening = false;
      onError('Failed to initiate microphone.');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  speak(
    text: string,
    lang: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel(); // cancel previous utterance

    // Expand maritime acronyms and SI units for natural spoken voice in Indian languages
    let cleanText = text
      .replace(/km\/h/gi, ' kilometers per hour ')
      .replace(/°C/g, ' degrees Celsius ')
      .replace(/mg\/m[3³]/g, ' milligrams per cubic meter ')
      .replace(/NM\b/g, ' nautical miles ')
      .replace(/\bSST\b/g, ' Sea Surface Temperature ')
      .replace(/\bPFZ\b/g, ' Potential Fishing Zone ')
      .replace(/\bIMBL\b/g, ' International Maritime Boundary Line ')
      .replace(/\bMPA\b/g, ' Marine Protected Area ')
      .replace(/\bETA\b/g, ' Estimated Arrival ')
      .replace(/\*\*/g, '')
      .replace(/[#_*~`]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    // Spoken response length: keep conversational (approx first 280 chars or 2 sentences)
    const sentences = cleanText.split('. ');
    if (sentences.length > 3) {
      cleanText = sentences.slice(0, 3).join('. ') + '.';
    }
    cleanText = cleanText.slice(0, 320);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = LANG_MAP[lang] || 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.95; // slightly slower for maritime acoustic clarity
    utterance.pitch = 1.0;

    // Pick Indian English / Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find((v) => v.lang === targetLang || v.lang.startsWith(targetLang.split('-')[0]));
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      this.isCurrentlySpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isCurrentlySpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isCurrentlySpeaking = false;
      if (onEnd) onEnd();
    };

    this.isCurrentlySpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Synthesize speech using Digital India NLTM Bhashini TTS with fallback to Web Speech
   */
  async speakWithBhashini(
    text: string,
    lang: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    try {
      this.stopSpeaking();
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: lang,
          gender: 'female'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.audio_base64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
          this.isCurrentlySpeaking = true;
          if (onStart) onStart();

          audio.onended = () => {
            this.isCurrentlySpeaking = false;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            this.isCurrentlySpeaking = false;
            if (onEnd) onEnd();
          };

          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn('Bhashini TTS unavailable, switching to browser Web Speech API:', e);
    }

    // Seamless fallback to browser speech synthesis
    this.speak(text, lang, onStart, onEnd);
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isCurrentlySpeaking = false;
    }
  }
}

export const voiceService = new VoiceService();
