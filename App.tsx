import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { VoiceControls } from './components/VoiceControls';
import { CommandPalette } from './components/CommandPalette'; // Import Command Palette
import { initializeChat, sendMessageToGemini } from './services/gemini';
import { AppState, Message, UserSettings, Topic, Level } from './types';
import { SYLLABUS, VOICE_PERSONAS } from './constants';
import { loadSession, saveSession, clearSession } from './services/storage';
import { Send, Menu, ShieldCheck, Terminal, AlertTriangle, Cpu, Activity, Zap } from 'lucide-react';

const App: React.FC = () => {
  // --- Initialization Logic ---
  const savedSession = loadSession();
  
  const defaultMessages: Message[] = [{ 
    id: 'welcome', 
    role: 'model', 
    text: "Hello! I am Cipher, your Blue Team Cybersecurity Mentor. I'm here to guide you from basic concepts to becoming a job-ready SOC Analyst. We'll start at Level 0. Are you ready to begin?", 
    timestamp: Date.now() 
  }];
  
  const defaultState: AppState = {
    currentLevel: 0,
    currentTopicId: null,
    settings: {
      voiceEnabled: true,
      activePersonaId: 'us_captain',
      tone: 'friendly',
      language: 'english'
    }
  };

  // --- State ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(savedSession?.messages || defaultMessages);
  const [state, setState] = useState<AppState>(savedSession?.state || defaultState);
  const [apiKey, setApiKey] = useState(savedSession?.apiKey || process.env.API_KEY || '');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Command Palette State
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  // Background Cycle State (0: Grid, 1: Stream, 2: Pulse)
  const [bgMode, setBgMode] = useState(0);

  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // --- Refs ---
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // --- Effects ---
  
  // Keyboard Shortcuts (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Background Cycling (Every 20s)
  useEffect(() => {
    const interval = setInterval(() => {
      setBgMode(prev => (prev + 1) % 3);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Auto-Save Session
  useEffect(() => {
    saveSession({
      state,
      messages,
      apiKey,
      lastActive: Date.now()
    });
  }, [state, messages, apiKey]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Init Speech Recognition & Synthesis Voices
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error", event);
        setIsListening(false);
      };
    }

    // Load voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };
    
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  // Init Gemini
  useEffect(() => {
    if (apiKey) {
      initializeChat(apiKey);
    }
  }, [apiKey]);

  // --- Handlers ---

  const handleReset = () => {
    if (window.confirm("WARNING: FACTORY RESET INITIATED.\n\nThis will purge all mission logs, progress, and settings. This action cannot be undone.\n\nConfirm system wipe?")) {
      clearSession();
      setMessages(defaultMessages);
      setState(defaultState);
      setApiKey(''); 
      window.location.reload(); 
    }
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim() || !apiKey) return;
    if (loading) return;

    // Add User Message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Call Gemini
    const responseText = await sendMessageToGemini(text, {
      level: state.currentLevel,
      topicId: state.currentTopicId,
      tone: state.settings.tone,
      lang: state.settings.language
    }, messages);

    // Add AI Message
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);

    // Handle TTS
    if (state.settings.voiceEnabled) {
      speakText(responseText);
    }
  };

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/[*#_`~-]/g, '') 
      .replace(/\s+/g, ' ') 
      .trim();
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const persona = VOICE_PERSONAS.find(p => p.id === state.settings.activePersonaId) || VOICE_PERSONAS[0];

    let selectedVoice = availableVoices.find(v => 
      persona.langKeywords.some(keyword => v.lang.includes(keyword) || v.name.includes(keyword))
    );
    if (!selectedVoice) {
       selectedVoice = availableVoices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      window.speechSynthesis.cancel(); 
    }
  };

  const handleTopicSelect = (levelId: number, topicId: string) => {
    setState(prev => ({ ...prev, currentLevel: levelId, currentTopicId: topicId }));
    setSidebarOpen(false); 
    
    const topic = SYLLABUS.flatMap(l => l.topics).find(t => t.id === topicId);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'system',
      text: `Context switched to: ${topic?.title}. Ask me anything about this!`,
      timestamp: Date.now()
    }]);
  };

  // --- Render Components ---

  // Cycling Background Component
  const CyberBackground = () => (
    <>
       {/* Layer 1: Grid */}
       <div className={`bg-layer bg-grid-perspective ${bgMode === 0 ? 'opacity-100' : 'opacity-0'}`}>
         <div className="grid-plane"></div>
       </div>
       
       {/* Layer 2: Data Stream */}
       <div className={`bg-layer bg-data-stream ${bgMode === 1 ? 'opacity-60' : 'opacity-0'}`}></div>
       
       {/* Layer 3: Radar Pulse */}
       <div className={`bg-layer bg-pulse-radar ${bgMode === 2 ? 'opacity-80' : 'opacity-0'}`}></div>

       {/* Overlays */}
       <div className="scanline-overlay"></div>
       <div className="scanner-bar"></div>
    </>
  );

  // --- API Key Modal ---
  if (!apiKey) {
    return (
      <div className="min-h-screen bg-cyber-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <CyberBackground />
        
        <div className="bg-cyber-900/80 backdrop-blur-xl p-10 rounded-2xl border border-cyber-500/50 shadow-[0_0_50px_rgba(0,255,65,0.25)] max-w-lg w-full relative z-10 box-glow animate-float">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-cyber-500/20 blur-xl rounded-full"></div>
            <div className="p-5 bg-cyber-900 rounded-full border border-cyber-500 shadow-[0_0_20px_rgba(0,255,65,0.6)] relative z-10">
              <ShieldCheck className="w-16 h-16 text-cyber-400 drop-shadow-[0_0_10px_rgba(0,255,65,0.8)] animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white text-center mb-2 tracking-tight glitch" data-text="CIPHER">CIPHER</h1>
          <p className="text-cyber-400 text-center mb-8 font-mono tracking-widest text-base uppercase">Blue Team Mentor AI</p>
          
          <p className="text-gray-300 text-center mb-8 text-xl leading-relaxed font-light">
            Initialize your training environment. Access is restricted to authorized personnel.
          </p>
          
          <div className="relative group">
            <input
              type="password"
              placeholder="ENTER API KEY"
              className="w-full bg-cyber-950/50 border-2 border-cyber-700 text-white p-5 rounded-xl mb-4 focus:border-cyber-400 focus:shadow-[0_0_30px_rgba(0,255,65,0.4)] outline-none transition-all text-center tracking-widest font-mono text-xl placeholder-gray-600"
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                     setApiKey((e.target as HTMLInputElement).value);
                  }
              }}
            />
          </div>
          
          <p className="text-sm text-center text-gray-500 mt-6">
            Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyber-400 hover:text-white underline decoration-cyber-500/50 hover:decoration-white transition-all">Google AI Studio</a>
          </p>
        </div>
      </div>
    );
  }

  // --- Main UI ---
  const currentLevelInfo = SYLLABUS.find(l => l.id === state.currentLevel);
  const currentTopicInfo = SYLLABUS.flatMap(l => l.topics).find(t => t.id === state.currentTopicId);

  return (
    <div className="flex h-screen bg-cyber-950 text-gray-100 overflow-hidden font-sans relative">
      <CyberBackground />
      <CommandPalette 
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectTopic={handleTopicSelect}
        onReset={handleReset}
        toggleVoice={() => setState(prev => ({...prev, settings: {...prev.settings, voiceEnabled: !prev.settings.voiceEnabled}}))}
      />
      
      <div className="relative z-20 flex h-full w-full">
        <Sidebar 
          currentLevel={state.currentLevel}
          currentTopicId={state.currentTopicId}
          onSelectTopic={handleTopicSelect}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onReset={handleReset}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full relative z-10">
          
          {/* Header */}
          <header className="h-24 border-b border-cyber-700/50 bg-cyber-900/80 backdrop-blur-md flex items-center justify-between px-8 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-5">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-cyber-400 hover:text-white transition-colors">
                <Menu className="w-8 h-8" />
              </button>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 text-glow tracking-tight animate-glow">
                   {currentTopicInfo ? <Terminal className="w-8 h-8 text-cyber-400" /> : <Activity className="w-8 h-8 text-cyber-400" />}
                   {currentTopicInfo?.title || currentLevelInfo?.title || "Operational Briefing"}
                </h2>
                <span className="text-sm text-cyber-400 font-mono tracking-widest flex items-center gap-2 mt-1">
                  {currentTopicInfo ? "STATUS: ACTIVE // MONITORING" : "STATUS: AWAITING INPUT // READY"}
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse box-glow"></span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Cmd+K Hint */}
              <button onClick={() => setIsPaletteOpen(true)} className="hidden md:flex items-center gap-2 text-gray-500 border border-gray-700 rounded px-3 py-1 hover:border-cyber-400 hover:text-cyber-400 transition-colors">
                <span className="text-xs font-mono">CMD+K</span>
              </button>
              
              <VoiceControls 
                settings={state.settings}
                onUpdateSettings={(newSettings) => setState(prev => ({ ...prev, settings: newSettings }))}
                isListening={isListening}
                onToggleListening={toggleListening}
                speaking={speaking}
              />
            </div>
          </header>

          {/* Chat Area */}
          <div 
            className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
            ref={chatContainerRef}
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full animate-glitch-slide ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] md:max-w-[70%] p-8 rounded-3xl text-lg md:text-xl leading-relaxed shadow-2xl backdrop-blur-md transition-all duration-300 relative overflow-hidden
                    ${msg.role === 'user' 
                      ? 'bg-cyber-600/20 border border-cyber-500/50 text-white rounded-tr-none shadow-[0_0_25px_rgba(0,255,65,0.15)] box-glow' 
                      : msg.role === 'system'
                        ? 'bg-cyber-800/30 border border-dashed border-cyber-600/50 text-gray-400 w-full text-center text-base py-4 font-mono mx-auto'
                        : 'bg-cyber-800/80 border border-cyber-700 text-gray-100 rounded-tl-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-glow'
                    }
                  `}
                >
                  {/* Decorative corner accent for AI messages */}
                  {msg.role === 'model' && (
                     <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyber-500 to-transparent opacity-50"></div>
                  )}

                  {msg.role !== 'system' && (
                    <div className="flex items-center gap-3 mb-4 opacity-80 text-xs font-mono uppercase tracking-widest border-b border-white/10 pb-2">
                      {msg.role === 'user' ? (
                        <span className="text-cyber-300 flex items-center gap-2 font-bold">You <span className="w-2 h-2 bg-cyber-300 rounded-full"></span></span>
                      ) : (
                        <span className="text-cyber-400 flex items-center gap-2 font-bold text-glow">Cipher AI <Zap className="w-3 h-3 text-yellow-400 animate-bounce"/></span>
                      )}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap font-sans font-light tracking-wide relative z-10">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Thematic Data Processing Animation */}
            {loading && (
              <div className="flex justify-start w-full animate-fade-in-up">
                 <div className="bg-cyber-800/50 border border-cyber-600/50 p-6 rounded-2xl rounded-tl-none flex items-center gap-4 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                   <div className="flex gap-1">
                     <span className="w-1 h-4 bg-cyber-400 animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                     <span className="w-1 h-4 bg-cyber-400 animate-[pulse_0.5s_ease-in-out_0.1s_infinite]"></span>
                     <span className="w-1 h-4 bg-cyber-400 animate-[pulse_0.5s_ease-in-out_0.2s_infinite]"></span>
                   </div>
                   <div className="font-mono text-cyber-400 text-sm tracking-widest">
                     PROCESSING_DATA_PACKETS<span className="animate-cursor-blink">_</span>
                   </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-cyber-700/50 bg-cyber-900/90 backdrop-blur-lg">
            <div className="max-w-6xl mx-auto flex gap-6">
              <div className="flex-1 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyber-600 to-cyber-400 rounded-2xl opacity-20 group-hover:opacity-60 transition duration-500 blur-lg group-focus-within:opacity-80 group-focus-within:duration-200"></div>
                <div className="relative bg-cyber-950/80 rounded-2xl flex items-center border border-cyber-700/50 box-glow">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Initiate query..."
                    className="flex-1 bg-transparent border-none text-white p-6 text-xl outline-none placeholder-gray-600 font-medium tracking-wide"
                    disabled={loading}
                  />
                </div>
              </div>
              <button 
                onClick={() => handleSendMessage()}
                disabled={loading || !inputText.trim()}
                className="px-8 bg-cyber-600 hover:bg-cyber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(0,255,65,0.3)] hover:shadow-[0_0_35px_rgba(0,255,65,0.6)] hover:scale-105 active:scale-95 flex items-center justify-center border border-cyber-400/30"
              >
                <Send className="w-8 h-8" />
              </button>
            </div>
            <div className="text-center mt-4">
               <p className="text-xs text-gray-500 font-mono uppercase tracking-widest opacity-70">
                 <AlertTriangle className="w-3 h-3 inline mr-2 text-yellow-500" />
                 AI output is generative. Verify critical intelligence manually.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;