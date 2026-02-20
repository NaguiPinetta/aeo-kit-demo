#!/usr/bin/env node
/**
 * CI gate that consumes the machine-readable JSON output from `aeo check`.
 * Exits 0 only when the report says ok: true.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["aeo", "check", "--format", "json"], {
  encoding: "utf8",
  stdio: ["inherit", "pipe", "inherit"],
});

const out = result.stdout ?? "";

let report;
try {
  report = JSON.parse(out);
} catch {
  console.error("✗ aeo check did not return valid JSON");
  console.error(out);
  process.exit(1);
}

if (report && report.ok === true) {
  console.log("✓ policy ok");
  process.exit(0);
}

console.error("✗ policy violations");
console.error(JSON.stringify(report, null, 2));
process.exit(1);
