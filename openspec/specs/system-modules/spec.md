# system-modules Specification

## Purpose
This specification outlines the modular architecture of the Conxian ecosystem, defining the core components and their responsibilities within the protocol.

## Requirements
### Requirement: DEX Factory Module
The system SHALL maintain a registry for all liquidity pools and provide interfaces to query and create new pools.

#### Scenario: Registry Access
- **WHEN** the system needs to find a pool for a swap
- **THEN** it SHALL call the `dex-factory-v2` contract's read-only functions to identify the pool's contract address

### Requirement: DEX Router Module
The system SHALL find efficient paths for multi-hop token trades and coordinate the exchange through one or more pools.

#### Scenario: Swap Routing
- **WHEN** a swap between two tokens without a direct pool is requested
- **THEN** the router SHALL calculate a path through intermediate tokens and execute the sequence of swaps

### Requirement: Vault and Oracle Modules
The system SHALL provide a central repository for liquidity (Vault) and a tamper-resistant price feed (Oracle Aggregator).

#### Scenario: Price Update
- **WHEN** a contract requires a reliable asset price for a swap or liquidity operation
- **THEN** it SHALL call the Oracle Aggregator to get the latest aggregated price

### Requirement: Economic Policy Engine
The system SHALL monitor and adjust protocol parameters to maintain market stability and capital efficiency.

#### Scenario: Fetch Market Parameters
- **WHEN** the dashboard requires real-time interest rates or collateral factors
- **THEN** it SHALL query the `economic-policy-engine` for the current protocol configuration
