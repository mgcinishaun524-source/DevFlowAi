# DevFlow AI - Mission Protocol

## Project Identity
**DevFlow AI** is a high-performance "Neural Command Center" for software engineers. It follows a tactical, cyberpunk-inspired aesthetic characterized by high-density interfaces, mono-spaced typography, and vibrant secondary accents (primarily cyan/brand-accent).

## Visual Guidelines
- **Theme**: Dark mode by default (`brand-bg`).
- **Accent Color**: Cyan (`brand-accent`) with glow effects (`shadow-[0_0_20px_rgba(6,182,212,0.4)]`).
- **Typography**: Heavy use of `font-mono` for technical feel and uppercase tracking for labels.
- **Components**: Glass-panel effects, glow borders, and tactical labels (e.g., "SYSTEM CORE ONLINE").
- **Animations**: Subtle `motion/react` transitions and pulse effects on status indicators.

## Architecture
- **Framework**: React 18+ with Vite.
- **Styling**: Tailwind CSS.
- **Database**: Firebase Firestore (Enterprise Edition).
- **Authentication**: Firebase Google Auth.
- **AI Integration**: Server-side Gemini API (via `server.ts`).
- **PWA**: PWA-ready with `manifest.json` and service worker (`sw.js`).
- **Deployment**: Configured for Netlify (includes `_redirects` and `netlify.toml`).

## Core Features
1. **Command Center (Dashboard)**: Real-time system monitoring and activity logs.
2. **Execution Kanban**: Mission-critical task management.
3. **Source Matrix**: GitHub repository analytics and velocity tracking.
4. **Dark Syntax AI**: Context-aware, aggressive coding intelligence using Gemini.
5. **Universal Terminal**: Cloud-based code execution sandbox.
6. **VS Code Connect**: Tactical bridge for local environment syncing.

## Deployment Notes
- Ensure `firebase-applet-config.json` is included in external builds.
- Always handle `TypeError` issues with optional chaining (`?.`) specifically in filters and mapping functions as seen in previous iterations.
