# -*- coding: utf-8 -*-
"""
DevFlow AI - Desktop Core Interface
Neural Command Center // Cyberpunk Companion Launcher
A lightweight Python Native Webview Wrapper & Process Manager
"""

import os
import sys
import time
import traceback
import ctypes

# ==============================================================================
# GLOBAL DEBUG LOGGER
# ==============================================================================
# Resolves the directory where the binary or script is executing
if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    EXEC_DIR = os.path.dirname(sys.executable)
else:
    EXEC_DIR = os.path.dirname(os.path.abspath(__file__))

LOG_PATH = os.path.join(EXEC_DIR, "devflow_debug_log.txt")

def log_system(msg):
    try:
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(f"[{timestamp}] {msg}\n")
    except Exception:
        pass

# Initialize fresh log session
try:
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        f.write("="*80 + "\n")
        f.write(f"DEVFLOW AI - SYSTEM UP - {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Platform: {sys.platform}\n")
        f.write(f"Python Executable: {sys.executable}\n")
        f.write(f"Frozen: {getattr(sys, 'frozen', False)}\n")
        f.write(f"Exec Dir: {EXEC_DIR}\n")
        if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
            f.write(f"Bundle Temp Dir MEIPASS: {sys._MEIPASS}\n")
        f.write("="*80 + "\n")
except Exception:
    pass

# ==============================================================================
# UNCAUGHT EXCEPTION TRACKER & NATIVE ERROR DIALOGS
# ==============================================================================
# This ensures that any crash (such as missing libraries or startup exceptions) 
# is written to a persistent log file and shown in a clear, native Windows error modal.
def global_excepthook(exctype, value, tb):
    tb_text = "".join(traceback.format_exception(exctype, value, tb))
    log_system(f"CRITICAL CRASH EXCEPTION:\n{tb_text}")
    
    msg = f"DevFlow AI Core Exception Alert:\n\n{value}\n\nTraceback has been persisted to devflow_debug_log.txt inside your application folder."
    
    if os.name == 'nt':
        try:
            ctypes.windll.user32.MessageBoxW(0, msg, "DevFlow AI - System Error", 0x10) # 0x10 = MB_ICONERROR
        except Exception:
            pass
            
    try:
        sys.__excepthook__(exctype, value, tb)
    except Exception:
        pass
    sys.exit(1)

sys.excepthook = global_excepthook

# ==============================================================================
# WINDOWS UNICODE & TERM ENCODING COMPATIBILITY LAYER
# ==============================================================================
# Protects against console encodings (e.g. cp1252/charmap) falling over UTF-8 blocks
if sys.stdout is not None:
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

if sys.stderr is not None:
    try:
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Fallback print utility to guarantee execution even with restrictive Windows terminals
_original_print = print
def safe_print(*args, **kwargs):
    try:
        _original_print(*args, **kwargs)
    except UnicodeEncodeError:
        # Replace non-ASCII symbols with fallback placeholders
        safe_args = []
        for arg in args:
            if isinstance(arg, str):
                safe_args.append(arg.encode('ascii', errors='replace').decode('ascii'))
            else:
                safe_args.append(arg)
        try:
            _original_print(*safe_args, **kwargs)
        except Exception:
            pass
    except Exception:
        # Prevent failure in strict GUI windowed environments where standard streams are closed
        pass

print = safe_print

log_system("System hooks configured. Importing additional core dependencies...")

try:
    import subprocess
    import urllib.request
    import urllib.error
    import threading
    import signal
    log_system("Standard libraries imported successfully.")
except Exception as e:
    log_system(f"Failed to import standard lib: {e}")
    raise

try:
    import webview
    log_system("pywebview imported successfully.")
except Exception as e:
    log_system(f"CRITICAL: Failed to import pywebview: {e}")
    raise

PORT = 3000

# Locate project root directory or PyInstaller temporary bundle directory
if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
    PROJECT_DIR = sys._MEIPASS
else:
    PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

