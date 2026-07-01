# Learnings from Expanded Research Cycle (June 2026)

## 1. Technical Nuance in Bitcoin Adapters
- **RGB Fork Split**: The distinction between the `rgb-protocol` (v0.11.1) and `rgb-core` (v0.12) is critical. Conxian must target v0.11.1 for mainnet readiness as it has the backing of major institutional players like Tether.
- **BitVM Chunking**: BitVM2's 364-tap verification system is the current state-of-the-art for SNARKs on Bitcoin. Our `BitVMAdapter` should be designed to handle these multi-transaction verification flows rather than a single atomic check.
- **Liquid Maturity**: Liquid's 102-confirmation requirement for peg-ins is a significant UX hurdle that must be clearly communicated in the UI.

## 2. UI/UX Terminology
- **Standardization**: Transitioning from technical/operator-grade terminology (e.g., 'NOMINAL', 'PARTIAL') to product-centric language (e.g., 'READY', 'ACTION REQUIRED') improves user trust and accessibility for non-technical institutional users.
- **Accessibility**: High-contrast labels (#333333 or #4D4D4D) are non-negotiable for financial dashboards. Opacity-based muting is deprecated.

## 3. Deployment & CI/CD
- **Environment Parity**: The `TypeError: pathToRegExp` issue on Render highlighted the importance of testing in production-like environments (using `serve` locally) even when the build passes.
- **Port Binding**: Explicitly using the `-l` flag in `serve` is the only reliable way to bind to dynamic ports on certain cloud providers.
