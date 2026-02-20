# AEO Kit Demo

Demo project for [AEO Kit](https://github.com/your-org/aeo-kit) (or your AEO tooling). This repo shows how to define a small, clear API and keep generated or tool output out of version control.

## What’s in this repo

- **`openapi.yaml`** — Small OpenAPI 3 spec: health check and a simple `items` resource. Use it as the source of truth for your API and for codegen or docs.
- **`README.md`** — This file: purpose of the repo and how to use it.
- **`.gitignore`** — Ignores `.aeo/` so tool output and generated artifacts stay local.

## Quick start

1. Clone the repo.
2. Point your AEO tooling at `openapi.yaml` (or use it with any OpenAPI-compatible client/server generator).
3. Run your tools; anything written under `.aeo/` won’t be committed.

## API overview

- `GET /health` — Health check; returns `{ "status": "ok" }`.
- `GET /items` — List items (optional `?limit`).
- `POST /items` — Create an item (body: `{ "name": "..." }`).

See `openapi.yaml` for full request/response schemas.

## License

Apache-2.0. See [LICENSE](LICENSE).
