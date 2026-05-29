import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, Users, Code2, Bug, Zap, Download, RefreshCw } from 'lucide-react';

const commitData = [
  { name: 'Week 1', commits: 45, bugs: 12 },
  { name: 'Week 2', commits: 52, bugs: 8 },
  { name: 'Week 3', commits: 38, bugs: 15 },
  { name: 'Week 4', commits: 65, bugs: 5 },
  { name: 'Week 5', commits: 48, bugs: 10 },
  { name: 'Week 6', commits: 72, bugs: 4 },
];

const languageData = [
  { name: 'TypeScript', value: 45 },
  { name: 'JavaScript', value: 25 },
  { name: 'CSS', value: 15 },
  { name: 'HTML', value: 10 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

export default function Analytics() {
  return (
    <div className="h-full flex flex-col space-y-8 cyber-grid">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-brand-accent uppercase tracking-tighter">Intelligence Matrix</h2>
          <p className="tech-label">Deep insights into development patterns and neural performance.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const btn = document.activeElement as HTMLElement;
              btn.classList.add('animate-ping');
              setTimeout(() => {
                btn.classList.remove('animate-ping');
                alert("NEURAL VELOCITY RECALIBRATED: Grid performance increased by 14.2%");
              }, 1000);
            }}
            className="tech-button text-[10px] py-1 px-3 flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Zap size={12} className="text-brand-accent" />
            RECALCULATE VELOCITY
          </button>
          <button 
            onClick={() => {
              const link = document.createElement('a');
              const data = JSON.stringify({ metrics: commitData, generatedAt: new Date().toISOString() });
              const blob = new Blob([data], { type: 'application/json' });
              link.href = URL.createObjectURL(blob);
              link.download = `intelligence_matrix_${Date.now()}.json`;
              link.click();
            }}
            className="tech-button text-[10px] py-1 px-3 border-slate-700 text-slate-400 hover:text-brand-accent transition-colors flex items-center gap-2"
          >
            <Download size={12} />
            DOWNLOAD RAW MATRIX
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Commits', value: '1,284', icon: Code2, trend: '+12%', color: 'text-cyan-400' },
          { label: 'Active Nodes', value: '8', icon: Users, trend: '0%', color: 'text-blue-400' },
          { label: 'Bugs Purged', value: '156', icon: Bug, trend: '+24%', color: 'text-red-400' },
          { label: 'Neural Velocity', value: '4.2', icon: TrendingUp, trend: '+8%', color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 glow-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="text-slate-600" size={20} />
              <span className="text-[10px] font-mono font-bold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                {stat.trend}
              </span>
            </div>
            <p className={`text-2xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
            <p className="tech-label mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="glass-panel p-6 flex flex-col glow-border">
          <h3 className="tech-label mb-6">Commit Velocity vs Anomalies</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={commitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px'}}
                  itemStyle={{fontSize: '12px'}}
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace'}} />
                <Line type="monotone" dataKey="commits" stroke="#06b6d4" strokeWidth={2} dot={{r: 3, fill: '#06b6d4'}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="bugs" stroke="#ef4444" strokeWidth={2} dot={{r: 3, fill: '#ef4444'}} activeDot={{r: 5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 flex flex-col glow-border">
          <h3 className="tech-label mb-6">Neural Language Distribution</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '4px'}}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
