# Conxian UI

Public interaction and application-facing interface work for the broader Conxian ecosystem.

## Purpose

Provide a public interaction layer for Conxian features, demos, and user-facing flows where a browser-based surface is appropriate.

## Status

**Active development.** This repository is a public interaction and interface layer. It should be treated as an application-facing surface, not as the protocol source of truth and not as the Labs operating authority.

## Scope

This repository contains interface work, UI assets, and application flows. It does not own canonical protocol logic, shared-core libraries, or private internal operations.

## Governance relation

This repository is maintained by Conxian-Labs as part of the public interaction layer around the Conxian ecosystem. Governance of the Conxian protocol remains separate from this interface surface.

## Relationship to the Conxian stack

- `Conxian` is the protocol and DAO-facing core.
- `conxius-wallet` is the wallet and reference client.
- `conxian-gateway` is the middleware and integration surface.
- `conxian-labs-site` is the Labs portfolio and public information surface.

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

## Release discipline

- Follow Semantic Versioning.
- Create annotated tags as `vX.Y.Z`.
- Document each release in [CHANGELOG.md](CHANGELOG.md).
- Use [RELEASE.md](RELEASE.md) for the release workflow.

## Security

Do not disclose vulnerabilities publicly. Use [SECURITY.md](SECURITY.md) or `security@conxian-labs.com`.

## Policies

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [SECURITY.md](SECURITY.md)
- [CODEOWNERS](CODEOWNERS)
- [LICENSE](LICENSE)
- [REPO_OWNERSHIP.md](REPO_OWNERSHIP.md)
- [CHANGELOG.md](CHANGELOG.md)
- [RELEASE.md](RELEASE.md)

## Contact

- General: [info@conxian-labs.com](mailto:info@conxian-labs.com)
- Support: [support@conxian-labs.com](mailto:support@conxian-labs.com)
- Security: [security@conxian-labs.com](mailto:security@conxian-labs.com)

## License

See [LICENSE](LICENSE).