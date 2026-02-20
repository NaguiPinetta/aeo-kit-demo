# AEO Policy (Demo)

This policy is evaluated by `aeo check`.

## Contract

- Tools referenced by intents MUST exist.
- Any tool with intent `write` or `admin` MUST have a corresponding trust record.
- If a trust record has `auth.required: true`, it MUST list at least one auth scheme.

## Policy

```aeo-policy
version: 1
requireTrustFor:
  - write
  - admin

requireAuthSchemesWhenAuthRequired: true
```
