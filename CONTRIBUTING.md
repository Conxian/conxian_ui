# Contributing to the Conxian UI

We welcome contributions from the community. This guide provides all the information you need to get started with developing and contributing to the Conxian UI.

## Getting Started

### Requirements

*   Node.js 20+
*   A Core API URL (Hiro): mainnet/testnet/devnet

### Installation

```bash
pnpm install
```

### Running the Development Server

```bash
NEXT_PUBLIC_CORE_API_URL=https://api.testnet.hiro.so pnpm run dev
# App will start at http://localhost:3000 (or next available port)
```

### Building for Production

```bash
pnpm run build
pnpm start
```

## Testing

We use a combination of unit tests and end-to-end tests to ensure the quality of our codebase.

### Running the Test Suite

```bash
pnpm test        # Interactive test runner
pnpm run test:run # Run tests once
pnpm run test:ui  # Visual test interface
```

### End-to-End Testing & UI Audit

We use Playwright for E2E testing and visual verification.

```bash
# Install browsers (first time only)
pnpm exec playwright install chromium

# Run UI audit (captures screenshots of all routes)
pnpm exec playwright test tests/audit_screenshots.spec.ts
```

Tests cover:

*   Contract function calls
*   Error handling scenarios
*   Configuration validation
*   Integration with Stacks network

### Smoke Tests

Before submitting a pull request, please run the following smoke tests to ensure that the core functionality of the application is working correctly.

*   **Wallet connect button in navbar**: Ensure that the wallet connect button is visible and functional.
*   **Transactions**:
    *   Open `/tx`, pick a template, confirm function + args populated, click Open Wallet.
*   **Router**:
    *   Open `/router`, confirm function list is populated from ABI, run an estimate.
*   **Pools**:
    *   Open `/pools`, select a pool, click refresh; verify KPIs render.

## Development

### Contract Interaction System

The application includes a comprehensive contract interaction system (`src/lib/contract-interactions.ts`) that provides:

*   **Read-only function calls**: Query contract state without transactions
*   **Public function calls**: Execute transactions through user wallets
*   **Type-safe interfaces**: Proper TypeScript types for all contract interactions
*   **Error handling**: Comprehensive error handling for network and contract issues

### Notes

*   Contract ABIs are retrieved on demand from the configured Core API via `GET /v2/contracts/interface/{principal}/{name}`.
*   Read-only calls are sent via `POST /v2/contracts/call-read/...` with hex-encoded Clarity args.
*   If a template function is not present in the selected contract ABI, the UI will show a "Template not supported" status.

## Governance-Sensitive Changes

If your PR changes governance or security-control files, complete the checklist in [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) and request CODEOWNERS review before merge.

Sensitive files include:

- `CODEOWNERS`
- `SECURITY.md`
- `SUPPORT.md`
- `.github/ISSUE_TEMPLATE/**`
- `.github/PULL_REQUEST_TEMPLATE*`
- `.github/workflows/**`
- `.github/release.yml`

## Support and Security Routing

- For support and governance-routing guidance, refer to [SUPPORT.md](SUPPORT.md).
- For private vulnerability reporting requirements, refer to [SECURITY.md](SECURITY.md).
