
import { render, screen, act, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConnectWallet from '@/components/ConnectWallet';
import EnvStatus from '@/components/EnvStatus';
import LaunchPage from '@/app/launch/page';
import { WalletProvider, useWallet } from '@/lib/wallet';
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
  getStatus: vi.fn().mockResolvedValue({ ok: true }),
  getV2Info: vi.fn().mockResolvedValue({ burn_block_height: 123456 }),
}));

// Mock the useWallet hook
const mockAddToast = vi.hoisted(() => vi.fn());
vi.mock('@/lib/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/wallet')>();
  return {
    ...actual,
    useWallet: vi.fn(),
  };
});

const mockedUseWallet = useWallet as vi.Mock;

// Mock the useSelfLaunch hook
vi.mock('@/lib/hooks/use-self-launch', () => ({
  useSelfLaunch: vi.fn().mockReturnValue({
    currentPhase: {
      id: '1',
      name: 'Phase 1',
      minFunding: 0,
      maxFunding: 10000,
      status: 'active',
      requiredContracts: [],
      communitySupport: 0,
    },
    fundingProgress: { current: 5000, target: 10000, percentage: 50 },
    communityStats: {
      totalContributors: 10,
      totalFunding: 5000,
      averageContribution: 500,
      topContributors: [{ address: 'SP2Z...W8L', amount: 1000, level: 'Gold' }],
    },
    userContribution: { total: 100, level: 'new' },
    isLoading: false,
    error: null,
    contribute: vi.fn().mockResolvedValue({ success: true }),
    getUserContribution: vi.fn(),
  }),
}));

describe('UI Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseWallet.mockReturnValue({
      stxAddress: null,
      connectWallet: vi.fn(),
      signOut: vi.fn(),
      addToast: mockAddToast,
    });
    // Ensure window.StacksProvider is not set by default
    if (window.StacksProvider) {
      delete window.StacksProvider;
    }
  });

  describe('ConnectWallet', () => {
    it('should render "Install Wallet" when Stacks provider is not available', () => {
      render(<WalletProvider><ConnectWallet /></WalletProvider>);
      expect(screen.getByRole('button', { name: /install wallet/i })).toBeInTheDocument();
    });

    it('should render "Connect Wallet" when provider is available and user is not connected', () => {
      window.StacksProvider = {};
      render(<WalletProvider><ConnectWallet /></WalletProvider>);
      expect(screen.getByRole('button', { name: /connect wallet/i })).toBeInTheDocument();
    });

    it('should render disconnect and copy buttons when user is connected', () => {
      window.StacksProvider = {};
      mockedUseWallet.mockReturnValue({
        stxAddress: 'SP2Z0Y4F6T8B7E6V5A0D3C1X9R5G4H3J2K1N0P8Q',
      });

      render(<WalletProvider><ConnectWallet /></WalletProvider>);

      expect(screen.getByRole('button', { name: /disconnect/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy address/i })).toBeInTheDocument();
    });

    it('should copy address to clipboard when copy button is clicked', async () => {
      window.StacksProvider = {};
      const user = userEvent.setup();
      const address = 'SP2Z0Y4F6T8B7E6V5A0D3C1X9R5G4H3J2K1N0P8Q';
      mockedUseWallet.mockReturnValue({ stxAddress: address });

      // Spy on writeText after userEvent.setup()
      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
      writeTextSpy.mockImplementation(async () => Promise.resolve());


      render(<WalletProvider><ConnectWallet /></WalletProvider>);

      const copyButton = screen.getByRole('button', { name: /copy address/i });
      await user.click(copyButton);

      expect(writeTextSpy).toHaveBeenCalledWith(address);

      // Restore original implementation
      writeTextSpy.mockRestore();
    });
  });

  it('should render the LaunchPage and show a toast when contributing without a wallet', async () => {
    render(
      <WalletProvider>
        <LaunchPage />
      </WalletProvider>
    );

    const contributeTab = screen.getByRole('tab', { name: /contribute/i });
    await act(async () => {
      await userEvent.click(contributeTab);
    });

    const tabPanel = screen.getByRole('tabpanel');
    const contributeButton = within(tabPanel).getByRole('button', { name: /contribute/i });
    await act(async () => {
      await userEvent.click(contributeButton);
    });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.stringContaining('Please connect your wallet to contribute'),
        'info'
      );
    });
  });

  it('should call the API when a button is clicked', async () => {
    render(
      <WalletProvider>
        <button onClick={() => ApiService.getDashboardMetrics()}>
          Refresh Metrics
        </button>
      </WalletProvider>
    );
    await act(async () => {
      await userEvent.click(screen.getByText('Refresh Metrics'));
    });
    expect(ApiService.getDashboardMetrics).toHaveBeenCalled();
  });

  describe('EnvStatus', () => {
    it('should render the status with a tooltip', async () => {
      render(<EnvStatus />);
      expect(await screen.findByRole('status')).toHaveAttribute('title', 'Operational');
    });
  });
});
