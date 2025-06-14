// scripts/validate-api-structure.ts
import fs from "fs";
import path from "path";
import glob from "fast-glob";

const BASE_DIR = path.resolve(__dirname, "../app/api");
const validPattern = /app\/api\/client\/\[email\]\/[^\/]+\/route\.ts$/;

const routeFiles = glob.sync(`${BASE_DIR}/**/route.ts`, { dot: true });
const invalidFiles = routeFiles.filter((file) => {
  const normalized = file.replace(/\\/g, "/");
  return !validPattern.test(normalized);
});

if (invalidFiles.length > 0) {
  console.error("\n❌ Invalid route locations detected. The following files are NOT inside /client/[email]/:\n");
  invalidFiles.forEach((file) => console.error(" -", file));
  console.error("\n➡️  Move them to the correct directory structure (e.g., /app/api/client/[email]/coaching/route.ts)\n");
  process.exit(1);
} else {
  console.log("✅ All route.ts files are in valid locations.");
}
