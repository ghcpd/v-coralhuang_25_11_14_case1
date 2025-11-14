#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const platformLabel = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux",
};

const detectedOs = platformLabel[process.platform] ?? process.platform;
console.log(`Detected OS: ${detectedOs}`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const vitestBase = path.join(__dirname, "node_modules", ".bin");
const isWindows = process.platform === "win32";
const vitestBin = path.join(
  vitestBase,
  isWindows ? "vitest.cmd" : "vitest"
);

const args = ["run"];
const command = isWindows ? "cmd.exe" : vitestBin;
const finalArgs = isWindows ? ["/c", vitestBin, ...args] : args;

const child = spawn(command, finalArgs, {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