IS_DEV = '--dev' in sys.argv or not os.path.exists(os.path.join(PROJECT_DIR, 'dist', 'server.cjs'))
COMPANION_PROCESS = None

print("""
\033[96m
██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██╗    ██╗    █████╗ ██╗
██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██║    ██║   ██╔══██╗██║
██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██║ █╗ ██║   ███████║██║
██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██║███╗██║   ██╔══██║██║
██████╔╝███████╗ ╚████╔╝ ██║     ███████╗╚██████╔╝╚███╔███╔╝   ██║  ██║██║
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝    ╚═╝  ╚═╝╚═╝
\033[93m               NEURAL COMMAND CENTER // ARCHITECT: MGCINI SHAUN\033[0m
""")

def start_companion_server():
    global COMPANION_PROCESS
    
    # Locate project root directory
    project_dir = PROJECT_DIR
    log_system(f"Initiating server in project directory: {project_dir}")
    print(f"\033[90m[System Core] Project directory identified: {project_dir}\033[0m")
    
    env = os.environ.copy()
    env["PORT"] = str(PORT)
    env["NODE_ENV"] = "development" if IS_DEV else "production"
    
    # Locate execution folder of binary vs project directory
    exec_dir = EXEC_DIR
    
    # Crawl up parent folders to resolve potential parent node_modules paths
    node_modules_dirs = []
    current_dir = exec_dir
    for _ in range(4):
        nm_path = os.path.join(current_dir, "node_modules")
        if os.path.isdir(nm_path):
            node_modules_dirs.append(nm_path)
        current_dir = os.path.dirname(current_dir)
        
    if node_modules_dirs:
        sep = ';' if os.name == 'nt' else ':'
        existing_node_path = env.get("NODE_PATH", "")
        if existing_node_path:
            env["NODE_PATH"] = existing_node_path + sep + sep.join(node_modules_dirs)
        else:
            env["NODE_PATH"] = sep.join(node_modules_dirs)
        log_system(f"Injected NODE_PATH paths: {env['NODE_PATH']}")
        print(f"[System Core] Injected external resolver routes (NODE_PATH): {env['NODE_PATH']}")
    
    if IS_DEV:
        log_system("Mode: Development. Spawning dev core using npm run dev...")
        print(f"\033[95m[Neural Link Master] Spawning dev core using local scripts (npm run dev)\033[0m")
        # Run local script to bypass non-interactive prompt blocks and utilize pre-configured node context
        cmd = ["npm", "run", "dev"]
    else:
        compiled_server = os.path.join(project_dir, "dist", "server.cjs")
        log_system(f"Mode: Production. Resolving server entry: {compiled_server}")
        print(f"\033[92m[Neural Link Master] Spawning compiled production core: {compiled_server}\033[0m")
        if not os.path.exists(compiled_server):
            log_system(f"CRITICAL ERROR: server.cjs does not exist at {compiled_server}")
            raise FileNotFoundError(f"Missing production server build file: {compiled_server}")
        # Run node dist/server.cjs
        cmd = ["node", compiled_server]
        
    log_system(f"Full command to dispatch: {cmd}")
    try:
        # suppressed console window creation for Windows windowed apps
        creation_flags = 0
        if os.name == 'nt':
            creation_flags = 0x08000000  # CREATE_NO_WINDOW
            
        COMPANION_PROCESS = subprocess.Popen(
            cmd,
            cwd=project_dir,
            env=env,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True if (os.name == 'nt' and IS_DEV) else False, # Use shell=True for dev scripts, False for node base binaries
            creationflags=creation_flags
        )
        
        log_system(f"Subprocess successfully created with PID {COMPANION_PROCESS.pid}")
        # Start logging output asynchronously to keep user terminal informed
        threading.Thread(target=log_subprocess_output, daemon=True).start()
        
    except Exception as e:
        log_system(f"CRITICAL ERROR: Failed to initiate subprocess: {e}")
        print(f"\033[91m[CRITICAL ERR] FAILED TO INITIATE CORE SUBPROCESS TRUNK: {e}\033[0m")
        raise e # Let sys.excepthook handle and pop a Windows error dialog with traceback


