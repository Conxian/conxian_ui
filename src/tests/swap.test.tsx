
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SwapPage from '@/app/swap/page';
import { WalletProvider, useWallet } from '@/lib/wallet';
import { getFungibleTokenBalances } from '@/lib/coreApi';
import { Tokens } from '@/lib/contracts';

// Mock dependencies
vi.mock('@stacks/transactions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@stacks/transactions')>();
  return {
    ...actual,
    cvToHex: vi.fn().mockReturnValue('0x01'),
    contractPrincipalCV: vi.fn().mockReturnValue({}),
    uintCV: vi.fn().mockReturnValue({}),
  };
});

vi.mock('@stacks/connect', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@stacks/connect')>();
  return {
    ...actual,
    openContractCall: vi.fn(),
  };
});

vi.mock('@/lib/coreApi', () => ({
  callReadOnly: vi.fn().mockResolvedValue({ ok: true, result: '' }),
  getFungibleTokenBalances: vi.fn().mockResolvedValue([]),
  decodeResultHex: vi.fn(),
  getTupleField: vi.fn(),
  getUint: vi.fn(),
  decodeHex: vi.fn(),
}));

vi.mock('@/lib/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/wallet')>();
  return {
    ...actual,
    useWallet: vi.fn(),
  };
});

const mockedUseWallet = useWallet as vi.Mock;
const mockedGetBalances = getFungibleTokenBalances as vi.Mock;

describe('SwapPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseWallet.mockReturnValue({
      stxAddress: 'SP1234',
      connectWallet: vi.fn(),
      signOut: vi.fn(),
    });
    mockedGetBalances.mockResolvedValue(
      Tokens.map(t => ({ asset_identifier: t.id, balance: '5000000' }))
    );
  });

  it('renders the "MAX" button when balance is available', async () => {
    await act(async () => {
      render(
        <WalletProvider>
          <SwapPage />
        </WalletProvider>
      );
    });

    const maxButton = await screen.findByRole('button', { name: /set maximum amount/i });
    expect(maxButton).toBeInTheDocument();
  });

  it('sets the amount to max when "MAX" is clicked', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(
        <WalletProvider>
          <SwapPage />
        </WalletProvider>
      );
    });

    const maxButton = await screen.findByRole('button', { name: /set maximum amount/i });
    await user.click(maxButton);

    const fromInput = screen.getByLabelText(/from/i);
    await waitFor(() => {
      expect(fromInput).toHaveValue('5.000000');
    });
  });

  it('slippage buttons are accessible buttons and have aria-pressed', async () => {
    await act(async () => {
      render(
        <WalletProvider>
          <SwapPage />
        </WalletProvider>
      );
    });

    const slippageButton = screen.getByRole('button', { name: '0.5%' });
    expect(slippageButton).toBeInTheDocument();
    expect(slippageButton).toHaveAttribute('aria-pressed', 'true');

    const otherSlippage = screen.getByRole('button', { name: '1%' });
    expect(otherSlippage).toHaveAttribute('aria-pressed', 'false');
  });
});
