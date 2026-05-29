import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Save, Play, Settings, FileCode } from 'lucide-react';

export default function CodeEditor() {
  const [code, setCode] = useState('// Start coding in DevFlow AI\n\nfunction helloWorld() {\n  console.log("Hello from DevFlow AI!");\n}\n\nhelloWorld();');
  const [language, setLanguage] = useState('javascript');

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: 'js' },
    { value: 'typescript', label: 'TypeScript', ext: 'ts' },
    { value: 'python', label: 'Python', ext: 'py' },
    { value: 'java', label: 'Java', ext: 'java' },
    { value: 'cpp', label: 'C++', ext: 'cpp' },
    { value: 'csharp', label: 'C#', ext: 'cs' },
    { value: 'go', label: 'Go', ext: 'go' },
    { value: 'rust', label: 'Rust', ext: 'rs' },
    { value: 'php', label: 'PHP', ext: 'php' },
    { value: 'ruby', label: 'Ruby', ext: 'rb' },
    { value: 'swift', label: 'Swift', ext: 'swift' },
    { value: 'kotlin', label: 'Kotlin', ext: 'kt' },
    { value: 'sql', label: 'SQL', ext: 'sql' },
    { value: 'html', label: 'HTML', ext: 'html' },
    { value: 'css', label: 'CSS', ext: 'css' },
    { value: 'json', label: 'JSON', ext: 'json' },
    { value: 'yaml', label: 'YAML', ext: 'yaml' },
    { value: 'markdown', label: 'Markdown', ext: 'md' },
    { value: 'shell', label: 'Shell', ext: 'sh' },
  ];

  const currentExt = languages.find(l => l.value === language)?.ext || 'txt';

  return (
    <div className="h-full flex flex-col space-y-4 cyber-grid">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-mono font-bold text-brand-accent uppercase tracking-tighter flex items-center gap-3">
            <FileCode className="text-brand-accent" />
            Cloud Terminal
          </h2>
          <p className="tech-label">Neural environment for rapid prototyping and execution.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-[10px] font-mono uppercase tracking-widest bg-black/40 border border-brand-border text-brand-accent rounded px-3 py-2 outline-none focus:border-brand-accent/50 transition-all custom-scrollbar"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value} className="bg-brand-surface">{lang.label}</option>
            ))}
          </select>
          <button className="tech-button flex items-center gap-2">
            <Save size={14} />
            Sync
          </button>
          <button className="tech-button flex items-center gap-2 bg-brand-accent/20 border-brand-accent text-brand-accent">
            <Play size={14} />
            Execute
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel overflow-hidden flex flex-col glow-border">
        <div className="px-4 py-2 bg-brand-surface/60 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
            <span className="ml-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">main.{currentExt}</span>
          </div>
          <Settings size={14} className="text-slate-600 cursor-pointer hover:text-brand-accent transition-colors" />
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: 'JetBrains Mono',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 }
            }}
          />
        </div>
      </div>
    </div>
  );
}
