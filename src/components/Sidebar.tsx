import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Trello, 
  Github, 
  BrainCircuit, 
  BarChart3, 
  Settings,
  LogOut,
  FileCode,
  Terminal,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'kanban', label: 'Operations', icon: Trello },
    { id: 'editor', label: 'Cloud Terminal', icon: FileCode },
    { id: 'github', label: 'Source Control', icon: Github },
    { id: 'ai', label: 'Neural Link', icon: BrainCircuit },
    { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
    { id: 'vscode', label: 'Environment', icon: Settings },
  ];

  return (
    <div className="w-64 bg-brand-bg border-r border-brand-border flex flex-col z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <Terminal size={18} className="text-black" />
        </div>
        <h1 className="text-lg font-mono font-bold text-brand-accent tracking-tighter uppercase">DevFlow AI</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono uppercase tracking-widest transition-all duration-200",
              activeTab === item.id 
                ? "bg-brand-accent/20 text-brand-accent border-l-2 border-brand-accent shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]" 
                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
            )}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-brand-border space-y-2">
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-mono uppercase tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 hover:bg-brand-accent/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] mb-2"
          >
            <Download size={16} />
            Install System
          </button>
        )}
        <div className="bg-brand-accent/5 p-3 rounded border border-brand-accent/20">
          <p className="tech-label text-[8px] mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></div>
            <span className="text-[10px] font-mono text-brand-accent uppercase">All Nodes Active</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={16} />
          Terminate
        </button>
      </div>
    </div>
  );
}
