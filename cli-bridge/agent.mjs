#!/usr/bin/env node

/**
 * DevTracker CLI Bridge Agent
 *
 * Lightweight local HTTP server that executes CLI AI tools
 * (claude, gemini, codex) and returns their output.
 *
 * Usage:
 *   export BRIDGE_TOKEN="your-secret"   # optional
 *   node cli-bridge/agent.mjs
 *
 * Environment variables:
 *   PORT          - HTTP port (default: 3939)
 *   BRIDGE_TOKEN  - Bearer token for auth (optional)
 *   BASE_DIR      - Base directory for project folders
 *                   (default: ~/DevTracker on Linux/Mac,
 *                    C:\Program Files\DevTracker on Windows)
 */

import { createServer } from "node:http";
import { execFile, spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir, platform } from "node:os";

const PORT = parseInt(process.env.PORT || "3939", 10);
const TOKEN = process.env.BRIDGE_TOKEN || "";
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://p11-ocr.vercel.app",
];

// Base directory for project folders
const BASE_DIR =
  process.env.BASE_DIR ||
  (platform() === "win32"
    ? join(process.env.PROGRAMFILES || "C:\\Program Files", "DevTracker")
    : join(homedir(), "DevTracker"));

// ── Rate limiting ──────────────────────────────────────────
const requests = new Map();
function checkRate(ip, max = 10, windowMs = 60000) {
  const now = Date.now();
  const timestamps = (requests.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= max) return false;
  timestamps.push(now);
  requests.set(ip, timestamps);
  return true;
}

// ── Detect available CLI tools ─────────────────────────────
const KNOWN_PROVIDERS = ["claude", "gemini", "codex"];

async function detectProviders() {
  const available = [];
  for (const cmd of KNOWN_PROVIDERS) {
    try {
      const which = platform() === "win32" ? "where" : "which";
      await new Promise((resolve, reject) => {
        execFile(which, [cmd], (err) => (err ? reject(err) : resolve(true)));
      });
      available.push(cmd);
    } catch {
      // Not installed
    }
  }
  return available;
}

// ── Execute a CLI prompt ───────────────────────────────────
function executePrompt(command, prompt, cwd, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const args = [];

    // Provider-specific flags for single-shot mode
    if (command === "claude") {
      args.push("--print");
    } else if (command === "codex") {
      args.push("--quiet");
    }

    const child = spawn(command, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: timeoutMs,
      shell: platform() === "win32",
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      resolve({ response: stdout.trim(), error: stderr.trim() || undefined, exitCode: code });
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to execute ${command}: ${err.message}`));
    });

    // Send prompt via stdin
    child.stdin.write(prompt);
    child.stdin.end();
  });
}

// ── Ensure project directory exists ────────────────────────
function ensureProjectDir(projectSlug) {
  if (!projectSlug) return BASE_DIR;
  // Sanitize slug
  const safe = projectSlug.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safe) return BASE_DIR;
  const dir = join(BASE_DIR, safe);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created project directory: ${dir}`);
  }
  return dir;
}

// ── HTTP Server ────────────────────────────────────────────
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

const server = createServer(async (req, res) => {
  // CORS
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Auth check
  if (TOKEN) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${TOKEN}`) {
      return sendJson(res, 401, { error: "Invalid or missing token" });
    }
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";
  if (!checkRate(ip)) {
    return sendJson(res, 429, { error: "Rate limit exceeded" });
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  try {
    // ── GET /health ──
    if (req.method === "GET" && url.pathname === "/health") {
      const providers = await detectProviders();
      return sendJson(res, 200, {
        status: "ok",
        version: "1.0.0",
        baseDir: BASE_DIR,
        providers,
      });
    }

    // ── GET /providers ──
    if (req.method === "GET" && url.pathname === "/providers") {
      const providers = await detectProviders();
      return sendJson(res, 200, { providers });
    }

    // ── POST /execute ──
    if (req.method === "POST" && url.pathname === "/execute") {
      const body = await parseBody(req);
      const { provider, prompt, projectSlug } = body;

      if (!provider || typeof provider !== "string") {
        return sendJson(res, 400, { error: "provider is required" });
      }
      if (!prompt || typeof prompt !== "string") {
        return sendJson(res, 400, { error: "prompt is required" });
      }

      // Verify provider is available
      const available = await detectProviders();
      if (!available.includes(provider)) {
        return sendJson(res, 400, {
          error: `Provider "${provider}" not found. Available: ${available.join(", ") || "none"}. Install it first.`,
        });
      }

      // Ensure project directory
      const cwd = ensureProjectDir(projectSlug);

      console.log(`[${new Date().toISOString()}] Executing: ${provider} in ${cwd}`);
      console.log(`  Prompt: ${prompt.slice(0, 100)}${prompt.length > 100 ? "..." : ""}`);

      const result = await executePrompt(provider, prompt, cwd);

      console.log(`  Exit code: ${result.exitCode}`);
      console.log(`  Response: ${(result.response || "").slice(0, 100)}...`);

      return sendJson(res, 200, result);
    }

    // ── 404 ──
    sendJson(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("Error:", err);
    sendJson(res, 500, { error: err.message || "Internal error" });
  }
});

// ── Start ──────────────────────────────────────────────────
// Ensure base directory
if (!existsSync(BASE_DIR)) {
  mkdirSync(BASE_DIR, { recursive: true });
  console.log(`Created base directory: ${BASE_DIR}`);
}

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   DevTracker CLI Bridge Agent v1.0.0     ║
╠══════════════════════════════════════════╣
║  Port:      ${String(PORT).padEnd(28)}║
║  Base dir:  ${BASE_DIR.slice(0, 28).padEnd(28)}║
║  Auth:      ${(TOKEN ? "Token required" : "No token (open)").padEnd(28)}║
╚══════════════════════════════════════════╝
  `);

  detectProviders().then((providers) => {
    if (providers.length) {
      console.log(`Detected CLI tools: ${providers.join(", ")}`);
    } else {
      console.log("No CLI tools detected. Install claude, gemini, or codex.");
    }
    console.log("\nReady for requests.\n");
  });
});
