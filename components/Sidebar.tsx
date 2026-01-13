import React from 'react';
import { SYLLABUS } from '../constants';
import { Topic } from '../types';
import { BookOpen, CheckCircle, Lock, ChevronDown, ChevronRight, Shield, RotateCcw, Trash2 } from 'lucide-react';

interface SidebarProps {
  currentLevel: number;
  currentTopicId: string | null;
  onSelectTopic: (levelId: number, topicId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentLevel, currentTopicId, onSelectTopic, isOpen, onToggle, onReset }) => {
  const [expandedLevel, setExpandedLevel] = React.useState<number | null>(0);

  const toggleLevel = (id: number) => {
    setExpandedLevel(expandedLevel === id ? null : id);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onToggle}
      />

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-80 transform transition-transform duration-300 ease-in-out
        bg-cyber-950/90 border-r border-cyber-700/50 flex flex-col shadow-[5px_0_30px_rgba(0,0,0,0.8)]
        backdrop-blur-md
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-cyber-700/50 flex items-center gap-4 bg-gradient-to-r from-cyber-900 to-cyber-950 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-500 via-cyber-accent to-cyber-500 animate-pulse"></div>
          
          <div className="p-3 bg-cyber-500/20 rounded-xl border border-cyber-500/50 shadow-[0_0_15px_rgba(0,255,65,0.4)] group hover:rotate-6 transition-transform duration-500">
            <Shield className="w-8 h-8 text-cyber-400" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white tracking-widest glitch" data-text="CIPHER">CIPHER</h1>
            <p className="text-xs text-cyber-400 font-mono tracking-wider">BLUE TEAM MENTOR</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4">
          {SYLLABUS.map((level) => (
            <div key={level.id} className="group/level">
              <button
                onClick={() => toggleLevel(level.id)}
                className={`
                  w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-300 relative overflow-hidden
                  ${currentLevel === level.id 
                    ? 'bg-cyber-800/80 border border-cyber-500/30 shadow-[0_0_15px_rgba(0,255,65,0.1)]' 
                    : 'hover:bg-cyber-800/40 hover:border-cyber-700 border border-transparent'}
                `}
              >
                {/* Hover scan effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover/level:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>

                <div className="flex flex-col gap-1 relative z-10">
                  <span className={`text-xs font-mono tracking-widest uppercase ${currentLevel === level.id ? 'text-cyber-400 text-glow' : 'text-gray-500'}`}>
                    LEVEL {level.id}
                  </span>
                  <span className={`text-base font-semibold transition-colors ${currentLevel === level.id ? 'text-white' : 'text-gray-300 group-hover/level:text-white'}`}>
                    {level.title.replace(`Level ${level.id}: `, '')}
                  </span>
                </div>
                {expandedLevel === level.id ? 
                  <ChevronDown className="w-5 h-5 text-cyber-400" /> : 
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover/level:text-cyber-400" />
                }
              </button>

              {expandedLevel === level.id && (
                <div className="mt-2 ml-4 space-y-1 border-l-2 border-cyber-700/50 pl-4 transition-all duration-300">
                  {level.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => onSelectTopic(level.id, topic.id)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 group/topic
                        ${currentTopicId === topic.id 
                          ? 'bg-cyber-500/20 text-cyber-300 border border-cyber-500/40 shadow-[0_0_10px_rgba(0,255,65,0.2)] translate-x-1' 
                          : 'text-gray-400 hover:text-white hover:bg-cyber-800/50 hover:translate-x-1'
                        }
                      `}
                    >
                      {currentTopicId === topic.id ? 
                        <BookOpen className="w-5 h-5 min-w-[20px] text-cyber-400 animate-pulse" /> : 
                        <div className="w-2 h-2 rounded-full bg-gray-600 group-hover/topic:bg-cyber-500 transition-colors" />
                      }
                      <span className="text-left leading-tight">{topic.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer / Progress */}
        <div className="p-6 border-t border-cyber-700/50 bg-cyber-900/50 backdrop-blur-sm space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-3">
              <span className="uppercase tracking-wider">System Progress</span>
              <span className="text-cyber-400 text-glow">{Math.round(((currentLevel + 0.1) / 9) * 100)}%</span>
            </div>
            <div className="w-full bg-cyber-950 rounded-full h-2 overflow-hidden border border-cyber-800">
              <div 
                className="bg-gradient-to-r from-cyber-600 to-cyber-400 h-full rounded-full shadow-[0_0_15px_rgba(0,255,65,0.6)] transition-all duration-1000 relative"
                style={{ width: `${((currentLevel + 0.1) / 9) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-red-900/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-800 transition-all text-xs font-mono uppercase tracking-widest group"
          >
            <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
            <span>Factory Reset</span>
          </button>
        </div>
      </div>
    </>
  );
};