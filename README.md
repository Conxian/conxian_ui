# Conxian UI

Public interface work for interacting with and demonstrating Conxian ecosystem capabilities.

## Purpose

Provide a public web interface layer for Conxian features, demos, and user-facing flows where a browser-based surface is appropriate.

## Status

**Active development.** This repository is the public web interface layer for the Conxian ecosystem and should be treated as a product-facing application surface rather than a protocol source of truth.

## Scope

This repository contains interface work, UI assets, and application flows. It does not own canonical protocol logic, shared-core libraries, or private internal operations.

## Governance relation

This repository is maintained by Conxian Labs as part of the public application and interface layer for the Conxian ecosystem. Governance of the protocol itself is expected to decentralize progressively after mainnet.

## Relationship to the Conxian stack

- `Conxian` is the protocol core.
- `conxius-wallet` is the wallet and reference client.
- `conxian-gateway` is the middleware and institutional integration surface.
- `conxian-labs-site` is the corporate and public information surface.

## Deployment

This repository deploys to Render as a Node web service.

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

## Security

Do not disclose vulnerabilities publicly. Use [SECURITY.md](SECURITY.md) or `security@conxian-labs.com`.

## Policies

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [SECURITY.md](SECURITY.md)
- [CODEOWNERS](CODEOWNERS)
- [LICENSE](LICENSE)
- [REPO_OWNERSHIP.md](REPO_OWNERSHIP.md)

## Contact

- General: [info@conxian-labs.com](mailto:info@conxian-labs.com)
- Support: [support@conxian-labs.com](mailto:support@conxian-labs.com)
- Security: [security@conxian-labs.com](mailto:security@conxian-labs.com)

## License

See [LICENSE](LICENSE).