def log_subprocess_output():
    global COMPANION_PROCESS
    if not COMPANION_PROCESS:
        return
        
    def stream_reader(pipe, prefix, is_error=False):
        try:
            for line in iter(pipe.readline, ''):
                if not line:
                    break
                cleaned = line.strip()
                log_system(f"[{prefix}] {cleaned}")
                if not is_error:
                    print(f"\033[90m[{prefix}] {cleaned}\033[0m")
                else:
                    print(f"\033[91m[{prefix}] {cleaned}\033[0m")
        except Exception as e:
            log_system(f"Error reading stream ({prefix}): {e}")

    # Spawn separate reader threads to bypass pipelining deadlock
    t_out = threading.Thread(target=stream_reader, args=(COMPANION_PROCESS.stdout, "Server Output", False), daemon=True)
    t_err = threading.Thread(target=stream_reader, args=(COMPANION_PROCESS.stderr, "Server SysErr", True), daemon=True)
    t_out.start()
    t_err.start()


def wait_for_server_health(url, timeout=45):
    print(f"\033[93m[Neural Link] Calibrating frequency on: {url}\033[0m")
    log_system(f"Starting connection calibration on: {url}")
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            # We ping the Express health API route. Expects 200 OK
            response = urllib.request.urlopen(f"{url}/api/health", timeout=1.5)
            if response.getcode() == 200:
                print("\033[92m[Neural Link] UPLINK ONLINE! Neural logic synchrony established.\033[0m")
                log_system("Calibration established successfully.")
                return True
        except Exception as e:
            # Server is still launching
            time.sleep(1.0)
            log_system(f"Calibration pending... Response trace: {e}")
            print("\033[90m[Neural Link] Tuning receiver wave... Connection pending...\033[0m")
            
    log_system("Calibration failed (timeout).")
    return False


def terminate_companion():
    global COMPANION_PROCESS
    if COMPANION_PROCESS:
        print("\033[93m[Neural Link] Cutting sync channels. De-allocating companion container...\033[0m")
        log_system("Terminating companion server core...")
        try:
            if os.name == 'nt':
                # Windows taskkill cleans the child process tree completely
                subprocess.run(f"taskkill /F /T /PID {COMPANION_PROCESS.pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                COMPANION_PROCESS.terminate()
                COMPANION_PROCESS.wait(timeout=2.0)
            print("\033[92m[Neural Link] Server core isolated and safely shutdown.\033[0m")
            log_system("Companion server core shutdown success.")
        except Exception as e:
            print(f"\033[91m[Neural Link Warning] Core socket release force-terminated: {e}\033[0m")
            log_system(f"Companion socket release returned error: {e}")


def on_closed():
    # Trigger shutdown when WebView is closed
    terminate_companion()


if __name__ == "__main__":
    log_system("Bootstrap trigger active.")
    # 1. Spawn backend server
    start_companion_server()
    
    # 2. Wait until connection is verified
    server_url = f"http://localhost:{PORT}"
    if not wait_for_server_health(server_url):
        print("\033[91m[Sync Timeout] UNABLE TO BRIDGE TO NEURAL CORE PORT. Shutting down.\033[0m")
        log_system("Bootstrap failed due to connection timeout.")
        terminate_companion()
        sys.exit(1)
        
    # 3. Open beautiful OS native hardware-accelerated viewport
    log_system("Mounting layout UI.")
    print("\033[96m[Engine Launch] Mounting Holographic UI container.\033[0m")
    
    window = webview.create_window(
        title="DevFlow AI - Neural Command Center",
        url=server_url,
        width=1400,
        height=900,
        background_color="#020617" # Matches brand-bg/dark slate
    )
    
    # Listen to window close event to clean up Node process
    window.events.closed += on_closed
    
    # Start webview loop (this blocks until window is closed)
    log_system("Launching browser container engine.")
    webview.start()
    log_system("Engine stopped. Isolated.")
