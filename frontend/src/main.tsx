import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (err) {
    console.error('Fatal Navika AI mount error:', err);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #030712; color: #f1f5fb; font-family: 'Inter', -apple-system, sans-serif; padding: 20px;">
        <div style="background-color: #151926; border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 12px; padding: 24px 32px; max-width: 440px; text-align: center;">
          <div style="display: inline-block; background-color: #dc2626; color: #fff; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; margin-bottom: 12px;">SYSTEM RECOVERY</div>
          <h2 style="color: #f1f5fb; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">Navika AI Platform Loading Notice</h2>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;">An unexpected initialization delay occurred. Resetting local cache will safely restore default settings.</p>
          <button onclick="try{localStorage.clear();}catch(e){}location.reload();" style="background-color: #0474c4; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">
            Reset Cache &amp; Reload
          </button>
        </div>
      </div>
    `;
  }
}
