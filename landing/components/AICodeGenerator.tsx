import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, Sliders, Database, Box, Cpu } from 'lucide-react';

const SNIPPETS = {
  'App.swift': `import SwiftUI
import DebugKit

struct ContentView: View {
    var body: some View {
        ZStack {
            MainContent()

            #if DEBUG
            DebugToolbar(
                sections: buildSections(),
                actions: buildActions()
            )
            #endif
        }
    }
}`,
  'Sections.swift': `import DebugKit

func buildSections() -> [DebugSection] {
    [
        DebugSection("BUILD", [
            ("Version", Bundle.main.version),
            ("Commit", Bundle.main.commitHash),
            ("Env", AppConfig.environment)
        ]),
        DebugSection("USER", [
            ("ID", session.userId ?? "—"),
            ("Role", session.role.rawValue)
        ])
    ]
}`,
  'Actions.swift': `import DebugKit

func buildActions() -> [DebugAction] {
    [
        DebugAction("Clear Cache", icon: "trash") {
            CacheManager.shared.clear()
        },
        DebugAction("Reset Defaults", icon: "arrow.counterclockwise", destructive: true) {
            UserDefaults.standard.removePersistentDomain(
                forName: Bundle.main.bundleIdentifier!
            )
        }
    ]
}`,
  'Controls.swift': `import DebugKit

// Interactive controls for tweaking state
controls: [
    .toggle("Dark Mode", binding: $isDark),
    .stepper("Font Size", binding: $fontSize, range: 12...24),
    .picker("Env", options: ["Dev", "Staging", "Prod"], binding: $env)
]

// Copy handler for bug reports
onCopy: {
    """
    Version: \\(version)
    User: \\(userId)
    Environment: \\(env)
    """
}`
};

type FileName = keyof typeof SNIPPETS;

// Robust Tokenizer Regex for Swift
const TOKENIZER_REGEX = /(\/\/.*)|("""[\s\S]*?"""|"(?:[^"\\]|\\.)*")|(@\w+)|(\b(?:import|struct|var|let|class|func|return|some|extension|if|else|switch|case|default|public|private|init|static)\b)|(\b[A-Z]\w+\b)|(\b\w+:)/g;

const HighlightedCode = ({ code }: { code: string }) => {
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  // Reset regex state
  TOKENIZER_REGEX.lastIndex = 0;

  while ((match = TOKENIZER_REGEX.exec(code)) !== null) {
    const [fullMatch, comment, string, decorator, keyword, type, arg] = match;
    const index = match.index;

    // Push preceding plain text
    if (index > lastIndex) {
      elements.push(code.slice(lastIndex, index));
    }

    if (comment) {
      elements.push(<span key={index} className="text-zinc-500 italic">{comment}</span>);
    } else if (string) {
      elements.push(<span key={index} className="text-green-400">{string}</span>);
    } else if (decorator) {
      elements.push(<span key={index} className="text-orange-400">{decorator}</span>);
    } else if (keyword) {
      elements.push(<span key={index} className="text-purple-400">{keyword}</span>);
    } else if (type) {
      elements.push(<span key={index} className="text-yellow-200">{type}</span>);
    } else if (arg) {
      elements.push(<span key={index} className="text-blue-300">{arg}</span>);
    } else {
      elements.push(fullMatch);
    }

    lastIndex = TOKENIZER_REGEX.lastIndex;
  }

  // Push remaining text
  if (lastIndex < code.length) {
    elements.push(code.slice(lastIndex));
  }

  return <>{elements}</>;
};

interface CodeArchitectureProps {
  frameless?: boolean;
}

export const CodeArchitecture: React.FC<CodeArchitectureProps> = ({ frameless = false }) => {
  const [activeFile, setActiveFile] = useState<FileName>('App.swift');
  const [copied, setCopied] = useState(false);

  const codeSnippet = SNIPPETS[activeFile];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const FileItem = ({ name, icon: Icon, color }: { name: FileName, icon: any, color: string }) => (
    <div 
      onClick={() => setActiveFile(name)}
      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors border ${activeFile === name ? 'bg-zinc-800/50 border-zinc-700 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
    >
       <Icon size={12} className={color} />
       <span className="text-[10px] font-mono">{name}</span>
    </div>
  );

  return (
    <div className={`${frameless ? '' : 'border border-zinc-800'} bg-[#09090b] grid lg:grid-cols-5 relative group min-h-[500px] h-full`}>
      {!frameless && (
        <>
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-white"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-white"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white"></div>
        </>
      )}

      {/* Sidebar / File Explorer */}
      <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-[#0c0c0e] p-4 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-white mb-2">
           <Terminal size={14} />
           <span className="text-xs font-bold uppercase tracking-wider">Project</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <FileItem name="App.swift" icon={Box} color="text-orange-400" />
          <FileItem name="Sections.swift" icon={Database} color="text-blue-400" />
          <FileItem name="Actions.swift" icon={FileCode} color="text-purple-400" />
          <FileItem name="Controls.swift" icon={Sliders} color="text-green-400" />
        </div>
        
        <div className="mt-auto border-t border-zinc-800 pt-4">
           <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mb-2">Target</div>
           <div className="flex items-center gap-2 text-zinc-400">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
             <span className="text-xs font-mono">macOS (Debug)</span>
           </div>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="lg:col-span-4 flex flex-col h-full bg-[#050505] relative">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-mono">Sources / Utils /</span>
            <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">{activeFile}</span>
          </div>
          <button onClick={copyToClipboard} className="text-zinc-500 hover:text-white transition-colors">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <pre className="font-mono text-xs md:text-sm leading-6 text-zinc-400">
            <code>
              {codeSnippet.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell text-zinc-800 select-none text-right pr-4 w-8">{i + 1}</span>
                  <span className="table-cell whitespace-pre-wrap break-all">
                    <HighlightedCode code={line} />
                  </span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};