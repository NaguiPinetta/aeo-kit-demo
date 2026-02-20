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

## Reproducibility

This repo intentionally keeps generated artifacts out of Git:

- `.aeo/` is ignored and can be regenerated at any time with `npx aeo build`.
- `openai-tools.json` and `mcp-tools.json` are committed as example outputs so readers can inspect them without running anything.

If you prefer *fully* generated outputs, delete the exported JSON files and add them to `.gitignore`.

## License

Apache-2.0. See [LICENSE](LICENSE).
