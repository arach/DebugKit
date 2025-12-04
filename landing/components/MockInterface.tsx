import React, { useState } from 'react';
import { X, Copy, Trash2, Database, Wifi, Server, Terminal, Activity } from 'lucide-react';

export const MockInterface = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full h-full bg-[#09090b] relative overflow-hidden select-none group flex items-center justify-center">
      {/* Grid Background */}
      <div className="absolute inset-0" 
           style={{ 
             backgroundImage: 'linear-gradient(#18181b 1px, transparent 1px), linear-gradient(90deg, #18181b 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      {/* macOS Window Simulation */}
      <div className="relative w-[90%] h-[85%] bg-[#0c0c0e] border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Window Header */}
        <div className="h-10 bg-zinc-900/50 border-b border-zinc-800 flex items-center px-4 gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
          </div>
          <div className="ml-4 flex-1 text-center pr-12">
            <span className="text-[10px] font-mono text-zinc-500">MyApp — Debug Build</span>
          </div>
        </div>

        {/* Window Content (Placeholder) */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center opacity-30">
           <Activity size={48} className="text-zinc-600 mb-4" />
           <div className="h-2 w-32 bg-zinc-800 rounded mb-2"></div>
           <div className="h-2 w-24 bg-zinc-800 rounded"></div>
        </div>

        {/* DebugToolbar Overlay (The Product) */}
        <div className="absolute bottom-4 right-4 flex flex-col items-end">
          
          {/* Expanded Panel */}
          <div 
            className={`mb-4 w-[280px] bg-[#0c0c0e] border border-zinc-700/50 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${isExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}
          >
            {/* Panel Header */}
            <div className="bg-zinc-900/80 px-3 py-2 flex items-center justify-between border-b border-zinc-800">
              <span className="text-[10px] font-bold font-mono tracking-[0.2em] text-white">DEV_TOOLS</span>
              <button onClick={() => setIsExpanded(false)} className="text-zinc-500 hover:text-white">
                <X size={12} />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-3 space-y-3">
              
              {/* Section 1 */}
              <div>
                <div className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider mb-2">ENVIRONMENT</div>
                <div className="border border-zinc-800 rounded bg-zinc-900/30 overflow-hidden">
                  <div className="flex justify-between px-2 py-1.5 border-b border-zinc-800/50">
                    <span className="text-[10px] font-mono text-zinc-400">API Endpoint</span>
                    <span className="text-[10px] font-mono text-white">Staging</span>
                  </div>
                  <div className="flex justify-between px-2 py-1.5 bg-zinc-800/20">
                    <span className="text-[10px] font-mono text-zinc-400">Feature Flags</span>
                    <span className="text-[10px] font-mono text-orange-400">Enabled</span>
                  </div>
                  <div className="flex justify-between px-2 py-1.5 border-t border-zinc-800/50">
                    <span className="text-[10px] font-mono text-zinc-400">Build</span>
                    <span className="text-[10px] font-mono text-white">2.1.0 (455)</span>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <div className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider mb-2">USER SESSION</div>
                <div className="border border-zinc-800 rounded bg-zinc-900/30 overflow-hidden">
                   <div className="flex justify-between px-2 py-1.5">
                    <span className="text-[10px] font-mono text-zinc-400">User ID</span>
                    <span className="text-[10px] font-mono text-white">usr_8829a</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <div className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider mb-2">ACTIONS</div>
                <div className="flex flex-col gap-1">
                  <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-800 rounded text-left transition-colors group">
                    <Trash2 size={12} className="text-red-400" />
                    <span className="text-[10px] font-mono text-red-300 group-hover:text-red-200">Reset Local Storage</span>
                  </button>
                  <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-800 rounded text-left transition-colors group">
                    <Database size={12} className="text-blue-400" />
                    <span className="text-[10px] font-mono text-zinc-300 group-hover:text-white">Seed Test Data</span>
                  </button>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-800 rounded text-left transition-colors group"
                  >
                    {copied ? <div className="w-3 h-3 text-green-500">✓</div> : <Copy size={12} className="text-zinc-500 group-hover:text-white" />}
                    <span className={`text-[10px] font-mono transition-colors ${copied ? 'text-green-500' : 'text-zinc-300 group-hover:text-white'}`}>
                      {copied ? 'Copied to Clipboard' : 'Copy Debug Info'}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Toggle Button */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-full bg-[#0c0c0e] border border-zinc-700 shadow-lg flex items-center justify-center hover:border-orange-500 transition-colors group"
          >
             <Terminal 
                size={14} 
                className={`transition-all duration-300 ${isExpanded ? 'text-orange-500 rotate-180' : 'text-zinc-500 group-hover:text-zinc-300'}`} 
             />
          </button>

        </div>
      </div>
    </div>
  );
};