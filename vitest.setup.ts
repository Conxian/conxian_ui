import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as React from 'react';

// Polyfill React.act for React 19 compatibility
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

// Mock react-dom/test-utils to prevent it from calling a missing React.act
vi.mock('react-dom/test-utils', async (importOriginal) => {
  try {
    const actual = await importOriginal<any>();
    return {
      ...actual,
      act: (React as any).act || ((cb: any) => cb()),
    };
  } catch (e) {
    return {
      act: (React as any).act || ((cb: any) => cb()),
    };
  }
});

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StacksProvider?: any;
  }
}

process.env.VITEST = 'true';
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('@/lib/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/wallet')>();
  // Use a generic test principal that we can reference
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
