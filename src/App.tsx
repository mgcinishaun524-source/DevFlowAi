/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import AIAssistant from './pages/AIAssistant';
import GitHubIntegration from './pages/GitHubIntegration';
import Analytics from './pages/Analytics';
import CodeEditor from './pages/CodeEditor';
import VSCodeLink from './pages/VSCodeLink';
import LandingPage from './pages/LandingPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-accent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'kanban': return <KanbanBoard />;
      case 'editor': return <CodeEditor />;
      case 'vscode': return <VSCodeLink />;
      case 'github': return <GitHubIntegration />;
      case 'ai': return <AIAssistant />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 cyber-grid">
          {renderContent()}
        </main>
        
        {/* System Status Bar */}
        <footer className="h-6 bg-brand-surface border-t border-brand-border flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-4">
            <span className="text-[8px] font-mono text-slate-500 uppercase">System: Operational</span>
            <span className="text-[8px] font-mono text-slate-500 uppercase">Latency: 12ms</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[8px] font-mono text-brand-accent uppercase">Dark Syntax Core v3.1.4</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

