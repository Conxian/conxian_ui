import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import SwapPage from '@/app/swap/page';
import { useWallet } from '@/lib/wallet';
import { getFungibleTokenBalances } from '@/lib/core-api';
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
    showConnect: vi.fn(),
  };
});

vi.mock('@/lib/core-api', () => ({
  getFungibleTokenBalances: vi.fn(),
  callReadOnly: vi.fn().mockResolvedValue({ ok: true, result: '0x01' }),
}));

describe('SwapPage', () => {
  const mockStxAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  beforeEach(() => {
    vi.clearAllMocks();
    (useWallet as Mock).mockReturnValue({
      isConnected: true,
      stxAddress: mockStxAddress,
    });

    // Mock balances for all tokens
    (getFungibleTokenBalances as Mock).mockResolvedValue(
      Tokens.map(token => ({
        asset_identifier: token.id,
        balance: '100000000',
      }))
    );
  });

  it('renders the "MAX" button when balance is available', async () => {
    render(<SwapPage />);
    const maxButton = await screen.findByRole('button', { name: /set maximum amount/i });
    expect(maxButton).toBeInTheDocument();
  });

  it('sets the amount to max when "MAX" is clicked', async () => {
    const user = userEvent.setup();
    render(<SwapPage />);

    // Wait for the formatted balance: formatAmount("100000000", 6) -> "100"
    // Since my formatAmount trims trailing zeros.
    const balanceDisplay = await screen.findByText("100", {}, { timeout: 5000 });
    expect(balanceDisplay).toBeInTheDocument();

    const maxButton = screen.getByRole('button', { name: /set maximum amount/i });
    await user.click(maxButton);

    const input = screen.getByLabelText(/Asset In/i) as HTMLInputElement;
    await waitFor(() => {
       expect(input.value).toBe('100');
    });
  });

  it('slippage buttons are accessible buttons and have aria-pressed', async () => {
    render(<SwapPage />);
    const slippageButton = screen.getByRole('button', { name: '0.5%' });
    expect(slippageButton).toBeInTheDocument();
    expect(slippageButton).toHaveAttribute('aria-pressed', 'true');
  });
});
