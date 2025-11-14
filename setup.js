const { execSync } = require("child_process");

console.log("Running npm install to prepare the project...");

try {
  execSync("npm install", {
    stdio: "inherit",
    shell: true,
  });
} catch (error) {
  console.error("npm install failed", error);
  process.exit(error.status || 1);
}
