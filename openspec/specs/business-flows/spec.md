# business-flows Specification

## Purpose
This specification defines the core business flows within the Conxian UI, ensuring a seamless user experience for trading, funding, and asset management on the Stacks blockchain.

## Requirements
### Requirement: Token Swap Flow
The system SHALL enable users to exchange one Stacks fungible token for another via the DEX Router and Factory.

#### Scenario: Successful Token Swap
- **WHEN** the user selects a "From" token and a "To" token, enters an amount, and clicks "Swap"
- **THEN** the system SHALL calculate an estimate using the DEX Router, request wallet signing, and broadcast the transaction to the Stacks network

### Requirement: Community Self-Launch
The system SHALL allow users to participate in community bootstrap funding (Self-Launch) for new tokens.

#### Scenario: Contribute to Launch
- **WHEN** a user enters a contribution amount on the Launch page and clicks "Contribute"
- **THEN** the system SHALL initiate a contract call to the `self-launch-coordinator` and provide real-time feedback on the transaction status

### Requirement: Shielded Asset Management
The system SHALL provide a private interface for managing shielded assets and transactions.

#### Scenario: View Shielded Balance
- **WHEN** an authenticated user navigates to the Shielded page
- **THEN** the system SHALL fetch and display the user's private balances and transaction history

### Requirement: Liquidity Provision
The system SHALL allow users to add or remove liquidity from DEX pools.

#### Scenario: Add Liquidity
- **WHEN** a user selects two tokens, specifies the amounts, and clicks "Add Liquidity"
- **THEN** the system SHALL interact with the `dex-factory-v2` or specific pool contract to update reserves and issue LP tokens

### Requirement: System Health Monitoring
The system SHALL provide real-time telemetry and readiness status for institutional users.

#### Scenario: View Readiness Dashboard
- **WHEN** a user navigates to the Overview page
- **THEN** the system SHALL display the Genesis countdown, hardware attestation status, and core protocol health metrics
