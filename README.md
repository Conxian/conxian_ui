# Conxian UI

Public interface work for interacting with and demonstrating Conxian ecosystem capabilities.

## Purpose

Provide a public interface layer for Conxian features, demos, and user-facing flows where a web-based surface is appropriate.

## Status

Active development.

## Scope

This repository contains interface work and related UI assets. It does not own canonical protocol logic, shared-core libraries, or private internal operations.

## Governance relation

This repository is maintained by Conxian Labs as part of the public application and interface layer for the Conxian ecosystem.

## Relationship to the portfolio

- `Conxian` is the protocol core
- `conxius-wallet` is the wallet and reference client
- `conxian-labs-site` is the corporate and public information surface

## Deployment

This repository deploys to Render as a Node web service serving the static Next export from `out/`.

### Required Render settings

- Node version: `20.19.0`
- Build command: `corepack enable && corepack prepare pnpm@10.17.1 --activate && NPM_CONFIG_PRODUCTION=false pnpm install --frozen-lockfile && pnpm build`
- Start command: `corepack enable && corepack prepare pnpm@10.17.1 --activate && pnpm start`

### Configuration rules

- Prefer syncing Render from `render.yaml` in this repository.
- Do not replace the pnpm-based build with `npm install; npm run build` in the Render dashboard.
- Public browser-safe values may use `NEXT_PUBLIC_*` variables.
- Secrets must be stored in Render secrets, not committed to the repository.
- Do not use placeholder API keys in repo config or deploy blueprints.

## Contact

- General: [info@conxian-labs.com](mailto:info@conxian-labs.com)
- Support: [support@conxian-labs.com](mailto:support@conxian-labs.com)
- Security: [security@conxian-labs.com](mailto:security@conxian-labs.com)
