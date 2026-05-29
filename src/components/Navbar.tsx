import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Search, Shield, Wifi } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-brand-accent animate-pulse" />
          <span className="tech-label text-[10px] text-brand-accent">Uplink: Stable</span>
        </div>
        
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input 
            type="text" 
            placeholder="ACCESS SYSTEM DATABASE..."
            className="w-full pl-10 pr-4 py-1.5 bg-black/40 border border-brand-border rounded text-[10px] font-mono text-brand-accent placeholder:text-slate-600 focus:outline-none focus:border-brand-accent/50 transition-all uppercase tracking-widest"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 px-4 border-x border-brand-border h-14">
          <button className="relative text-slate-500 hover:text-brand-accent transition-colors">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-accent rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          </button>
          <button className="text-slate-500 hover:text-brand-accent transition-colors">
            <Shield size={16} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-mono font-bold text-slate-200 uppercase tracking-tighter">{user?.displayName}</p>
            <p className="text-[8px] font-mono text-brand-accent uppercase opacity-70">Operator ID: {user?.uid.substring(0, 8)}</p>
          </div>
          <div className="relative">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=0f172a&color=06b6d4`} 
              alt="Profile" 
              className="w-8 h-8 rounded border border-brand-accent/30 p-0.5"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-brand-accent border-2 border-brand-bg rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
