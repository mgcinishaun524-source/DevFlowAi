const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let splashWindow;
let companionProcess = null;
const PORT = process.env.PORT || 3000;
const IS_DEV = process.env.NODE_ENV === 'development' || !app.isPackaged;

console.log(`[Neural Link] Bootstrapping DevFlow AI Desktop Environment. Mode: ${IS_DEV ? 'DEV' : 'PROD'}`);

// 1. Spawns the Companion Express Server
function startCompanionProcess() {
  console.log(`[Neural Link] Initiating companion background process on port ${PORT}...`);
  
  if (IS_DEV) {
    // In development, spawn the server using "npm run dev" to avoid npx package install prompts
    // Set environment variable to make sure port is correct
    companionProcess = spawn('npm', ['run', 'dev'], {
      shell: true,
      env: { ...process.env, PORT: PORT, NODE_ENV: 'development' }
    });
  } else {
    // In production (built app), run the compiled bundle or node app
    // Depending on bundling strategy, usually "node dist/server.cjs"
    companionProcess = spawn('node', [path.join(__dirname, 'dist', 'server.cjs')], {
      shell: true,
      env: { ...process.env, PORT: PORT, NODE_ENV: 'production' }
    });
  }

  companionProcess.stdout.on('data', (data) => {
    console.log(`[Companion Server stdout]: ${data.toString().trim()}`);
  });

  companionProcess.stderr.on('data', (data) => {
    console.error(`[Companion Server stderr]: ${data.toString().trim()}`);
  });

  companionProcess.on('close', (code) => {
    console.log(`[Companion Server] Terminated with exit code ${code}`);
    companionProcess = null;
    if (mainWindow) {
      mainWindow.webContents.send('companion-status', 'offline');
    }
  });
}

// 2. Poll the companion server's health endpoint until it is ready
function pingServerAndLaunch(url, callback, maxAttempts = 30) {
  let attempts = 0;
  
  const ping = () => {
    attempts++;
    console.log(`[Neural Link] Pinging neural core core... Wave ${attempts}/${maxAttempts}`);
    
    http.get(`${url}/api/health`, (res) => {
      if (res.statusCode === 200) {
        console.log('[Neural Link] Neural Core Link established successfully!');
        callback(true);
      } else {
        retry();
      }
    }).on('error', () => {
      retry();
    });
  };

  const retry = () => {
    if (attempts < maxAttempts) {
      setTimeout(ping, 1000);
    } else {
      console.error('[Neural Link] EXCEEDED MAX RETRY CAPACITY. Companion process unresponsive.');
      callback(false);
    }
  };

  setTimeout(ping, 1000); // Wait 1s before first ping
}

// 3. Create Splash Window for loading transition matching Cyberpunk visual style
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Inject a high-density, cybersecurity-themed HTML splash directly
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          background: #020617;
          color: #06b6d4;
          font-family: 'Courier New', Courier, monospace;
          margin: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          border: 1px solid #06b6d440;
          box-shadow: inset 0 0 30px rgba(6, 182, 212, 0.2), 0 0 30px rgba(6, 182, 212, 0.3);
          overflow: hidden;
        }
        .container {
          text-align: center;
          padding: 20px;
        }
        .logo-box {
          font-size: 40px;
          font-weight: bold;
          text-shadow: 0 0 15px #06b6d4;
          margin-bottom: 5px;
          letter-spacing: -2px;
        }
        .subtitle {
          font-size: 9px;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 4px;
          margin-bottom: 40px;
        }
        .loader-bar {
          width: 250px;
          height: 3px;
          background: #022c22;
          overflow: hidden;
          position: relative;
          border-radius: 2px;
        }
        .loader-progress {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #06b6d4;
          width: 40%;
          border-radius: 2px;
          animation: loading 1.5s infinite ease-in-out;
          box-shadow: 0 0 10px #06b6d4;
        }
        .status-text {
          font-size: 8px;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 2px;
          margin-top: 15px;
          animation: blink 1s infinite alternate;
        }
        @keyframes loading {
          0% { left: -40%; width: 30%; }
          50% { width: 45%; }
          100% { left: 110%; width: 20%; }
        }
        @keyframes blink {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-box">DEVFLOW AI</div>
        <div class="subtitle">Neural Command Center</div>
        <div class="loader-bar">
          <div class="loader-progress"></div>
        </div>
        <div class="status-text">CONNECTING UPLINK CHANNEL...</div>
      </div>
    </body>
    </html>
  `;
  
  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
}

// 4. Create Main App Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false, // Don't show until ready
    backgroundColor: '#020617',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.js')
    }
  });

  // Open external links in default system browser instead of Electron app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Navigate to local port hosted by companion server
  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.close();
      splashWindow = null;
    }
    mainWindow.show();
    mainWindow.maximize();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron Lifecycle Handlers
app.whenReady().then(() => {
  createSplashWindow();
  startCompanionProcess();
  
  pingServerAndLaunch(`http://localhost:${PORT}`, (success) => {
    if (success) {
      createMainWindow();
    } else {
      app.quit();
    }
  });
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// Terminate companion process cleanly when exiting
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (companionProcess) {
    console.log('[Neural Link] Terminating companion background process cleanly...');
    // Kill the spawned process tree
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', companionProcess.pid, '/f', '/t']);
      } else {
        companionProcess.kill('SIGINT');
      }
    } catch (e) {
      console.error('[Neural Link] FAILED TO TERMINATE COMPANION CHILD PROCESS TREE:', e);
    }
  }
});
