import { spawn, execFile } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir, platform } from "node:os";

const BASE_DIR = join(homedir(), "DevTracker");

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
export function ensureProjectDirPublic(projectSlug?: string): string {
  return ensureProjectDir(projectSlug);
}

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
 * Execute a CLI AI tool in the background (long-running, e.g. sprint coding).
 * Returns the ChildProcess immediately. Calls onOutput/onClose callbacks.
 */
export function executeCliBackground(
  command: string,
  prompt: string,
  projectSlug: string,
  onOutput: (line: string) => void,
  onClose: (code: number | null, stderr: string) => void
): ReturnType<typeof spawn> {
  const cwd = ensureProjectDir(projectSlug);
  const args: string[] = [];

  // For background coding: use --print + --dangerously-skip-permissions so Claude creates files
  if (command === "claude") args.push("--print", "--dangerously-skip-permissions");
  else if (command === "codex") args.push("--quiet");

  const child = spawn(command, args, {
    cwd,
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 30 * 60 * 1000, // 30 minutes
    shell: platform() === "win32",
  });

  let stderr = "";

  child.stdout.on("data", (data: Buffer) => {
    const lines = data.toString().split("\n").filter(Boolean);
    for (const line of lines) {
      onOutput(line);
    }
  });
  child.stderr.on("data", (data: Buffer) => {
    stderr += data.toString();
    const lines = data.toString().split("\n").filter(Boolean);
    for (const line of lines) {
      onOutput(`[stderr] ${line}`);
    }
  });

  child.on("close", (code) => {
    saveExchange(command, prompt, { response: "(background job)", error: stderr || undefined, exitCode: code }, cwd);
    onClose(code, stderr);
  });

  child.on("error", (err) => {
    onClose(null, err.message);
  });

  child.stdin.write(prompt);
  child.stdin.end();

  return child;
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
      const result = {
        response: stdout.trim(),
        error: stderr.trim() || undefined,
        exitCode: code,
      };

      // Save exchange to documentation folder
      saveExchange(command, prompt, result, cwd);

      resolve(result);
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
 * Save a CLI exchange (prompt + response) as a Markdown file.
 */
function saveExchange(
  provider: string,
  prompt: string,
  result: { response: string; error?: string; exitCode: number | null },
  projectDir: string
) {
  try {
    const docsDir = join(projectDir, "documentation");
    if (!existsSync(docsDir)) {
      mkdirSync(docsDir, { recursive: true });
    }

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `${timestamp}_${provider}.md`;

    const content = [
      `# Échange CLI — ${provider}`,
      "",
      `> ${now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} à ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`,
      `> Exit code: ${result.exitCode}`,
      "",
      "---",
      "",
      "## Prompt",
      "",
      "```",
      prompt,
      "```",
      "",
      "## Réponse",
      "",
      result.response || "*(Pas de réponse)*",
      "",
      ...(result.error
        ? ["## Erreurs", "", "```", result.error, "```", ""]
        : []),
      "---",
      "",
      `*Généré automatiquement par DevTracker — provider: ${provider}*`,
      "",
    ].join("\n");

    writeFileSync(join(docsDir, filename), content, "utf-8");
  } catch {
    // Don't fail the response if saving fails
  }
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
