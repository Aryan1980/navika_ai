import React from 'react';
import { Compass, Volume2, VolumeX, RefreshCw, Anchor } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'or', name: 'ଓଡ଼ିଆ' },
];

export const Header: React.FC = () => {
  const { activeLocationName, language, soundEnabled, setLanguage, setSoundEnabled, resetLocation } = useApp();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl flex-shrink-0"
      style={{
        background: 'rgba(5,8,15,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2.5 select-none flex-shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: 'rgba(34,211,238,0.1)',
              border: '1px solid rgba(34,211,238,0.25)',
              color: '#22d3ee'
            }}
          >
            <Compass className="w-3.5 h-3.5" />
          </div>
          <h1 className="font-heading font-bold text-[15px] tracking-tight text-white">
            Navika<span style={{ color: '#22d3ee' }}>AI</span>
          </h1>
        </div>

        {/* Active departure badge */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs flex-1 min-w-0 max-w-xs sm:max-w-md"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <Anchor className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#22d3ee' }} />
          <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wide flex-shrink-0">Port</span>
          <span className="font-semibold text-white truncate text-[12px]">{activeLocationName.split(',')[0]}</span>
          <button
            onClick={resetLocation}
            title="Change departure location"
            className="ml-auto flex items-center gap-1 text-[11px] font-medium cursor-pointer flex-shrink-0 transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Change</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="rounded-xl px-2.5 py-1.5 text-[11px] font-medium outline-none cursor-pointer transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#cbd5e1'
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code} style={{ background: '#0f172a' }}>
                {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute voice' : 'Enable voice'}
            className="p-1.5 rounded-xl cursor-pointer transition-all"
            style={{
              background: soundEnabled ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.04)',
              border: soundEnabled ? '1px solid rgba(34,211,238,0.25)' : '1px solid rgba(255,255,255,0.08)',
              color: soundEnabled ? '#22d3ee' : '#64748b'
            }}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>
    </header>
  );
};
