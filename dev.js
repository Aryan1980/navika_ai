// Cross-platform concurrent runner for NavikaAI Backend & Frontend
const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';

console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');
console.log('\x1b[36m%s\x1b[0m', '  Starting NavikaAI Marine Intelligence Platform...   ');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');

// 1. Launch FastAPI Backend (prioritizing local venv)
const fs = require('fs');
const venvPython = isWindows 
  ? path.join(__dirname, 'venv', 'Scripts', 'python.exe')
  : path.join(__dirname, 'venv', 'bin', 'python');
const backendCmd = fs.existsSync(venvPython) ? venvPython : 'python';
const backendArgs = ['-m', 'uvicorn', 'app.main:app', '--app-dir', 'backend', '--host', '127.0.0.1', '--port', '8000', '--reload'];

console.log('\x1b[34m[BACKEND]\x1b[0m Launching FastAPI on http://127.0.0.1:8000 ...');
const backend = isWindows
  ? spawn(`"${backendCmd}" -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload`, {
      shell: true,
      cwd: __dirname,
      env: process.env
    })
  : spawn(backendCmd, backendArgs, {
      shell: false,
      cwd: __dirname,
      env: process.env
    });

backend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[34m[BACKEND]\x1b[0m ${data.toString()}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[34m[BACKEND]\x1b[0m ${data.toString()}`);
});

backend.on('error', (err) => {
  console.warn(`\x1b[33m[BACKEND WARN]\x1b[0m Failed to start backend via python: ${err.message}. Frontend will use calibrated local marine fallback.`);
});

// 2. Launch Vite Frontend
console.log('\x1b[32m[FRONTEND]\x1b[0m Launching Vite Dev Server on http://localhost:5173 ...');
const frontendCmd = isWindows ? 'npm.cmd' : 'npm';
const frontendArgs = ['run', 'dev'];

const frontend = spawn(frontendCmd, frontendArgs, {
  shell: isWindows,
  cwd: path.join(__dirname, 'frontend'),
  env: process.env
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[32m[FRONTEND]\x1b[0m ${data.toString()}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[32m[FRONTEND]\x1b[0m ${data.toString()}`);
});

function cleanup() {
  console.log('\nStopping NavikaAI services...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
