import React from 'react';
import { Settings, Mic, Volume2, X } from 'lucide-react';
import { UserSettings, TeachingTone, Language } from '../types';
import { VOICE_PERSONAS } from '../constants';

interface VoiceControlsProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  isListening: boolean;
  onToggleListening: () => void;
  speaking: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({ 
  settings, 
  onUpdateSettings,
  isListening,
  onToggleListening,
  speaking
}) => {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Settings Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`
            p-3 rounded-full transition-all duration-300
            ${showSettings ? 'bg-cyber-800 text-cyber-400 shadow-[0_0_15px_rgba(0,255,65,0.3)]' : 'text-gray-400 hover:text-white hover:bg-cyber-800 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]'}
          `}
          title="Mentor Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

        {showSettings && (
          <div className="absolute top-16 right-0 w-80 md:w-96 bg-cyber-900/95 backdrop-blur-xl border border-cyber-500/30 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] p-5 z-50">
            <div className="flex justify-between items-center mb-4 border-b border-cyber-700/50 pb-2">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <Settings className="w-5 h-5 text-cyber-400" /> System Config
               </h3>
               <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="space-y-5">
              {/* Voice Persona Grid */}
              <div>
                <label className="text-xs text-cyber-400 uppercase font-mono tracking-wider block mb-2">Voice Persona</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {VOICE_PERSONAS.map(persona => (
                    <button
                      key={persona.id}
                      onClick={() => onUpdateSettings({ ...settings, activePersonaId: persona.id })}
                      className={`
                        text-left p-2 rounded-lg text-sm transition-all border
                        ${settings.activePersonaId === persona.id 
                          ? 'bg-cyber-500/20 border-cyber-500 text-white shadow-[0_0_10px_rgba(0,255,65,0.3)]' 
                          : 'bg-cyber-950 border-cyber-800 text-gray-400 hover:border-cyber-600 hover:text-gray-200'
                        }
                      `}
                    >
                      <div className="font-bold">{persona.emoji} {persona.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-cyber-400 uppercase font-mono tracking-wider block mb-2">Teaching Tone</label>
                <select 
                  className="w-full bg-cyber-950 border border-cyber-700 text-base text-gray-200 rounded-lg p-3 focus:border-cyber-500 focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] outline-none transition-all"
                  value={settings.tone}
                  onChange={(e) => onUpdateSettings({ ...settings, tone: e.target.value as TeachingTone })}
                >
                  <option value="calm">🧘 Calm Mentor</option>
                  <option value="friendly">👋 Friendly Teacher</option>
                  <option value="serious">🛡️ SOC Analyst</option>
                  <option value="motivational">🔥 Motivational</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-cyber-400 uppercase font-mono tracking-wider block mb-2">Language</label>
                <select 
                  className="w-full bg-cyber-950 border border-cyber-700 text-base text-gray-200 rounded-lg p-3 focus:border-cyber-500 focus:shadow-[0_0_10px_rgba(0,255,65,0.3)] outline-none transition-all"
                  value={settings.language}
                  onChange={(e) => onUpdateSettings({ ...settings, language: e.target.value as Language })}
                >
                  <option value="english">English (Professional)</option>
                  <option value="hinglish">Hinglish (Natural)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-cyber-700/50">
                 <span className="text-sm text-gray-300 font-medium">Auto-Speak</span>
                 <button 
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${settings.voiceEnabled ? 'bg-cyber-500 shadow-[0_0_10px_rgba(0,255,65,0.5)]' : 'bg-gray-800'}`}
                  onClick={() => onUpdateSettings({ ...settings, voiceEnabled: !settings.voiceEnabled })}
                 >
                   <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.voiceEnabled ? 'translate-x-7' : ''}`} />
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mic Button */}
      <button 
        onClick={onToggleListening}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 shadow-lg transform hover:-translate-y-0.5
          ${isListening 
            ? 'bg-danger/20 text-red-400 border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' 
            : speaking 
              ? 'bg-success/20 text-green-400 border border-green-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
              : 'bg-cyber-800 text-gray-200 border border-cyber-600 hover:border-cyber-400 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] hover:text-white'
          }
        `}
      >
        {isListening ? <Mic className="w-5 h-5" /> : speaking ? <Volume2 className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5" />}
        <span className="hidden sm:inline">
          {isListening ? 'LISTENING...' : speaking ? 'SPEAKING...' : 'VOICE MODE'}
        </span>
      </button>
    </div>
  );
};