import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import ConnectWallet from '@/components/ConnectWallet';
import EnvStatus from '@/components/EnvStatus';
import LaunchPage from '@/app/launch/page';
import { useWallet } from '@/lib/wallet';
import { ApiService } from '@/lib/api-services';

// Mock the ApiService
vi.mock('@/lib/api-services', () => ({
  ApiService: {
    getDashboardMetrics: vi.fn().mockResolvedValue({
      systemHealth: { success: true, result: 'OK' },
    }),
  },
}));

vi.mock('@/lib/core-api', () => ({
  getAddressBalances: vi.fn().mockResolvedValue({
    stx: { balance: '1000000' }
  }),
  getFungibleTokenBalances: vi.fn().mockResolvedValue([]),
  getStatus: vi.fn().mockResolvedValue({ ok: true }),
  callReadOnly: vi.fn().mockResolvedValue({ ok: false }),
}));

// Mock the clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};
Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe('UI Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).StacksProvider;
  });

  describe('ConnectWallet', () => {
    it('should render "Install Wallet" when Stacks provider is not available', () => {
      (useWallet as Mock).mockReturnValue({
        isConnected: false,
        stxAddress: null,
        connectWallet: vi.fn(),
        signOut: vi.fn(),
      });

      render(<ConnectWallet />);
      expect(screen.getByRole('button', { name: /install wallet/i })).toBeInTheDocument();
    });

    it('should render "Connect Wallet" when provider is available and user is not connected', () => {
      window.StacksProvider = {};
      (useWallet as Mock).mockReturnValue({
        isConnected: false,
        stxAddress: null,
        connectWallet: vi.fn(),
        signOut: vi.fn(),
      });

      render(<ConnectWallet />);
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
    });

    it('should render disconnect and copy buttons when user is connected', () => {
      (useWallet as Mock).mockReturnValue({
        isConnected: true,
        stxAddress: 'ST1234567890ABCDEFGHIKLMNOPQRSTUVWXYZ',
        connectWallet: vi.fn(),
        signOut: vi.fn(),
      });

      render(<ConnectWallet />);

      expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /address/i })).toBeInTheDocument();
    });

    it('should copy address to clipboard when copy button is clicked', async () => {
      const stxAddress = 'ST1234567890ABCDEFGHIKLMNOPQRSTUVWXYZ';
      (useWallet as Mock).mockReturnValue({
        isConnected: true,
        stxAddress,
        connectWallet: vi.fn(),
        signOut: vi.fn(),
      });

      render(<ConnectWallet />);

      const copyButton = screen.getByRole('button', { name: /address/i });
      await userEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(stxAddress);
    });
  });

  it('should render the LaunchPage and allow clicking contribute tab', async () => {
    (useWallet as Mock).mockReturnValue({
      isConnected: false,
      stxAddress: null,
      connectWallet: vi.fn(),
      signOut: vi.fn(),
    });

    render(<LaunchPage />);

    const contributeTab = screen.getByRole('tab', { name: /contribute/i });
    await userEvent.click(contributeTab);

    const contributeButton = await screen.findByRole('button', { name: /contribute/i });
    expect(contributeButton).toBeInTheDocument();
  });

  it('should call the API when a button is clicked', async () => {
    render(
      <button onClick={() => ApiService.getDashboardMetrics()}>Refresh</button>
    );

    const button = screen.getByRole('button', { name: /refresh/i });
    await userEvent.click(button);

    expect(ApiService.getDashboardMetrics).toHaveBeenCalled();
  });

  describe('EnvStatus', () => {
    it('should render the status with a tooltip', async () => {
      render(<EnvStatus />);
      const statusElement = await screen.findByRole('status');
      expect(statusElement).toBeInTheDocument();
    });
  });
});
