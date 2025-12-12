import React, { useState } from 'react';
import { CodeArchitecture } from './components/AICodeGenerator';
import { Button } from './components/Button';
import { Github, Box, Layers, Zap, MousePointer2, ArrowDown, Package, Copy, CheckCircle2, XCircle, Puzzle, Gamepad2, Workflow, Terminal, Play, Eye, Clipboard, Server, Wifi } from 'lucide-react';

const Features = () => (
  <div className="relative border-t border-zinc-800">
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
      {[
        { icon: <Zap size={24} strokeWidth={1} />, title: "Drop-in", desc: "Add to any view. Handles positioning, animations, and styling." },
        { icon: <Play size={24} strokeWidth={1} />, title: "Actions", desc: "Wire up buttons to reset state, clear caches, or toggle settings." },
        { icon: <Eye size={24} strokeWidth={1} />, title: "Sections", desc: "Show key-value pairs for any state you want to inspect." },
        { icon: <Clipboard size={24} strokeWidth={1} />, title: "Copy", desc: "One-click to copy debug info for bug reports." }
      ].map((f, i) => (
        <div key={i} className="p-10 bg-[#09090b] hover:bg-[#050505] transition-colors group relative border-r border-zinc-800 last:border-r-0">
          <div className="mb-6 text-zinc-500 group-hover:text-orange-400 transition-colors">{f.icon}</div>
          <h3 className="text-sm font-bold text-white mb-3 font-sans uppercase tracking-widest">{f.title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed font-mono">{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const ComparisonTable = () => (
  <div className="border border-zinc-800 bg-[#0c0c0e]">
    <div className="grid grid-cols-3 border-b border-zinc-800 bg-zinc-900/20">
      <div className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest"></div>
      <div className="p-4 text-xs font-bold text-white uppercase tracking-widest border-l border-zinc-800 bg-zinc-900/40">DebugKit</div>
      <div className="p-4 text-xs font-bold text-zinc-600 uppercase tracking-widest border-l border-zinc-800">DIY</div>
    </div>
    {[
      { label: "Panel UI", wf: "Built-in", web: "Write it" },
      { label: "Expand/collapse", wf: "Built-in", web: "Write it" },
      { label: "Styling", wf: "Built-in", web: "Write it" },
      { label: "Copy to clipboard", wf: "Built-in", web: "Write it" },
    ].map((row, i) => (
      <div key={i} className="grid grid-cols-3 border-b last:border-b-0 border-zinc-800 hover:bg-white/5 transition-colors">
        <div className="p-4 text-xs font-mono text-zinc-400">{row.label}</div>
        <div className="p-4 text-xs font-mono text-white border-l border-zinc-800 font-bold bg-white/5">{row.wf}</div>
        <div className="p-4 text-xs font-mono text-zinc-600 border-l border-zinc-800">{row.web}</div>
      </div>
    ))}
  </div>
);

const UseCases = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      { title: "Show build info", icon: <Server size={20}/>, desc: "Version, commit hash, environment—visible at a glance." },
      { title: "Reset state", icon: <Puzzle size={20}/>, desc: "Clear caches, reset user defaults, seed test data." },
      { title: "Toggle flags", icon: <Zap size={20}/>, desc: "Flip feature flags or debug settings without rebuilding." },
      { title: "Copy debug info", icon: <Wifi size={20}/>, desc: "Grab everything for a bug report in one click." },
    ].map((useCase, i) => (
      <div key={i} className="border border-zinc-800 p-6 bg-[#0c0c0e] hover:border-zinc-600 transition-colors group">
        <div className="mb-4 text-zinc-400 group-hover:text-white transition-colors">{useCase.icon}</div>
        <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{useCase.title}</h4>
        <p className="text-xs text-zinc-500 font-mono leading-relaxed">{useCase.desc}</p>
      </div>
    ))}
  </div>
);

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800">
    <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white flex items-center justify-center">
          <Terminal size={16} className="text-black" strokeWidth={3} />
        </div>
        <span className="font-sans font-bold text-lg tracking-tighter text-white">DebugKit</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Documentation</a>
        <a href="#" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Examples</a>
        <div className="h-4 w-[1px] bg-zinc-800"></div>
        <a href="#" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest">GitHub</span>
            <Github size={16} />
        </a>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="border-t border-zinc-800 bg-[#050505] py-20 mt-20 relative">
    <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
       <div className="flex flex-col gap-4">
         <div className="flex items-center gap-2">
            <Terminal size={20} className="text-white" />
            <span className="font-sans font-bold text-xl text-white tracking-tighter">DebugKit</span>
         </div>
         <p className="text-zinc-600 text-xs font-mono max-w-xs">
           Debug toolbar for macOS SwiftUI apps.
         </p>
      </div>
      
      <div className="flex gap-12">
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-white text-xs uppercase tracking-widest">Project</h4>
          <a href="#" className="text-zinc-600 hover:text-white text-xs font-mono transition-colors">Source Code</a>
          <a href="#" className="text-zinc-600 hover:text-white text-xs font-mono transition-colors">License (MIT)</a>
          <a href="#" className="text-zinc-600 hover:text-white text-xs font-mono transition-colors">Releases</a>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-white text-xs uppercase tracking-widest">Community</h4>
          <a href="#" className="text-zinc-600 hover:text-white text-xs font-mono transition-colors">Discussions</a>
          <a href="#" className="text-zinc-600 hover:text-white text-xs font-mono transition-colors">Issues</a>
          <a href="#" className="text-zinc-600 hover:text-white text-xs font-mono transition-colors">Twitter</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-[#09090b] selection:bg-orange-500/30 selection:text-orange-200 font-mono flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 px-6 max-w-[1400px] mx-auto w-full">
        
        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center mb-40 border-b border-zinc-800 pb-20 relative">

          <div className="lg:col-span-5 relative z-10">
             <div className="inline-flex items-center gap-2 mb-8 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900/50">
               <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Public Beta</span>
             </div>
             
             <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-[0.85] font-sans">
               DEBUG<br/>
               TOOL<br/>
               BAR<span className="text-orange-500">.</span>
             </h1>

             <p className="text-lg text-zinc-400 mb-10 max-w-md leading-relaxed font-light font-sans">
               Drop-in debug panel for macOS SwiftUI apps.
               You provide the data, it handles the UI.
             </p>
             
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
               <Button size="lg" icon={<Package size={16}/>}>Get Started</Button>
               <Button size="lg" variant="outline" icon={<ArrowDown size={16}/>}>View Source</Button>
             </div>
             
             <div className="mt-16 border-t border-zinc-800 pt-6 flex flex-wrap items-center gap-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-zinc-500"></div> SwiftUI Native
                </span>
                <span className="text-zinc-800">/</span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-zinc-500"></div> Zero Config
                </span>
             </div>
          </div>

          {/* Graphic / Screenshot Area */}
          <div className="lg:col-span-7 relative">
            <div className="relative border border-zinc-800 bg-[#0c0c0e] p-2 group">
              {/* Technical markers */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white z-20"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white z-20"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white z-20"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white z-20"></div>
              
              <div
                className="relative overflow-hidden bg-[#0c0c0e] border border-zinc-800/50 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                 <img
                   src={isExpanded ? `${import.meta.env.BASE_URL}screenshot.png` : `${import.meta.env.BASE_URL}screenshot-minimized.png`}
                   alt="DebugKit in action"
                   className="w-full h-auto transition-opacity duration-200"
                 />
                 <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 border border-zinc-700 rounded text-[10px] text-zinc-400 font-mono">
                   Click to {isExpanded ? 'minimize' : 'expand'}
                 </div>
              </div>
            </div>
            
            {/* Background decorative element */}
            <div className="absolute -z-10 top-8 -right-8 w-full h-full border border-zinc-800/30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMTgxODFiIi8+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMjcyNzJhIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-40"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-40">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-bold text-white font-sans tracking-tight">What it does</h2>
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Features</span>
          </div>
          <Features />
        </div>

        {/* Code Showcase Section */}
        <div className="mb-40 border border-zinc-800 bg-[#0c0c0e]">
          <div className="grid lg:grid-cols-12 min-h-[600px] h-full divide-x divide-zinc-800">
            
            {/* Text Panel */}
            <div className="lg:col-span-4 p-8 lg:p-12 flex flex-col justify-center relative bg-[#09090b]">
               <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center mb-6">
                  <Terminal size={20} strokeWidth={1} />
               </div>
               <h2 className="text-3xl font-bold text-white font-sans tracking-tight mb-4">How it<br/>works</h2>
               <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                 Pass sections and actions. The UI is handled for you.
               </p>
               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <ArrowDown size={14} />
                  <span>See code</span>
               </div>

               {/* Technical Hinge / Divider */}
               <div className="absolute top-1/2 -right-[11px] -translate-y-1/2 hidden lg:flex flex-col items-center z-10">
                  <div className="w-px h-16 bg-gradient-to-b from-transparent to-zinc-700"></div>
                  <div className="w-[20px] h-[20px] bg-[#0c0c0e] border border-zinc-600 rotate-45 flex items-center justify-center shadow-xl">
                     <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  </div>
                  <div className="w-px h-16 bg-gradient-to-t from-transparent to-zinc-700"></div>
               </div>
            </div>

            {/* Code Panel */}
            <div className="lg:col-span-8 bg-[#0c0c0e]">
              <CodeArchitecture frameless />
            </div>
          </div>
        </div>

        {/* Comparison & Use Cases Grid */}
        <div className="mb-40 grid xl:grid-cols-12 gap-12">
           <div className="xl:col-span-5">
              <h2 className="text-2xl font-bold text-white font-sans tracking-tight mb-8">What you get</h2>
              <ComparisonTable />
           </div>
           <div className="xl:col-span-7">
              <h2 className="text-2xl font-bold text-white font-sans tracking-tight mb-8">Use cases</h2>
              <UseCases />
           </div>
        </div>

        {/* Quick Install */}
        <div className="max-w-2xl mx-auto text-center border border-zinc-800 p-12 bg-[#0c0c0e] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

           <h2 className="text-3xl font-bold text-white font-sans tracking-tight mb-6">Install</h2>
           <p className="text-zinc-500 mb-8 max-w-md mx-auto font-mono text-sm">
            Add to Package.swift
           </p>

           <div className="flex flex-col items-center gap-4">
              <div className="flex items-center bg-black border border-zinc-800 p-4 w-full max-w-lg group hover:border-zinc-600 transition-colors cursor-pointer" onClick={() => navigator.clipboard.writeText('.package(url: "https://github.com/arach/DebugKit", branch: "main")')}>
                 <span className="text-zinc-500 mr-4 select-none">$</span>
                 <code className="flex-1 text-left text-xs md:text-sm text-zinc-300 font-mono">
                   .package(url: "https://github.com/arach/DebugKit", branch: "main")
                 </code>
                 <Copy size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Click to copy</span>
           </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}