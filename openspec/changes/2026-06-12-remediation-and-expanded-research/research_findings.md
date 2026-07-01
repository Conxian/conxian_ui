# Research Findings: Cross-Chain Interoperability & Protocol Adapters

## 1. Bitcoin & Stacks (sBTC)
- **Security Model**: sBTC uses a decentralized 2-way peg. Stacks and sBTC state automatically fork with Bitcoin, ensuring 100% Bitcoin Finality.
- **Confirmation Timelines**: Deposits require 3 Bitcoin blocks (~30 mins) before sBTC is minted.
- **Implementation**: Clarity smart contracts can parse raw Bitcoin transactions using `parse-tx` to extract version, inputs, outputs, and locktime.

## 2. RGB Protocol (v0.11.1 vs v0.12)
- **Production Readiness**: RGB v0.11.1 is the current production-ready ecosystem (July 2025). v0.12 is considered experimental/non-production.
- **Key Features**: Supports Tether (USD₮) with a $170B+ issuance. Uses "Client-Side Validation" and "Single-Use Seals".
- **Upgrade Path**: Implements "Fast-forward" updates (FFV) at the contract level to enable new rules without breaking backward compatibility for existing owners.

## 3. BitVM (BitVM2 & BitVM3)
- **BitVM2 Architecture**: Optimistic bridge with Groth16 SNARK verification on BN254. Verification is split into 364 executable chunks (1 arithmetic validation tap, 363 hashing taps) to stay within Bitcoin's script limits.
- **BitVM3 Strategy**: Uses Garbled Circuits and BitHash for SNARK verification, reducing dispute costs by ~3000x compared to BitVM2.
- **Verifier Boundary**: Requires explicit definition of public inputs, witness expectations, and statement format.

## 4. Liquid Network (Elements)
- **Peg-in Mechanics**: Requires 102 Bitcoin confirmations before a peg-in claim can be processed on Liquid.
- **Sidechain Security**: Managed by 15 functionaries (PowPeg). Elements-based codebase allows for Confidential Transactions and Issued Assets.
- **Proof Verification**: Peg-in requires a Bitcoin Merkle inclusion proof and headers. Peg-out is processed in batches (~17 mins).

## 5. Lightning Network (BOLT Standards)
- **Routing & Peer Protocol**: Requires explicit `chain_hash` (32-byte hash) to identify the blockchain (e.g., Bitcoin).
- **Channel Operations**: Strict limits on `push_msat` (max 1000 * funding_satoshis) and `dust_limit_satoshis` to prevent griefing.
- **LDK Integration**: Moving from simulated backends to LDK Node (Rust-native) is recommended for production.

## 6. Key Considerations for Conxian
- **Sovereign Tax Extraction**: Integration with Gateway Webhooks is required for automated extraction.
- **Identity Mapping**: Cross-chain identity mapping (Passkey to TEE/HSM) is a core requirement for secure institutional flows.
