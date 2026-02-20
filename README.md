# AEO Kit Demo

Demo project for **AEO Kit**. This repo shows how to define a small, clear API and keep generated artifacts out of version control while still producing reproducible outputs.

> Update this link once your main repo is public: `https://github.com/<org>/<aeo-kit>`

## What’s in this repo

- **`openapi.yaml`** — Small OpenAPI 3 spec: health check and a simple `items` resource. Use it as the source of truth for your API and for codegen or docs.
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

## Policy demo

AEO Kit includes a policy gate (`aeo check`) that enforces rules against the generated `.aeo/` artifacts. This repo ships a policy that requires every `write`/`admin` tool to have a trust record.

### Pass case

```bash
npm run demo:policy
```

This runs `aeo build` then `aeo check`. Because `create-item` (a write tool) has a trust entry, the check passes with 0 findings.

### Fail case

```bash
npm run demo:policy:fail
```

This builds artifacts, strips the trust record for `create-item`, and re-runs `aeo check`. The policy gate fires and `aeo check` exits non-zero:

```
✗ Write tool missing trust record
  Tool "create-item" has write/admin intent but no trust entry.
```

### Policy file

See [`policy.aeo.md`](policy.aeo.md) for the human-readable policy. The enforcement config lives in `aeo.config.ts` under the `policy` key.

## CI Policy Gate

Every pull request is automatically checked for policy violations. The workflow
runs the full AEO pipeline and fails the PR if any findings exist:

```bash
npm ci
npx aeo build              # generate .aeo/ artifacts from openapi.yaml
npx aeo check --format json # enforce policies — exit 1 on any finding
```

The JSON output makes violations easy to parse in CI logs:

```json
{
  "ok": false,
  "findings": [
    {
      "id": "policy-missing-trust:create-item",
      "severity": "error",
      "message": "Tool \"create-item\" has write/admin intent but no trust entry.",
      "toolId": "create-item",
      "path": ".aeo/trust.json",
      "hint": "Add x-aeo-trust to the operation in your OpenAPI spec."
    }
  ]
}
```

See [`.github/workflows/aeo-policy-gate.yml`](.github/workflows/aeo-policy-gate.yml)
for the full workflow.

## Reproducibility

This repo intentionally keeps generated artifacts out of Git:

- `.aeo/` is ignored and can be regenerated at any time with `npx aeo build`.
- `openai-tools.json` and `mcp-tools.json` are committed as example outputs so readers can inspect them without running anything.

If you prefer *fully* generated outputs, delete the exported JSON files and add them to `.gitignore`.

## License

Apache-2.0. See [LICENSE](LICENSE).
