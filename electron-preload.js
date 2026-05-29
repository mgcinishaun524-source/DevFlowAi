const { contextBridge, ipcRenderer } = require('electron');

// Expose safe, selected functions to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  onCompanionStatus: (callback) => ipcRenderer.on('companion-status', (event, value) => callback(value))
});

console.log('[Neural Link] Preload script attached. Context Isolation fully online.');
