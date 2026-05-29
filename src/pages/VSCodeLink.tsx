import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Terminal, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function VSCodeLink() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const apiKey = "df_live_" + btoa(user?.uid || 'guest').substring(0, 24);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 cyber-grid">
      <div>
        <h2 className="text-2xl font-mono font-bold text-brand-accent uppercase tracking-tighter">Environment Uplink</h2>
        <p className="tech-label">Connect local development nodes with DevFlow AI neural core.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 glow-border space-y-4">
          <div className="w-10 h-10 bg-brand-accent/10 rounded flex items-center justify-center text-brand-accent">
            <Globe size={24} />
          </div>
          <h3 className="font-mono font-bold text-slate-200 uppercase text-xs">Remote Sync</h3>
          <p className="text-[10px] text-slate-500 font-sans">Bi-directional synchronization between local buffers and cloud storage.</p>
        </div>
        <div className="glass-panel p-6 glow-border space-y-4">
          <div className="w-10 h-10 bg-brand-accent-secondary/10 rounded flex items-center justify-center text-brand-accent-secondary">
            <Cpu size={24} />
          </div>
          <h3 className="font-mono font-bold text-slate-200 uppercase text-xs">Neural Bridge</h3>
          <p className="text-[10px] text-slate-500 font-sans">Access Gemini AI intelligence directly from your local IDE environment.</p>
        </div>
        <div className="glass-panel p-6 glow-border space-y-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded flex items-center justify-center text-emerald-500">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-mono font-bold text-slate-200 uppercase text-xs">Encrypted Link</h3>
          <p className="text-[10px] text-slate-500 font-sans">End-to-end encrypted tunnels for secure data transmission.</p>
        </div>
      </div>

      <div className="glass-panel p-8 space-y-6 glow-border bg-brand-surface/60">
        <div className="space-y-2">
          <h3 className="text-lg font-mono font-bold text-brand-accent uppercase tracking-tight">Setup Protocol</h3>
          <p className="tech-label">Follow these steps to initialize the environment link.</p>
        </div>

        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="w-8 h-8 rounded border border-brand-accent/30 bg-brand-accent/10 flex-shrink-0 flex items-center justify-center font-mono font-bold text-brand-accent shadow-[0_0_10px_rgba(6,182,212,0.2)]">01</div>
            <div className="space-y-2">
              <p className="font-mono font-bold text-slate-200 text-xs uppercase">Install Extension</p>
              <p className="text-[10px] text-slate-500">Search for <span className="text-brand-accent font-mono font-bold">"DevFlow AI"</span> in the VS Code Marketplace.</p>
              <button className="flex items-center gap-2 text-[10px] text-brand-accent hover:underline font-mono uppercase tracking-widest">
                Open Marketplace <ExternalLink size={10} />
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-8 h-8 rounded border border-brand-accent/30 bg-brand-accent/10 flex-shrink-0 flex items-center justify-center font-mono font-bold text-brand-accent shadow-[0_0_10px_rgba(6,182,212,0.2)]">02</div>
            <div className="space-y-3 flex-1">
              <p className="font-mono font-bold text-slate-200 text-xs uppercase">Neural Authentication</p>
              <p className="text-[10px] text-slate-500">Copy your unique system access key for extension authorization.</p>
              <div className="flex items-center gap-2 bg-black/40 p-3 rounded border border-brand-border">
                <code className="flex-1 text-[10px] font-mono text-brand-accent-secondary overflow-hidden text-ellipsis uppercase tracking-widest">
                  {apiKey}
                </code>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-brand-accent/10 rounded transition-colors text-slate-500 hover:text-brand-accent"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-8 h-8 rounded border border-brand-accent/30 bg-brand-accent/10 flex-shrink-0 flex items-center justify-center font-mono font-bold text-brand-accent shadow-[0_0_10px_rgba(6,182,212,0.2)]">03</div>
            <div className="space-y-2">
              <p className="font-mono font-bold text-slate-200 text-xs uppercase">Initialize Link</p>
              <p className="text-[10px] text-slate-500">Execute the following command in your local terminal:</p>
              <div className="bg-black/40 p-3 rounded border border-brand-border flex items-center gap-3">
                <Terminal size={12} className="text-slate-600" />
                <code className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">devflow link --node current-workspace</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
