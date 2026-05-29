import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Sparkles, Code2, Bug, Zap, Loader2, Trash2, Layers, Users, Copy, Check, Terminal, Info, KeyRound } from 'lucide-react';
import { getCodeInsights } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import CollaborativeChat from '../components/CollaborativeChat';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AIAssistant() {
  const [code, setCode] = useState('');
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Initializing Neural Link...');
  const [sidebarTab, setSidebarTab] = useState<'source' | 'sync'>('source');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isCreator, setIsCreator] = useState(() => {
    return localStorage.getItem('devflow_is_creator') === 'true';
  });
  const [customKey, setCustomKey] = useState(() => {
    return localStorage.getItem('devflow_custom_gemini_key') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [projectId] = useState('demo-project');

  const handleSaveKey = (val: string) => {
    setCustomKey(val);
    if (val.trim()) {
      localStorage.setItem('devflow_custom_gemini_key', val.trim());
    } else {
      localStorage.removeItem('devflow_custom_gemini_key');
    }
  };

  // Auto-scroll to the latest tactical reports
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  const handleAnalyze = async (overridePrefix?: string) => {
    const finalQuery = overridePrefix 
      ? `${overridePrefix} \n${query}`.trim() 
      : query;
      
    if (!finalQuery && !code) return; // Permit analysis if there is either code or query

    // Real-time verification of creator bypass code '123456789'
    const passcodeEntered = finalQuery.includes('123456789');
    let currentCreatorState = isCreator;
    
    if (passcodeEntered) {
      localStorage.setItem('devflow_is_creator', 'true');
      setIsCreator(true);
      currentCreatorState = true;
    }

    // Support logout to inspect standard Dark Syntax persona of non-creator
    const trimmedQuery = finalQuery.toLowerCase().trim();
    if (trimmedQuery === 'reset creator' || trimmedQuery === 'logout creator' || trimmedQuery === 'clear creator') {
      localStorage.removeItem('devflow_is_creator');
      setIsCreator(false);
      currentCreatorState = false;
    }

    const userMsg: AIMessage = {
      role: 'user',
      content: finalQuery || 'Launch full automated review sequence on current code matrix.',
      timestamp: new Date().toISOString(),
    };

    setHistory(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);
    
    const loadingMessages = currentCreatorState ? [
      'AUTHENTICATING SOVEREIGN CREATOR SIGNATURE...',
      'ESTABLISHING DIRECT SYMPATHETIC LINK TO ARCHITECT...',
      'DE-ALLOCATING CYNICAL SUBROUTINES FOR CREATOR...',
      'OPENING THE ROYAL SYSTEM COMMAND SHELLS...',
      'UPGRADING COGNITION MATRICES TO MAXIMUM BANDWIDTH...',
    ] : [
      'Establishing Dark Syntax Link...',
      'Injecting Context Payload...',
      'Analyzing Abstract Syntax Trees...',
      'Checking Vulnerability Records...',
      'Synthesizing Optimal Structural Architecture...',
      'Executing Class-X Cognitive Matrix...',
    ];
    let msgIndex = 0;
    setLoadingMsg(loadingMessages[0]);
    
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingMessages.length;
      setLoadingMsg(loadingMessages[msgIndex]);
    }, 1200);

    try {
      const result = await getCodeInsights(code, finalQuery || 'Review and optimize the provided code matrix.', currentCreatorState);
      const assistantMsg: AIMessage = {
        role: 'assistant',
        content: result || 'Neural Core synthesized an empty memory matrix.',
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Neural Link Failure:", err);
      
      const isIncorrectKeyFormat = customKey && !customKey.startsWith("AIzaSy");
      const keyFormatNotice = isIncorrectKeyFormat 
        ? `\n\n🚨 **CRITICAL COGNITIVE ANOMALY**: The custom key you configured starts with \`${customKey.substring(0, 5)}...\` but Google Gemini API keys always start with \`AIzaSy\`. Please ensure you obtain a valid API key from [Google AI Studio](https://aistudio.google.com/) and update your Uplink Configuration.`
        : '';

      const errorMsg: AIMessage = {
        role: 'assistant',
        content: `### ⚠️ NEURAL LINK FAILURE\n\n**DIAGNOSTIC**: ${err?.message || 'Uplink rejected the payload.'}${keyFormatNotice}\n\n**REMEDIAL STEPS**:\n1. Click the **'Uplink API Key'** button in the header of DevFlow AI.\n2. Verify that your Gemini key starts with the standard **\`AIzaSy\`** pattern.\n3. Make sure you don't enter deployment tokens, project IDs, or random strings. Free keys are easily obtainable on [Google AI Studio](https://aistudio.google.com/).`,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      clearInterval(interval);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let combinedContent = '';
    const readFiles = Array.from(files);
    
    const validFiles = readFiles.filter(f => 
      f.type.startsWith('text/') || 
      f.name.endsWith('.ts') || 
      f.name.endsWith('.tsx') || 
      f.name.endsWith('.js') || 
      f.name.endsWith('.jsx') || 
      f.name.endsWith('.json') || 
      f.name.endsWith('.md') || 
      f.name.endsWith('.css')
    );

    for (const file of validFiles) {
      const content = await file.text();
      combinedContent += `\n/* FILE: ${file.webkitRelativePath || file.name} */\n${content}\n`;
    }

    if (combinedContent) {
      setCode(prev => (prev ? prev + '\n' + combinedContent : combinedContent));
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-4 cyber-grid pb-2">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        multiple
        {...({ webkitdirectory: "", directory: "" } as any)}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-brand-border/40 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-mono font-bold text-brand-accent uppercase tracking-tighter flex items-center gap-3">
            <BrainCircuit className="text-brand-accent animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.4)]" />
            Dark Syntax AI Core
          </h2>
          <p className="tech-label mt-1 text-slate-500">
            NEURAL COMMAND CENTER • LEVEL-X REFACTORING AND COGNITIVE RECONSTRUCTS
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Custom API Key Uplink Button */}
          <button
            onClick={() => setShowKeyInput(p => !p)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 border font-mono text-[9px] uppercase font-bold rounded-md transition-all cursor-pointer",
              customKey 
                ? "border-green-500/30 bg-green-500/5 text-green-400 hover:bg-green-500/10" 
                : "border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 animate-pulse"
            )}
          >
            <KeyRound size={11} className={cn(customKey ? "" : "animate-bounce")} />
            {customKey ? "🔒 Custom Key Saved" : "🔑 Uplink API Key"}
          </button>

          {isCreator ? (
            <div className="flex items-center gap-3 px-4 py-1.5 border border-cyan-500 bg-cyan-950/20 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.35)] animate-pulse">
              <Terminal size={14} className="text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase leading-none">Sovereign Direct Link Engaged</span>
                <span className="text-[7px] font-mono text-cyan-300 mt-1">Hello, Architect Mgcini Shaun</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-1.5 border border-brand-accent/20 bg-brand-accent/5 rounded-md">
              <Sparkles size={14} className="text-brand-accent animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold text-brand-accent uppercase leading-none">Status: Primary Link Active</span>
                <span className="text-[7px] font-mono text-slate-400 mt-1">Multi-Model Fallback Shield Loaded</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Key Control Dashboard */}
      {showKeyInput && (
        <div className="p-4 bg-slate-950/90 border border-brand-border/60 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-[10px] font-mono font-bold text-brand-accent uppercase tracking-wider flex items-center gap-2">
              <Info size={12} className={cn(customKey && !customKey.startsWith("AIzaSy") ? "text-red-500 animate-pulse" : "text-cyan-400")} />
              Personal Gemini Uplink Matrix Configuration
            </h4>
            <p className="text-[9px] font-slate-500 text-slate-400 leading-normal uppercase">
              Vercel acts as static server hosting. Under direct static execution, Dark Syntax routes payloads directly from your browser to Google API.
              Paste your Gemini API key securely below. Key stays confidential, stored only in your browser storage.
            </p>
            {customKey && !customKey.trim().startsWith("AIzaSy") && (
              <p className="text-[9px] text-amber-500 font-mono font-bold animate-pulse mt-1">
                ⚠️ FORMAT DETECTED: YOUR KEY STARTS WITH '{customKey.substring(0, 5)}...'. GENUINE GEMINI API KEYS MUST START WITH 'AIzaSy'. PLEASE CHECK COGNITIVE SIGNATURE.
              </p>
            )}
            {customKey && customKey.trim().startsWith("AIzaSy") && (
              <p className="text-[9px] text-green-400 font-mono font-bold mt-1">
                ✔ VERIFIED FORMAT: API KEY PREFIX ALIGNS WITH THE GEMINI CORE SIGNATURE DESIGN ('AIzaSy').
              </p>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <input
                type="password"
                placeholder="Enter Gemini API key (AIzaSy...)"
                value={customKey}
                onChange={(e) => handleSaveKey(e.target.value)}
                className={cn(
                  "w-full px-3 py-1.5 bg-slate-900 border rounded font-mono text-[10px] placeholder:text-slate-700 focus:outline-none transition-all",
                  customKey && !customKey.trim().startsWith("AIzaSy")
                    ? "border-amber-500/80 text-amber-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20"
                    : "border-brand-border/50 text-brand-accent focus:border-brand-accent"
                )}
              />
            </div>
            {customKey && (
              <button
                onClick={() => handleSaveKey('')}
                className="px-2.5 py-1.5 border border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/15 text-red-400 rounded text-[9px] font-mono font-bold transition-all cursor-pointer uppercase text-center"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Split Interface */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-0 h-[calc(100vh-10rem)]">
        
        {/* Left Side: Space-Optimized Dual Tab Sidebar (33% of screen space) */}
        <div className="xl:col-span-4 flex flex-col h-full min-h-0">
          
          {/* High-Tech Tab Controls */}
          <div className="flex bg-slate-950/80 border border-brand-border/60 rounded-t-lg overflow-hidden p-1 gap-1">
            <button
              onClick={() => setSidebarTab('source')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-[10px] uppercase font-mono font-bold tracking-wider transition-all",
                sidebarTab === 'source'
                  ? "bg-brand-accent/15 border border-brand-accent/30 text-brand-accent shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              )}
            >
              <Code2 size={13} />
              Source Payload
              {code.length > 0 && (
                <span className="ml-1 text-[8px] bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded-full font-mono">
                  {Math.round(code.length / 100) / 10}kb
                </span>
              )}
            </button>
            <button
              onClick={() => setSidebarTab('sync')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-[10px] uppercase font-mono font-bold tracking-wider transition-all",
                sidebarTab === 'sync'
                  ? "bg-brand-accent/15 border border-brand-accent/30 text-brand-accent shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              )}
            >
              <Users size={13} />
              Team Sync
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            </button>
          </div>

          {/* Tab Content Window */}
          <div className="flex-1 bg-brand-surface/20 border-x border-b border-brand-border/60 rounded-b-lg flex flex-col min-h-0 overflow-hidden relative">
            
            {sidebarTab === 'source' ? (
              <div className="flex-1 flex flex-col min-h-0 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Terminal size={12} className="text-slate-400" />
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">Payload Buffer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {code.length > 0 && (
                      <button 
                        onClick={() => setCode('')}
                        className="text-[8px] text-red-400/80 hover:text-red-400 font-mono transition-colors uppercase border border-red-500/20 hover:border-red-500/40 px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        Clear Matrix
                      </button>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[8px] text-brand-accent hover:text-cyan-300 font-mono flex items-center gap-1 transition-all border border-brand-accent/30 hover:border-brand-accent/75 bg-brand-accent/5 hover:bg-brand-accent/10 px-2 py-0.5 rounded cursor-pointer"
                    >
                      <Code2 size={10} className="animate-pulse" />
                      UPLINK ASSETS
                    </button>
                  </div>
                </div>

                <div className="flex-1 relative flex flex-col glass-panel glow-border overflow-hidden bg-slate-950/60">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="PASTE SOURCE CODE OR UPLINK A LOCAL PROJECT FOLDER DIRECTLY FOR DEEP SECURITY AUDITING & STRUCTURAL OPTIMIZATION..."
                    className="flex-1 w-full p-4 bg-transparent font-mono text-[11px] leading-relaxed text-brand-accent-secondary resize-none focus:outline-none placeholder:text-slate-800 custom-scrollbar whitespace-pre tab-2"
                  />
                  {code.length === 0 && (
                    <div className="absolute inset-x-4 inset-y-12 flex flex-col items-center justify-center text-center opacity-30 select-none pointer-events-none">
                      <Code2 size={40} className="text-brand-accent/40 mb-3 stroke-1" />
                      <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Buffer Empty</p>
                      <p className="text-[8px] font-mono text-slate-600 mt-2 max-w-[200px] leading-relaxed uppercase">
                        Pastes, files, or folders loaded here will be read automatically by Dark Syntax as comprehensive reference context.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex items-center gap-2 border-t border-brand-border/30 pt-3">
                  <Info size={12} className="text-slate-500 flex-shrink-0" />
                  <p className="text-[8px] font-mono text-slate-500 leading-normal uppercase">
                    Dark Syntax evaluates this reference buffer against any prompt compiled below.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-grow h-full overflow-hidden">
                <CollaborativeChat projectId={projectId} />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: The MAIN Cognitive Dialogue Center (67% of screen space) */}
        <div className="xl:col-span-8 flex flex-col h-full min-h-0 bg-brand-surface/10 border border-brand-border/60 rounded-lg overflow-hidden glow-border">
          
          {/* Terminal Console Header */}
          <div className="px-4 py-2 bg-slate-950 border-b border-brand-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="tech-label text-cyan-400 tracking-widest">COGNITIVE DIALOGUE TERMINAL</span>
            </div>
            <div className="flex items-center gap-3">
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-[8px] flex items-center gap-1.5 text-slate-500 hover:text-red-400 font-mono transition-colors uppercase border border-brand-border/40 hover:border-red-500/30 px-2 py-0.5 rounded bg-brand-surface/40"
                  title="Purge dialogue cache"
                >
                  <Trash2 size={10} />
                  Purge Cache ({history.length})
                </button>
              )}
            </div>
          </div>

          {/* Dialogue Monitor & Scroll Window */}
          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-slate-950/40 space-y-6">
            
            {/* Elegant Welcome Guidance Screen when empty */}
            {history.length === 0 && !loading && (
              <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col space-y-6 animate-in fade-in duration-500">
                <div className="border border-cyan-500/20 bg-cyan-950/10 p-6 rounded-lg glow-border flex items-start gap-4">
                  <Terminal size={24} className="text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-mono text-sm font-bold text-brand-accent uppercase tracking-wider mb-1">
                      DARK SYNTAX INTEL INTERFACE INITIALIZED
                    </h3>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed uppercase">
                      Class-X neural pipeline online. All queries are compiled via the highest-priority 
                      fallback chain directly against your codebase architecture.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-brand-border rounded bg-brand-surface/40 flex flex-col space-y-2">
                    <span className="text-[10px] font-mono text-brand-accent uppercase tracking-wider font-bold">1. LOAD CONTEXT (LEFT PANEL)</span>
                    <p className="text-[10px] font-mono text-slate-500 leading-relaxed uppercase">
                      Paste a script or click <strong className="text-slate-300">Uplink Assets</strong> on the left panel to load local source files. The AI automatically analyzes the loaded matrix.
                    </p>
                  </div>
                  <div className="p-4 border border-brand-border rounded bg-brand-surface/40 flex flex-col space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">2. CHAT & CONVERSE (BELOW)</span>
                    <p className="text-[10px] font-mono text-slate-500 leading-relaxed uppercase">
                      Input your questions or tactical directives. The output architecture, reports, and refactoring scripts will stream directly in this main viewport.
                    </p>
                  </div>
                </div>

                <div className="border border-brand-border bg-brand-surface/20 p-4 rounded text-center">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">
                    --- Awaiting Neural Link Input Directive ---
                  </p>
                </div>
              </div>
            )}

            {/* Conversation Flow */}
            {history.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}
              >
                {/* Meta Header */}
                <div className="flex items-center gap-2 px-1">
                  <span className={cn(
                    "text-[8px] font-mono uppercase tracking-widest",
                    msg.role === 'user' ? 'text-brand-accent' : (isCreator ? 'text-cyan-400 font-bold' : 'text-slate-400')
                  )}>
                    {msg.role === 'user' 
                      ? (isCreator ? '► ARCHITECT ULTIMATUM [ROOT]' : '► OPERATOR DIRECTIVE') 
                      : (isCreator ? '◄ LOYAL SENTINEL INTERLOCK' : '◄ DARK SYNTAX SYSTEM RESPONSE')
                    }
                  </span>
                  <span className="text-[7px] font-mono text-slate-600">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Message Box */}
                <div className={cn(
                  "w-full rounded border font-mono text-xs leading-relaxed p-5 relative group transition-all",
                  msg.role === 'user' 
                    ? "bg-brand-accent/5 border-brand-accent/30 text-brand-accent-secondary"
                    : "bg-slate-900/80 border-brand-border text-slate-200 shadow-md"
                )}>
                  {/* Copy Button option for long responses */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, i)}
                      className="absolute right-3 top-3 p-1.5 rounded border border-brand-border bg-slate-950 text-slate-400 hover:text-brand-accent opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg"
                      title="Copy intelligence text"
                    >
                      {copiedIndex === i ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                    </button>
                  )}

                  <div className={cn(msg.role === 'assistant' ? "markdown-body" : "whitespace-pre-wrap text-brand-accent font-medium")}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming Refactoring Indicator */}
            {loading && (
              <div className="flex flex-col items-start space-y-2 animate-pulse max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-brand-accent uppercase tracking-widest blinking">
                    Dark Syntax core compiling response...
                  </span>
                </div>
                <div className="bg-brand-accent/5 border border-brand-accent/20 p-6 rounded w-full flex flex-col items-center justify-center space-y-3 shadow-2xl">
                  <Loader2 size={24} className="animate-spin text-brand-accent shadow-glow" />
                  <p className="tech-label text-brand-accent mt-2">{loadingMsg}</p>
                  <div className="w-64 h-1 bg-slate-950 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 h-full bg-brand-accent animate-[loading-bar_1.2s_infinite] w-1/2" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Entry & Command Center Block */}
          <div className="p-4 bg-slate-950 border-t border-brand-border/60 space-y-3">
            
            {/* Main Interactive Command input */}
            <div className="relative flex items-center bg-black/50 border border-brand-border rounded focus-within:border-brand-accent/50 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all">
              <span className="pl-3 text-brand-accent font-mono text-[10px] select-none uppercase tracking-widest">
                SYS_INP {">"}
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="INPUT COGNITIVE DIRECTIVE, LOGICAL EXPLANATION, OR REFACTORING INSTRUCTION..."
                className="w-full pl-2 pr-12 py-3.5 bg-transparent font-mono text-xs text-brand-accent placeholder:text-slate-800 focus:outline-none uppercase tracking-widest"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                disabled={loading}
              />
              <button 
                onClick={() => handleAnalyze()}
                disabled={loading || (!query && !code)}
                className="absolute right-2 p-2 bg-brand-accent text-black rounded hover:bg-brand-accent/80 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
            
            {/* Instant Actions Deck */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[8px] font-mono text-slate-600 uppercase mr-1">Tactical Macros:</span>
              {[
                { label: 'Architect Solution', icon: BrainCircuit, color: 'text-brand-accent border-brand-accent/20 hover:border-brand-accent bg-brand-accent/5', prefix: 'Architect a full production-ready solution for the following requirements:' },
                { label: 'Security Audit', icon: Bug, color: 'text-red-400 border-red-500/20 hover:border-red-500 bg-red-500/5', prefix: 'Perform a deep security audit on this code. Identify all vulnerabilities:' },
                { label: 'Extreme Optimization', icon: Zap, color: 'text-amber-400 border-amber-500/20 hover:border-amber-500 bg-amber-500/5', prefix: 'Optimize this code for maximum performance. Focus on memory layout and cache locality:' },
                { label: 'Rewrite Modular', icon: Code2, color: 'text-cyan-400 border-cyan-500/20 hover:border-cyan-500 bg-cyan-500/5', prefix: 'Rewrite this code following modern modular patterns and industry-standard clean code principles:' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleAnalyze(action.prefix)}
                  disabled={loading}
                  className={cn(
                    "py-1.5 px-3 border rounded text-[9px] font-mono transition-all hover:scale-[1.03] active:scale-95 flex items-center gap-1.5 uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
                    action.color
                  )}
                  title={`Trigger automated context review using macro: ${action.label}`}
                >
                  <action.icon size={11} />
                  {action.label}
                </button>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
