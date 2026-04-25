# Conxian UI Architecture

## 1. Welcome to the Conxian UI!

This document provides an overview of the Conxian UI's architecture, outlining how it functions as a decentralized application (dApp) on the Stacks blockchain.

## 2. The Big Picture: A dApp on the Stacks Blockchain

The Conxian UI is a Next.js application that empowers users to interact with Conxian smart contracts. Unlike traditional web apps, it doesn't have a central backend server. Instead, it communicates directly with the Stacks blockchain, making it a true dApp.

## 3. Smart Contract Architecture

The Conxian protocol is a sophisticated system of interconnected smart contracts that work together to provide a seamless DeFi experience.

### Core Components

*   **DEX Factory (`dex-factory-v2`)**: This contract serves as the registry for all liquidity pools. It is responsible for creating new pools and maintaining a canonical list of all pools in the ecosystem.
*   **Liquidity Pools**: Each liquidity pool is a separate smart contract that holds reserves of two tokens. These contracts implement the core logic for automated market making (AMM), including functions for adding and removing liquidity, and executing swaps.
*   **DEX Router (`dex-router`)**: The router is the primary entry point for all swap transactions. It is responsible for finding the most efficient path for a given trade.
*   **Vault (`vault`)**: The vault is a central repository for all liquidity in the Conxian ecosystem.
*   **Dimensional Core (`dimensional-core`)**: Manages complex positions and advanced capital strategies.

### Auxiliary Components

*   **Oracle Aggregator (`oracle-aggregator`)**: This contract provides a reliable and tamper-resistant price feed.
*   **Circuit Breaker (`circuit-breaker`)**: A critical security feature that can temporarily pause trading in the event of a major security vulnerability.
*   **Readiness Monitoring**: Real-time telemetry and hardware-attested status tracking for institutional readiness.

## 4. Frontend-to-Backend Communication

The Conxian UI communicates with the Stacks blockchain via the Hiro API. We use a combination of read-only calls and public function calls to interact with our smart contracts.

### Our Toolkit for Blockchain Interaction:

*   **`src/lib/contracts.ts`**: This file contains a list of all our smart contract identifiers. It serves as a central registry for all on-chain endpoints.
*   **`src/lib/core-api.ts`**: This file contains our low-level functions for making API calls to the Stacks blockchain.
*   **`src/lib/contract-interactions.ts`**: This file contains our high-level functions for interacting with our smart contracts, including dashboard metrics and system health checks.
*   **`src/lib/api-client.ts`**: Provides a unified API interface for UI components via React hooks.

## 5. The User Interface

The Conxian UI is built with Next.js 15, React 19, and Tailwind CSS v4. It follows a "Sovereign Earthy" institutional design system.

### Key Pages & Components:

*   **Swap (`src/app/swap/page.tsx`)**: The core trading interface for token exchanges.
*   **Launch (`src/app/launch/page.tsx`)**: Community self-launch dashboard for bootstrap funding.
*   **Pools Explorer (`src/app/pools/page.tsx`)**: Real-time telemetry for liquidity pools.
*   **Overview (`src/app/overview/page.tsx`)**: High-level system health and readiness dashboard.
*   **Shielded (`src/app/shielded/page.tsx`)**: Privacy-focused wallet management.
*   **Reusable UI**: Components in `src/components/ui` ensuring consistency through the 60-30-10 Ivory foundation.

## 6. The User's Journey: A Data Flow Story

1.  **A User's Click**: The journey begins when a user interacts with a UI component.
2.  **A Call to Action**: The UI calls a function from `src/lib/contract-interactions.ts` or specialized hooks.
3.  **A Conversation with the Blockchain**:
    *   For read-only operations, we use `callReadOnly` from `src/lib/core-api.ts`.
    * For transactions, we use `@stacks/connect` to open a wallet pop-up.
4.  **A Fresh Look**: The UI updates to reflect the results of the blockchain interaction, providing a seamless user experience.

## 7. Our Promise: A Seamless User Experience

By combining a modern frontend with the power of the Stacks blockchain and a specialized institutional aesthetic, we're able to provide a user-friendly and decentralized platform for the Conxian ecosystem.
