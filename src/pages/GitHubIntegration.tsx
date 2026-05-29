import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, ExternalLink, RefreshCw, Search } from 'lucide-react';
import { Repository } from '../types';

export default function GitHubIntegration() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github/repos/demo-user');
      const data = await res.json();
      setRepos(data);
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(repo => 
    repo.name?.toLowerCase()?.includes(search.toLowerCase()) ?? false
  );

  return (
    <div className="h-full flex flex-col space-y-6 cyber-grid">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-brand-accent uppercase tracking-tighter flex items-center gap-3">
            <Github className="text-brand-accent" />
            Source Control Matrix
          </h2>
          <p className="tech-label">Synchronized repository data and activity tracking.</p>
        </div>
        <button 
          onClick={fetchRepos}
          className="tech-button flex items-center gap-2"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Uplink
        </button>
      </div>

      <div className="glass-panel p-6 flex-1 flex flex-col space-y-6 glow-border min-h-0">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="FILTER REPOSITORIES..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-brand-border rounded font-mono text-[10px] text-brand-accent placeholder:text-slate-700 focus:outline-none focus:border-brand-accent/50 transition-all uppercase tracking-widest"
            />
          </div>
          <button className="tech-button">
            Link New Repo
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2 custom-scrollbar">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-48 glass-panel animate-pulse border-brand-accent/10"></div>
            ))
          ) : filteredRepos.map((repo) => (
            <div key={repo.id} className="group glass-panel p-5 hover:border-brand-accent/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-brand-accent/10 rounded border border-brand-accent/20 group-hover:bg-brand-accent/20 transition-colors">
                  <Github size={20} className="text-brand-accent" />
                </div>
                <a href="#" className="text-slate-500 hover:text-brand-accent transition-colors">
                  <ExternalLink size={16} />
                </a>
              </div>
              
              <h3 className="text-xs font-mono font-bold text-slate-200 mb-1 uppercase tracking-tight">{repo.name}</h3>
              <p className="text-[10px] font-mono text-slate-500 mb-4">LAST_COMMIT: {repo.lastCommit}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <Star size={12} className="text-yellow-500/70" />
                  {repo.stars}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <GitFork size={12} className="text-slate-500" />
                  {repo.forks}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_5px_rgba(6,182,212,0.5)]"></span>
                  <span className="text-[10px] font-mono text-brand-accent uppercase">{repo.language}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
