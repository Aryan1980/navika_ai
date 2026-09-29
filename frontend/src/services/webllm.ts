/**
 * Mobile On-Device AI Service using WebLLM (@mlc-ai/web-llm).
 * 
 * Enables true deep-sea offline helming inference directly inside
 * the mobile browser using WebGPU and WebAssembly with zero internet.
 */

export interface ModelProgress {
  progress: number;
  text: string;
}

class MobileWebLLMService {
  private engine: any = null;
  private isInitializing: boolean = false;
  private isLoaded: boolean = false;
  private selectedModel: string = 'SmolLM2-360M-Instruct-q4f16_1-MLC';

  /**
   * Checks whether the current browser / mobile hardware supports WebGPU.
   */
  async isWebGPUSupported(): Promise<boolean> {
    if (typeof navigator === 'undefined') return false;
    return 'gpu' in navigator;
  }

  /**
   * Initializes and caches the lightweight mobile model weights in IndexedDB.
   */
  async initializeModel(
    onProgress?: (progress: ModelProgress) => void
  ): Promise<boolean> {
    if (this.isLoaded && this.engine) return true;
    if (this.isInitializing) return false;

    const supported = await this.isWebGPUSupported();
    if (!supported) {
      console.warn('WebGPU is not supported in this client environment.');
      return false;
    }

    try {
      this.isInitializing = true;
      const webllm = await import('@mlc-ai/web-llm');

      this.engine = await webllm.CreateMLCEngine(this.selectedModel, {
        initProgressCallback: (report: any) => {
          if (onProgress) {
            onProgress({
              progress: Math.round(report.progress * 100),
              text: report.text || 'Preparing mobile offline model...'
            });
          }
        }
      });

      this.isLoaded = true;
      this.isInitializing = false;
      return true;
    } catch (err) {
      console.error('Failed to initialize on-device WebLLM model:', err);
      this.isInitializing = false;
      return false;
    }
  }

  /**
   * Generates deep-sea offline navigation advice when vessel is outside GSM/cellular range.
   */
  async generateOfflineAdvice(
    userPrompt: string,
    maritimeContext?: string,
    language: string = 'en'
  ): Promise<string> {
    const langNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      ta: 'Tamil (தமிழ்)',
      te: 'Telugu (తెలుగు)',
      ml: 'Malayalam (മലയാളം)',
      bn: 'Bengali (বাংলা)'
    };
    const targetLangName = langNames[language] || 'English';

    if (!this.isLoaded || !this.engine) {
      if (language === 'hi') {
        return `[ऑफलाइन हेल्म्समैन] गहरे समुद्र का ऑफलाइन मोड सक्रिय है। मानक समुद्री फेयरवे मार्ग पर आगे बढ़ें और VHF चैनल 16 पर निरंतर रेडियो सतर्कता बनाए रखें।`;
      }
      if (language === 'ml') {
        return `[ഓഫ്‌ലൈൻ ഹെൽമ്‌സ്മാൻ] ഓഫ്‌ലൈൻ മോഡ് സജീവമാണ്. സാധാരണ ചാനൽ പാതയിലൂടെ സഞ്ചരിക്കുക, വിഎച്ച്എഫ് ചാനൽ 16 ൽ ശ്രദ്ധിക്കുക.`;
      }
      if (language === 'ta') {
        return `[ஆஃப்லைன் ஹெல்ம்ஸ்மேன்] ஆஃப்லைன் முறை செயலில் உள்ளது. நிலையான கடல் பாதையில் செல்லவும், VHF சேனல் 16 ஐக் கண்காணிக்கவும்.`;
      }
      if (language === 'te') {
        return `[ఆఫ్‌లైన్ హెల్మ్స్‌మన్] డీప్ సీ ఆఫ్‌లైన్ మోడ్ యాక్టివ్‌గా ఉంది. ప్రామాణిక మార్గంలో సాగండి మరియు VHF ఛానల్ 16 ని పర్యవేక్షించండి.`;
      }
      if (language === 'bn') {
        return `[অফলাইন হেলমসম্যান] গভীর সমুদ্রের অফলাইন মোড সক্রিয়। স্ট্যান্ডার্ড ফেয়ারওয়ে ধরে এগিয়ে যান এবং VHF চ্যানেল ১৬ পর্যবেক্ষণ করুন।`;
      }
      return `[OFFLINE HELM] Deep sea offline mode active. Steer standard fairway heading and maintain radio watch on VHF Ch 16.`;
    }

    try {
      const systemPrompt = `You are SamudraAI Mobile Edge Helmsman. You MUST respond ONLY in ${targetLangName}. Do NOT use English except for coordinates and SI units (km, NM, °C, kts). Provide concise, lifesaving nautical advice for skippers at sea. Ground responses in maritime navigation safety. ${maritimeContext || ''}`;

      const reply = await this.engine.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 150
      });

      return reply.choices[0]?.message?.content || (language === 'hi' ? 'नेविगेशन मार्ग सुरक्षित है। सुरक्षित पोत गति बनाए रखें।' : 'Navigation clear. Maintain safe vessel speed.');
    } catch (err) {
      console.error('WebLLM offline inference error:', err);
      return language === 'hi'
        ? 'तटीय सीमा से सुरक्षित दूरी बनाए रखें। बैरोमीटर के दबाव पर नजर रखें।'
        : 'Maintain standard coastal clearance. Monitor barometric pressure.';
    }
  }

  getStatus() {
    return {
      isLoaded: this.isLoaded,
      isInitializing: this.isInitializing,
      model: this.selectedModel
    };
  }
}

export const mobileWebLLM = new MobileWebLLMService();
