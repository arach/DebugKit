import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, Sliders, Database, Box, Cpu } from 'lucide-react';

const SNIPPETS = {
  'App.swift': `import SwiftUI
import DebugKit

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            #if DEBUG
            ZStack {
                ContentView()
                DebugToolbar(
                    sections: debugSections,
                    actions: debugActions,
                    onCopy: { copyDebugInfo() }
                )
            }
            #else
            ContentView()
            #endif
        }
    }
}`,
  'Sections.swift': `import DebugKit

var debugSections: [DebugSection] {
    [
        DebugSection("BUILD", [
            ("Version", "1.2.0"),
            ("Build", "142"),
            ("Env", "Debug")
        ]),
        DebugSection("STATE", [
            ("User", currentUser?.name ?? "Guest"),
            ("Synced", lastSync ?? "Never")
        ])
    ]
}`,
  'Actions.swift': `import DebugKit

var debugActions: [DebugAction] {
    [
        DebugAction("Force Sync", icon: "arrow.triangle.2.circlepath") {
            SyncManager.shared.sync()
        },
        DebugAction("Clear Cache", icon: "trash", destructive: true) {
            CacheManager.shared.clear()
        },
        DebugAction("Reset Onboarding", icon: "arrow.counterclockwise") {
            UserDefaults.standard.removeObject(forKey: "onboarded")
        }
    ]
}`,
  'Copy.swift': `func copyDebugInfo() -> String {
    let version = Bundle.main.appVersion
    let build = Bundle.main.buildNumber
    let user = currentUser?.name ?? "Guest"

    return """
    App: MyApp v\\(version) (\\(build))
    User: \\(user)
    Last Sync: \\(lastSync ?? "Never")
    """
}`
};

type FileName = keyof typeof SNIPPETS;

// Simple Swift syntax highlighter
const highlightSwift = (code: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  let i = 0;

  const keywords = new Set([
    'import', 'struct', 'class', 'func', 'var', 'let', 'return', 'if', 'else',
    'some', 'private', 'public', 'static', 'true', 'false', 'nil', 'self'
  ]);

  while (i < code.length) {
    // Comments
    if (code.slice(i, i + 2) === '//') {
      const end = code.indexOf('\n', i);
      const comment = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push(<span key={i} className="text-zinc-500 italic">{comment}</span>);
      i += comment.length;
      continue;
    }

    // Strings
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"') {
        if (code[j] === '\\') j++;
        j++;
      }
      const str = code.slice(i, j + 1);
      tokens.push(<span key={i} className="text-green-400">{str}</span>);
      i = j + 1;
      continue;
    }

    // Preprocessor (#if, #else, #endif)
    if (code[i] === '#' && /[a-zA-Z]/.test(code[i + 1] || '')) {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      const directive = code.slice(i, j);
      tokens.push(<span key={i} className="text-pink-400">{directive}</span>);
      i = j;
      continue;
    }

    // Property wrappers (@State, @main, etc.)
    if (code[i] === '@') {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      const attr = code.slice(i, j);
      tokens.push(<span key={i} className="text-orange-400">{attr}</span>);
      i = j;
      continue;
    }

    // Words (keywords, types, identifiers)
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w]/.test(code[j])) j++;
      const word = code.slice(i, j);

      if (keywords.has(word)) {
        tokens.push(<span key={i} className="text-purple-400">{word}</span>);
      } else if (/^[A-Z]/.test(word)) {
        tokens.push(<span key={i} className="text-yellow-200">{word}</span>);
      } else if (code[j] === ':') {
        tokens.push(<span key={i} className="text-blue-300">{word}</span>);
      } else {
        tokens.push(<span key={i} className="text-zinc-300">{word}</span>);
      }
      i = j;
      continue;
    }

    // Everything else
    tokens.push(<span key={i} className="text-zinc-400">{code[i]}</span>);
    i++;
  }

  return tokens;
};

const HighlightedCode = ({ code }: { code: string }) => {
  return <>{highlightSwift(code)}</>;
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
          <FileItem name="Copy.swift" icon={Sliders} color="text-green-400" />
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
          <pre className="font-mono text-xs md:text-sm leading-6">
            <code>
              {codeSnippet.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell text-zinc-700 select-none text-right pr-4 w-8">{i + 1}</span>
                  <span className="table-cell whitespace-pre">
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