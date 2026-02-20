# AEO Kit Demo

Demo project for **AEO Kit**. This repo shows how to define a small, clear API and keep generated artifacts out of version control while still producing reproducible outputs.

> Update this link once your main repo is public: `https://github.com/<org>/<aeo-kit>`

## Why this repository exists

This repository is a **reference implementation** for AEO (Agent Exposure Objects).

It demonstrates how to:

1. Generate agent-safe tools from a real-world OpenAPI specification
2. Explicitly expose operations using `x-aeo-expose`
3. Enforce trust and security policies automatically
4. Fail CI deterministically when policies are violated
5. Export tools for OpenAI function calling and MCP consumers

There is **no manual review step** and **no runtime guesswork**.
If CI passes, the exposed tools are safe to consume.

## What’s in this repo

- **`openapi.yaml`** — TVMaze User API OpenAPI 3.0 spec, used as the source of truth for codegen and docs. This demo intentionally uses the TVMaze User API as a large, real-world OpenAPI specification to demonstrate AEO behavior at scale (40+ exposed operations).
- **`README.md`** — This file: purpose of the repo and how to use it.
- **`.gitignore`** — Ignores `.aeo/` so tool output and generated artifacts stay local.

## Quick start

```bash
npm install

# Create config (one-time)
npx aeo init

# Mark endpoints to expose (updates openapi.yaml)
npx aeo annotate --all

# Generate .aeo artifacts
npx aeo build

# Optional: validate + export for tool runtimes
npx aeo-agent validate
npx aeo-agent openai > openai-tools.json
npx aeo-agent mcp > mcp-tools.json
```

### What gets generated?

- `.aeo/` contains the AEO artifacts (`index.json`, `tools.json`, `intents.json`, `trust.json`).
- This repo ignores `.aeo/` so clones stay clean, but the build is fully reproducible from `openapi.yaml`.

## API overview

- `GET /health` — Health check; returns `{ "status": "ok" }`.
- `GET /items` — List items (optional `?limit`).
- `POST /items` — Create an item (body: `{ "name": "..." }`).

See `openapi.yaml` for full request/response schemas.

## Policy demo (pass + fail)

AEO Kit includes a policy gate (`aeo check`) that enforces rules against the generated `.aeo/` artifacts. This repo ships a policy requiring every `write`/`admin` tool to have a trust record. See [`policy.aeo.md`](policy.aeo.md) for the human-readable contract and `aeo.config.ts` for enforcement keys.

### Pass

```bash
npm run demo:policy        # build + text check (0 findings)
npm run ci:policy:json     # build + JSON contract gate (ok: true)
```

`demo:policy` runs `aeo build` then `aeo check` in text mode. `ci:policy:json` does the same but parses the JSON output and gates on `ok === true` — this is the pattern you'd use in CI.

### Fail case

```bash
npm run demo:policy:fail
```

Builds artifacts, temporarily strips the trust record for the first `write`/`admin` tool, and re-runs `aeo check`. The policy gate fires and exits non-zero. The original `trust.json` is always restored afterward, even on error.

## Reproducibility

This repo intentionally keeps generated artifacts out of Git:

- `.aeo/` is ignored and can be regenerated at any time with `npx aeo build`.
- `openai-tools.json` and `mcp-tools.json` are committed as example outputs so readers can inspect them without running anything.

If you prefer *fully* generated outputs, delete the exported JSON files and add them to `.gitignore`.

## License

Apache-2.0. See [LICENSE](LICENSE).
