import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Globe, 
  Shield, 
  Zap,
  Terminal as TerminalIcon,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const performanceData = [
  { time: '00:00', cpu: 45, mem: 62, net: 24 },
  { time: '04:00', cpu: 52, mem: 65, net: 38 },
  { time: '08:00', cpu: 85, mem: 78, net: 92 },
  { time: '12:00', cpu: 78, mem: 82, net: 85 },
  { time: '16:00', cpu: 92, mem: 88, net: 95 },
  { time: '20:00', cpu: 65, mem: 75, net: 45 },
  { time: '23:59', cpu: 48, mem: 70, net: 30 },
];

const distributionData = [
  { name: 'Frontend', value: 400 },
  { name: 'Backend', value: 300 },
  { name: 'DevOps', value: 200 },
  { name: 'Security', value: 100 },
];

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const { user } = useAuth();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logs = [
      "INITIALIZING NEURAL UPLINK...",
      "ESTABLISHING SECURE TUNNEL [AES-256]...",
      "SYNCING GLOBAL OPERATIONS MATRIX...",
      "DARK SYNTAX CORE V3.1.4 ONLINE",
      "OPERATOR: " + (user?.displayName?.toUpperCase() || "UNKNOWN"),
      "UPLINK STATUS: STABLE",
      "LATENCY: 12ms",
      "SCANNING SOURCE CONTROL NODES...",
      "DETECTING ANOMALIES... NONE FOUND",
      "READY FOR COMMAND INPUT."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setTerminalLines(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  return (
    <div className="h-full flex flex-col space-y-6 cyber-grid p-2 relative overflow-hidden">
      {/* Terminal Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'System Uptime', value: '99.99%', icon: Activity, color: 'text-cyan-400' },
          { label: 'Compute Load', value: '74.2%', icon: Cpu, color: 'text-blue-400' },
          { label: 'Global Traffic', value: '1.2M', icon: Globe, color: 'text-purple-400' },
          { label: 'Security Status', value: 'Optimal', icon: Shield, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 flex items-center justify-between glow-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-accent/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative z-10">
              <p className="tech-label">{stat.label}</p>
              <p className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`${stat.color} opacity-50 relative z-10`} size={24} />
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Column: Global Visualization & Terminal */}
        <div className="lg:col-span-7 flex flex-col space-y-6 min-h-0">
          <div className="flex-[2] glass-panel p-6 relative overflow-hidden flex flex-col glow-border">
            <div className="flex items-center justify-between mb-4 z-10">
              <h3 className="tech-label text-brand-accent">Global Operations Matrix</h3>
              <div className="flex gap-2">
                <button className="tech-button py-1 px-2"><RefreshCw size={12} /></button>
                <button className="tech-button py-1 px-2"><Maximize2 size={12} /></button>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="w-[400px] h-[400px] rounded-full border border-brand-accent/30 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full border border-brand-accent/50 animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute w-[200px] h-[200px] rounded-full border border-brand-accent animate-[pulse_4s_ease-in-out_infinite]"></div>
              </div>
              <div className="text-center z-10">
                <p className="text-5xl font-mono font-bold text-brand-accent tracking-tighter drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">1,812,020,001</p>
                <p className="tech-label mt-2">Total System Transactions</p>
              </div>
            </div>

            <div className="h-32 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="net" stroke="#06b6d4" fill="url(#glow)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cyber Terminal Effect Panel */}
          <div className="flex-1 glass-panel p-4 glow-border bg-black/60 font-mono text-[10px] overflow-hidden flex flex-col border-brand-accent/20">
            <div className="flex items-center gap-2 mb-2 border-b border-brand-accent/20 pb-2">
              <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
              <span className="tech-label text-brand-accent">System Initialization Terminal</span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
              {terminalLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className={cn(
                    "transition-all duration-300",
                    line?.includes("ONLINE") || line?.includes("STABLE") ? "text-emerald-400" : "text-brand-accent"
                  )}>
                    {line}
                  </span>
                </div>
              ))}
              <div className="flex gap-2">
                <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-brand-accent animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High Density Metrics */}
        <div className="lg:col-span-5 flex flex-col space-y-6 min-h-0">
          <div className="h-1/2 glass-panel p-6 flex flex-col glow-border">
            <h3 className="tech-label mb-4">Resource Allocation</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px'}}
                    itemStyle={{fontSize: '12px'}}
                  />
                  <Bar dataKey="cpu" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="mem" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="h-1/2 grid grid-cols-2 gap-4 min-h-0">
            <div className="glass-panel p-4 flex flex-col glow-border">
              <h3 className="tech-label mb-2">Service Load</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="glass-panel p-4 flex flex-col glow-border bg-black/40">
              <div className="flex items-center gap-2 mb-2">
                <TerminalIcon size={12} className="text-brand-accent" />
                <h3 className="tech-label">Live Feed</h3>
              </div>
              <div className="flex-1 font-mono text-[10px] text-slate-500 overflow-y-auto space-y-1">
                <p><span className="text-brand-accent">[04:12:01]</span> AUTH_SUCCESS: user_829</p>
                <p><span className="text-brand-accent">[04:12:05]</span> DB_SYNC: projects_v2</p>
                <p><span className="text-brand-accent">[04:12:12]</span> AI_PROC: analysis_complete</p>
                <p><span className="text-brand-accent">[04:12:18]</span> NET_PEAK: 1.2Gbps detected</p>
                <p><span className="text-brand-accent">[04:12:22]</span> SYS_HEAL: node_04 recovered</p>
                <p className="animate-pulse text-brand-accent">_</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
