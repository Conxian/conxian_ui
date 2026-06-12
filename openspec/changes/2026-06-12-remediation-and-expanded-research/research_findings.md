# Research Findings: Cross-Chain Interoperability

## 1. Bitcoin & Stacks (sBTC)
- **Security Model**: sBTC uses a decentralized 2-way peg. Stacks and sBTC state automatically fork with Bitcoin, ensuring 100% Bitcoin Finality.
- **Confirmation Timelines**: Deposits require 3 Bitcoin blocks (~30 mins) before sBTC is minted.
- **Implementation**: Clarity smart contracts can parse raw Bitcoin transactions using `parse-tx` to extract version, inputs, outputs, and locktime.

## 2. Lightning Network (BOLT Standards)
- **Routing & Peer Protocol**: Requires explicit `chain_hash` (32-byte hash) to identify the blockchain (e.g., Bitcoin).
- **Channel Operations**: Strict limits on `push_msat` (max 1000 * funding_satoshis) and `dust_limit_satoshis` to prevent griefing.
- **Closing**: `shutdown` messages must use standard segwit scripts (P2WPKH, P2WSH) or anysegwit if negotiated.

## 3. Tooling & SDKs
- **Stacks.js**: Comprehensive support for transaction building (`makeSTXTokenTransfer`), signing, and broadcasting. Address conversion between BTC and STX is a standard utility.
- **Monitoring**: Client-side monitoring of Bitcoin transaction status is commonly handled via polling Blockstream or similar APIs to trigger subsequent on-chain actions.

## 4. Key Considerations for Conxian
- **Sovereign Tax Extraction**: Integration with Gateway Webhooks is required for automated extraction.
- **Identity Mapping**: Cross-chain identity mapping (Passkey to TEE/HSM) is a core requirement for secure institutional flows.
