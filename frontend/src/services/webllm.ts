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
  private selectedModel: string = 'SmolLM2-360M-Instruct-q4f16-MLC';

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
        initProgressCallback: (report) => {
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
    maritimeContext?: string
  ): Promise<string> {
    if (!this.isLoaded || !this.engine) {
      // Deterministic marine offline fallback
      return `[OFFLINE HELM] Deep sea offline mode active. Steer standard fairway heading and maintain radio watch on VHF Ch 16.`;
    }

    try {
      const systemPrompt = `You are SamudraAI Mobile Edge Helmsman. Provide concise, lifesaving nautical advice for skippers at sea. Ground responses in maritime navigation safety. ${maritimeContext || ''}`;

      const reply = await this.engine.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 150
      });

      return reply.choices[0]?.message?.content || 'Navigation clear. Maintain safe vessel speed.';
    } catch (err) {
      console.error('WebLLM offline inference error:', err);
      return 'Maintain standard coastal clearance. Monitor barometric pressure.';
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
