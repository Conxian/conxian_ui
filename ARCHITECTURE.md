# Conxian UI Architecture

## 1. Welcome to the Conxian UI!

This document provides an overview of the Conxian UI's architecture, outlining how it functions as a decentralized application (dApp) on the Stacks blockchain.

## 2. The Big Picture: A dApp on the Stacks Blockchain

The Conxian UI is a Next.js application that empowers users to interact with Conxian smart contracts. Unlike traditional web apps, it doesn't have a central backend server. Instead, it communicates directly with the Stacks blockchain, making it a true dApp.

## 3. Smart Contract Architecture

The Conxian protocol is a sophisticated system of interconnected smart contracts that work together to provide a seamless DeFi experience. The following is a high-level overview of the core components of our on-chain architecture.

### Core Components

*   **DEX Factory (`dex-factory-v2`)**: This contract serves as the registry for all liquidity pools. It is responsible for creating new pools and maintaining a canonical list of all pools in the ecosystem.
*   **Liquidity Pools**: Each liquidity pool is a separate smart contract that holds reserves of two tokens. These contracts implement the core logic for automated market making (AMM), including functions for adding and removing liquidity, and executing swaps.
*   **DEX Router (`dex-router`)**: The router is the primary entry point for all swap transactions. It is responsible for finding the most efficient path for a given trade, which may involve routing the trade through multiple liquidity pools. This multi-hop capability ensures that users always get the best possible price for their trades.
*   **Vault (`vault`)**: The vault is a central repository for all liquidity in the Conxian ecosystem. It provides an extra layer of security and abstraction, allowing for more complex liquidity management strategies and easier integration with other protocols.

### Auxiliary Components

*   **Oracle Aggregator (`oracle-aggregator`)**: This contract provides a reliable and tamper-resistant price feed for all assets in the Conxian ecosystem. It aggregates data from multiple sources to provide accurate and up-to-date pricing information.
*   **Circuit Breaker (`circuit-breaker`)**: A critical security feature that can temporarily pause trading in the event of a major security vulnerability or market anomaly, protecting user funds.

## 4. Frontend-to-Backend Communication

The Conxian UI communicates with the Stacks blockchain via the Hiro API. We use a combination of read-only calls and public function calls to interact with our smart contracts.

### Our Toolkit for Blockchain Interaction:

*   **`src/lib/contracts.ts`**: This file contains a list of all our smart contract identifiers. It serves as a central registry for all on-chain endpoints.
*   **`src/lib/core-api.ts`**: This file contains our low-level functions for making API calls to the Stacks blockchain. It includes functions for fetching balances, making read-only contract calls, and broadcasting transactions.
*   **`src/lib/contract-interactions.ts`**: This file contains our high-level functions for interacting with our smart contracts. It uses the `@stacks/transactions` and `@stacks/connect` libraries to build and send transactions.

## 4. The User Interface

The Conxian UI is built with Next.js and Tailwind CSS v4. We strictly adhere to our **Sovereign Earthy** UI architecture, utilizing a 60-30-10 palette split (Ivory/White/Brand) to ensure an institutional-grade, low-fatigue experience. We use a set of canonical UI components to ensure consistency throughout the application.

### Key Pages & Components:

*   **Swap (`src/app/swap/page.tsx`)**: The core trading interface for token exchanges.
*   **Launch (`src/app/launch/page.tsx`)**: The community self-launch dashboard for bootstrap funding.
*   **Shielded (`src/app/shielded/page.tsx`)**: Privacy-focused wallet management for shielded transactions.
*   **Reusable UI**: Components in `src/components/ui` like `Card`, `Button`, `VStack`, `StatCard` ensuring consistency.

## 5. The User's Journey: A Data Flow Story

Here's a step-by-step look at how data flows through our app:

1.  **A User's Click**: The journey begins when a user interacts with a UI component, like clicking the "Swap" button.
2.  **A Call to Action**: The UI then calls a function from `src/lib/contract-interactions.ts` or specific hooks like `useSelfLaunch`.
3.  **A Conversation with the Blockchain**:
    *   For read-only operations (like checking a balance), we use `fetchCallReadOnlyFunction` from `@stacks/transactions` to query a Stacks node.
    * For transactions (like making a swap), we use `@stacks/connect` to open a wallet pop-up, allowing the user to approve the transaction securely.
4.  **A Fresh Look**: The UI updates to reflect the results of the blockchain interaction, providing a seamless user experience.

## 6. Staying Ahead of the Curve: Our Tech Stack

We're committed to using the latest and greatest technologies to ensure a stable and secure platform. We use React 19, Next.js 15, and Tailwind CSS v4 to provide a high-performance, modern user experience.

## 7. Screenshots

Below are screenshots of the Conxian UI key interfaces.

### Homepage
![Homepage](docs/images/homepage.png)

### Launch Dashboard
![Launch Page](docs/images/launch_page.png)

### Swap Interface
![Swap Page](docs/images/guide_02_swap_page.png)

## 8. Our Promise: A Seamless User Experience

By combining a modern frontend with the power of the Stacks blockchain, we're able to provide a user-friendly and decentralized platform for interacting with the Conxian ecosystem. We're excited to have you on board!
