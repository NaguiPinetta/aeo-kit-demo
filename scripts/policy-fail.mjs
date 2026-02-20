#!/usr/bin/env node
/**
 * Proves the policy gate fires: removes a write/admin tool's trust record,
 * runs `aeo check --format json`, and asserts it fails.
 * Always restores the original trust.json via a finally block.
 */
import { readFileSync, writeFileSync, copyFileSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";

const INTENTS_PATH = ".aeo/intents.json";
const TRUST_PATH = ".aeo/trust.json";
const TRUST_BAK = ".aeo/trust.json.bak";

const intents = JSON.parse(readFileSync(INTENTS_PATH, "utf8"));
const writeIntent = intents.intents.find(
  (i) => i.intent === "write" || i.intent === "admin",
);
if (!writeIntent) {
  throw new Error(
    "Demo requires at least one tool with write or admin intent. " +
      "Expose a POST/PUT/PATCH/DELETE endpoint with x-aeo-expose: true.",
  );
}

const targetId = writeIntent.id ?? writeIntent.toolId;

copyFileSync(TRUST_PATH, TRUST_BAK);

try {
  console.log(`→ Removing trust record for: ${targetId}`);
  const trust = JSON.parse(readFileSync(TRUST_PATH, "utf8"));
  trust.trust = trust.trust.filter(
    (t) => (t.id ?? t.toolId) !== targetId,
  );
  writeFileSync(TRUST_PATH, JSON.stringify(trust, null, 2) + "\n");

  console.log("→ Running aeo check (expecting failure)…");
  const result = spawnSync("npx", ["aeo", "check", "--format", "json"], {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "inherit"],
  });

  const out = result.stdout ?? "";
  let report;
  try {
    report = JSON.parse(out);
  } catch {
    // Non-JSON output with non-zero exit is still a valid failure
    if (result.status !== 0) {
      console.log(`✓ aeo check exited ${result.status} — policy gate works.`);
      console.log("expected failure ✅");
      process.exit(0);
    }
    throw new Error("aeo check returned invalid JSON and exited 0");
  }

  if (result.status === 0 && report.ok === true) {
    throw new Error("Expected policy check to fail but it passed");
  }

  console.log(`✓ aeo check exited ${result.status} — policy gate works.`);
  console.log(JSON.stringify(report, null, 2));
  console.log("expected failure ✅");
} finally {
  copyFileSync(TRUST_BAK, TRUST_PATH);
  try { unlinkSync(TRUST_BAK); } catch {}
}
