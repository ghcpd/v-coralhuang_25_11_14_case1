const { spawn } = require("child_process");
const os = require("os");

const platform = os.platform();
const friendlyName = {
  darwin: "macOS",
  win32: "Windows",
  linux: "Linux",
}[platform] || platform;

console.log(`Detected OS: ${friendlyName}`);

const runner = spawn(process.execPath, ["tests/ui.spec.js"], {
  stdio: "inherit",
});

runner.on("close", (code) => {
  process.exit(code);
});
