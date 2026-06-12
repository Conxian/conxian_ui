import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as React from 'react';

// Polyfill React.act for React 19 compatibility
// Testing Library v16+ expects act to be on the React object.
if (typeof (React as any).act !== 'function') {
  const actPolyfill = (cb: any) => {
    const result = cb();
    if (result && typeof result.then === 'function') {
      return result;
    }
    return Promise.resolve(result);
  };

  try {
    Object.defineProperty(React, 'act', {
      value: actPolyfill,
      writable: true,
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    (React as any).act = actPolyfill;
  }
}

// Ensure the environment is treated as a test environment for act warnings
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StacksProvider?: any;
  }
}

process.env.VITEST = 'true';

vi.mock('@/lib/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/wallet')>();
  const TEST_PRINCIPAL = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  return {
    ...actual,
    userSession: {
      isUserSignedIn: vi.fn().mockReturnValue(true),
      loadUserData: vi.fn().mockReturnValue({
        profile: {
          stxAddress: {
            testnet: TEST_PRINCIPAL,
            mainnet: TEST_PRINCIPAL,
          },
        },
      }),
    },
    useWallet: vi.fn().mockReturnValue({
      isConnected: true,
      stxAddress: TEST_PRINCIPAL,
      connectWallet: vi.fn(),
      signOut: vi.fn(),
    }),
    WalletProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});
