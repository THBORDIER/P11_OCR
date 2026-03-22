import { spawn, execFile } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir, platform } from "node:os";

const BASE_DIR =
  platform() === "win32"
    ? join(process.env.PROGRAMFILES || "C:\\Program Files", "DevTracker")
    : join(homedir(), "DevTracker");

/**
 * Detect which CLI tools are installed on this machine.
 */
export async function detectProviders(): Promise<string[]> {
  const KNOWN = ["claude", "gemini", "codex"];
  const available: string[] = [];
  const which = platform() === "win32" ? "where" : "which";

  for (const cmd of KNOWN) {
    try {
      await new Promise<void>((resolve, reject) => {
        execFile(which, [cmd], (err) => (err ? reject(err) : resolve()));
      });
      available.push(cmd);
    } catch {
      // Not installed
    }
  }
  return available;
}

/**
 * Ensure the project directory exists and return its path.
 */
function ensureProjectDir(projectSlug?: string): string {
  if (!existsSync(BASE_DIR)) {
    mkdirSync(BASE_DIR, { recursive: true });
  }
  if (!projectSlug) return BASE_DIR;
  const safe = projectSlug.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safe) return BASE_DIR;
  const dir = join(BASE_DIR, safe);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Execute a CLI AI tool with a prompt via stdin.
 * Returns { response, error?, exitCode }.
 */
export function executeCliPrompt(
  command: string,
  prompt: string,
  projectSlug?: string,
  timeoutMs = 120_000
): Promise<{ response: string; error?: string; exitCode: number | null }> {
  return new Promise((resolve, reject) => {
    const cwd = ensureProjectDir(projectSlug);
    const args: string[] = [];

    // Provider-specific flags for single-shot mode
    if (command === "claude") args.push("--print");
    else if (command === "codex") args.push("--quiet");

    const child = spawn(command, args, {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: timeoutMs,
      shell: platform() === "win32",
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      resolve({
        response: stdout.trim(),
        error: stderr.trim() || undefined,
        exitCode: code,
      });
    });

    child.on("error", (err) => {
      reject(new Error(`Impossible d'exécuter "${command}" : ${err.message}`));
    });

    // Send prompt via stdin (avoids shell injection)
    child.stdin.write(prompt);
    child.stdin.end();
  });
}

/**
 * Check if we're running locally (can execute CLI) vs in serverless (Vercel).
 */
export function isLocalEnvironment(): boolean {
  // Vercel sets this env var
  if (process.env.VERCEL) return false;
  // AWS Lambda
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) return false;
  return true;
}
