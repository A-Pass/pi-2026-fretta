import { spawn } from "node:child_process";
import { constants as osConstants } from "node:os";
import { dirname, resolve } from "node:path";
import process, { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");

if (process.env.ENV_FILE) {
  loadEnvFile(process.env.ENV_FILE);
}

if (process.getuid() === 0) {
  process.setgroups([]);
  process.setgid(65532);
  process.setuid(65532);
}

function runNodeScript(scriptPath, args) {
  const child = spawn(
    process.execPath,
    [resolve(appDirectory, scriptPath), ...args],
    {
      cwd: appDirectory,
      env: process.env,
      stdio: "inherit",
    },
  );

  return new Promise((resolveExitCode, reject) => {
    let receivedSignal;
    const signalHandlers = new Map(
      ["SIGINT", "SIGTERM"].map((signal) => [
        signal,
        () => {
          receivedSignal = signal;
          child.kill(signal);
        },
      ]),
    );

    for (const [signal, handler] of signalHandlers) {
      process.once(signal, handler);
    }

    const cleanup = () => {
      for (const [signal, handler] of signalHandlers) {
        process.off(signal, handler);
      }
    };

    child.once("error", (error) => {
      cleanup();
      reject(error);
    });

    child.once("exit", (code, signal) => {
      cleanup();
      const exitSignal = receivedSignal ?? signal;
      resolveExitCode(
        exitSignal
          ? 128 + (osConstants.signals[exitSignal] ?? 1)
          : (code ?? 1),
      );
    });
  });
}

const migrationExitCode = await runNodeScript(
  "node_modules/prisma/build/index.js",
  ["migrate", "deploy"],
);

process.exitCode =
  migrationExitCode === 0
    ? await runNodeScript(".next/standalone/server.js", [])
    : migrationExitCode;
