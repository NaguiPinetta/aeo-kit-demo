#!/usr/bin/env node
/**
 * Proves the policy gate works: builds artifacts, removes the trust record
 * for a write/admin-intent tool, then runs `aeo check` which must exit non-zero.
 */
import { readFile, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const INTENTS_PATH = ".aeo/intents.json";
const TRUST_PATH = ".aeo/trust.json";

console.log("→ Building .aeo/ artifacts…");
execSync("npx aeo build --openapi ./openapi.yaml", { stdio: "inherit" });

const intents = JSON.parse(await readFile(INTENTS_PATH, "utf8"));
const writeIntent = intents.intents.find(
  (i) => i.intent === "write" || i.intent === "admin",
);
if (!writeIntent) {
  throw new Error(
    "Demo requires at least one tool with write or admin intent. " +
      "Expose a POST/PUT/PATCH/DELETE endpoint with x-aeo-expose: true.",
  );
}

const targetId = writeIntent.id;
console.log(`→ Removing trust record for: ${targetId}`);

const trust = JSON.parse(await readFile(TRUST_PATH, "utf8"));
trust.trust = trust.trust.filter((t) => t.id !== targetId);
await writeFile(TRUST_PATH, JSON.stringify(trust, null, 2) + "\n");

console.log("→ Running aeo check (expecting failure)…");
try {
  execSync("npx aeo check", { stdio: "inherit" });
  throw new Error("Expected policy check to fail but it passed");
} catch (err) {
  if (err.status && err.status !== 0) {
    console.log(`✓ aeo check exited ${err.status} — policy gate works.`);
    process.exit(0);
  }
  throw err;
}
