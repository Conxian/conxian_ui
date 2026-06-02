# UI Naming Standardization Matrix

This document translates the current `conxian_ui` copy review into an implementation-ready rename matrix.

## Goal

Use standard product and DeFi naming for public-facing flows while reserving operator-grade or BOS/internal wording for advanced contexts only.

## Core rule

- **Public product surfaces** should use plain, standard product language.
- **Advanced/operator surfaces** may use more technical language, but should still be understandable.
- **BOS/internal terminology** should not lead public UI labels.

## Route policy

Keep route paths stable unless there is a strong structural reason to change them.

Recommended route stability:
- `/swap`
- `/pools`
- `/positions`
- `/governance`
- `/sdk`

## Naming guidance by surface

### 1. Home / overview

| Current | Recommended | Notes |
|---|---|---|
| `TERMINAL` | `Dashboard` or `Overview` | Public landing label should not imply operator-only terminal mode. |
| `Institutional Protocol Access` | `Overview` | Use simpler framing in the hero. |
| `PROTOCOL TELEMETRY STREAM` | `Protocol Activity` or `Market Activity` | `Telemetry` is acceptable in advanced/operator mode, but not as the main framing. |
| `SYSTEM AUTH` | `Wallet` or `Connection` | Better matches current wallet-first auth pattern. |
| `BENCHMARKS` | `Performance` | More standard product wording. |
| `Hardware Isolation` | `Secure Vaults` or `Active Vaults` | Better user-facing meaning. |
| `Yield Performance` | `APY` or `Yield` | Use standard DeFi terminology. |

### 2. Swap

| Current | Recommended | Notes |
|---|---|---|
| `EXECUTION` | `Swap` | Standard DEX naming. |
| `Protocol Execution Interface` | `Swap` | Too operator-centric. |
| `DEX Routing & Settlement` | `Token Swap` | Keep routing/settlement detail secondary. |
| `EXECUTE PROTOCOL` | `Swap` | Standard CTA. |
| `Aggregated Path` | `Route` | Standard DeFi wording. |
| `Transmitted to mempool.` | `Transaction submitted.` | Simpler for general users. |
| `STATUS: NOMINAL` | `Status: Ready` | More product-standard. |

Recommended additional labels to surface if missing:
- `Price impact`
- `Minimum received`
- `Network fee`

### 3. Pools

| Current | Recommended | Notes |
|---|---|---|
| `Institutional Liquidity Monitor` | `Pools` | Simpler main title. |
| `SELECT_LIQUIDITY_VECTOR` | `Select Pool` | More understandable. |
| `NODE_STATUS` | `Status` or `Pool Status` | Avoid infrastructure-heavy wording. |
| `POOL_RESERVES` | `Reserves` | Standard. |
| `LP_TOTAL_SUPPLY` | `LP Supply` or `Total Liquidity` | Standard DEX wording. |
| `REALTIME_PRICE` | `Pool Price` | Simpler. |
| `FEE_STRUCTURE` | `Fee Tier` or `Fees` | Standard DEX wording. |

### 4. Positions

| Current | Recommended | Notes |
|---|---|---|
| `Protocol Asset Custody Interface` | `Positions` | Current page is about positions, not generic custody. |
| `PORTFOLIO` | `Positions` or `Portfolio` | Keep `Portfolio` only if the page broadens beyond LP positions. |
| `Zero active positions detected in custody.` | `No positions found.` | Simpler. |
| `SYNC_LIQUIDITY_POOLS` | `Add liquidity` | Standard CTA. |
| `Authorization required for asset disclosure.` | `Connect wallet to view positions.` | Better aligned to current behavior. |

### 5. Governance

| Current | Recommended | Notes |
|---|---|---|
| `Intent-Based Governance Portal` | `Governance` | Simpler main title. |
| `Institutional Protocol Influence` | `Proposals and Voting` | Standard user framing. |
| `MANDATE_BUILDER` | `Voting Policy` or `Proposal Rules` | Depends on final product behavior. |
| `COMPLIANCE_AUDIT_TRAIL` | `Voting History` or `Governance Activity` | Better user-facing term. |
| `DELEGATION_HEALTH` | `Delegation` | Standard governance term. |
| `SYSTEM_IDENTITY` | `Connected Wallet` or `Account` | Better matches actual auth model. |
| `VOTE_PROPOSALS` | `View proposals` or `Vote` | Depends on actual behavior. |

### 6. SDK

| Current | Recommended | Notes |
|---|---|---|
| `SDK_CORE` | `SDK` | Simpler. |
| `Institutional-Grade Build Patterns` | `Developer Integrations` | Better external framing. |
| `GENERATE_API_KEY` | `Create API Key` | Standard action label. |
| `Hosted Acceleration` | `Hosted API` | Less marketing-heavy, clearer technically. |
| `GTM Integration` | `Production Support` or `Deployment Support` | `GTM` is not useful user-facing product language. |
| `TRUST_BOUNDARY` | `Security Model` | More standard. |
| `INSTALLATION_PROTOCOL` | `Installation` | Simpler. |
| `CONFIGURATION_TEMPLATE` | `Configuration` | Simpler. |

## Vocabulary policy

### Preferred for public UI
- Swap
- Pools
- Liquidity
- Positions
- Governance
- Vote
- Delegation
- SDK
- API key
- Connection / Wallet
- Price impact
- Route
- Fees
- APY

### Use only in advanced/operator contexts
- Telemetry
- Attestation
- Execution engine
- Routing settlement
- Hardware isolation
- Institutional
- Operator
- Compliance trail

### Avoid as primary public labels
- terminal
- protocol execution interface
- liquidity vector
- system auth
- custody interface
- mandate builder
- GTM integration
- system identity

## Implementation order

1. Replace primary page headings and CTA labels
2. Replace empty-state text and helper text
3. Replace panel headings and metric labels
4. Add tooltips or secondary copy where advanced meaning still matters
5. Update screenshots/docs to match the final copy

## Related work
- `conxian_ui` issue #130
