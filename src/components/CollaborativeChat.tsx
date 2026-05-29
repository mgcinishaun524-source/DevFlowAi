import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Terminal, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSocket, emitChatMessage, joinProject } from '../services/socketService';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  projectId: string;
  text: string;
  userId: string;
  displayName: string;
  timestamp: string;
  isAI?: boolean;
}

export default function CollaborativeChat({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();
    
    if (user) {
      joinProject(projectId, user.uid, user.displayName || 'Anonymous');
    }
    
    const handleMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on('chat-message-received', handleMessage);

    return () => {
      socket.off('chat-message-received', handleMessage);
    };
  }, [user, projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !user) return;
    
    // Create temporary message for local echo
    const tempId = `local-${Date.now()}`;
    const localMsg: Message = {
      id: tempId,
      projectId,
      text: input,
      userId: user.uid,
      displayName: user.displayName || 'Anonymous',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, localMsg]);
    emitChatMessage(projectId, input, user.uid, user.displayName || 'Anonymous');
    setInput('');
  };

  return (
    <div className="flex flex-col h-full glass-panel glow-border overflow-hidden">
      <div className="px-4 py-3 bg-brand-surface/60 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-brand-accent" />
          <span className="tech-label">Neural Team Sync: {projectId}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse delay-75" />
          <div className="w-1 h-1 rounded-full bg-brand-accent animate-pulse delay-150" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 transform -rotate-2">
            <Sparkles size={48} className="mb-4 text-brand-accent" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-center px-8">
              Neural channel quiet. Start transmission to sync with other nodes.
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => {
          const isMe = msg.userId === user?.uid;
          // Filter out duplicates that might come back from the server if we already have the local echo
          // We check if a later message with the same content/time exists, but for simple demo:
          const isDuplicate = messages.slice(0, i).some(m => !m.id.startsWith('local-') && m.text === msg.text && Math.abs(new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 2000);
          if (isDuplicate && msg.id.startsWith('local-')) return null;

          return (
            <div 
              key={msg.id || i} 
              className={cn(
                "flex flex-col space-y-1",
                isMe ? "items-end" : "items-start"
              )}
            >
              <div className="flex items-center gap-2 px-1">
                <span className="text-[8px] font-mono text-slate-500 uppercase">
                  {msg.displayName}
                </span>
                <span className="text-[6px] font-mono text-slate-700">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={cn(
                "max-w-[85%] px-3 py-2 rounded border font-mono text-[10px] leading-relaxed break-words",
                isMe 
                  ? "bg-brand-accent/10 border-brand-accent/50 text-brand-accent shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "bg-slate-900 border-brand-border text-slate-300"
              )}>
                {msg.text}
                {msg.id?.startsWith('local-') && (
                  <span className="ml-2 text-[6px] opacity-30 animate-pulse">Syncing...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-black/40 border-t border-brand-border">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="TYPE TRANSMISSION..."
            className="w-full bg-transparent border border-brand-border rounded px-3 py-2 text-[10px] font-mono text-brand-accent placeholder:text-slate-700 focus:outline-none focus:border-brand-accent/40"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-brand-accent hover:text-white transition-colors disabled:opacity-20"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
