import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, Sliders, Database, Box, Cpu } from 'lucide-react';

const SNIPPETS = {
  'App.swift': `import SwiftUI
import DebugKit

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .overlay(alignment: .bottomTrailing) {
                    // Integrate the toolbar with one line
                    DebugToolbar(
                        sections: DebugData.sections,
                        actions: DebugData.actions
                    )
                }
        }
    }
}`,
  'DebugData.swift': `import DebugKit

struct DebugData {
    static let sections = [
        DebugSection("ENVIRONMENT", [
            ("Server", Configuration.serverURL),
            ("Build", Bundle.main.versionString),
            ("Branch", "feature/login-v2")
        ]),
        DebugSection("USER", [
            ("ID", UserSession.current?.id ?? "Guest"),
            ("Role", UserSession.current?.role.rawValue ?? "-")
        ])
    ]
    
    static let actions = [
        DebugAction("Reset Cache", icon: "trash", destructive: true) {
            CacheService.shared.clear()
        },
        DebugAction("Toggle Theme", icon: "sun.max") {
            ThemeManager.shared.toggle()
        }
    ]
}`,
  'Network.swift': `// Dynamically inject debug headers
class NetworkService {
    func request(_ url: URL) async throws -> Data {
        var request = URLRequest(url: url)
        
        #if DEBUG
        request.addValue("true", forHTTPHeaderField: "X-Debug-Mode")
        if DebugSettings.simulateSlowNetwork {
            try await Task.sleep(nanoseconds: 1_000_000_000)
        }
        #endif
        
        return try await URLSession.shared.data(for: request)
    }
}`,
  'Custom.swift': `// Custom View integration
struct UserProfileView: View {
    var body: some View {
        VStack {
            UserProfileHeader()
            // ... content
        }
        .debugAction("Refresh Profile", icon: "arrow.clockwise") {
            await viewModel.reload()
        }
        .debugInfo("Last Sync", value: viewModel.lastSyncTime)
    }
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
          <FileItem name="DebugData.swift" icon={Database} color="text-blue-400" />
          <FileItem name="Network.swift" icon={FileCode} color="text-purple-400" />
          <FileItem name="Custom.swift" icon={Sliders} color="text-green-400" />
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