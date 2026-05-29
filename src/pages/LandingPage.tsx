import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  ChevronRight, 
  Github, 
  BrainCircuit, 
  Activity,
  ArrowRight,
  Code2,
  Zap,
  Shield,
  ShieldCheck,
  Key,
  Cpu,
  Tv,
  Sparkles,
  Unlock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const { login, loginSandbox } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [creatorCode, setCreatorCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setAuthError(null);
    try {
      await login();
    } catch (err: any) {
      console.error("Google Auth process error:", err);
      setAuthError(
        err?.message || "Google OAuth redirect/popup error. Restrictive local network or missing Authorized Domain configuration."
      );
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSovereignBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (creatorCode.trim() === '123456789') {
      await loginSandbox('Chief Architect Mgcini Shaun', 'mgcinishaun524@gmail.com', true);
      setShowAuthModal(false);
    } else {
      setAuthError("CRYPTOGRAPHIC DISCORD: The passcode provided does not match any registered creator database node.");
    }
  };

  const handleLocalSandboxLogin = async () => {
    setAuthError(null);
    await loginSandbox('Operator Core Sandbox', 'operator@devflow.local', false);
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-200 selection:bg-brand-accent selection:text-black selection:shadow-[0_0_10px_rgba(6,182,212,0.8)] custom-scrollbar overflow-x-hidden">
      {/* Tactical Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      <div className="fixed inset-0 pointer-events-none z-0 cyber-grid opacity-20"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-brand-border/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Terminal size={20} className="text-black" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tighter uppercase text-brand-accent">DevFlow AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
          <a href="#features" className="hover:text-brand-accent transition-colors">Tactical Features</a>
          <a href="#matrix" className="hover:text-brand-accent transition-colors">Neural Matrix</a>
          <a href="#pricing" className="hover:text-brand-accent transition-colors">Uplink Tiers</a>
        </div>
        <button 
          onClick={() => setShowAuthModal(true)}
          className="tech-button px-6 py-2 flex items-center gap-2 group"
          id="nav_init_uplink"
        >
          Initialize Uplink
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center"
          >
            <span className="tech-label px-4 py-1.5 border border-brand-accent/30 bg-brand-accent/5 rounded-full flex items-center gap-2 text-brand-accent">
              <Activity size={12} className="animate-pulse" />
              SYSTEM CORE V3.1.4 ONLINE
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-mono font-bold tracking-tighter uppercase leading-[0.9]"
          >
            The Neural <br />
            <span className="text-brand-accent drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">Command Center</span><br />
            for Engineers
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-400 font-sans text-lg md:text-xl leading-relaxed"
          >
            A high-performance SaaS engine for tactical project management, real-time code analytics, and AI-driven intelligence. Built for mission-critical development nodes.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4"
          >
            <button 
              onClick={() => setShowAuthModal(true)}
              className="w-full md:w-auto px-10 py-4 bg-brand-accent text-black font-mono font-bold uppercase tracking-widest hover:bg-brand-accent/80 transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3"
              id="hero_start_mission"
            >
              Start Mission Protocol
              <ArrowRight size={18} />
            </button>
            <button className="w-full md:w-auto tech-button px-10 py-4 text-brand-accent">
              View Deployment Docs
            </button>
          </motion.div>
        </div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 relative glass-panel border border-brand-accent/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent z-10"></div>
          <div className="px-4 py-2 bg-brand-surface/80 border-b border-brand-border flex items-center justify-between">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">LIVE_COMMAND_CENTER_PREVIEW.exe</span>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000" 
            alt="Dashboard Preview" 
            className="w-full opacity-60 mix-blend-screen"
          />
        </motion.div>
      </section>

      {/* Feature Matrix */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter">Tactical Feature Matrix</h2>
          <div className="w-20 h-1 bg-brand-accent mx-auto shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Neural AI Assistant",
              desc: "Context-aware code intelligence powered by Gemini AI. Optimize, debug, and explain complex source buffers instantly.",
              icon: BrainCircuit,
              accent: "text-brand-accent"
            },
            {
              title: "Source Matrix",
              desc: "Deep GitHub integration with real-time commit velocity tracking and repository health analytics.",
              icon: Github,
              accent: "text-blue-400"
            },
            {
              title: "Execution Kanban",
              desc: "High-density project tracking with drag-and-drop mechanics and real-time status synchronization.",
              icon: Activity,
              accent: "text-emerald-400"
            },
            {
              title: "Cloud Editor",
              desc: "Universal terminal with support for 20+ dev languages. Prototype and execute code in a neural sandbox environment.",
              icon: Code2,
              accent: "text-purple-400"
            },
            {
              title: "Intelligence Hub",
              desc: "Deep visual matrices mapping team velocity against anomaly detection and system health.",
              icon: Zap,
              accent: "text-yellow-400"
            },
            {
              title: "Security Shield",
              desc: "Enterprise-grade encryption for all neural links and local environment uplinks (VS Code).",
              icon: Shield,
              accent: "text-red-400"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 glow-border group transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <feature.icon size={40} className={`${feature.accent} mb-6 transition-transform group-hover:scale-110 duration-500`} />
              <h3 className="text-xl font-mono font-bold mb-4 uppercase text-slate-100">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-mono font-bold uppercase tracking-tighter text-brand-accent">Uplink Authorization Tiers</h2>
          <p className="tech-label">Select your subscription level for system access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              tier: "Guest Phase",
              price: "$0",
              features: ["3 Neural Projects", "Basic AI Insights", "Standard Matrix", "Cloud Editor Access"],
              cta: "Launch Guest Access",
              popular: false
            },
            {
              tier: "Operator Core",
              price: "$29",
              features: ["Unlimited Projects", "Advanced Neural AI", "Full Source Matrix", "VS Code Neural Bridge", "Custom Theme Engine"],
              cta: "Authenticate Operator",
              popular: true
            },
            {
              tier: "Command Center",
              price: "$99",
              features: ["Enterprise Encryption", "Priority Neural Queue", "Team Matrix Dashboard", "Dedicated System Node", "24/7 Tactical Support"],
              cta: "Initialize Command",
              popular: false
            }
          ].map((plan, i) => (
            <div 
              key={i}
              className={`glass-panel p-10 flex flex-col glow-border relative ${plan.popular ? 'border-brand-accent shadow-[0_0_30px_rgba(6,182,212,0.1)]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-brand-accent text-black font-mono font-bold text-[10px] px-4 py-1 rounded-b uppercase tracking-widest">
                  RECOMMENDED NODE
                </div>
              )}
              <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-2">{plan.tier}</h3>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-mono font-bold text-slate-100">{plan.price}</span>
                <span className="text-slate-500 font-mono text-sm">/SYSTEM_CYCLE</span>
              </div>
              <ul className="flex-1 space-y-4 mb-10">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-xs text-slate-400">
                    <ChevronRight size={14} className="text-brand-accent" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setShowAuthModal(true)}
                className={`w-full py-4 font-mono font-bold uppercase tracking-widest transition-all ${
                  plan.popular ? 'bg-brand-accent text-black hover:bg-brand-accent/80' : 'tech-button text-brand-accent'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-brand-border bg-black/40 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Terminal size={24} className="text-brand-accent" />
              <span className="font-mono font-bold text-xl tracking-tighter uppercase text-brand-accent">DevFlow AI</span>
            </div>
            <p className="text-slate-500 text-xs max-w-xs font-mono">
              NEXT-GEN DEVELOPMENT OPERATING SYSTEM FOR MISSION CRITICAL NODES.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">
            <div className="space-y-4">
              <p className="text-slate-300 font-bold">Terminal</p>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brand-accent">Commands</a></li>
                <li><a href="#" className="hover:text-brand-accent">Manifest</a></li>
                <li><a href="#" className="hover:text-brand-accent">Uplink</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-slate-300 font-bold">Neural</p>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brand-accent">Gemini Logic</a></li>
                <li><a href="#" className="hover:text-brand-accent">Core AI</a></li>
                <li><a href="#" className="hover:text-brand-accent">Datasets</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-slate-300 font-bold">Secure</p>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-brand-accent">Encryption</a></li>
                <li><a href="#" className="hover:text-brand-accent">Nodes</a></li>
                <li><a href="#" className="hover:text-brand-accent">Auth</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-brand-border/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono text-slate-600">© 2026 DEVFLOW AI SYSTEMS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 text-[10px] font-mono text-slate-600">
            <a href="#" className="hover:text-brand-accent">PRIVACY_PROTOCOL</a>
            <a href="#" className="hover:text-brand-accent">TERMS_OF_ENGAGEMENT</a>
          </div>
        </div>
      </footer>

      {/* Cyberpunk Sovereign Authorization Bridge Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-brand-surface border border-brand-accent/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)] relative"
          >
            {/* Top Scanning Line */}
            <div className="h-1 bg-brand-accent w-full animate-pulse"></div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-brand-border/50 bg-slate-950/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-brand-accent animate-pulse" />
                <span className="font-mono font-bold text-xs uppercase tracking-widest text-slate-300">
                  DEVFLOW_AUTHORIZATION_BRIDGE_v3.1.4
                </span>
              </div>
              <button 
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError(null);
                }}
                className="text-[10px] font-mono uppercase text-slate-500 hover:text-brand-accent transition-colors px-2 py-1 border border-brand-border/40 hover:border-brand-accent/40 bg-black/40 rounded"
              >
                [ Abort ]
              </button>
            </div>

            <div className="p-6 space-y-6">
              {authError && (
                <div className="p-4 border border-red-500/30 bg-red-950/20 rounded flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 animate-ping"></div>
                  <div className="flex-1 space-y-1">
                    <p className="font-mono text-[9px] font-bold uppercase text-red-400">Uplink Error Protocol Initiated</p>
                    <p className="font-mono text-[10px] text-red-300/80 leading-normal">{authError}</p>
                  </div>
                </div>
              )}

              <p className="font-sans text-[13px] text-slate-400 leading-relaxed">
                Choose an override entry vector. For packaged native environments, desktop shells (PyWebView), or strict local hosts, utilize the <strong className="text-slate-200">Local Developer Sandbox</strong> or enter your <strong className="text-brand-accent">Sovereign Creator Seed</strong> passcode.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Channel 1: Google login */}
                <div className="glass-panel p-5 border border-brand-border/60 hover:border-brand-accent/30 transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2">
                    <span className="text-[7px] font-mono text-brand-accent font-semibold tracking-widest block uppercase">
                      CHANNEL-01 • DEPLOYMENT SECURE
                    </span>
                    <h4 className="font-mono text-xs font-bold uppercase text-slate-200">Google OAuth Uplink</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Initiate standard external Firebase sign-in workflow. Requires active OAuth credentials and authorized hosting hostnames.
                    </p>
                  </div>
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={loadingGoogle}
                    className="w-full py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-brand-accent text-black hover:bg-brand-accent/80 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {loadingGoogle ? (
                      <>
                        <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        CALIBRATING FREQUENCY...
                      </>
                    ) : (
                      <>
                        <Zap size={12} />
                        ACTIVATE GOOGLE LINK
                      </>
                    )}
                  </button>
                </div>

                {/* Channel 2: Sandbox Local Login */}
                <div className="glass-panel p-5 border border-brand-border/60 hover:border-brand-accent/30 transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2">
                    <span className="text-[7px] font-mono text-cyan-400 font-semibold tracking-widest block uppercase">
                      CHANNEL-02 • LOCAL HOST OVERRIDE
                    </span>
                    <h4 className="font-mono text-xs font-bold uppercase text-slate-200">Local Sandbox Mode</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Instantly bypass all external cloud provider login blocks. Instantiates a native sandbox operator role perfectly suited for VS Code testing.
                    </p>
                  </div>
                  <button 
                    onClick={handleLocalSandboxLogin}
                    className="w-full py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest border border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  >
                    <Cpu size={12} />
                    LAUNCH LOCAL SANDBOX
                  </button>
                </div>
              </div>

              {/* Channel 3: Sovereign Creator Passcode Bypass */}
              <div className="p-5 border border-brand-accent/20 bg-brand-accent/5 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-brand-accent/10 border border-brand-accent/30 rounded flex items-center justify-center">
                    <Key size={12} className="text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="font-mono text-[11px] font-bold text-slate-100 uppercase tracking-wider">
                      CHANNEL-03 • SOVEREIGN CREATOR PORTAL
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">DIRECT BYPASS FOR CHIEF ARCHITECT MGCINI SHAUN</p>
                  </div>
                </div>

                <form onSubmit={handleSovereignBypass} className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="password"
                      value={creatorCode}
                      onChange={(e) => setCreatorCode(e.target.value)}
                      placeholder="ENTER CREATOR SECURITY SEED..."
                      className="w-full bg-black/60 border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent px-3 py-2 font-mono text-xs text-brand-accent tracking-widest placeholder-slate-700 rounded transition-all outline-none"
                    />
                    {creatorCode.trim() === '123456789' && (
                      <span className="absolute right-3 top-2.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="px-5 bg-gradient-to-r from-brand-accent to-cyan-500 text-black font-mono font-bold text-[10px] uppercase tracking-wider hover:from-cyan-400 hover:to-brand-accent transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  >
                    <Unlock size={11} />
                    AUTHORIZE
                  </button>
                </form>
              </div>

            </div>

            {/* Footer Matrix Status Label */}
            <div className="px-6 py-3 border-t border-brand-border/40 bg-slate-950/80 flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Link Node: SECURE CONTEXT</span>
              <span className="text-brand-accent animate-pulse">● FREQUENCY LOCKED</span>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}
