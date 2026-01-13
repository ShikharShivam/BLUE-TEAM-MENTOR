import React, { useEffect, useState } from 'react';
import { Search, Command, BookOpen, Settings, ShieldAlert, Trash2 } from 'lucide-react';
import { SYLLABUS } from '../constants';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (levelId: number, topicId: string) => void;
  onReset: () => void;
  toggleVoice: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTopic, 
  onReset,
  toggleVoice 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten syllabus items for search
  const items = [
    ...SYLLABUS.flatMap(level => 
      level.topics.map(topic => ({
        type: 'topic' as const,
        title: topic.title,
        subtitle: level.title,
        levelId: level.id,
        id: topic.id,
        icon: <BookOpen className="w-4 h-4 text-cyber-400" />
      }))
    ),
    { type: 'action' as const, title: 'Toggle Voice Mode', subtitle: 'System Control', action: toggleVoice, icon: <Settings className="w-4 h-4 text-cyber-purple" /> },
    { type: 'action' as const, title: 'Factory Reset', subtitle: 'Danger Zone', action: onReset, icon: <Trash2 className="w-4 h-4 text-red-400" /> },
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filteredItems[selectedIndex];
        if (item) {
          if (item.type === 'topic') {
            onSelectTopic(item.levelId, item.id);
          } else {
            item.action();
          }
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onSelectTopic]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-2xl bg-cyber-900 border border-cyber-500/50 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.4)] overflow-hidden flex flex-col relative box-glow">
        
        {/* Input */}
        <div className="flex items-center gap-3 p-4 border-b border-cyber-700/50 bg-cyber-950/50">
          <Search className="w-5 h-5 text-cyber-400" />
          <input 
            type="text" 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 font-mono text-lg"
            placeholder="Search modules or execute commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 text-xs text-gray-500 font-mono border border-gray-700 px-2 py-1 rounded">
             <span className="text-xs">ESC</span>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filteredItems.length === 0 ? (
             <div className="p-8 text-center text-gray-500 font-mono">
               NO DATA FOUND
             </div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.type === 'topic') {
                    onSelectTopic(item.levelId, item.id);
                  } else {
                    item.action();
                  }
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg transition-all text-left group
                  ${selectedIndex === idx 
                    ? 'bg-cyber-500/20 border border-cyber-500/50 shadow-[0_0_15px_rgba(0,255,65,0.2)]' 
                    : 'hover:bg-cyber-800 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${selectedIndex === idx ? 'bg-cyber-500 text-white' : 'bg-cyber-800 text-gray-400'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className={`font-medium ${selectedIndex === idx ? 'text-white' : 'text-gray-300'}`}>{item.title}</div>
                    <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">{item.subtitle}</div>
                  </div>
                </div>
                {selectedIndex === idx && <Command className="w-4 h-4 text-cyber-400 animate-pulse" />}
              </button>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="p-2 bg-cyber-950/80 border-t border-cyber-700/50 flex justify-between px-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
           <span>System Ready</span>
           <span>Use ↑↓ to navigate • Enter to select</span>
        </div>
      </div>
    </div>
  );
};