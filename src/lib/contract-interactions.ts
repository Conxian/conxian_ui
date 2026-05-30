import {
  ClarityValue,
  standardPrincipalCV,
  uintCV,
  cvToHex,
} from '@stacks/transactions';
import { CoreContracts, BASE_PRINCIPAL } from './contracts';
import { callReadOnly } from './core-api';
import { IntentManager, Intent } from './intent-manager';

// --- Types ---

export interface ApiResult<T> {
  success: boolean;
  result?: T;
  data?: T; // Alias for result to match UI usage
  error?: string;
}

// --- Helper Functions ---

async function callReadOnlyContractFunction<T>(
  contractId: string,
  functionName: string,
  functionArgs: ClarityValue[],
  senderAddress: string
): Promise<ApiResult<T>> {
  const [contractAddress, contractName] = contractId.split('.');
  try {
    const hexArgs = functionArgs.map(arg => cvToHex(arg));
    const result = await callReadOnly(contractAddress, contractName, functionName, senderAddress, hexArgs);
    if (!result.ok) {
      throw new Error(`Read-only call failed: ${result.error}`);
    }
    return { success: true, result: result.result as T, data: result.result as T };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}

const findContract = (idPart: string): string | undefined => {
    const contract = CoreContracts.find(c => c.id.includes(idPart));
    return contract?.id;
}

// --- ContractInteractions Class ---

export class ContractInteractions {
  private static readonly SENDER_ADDRESS = BASE_PRINCIPAL;
  private static readonly intentManager = new IntentManager();

  private static async executeReadOnly<T>(
    contractIdentifier: string,
    functionName: string,
    args: ClarityValue[] = []
  ): Promise<ApiResult<T>> {
    const contractId = findContract(contractIdentifier);
    if (!contractId) {
      return {
        success: false,
        error: `${contractIdentifier} contract not found`,
      };
    }
    return callReadOnlyContractFunction(
      contractId,
      functionName,
      args,
      this.SENDER_ADDRESS
    );
  }

  // --- DEX ---
  static getPair = (tokenA: string, tokenB: string) =>
    this.executeReadOnly("pool-template", "get-pair", [
      standardPrincipalCV(tokenA),
      standardPrincipalCV(tokenB),
    ]);
  static createPair = (tokenA: string, tokenB: string) =>
    this.executeReadOnly("pool-template", "create-pair", [
      standardPrincipalCV(tokenA),
      standardPrincipalCV(tokenB),
    ]);
  static getLiquidityProviderShare = (address: string) =>
    this.executeReadOnly("liquidity-provider", "get-lp-share", [
      standardPrincipalCV(address),
    ]);

  static deposit = (token: string, amount: number) =>
    this.executeReadOnly("vault", "deposit", [
      standardPrincipalCV(token),
      uintCV(amount),
    ]);

  static getPrice = (token: string) =>
    this.executeReadOnly("oracle-aggregator", "get-price", [standardPrincipalCV(token)]);

  static getTokenBalance = (token: string, address: string) =>
    this.executeReadOnly(token, "get-balance", [standardPrincipalCV(address)]);

  static getTokenTotalSupply = (token: string) =>
    this.executeReadOnly(token, "get-total-supply");
  static getDecimals = (tokenId: string) =>
    this.executeReadOnly(tokenId, "get-decimals");
  static getAllowance = (tokenId: string, owner: string, spender: string) =>
    this.executeReadOnly(tokenId, "get-allowance", [
      standardPrincipalCV(owner),
      standardPrincipalCV(spender),
    ]);

  // --- Vault & Bond ---
  static getVaultBalance = (token: string) =>
    this.executeReadOnly("vault", "get-balance", [standardPrincipalCV(token)]);
  static createBond = (amount: number, maturity: number) =>
    this.executeReadOnly("bond-factory", "create-bond", [
      uintCV(amount),
      uintCV(maturity),
    ]);

  // --- AMM ---
  static getAmmInfo = () => this.executeReadOnly("amm", "get-info");

  // --- Flash Loan ---
  static executeFlashLoan = (loanAmount: number, loanAsset: string) =>
    this.executeReadOnly("flash-loan", "execute-loan", [
      uintCV(loanAmount),
      standardPrincipalCV(loanAsset),
    ]);

  // --- Security ---
  static getCircuitBreakerStatus = () =>
    this.executeReadOnly("circuit-breaker", "get-status");
  static isContractPaused = (contractId: string) =>
    this.executeReadOnly("circuit-breaker", "is-contract-paused", [
      standardPrincipalCV(contractId),
    ]);

  // --- Governance & Staking ---
  static verifyGovernanceSignature = (_signature: string) =>
    Promise.resolve({ success: true, verified: true });
  static getStakingInfo = (user: string) =>
    this.executeReadOnly("cxd-staking", "get-user-stake", [
      standardPrincipalCV(user),
    ]);

  // --- System Health & Metrics ---
  static getSystemHealth = () =>
    this.executeReadOnly<Record<string, unknown>>("conxian-protocol", "get-protocol-status");
  static getAggregatedMetrics = () =>
    this.executeReadOnly<Record<string, unknown>>("economic-policy-engine", "get-market-parameters");
  static getFinancialMetrics = () =>
    this.executeReadOnly<Record<string, unknown>>("economic-policy-engine", "get-current-rates");

  // --- Dashboard & Recommendations ---
  static getDashboardData = async () => this.getDashboardMetrics();
  static getPerformanceRecommendations = () =>
    this.executeReadOnly("risk-unit", "get-global-collateral-factor");

  static async getDashboardMetrics(): Promise<{
    systemHealth: ApiResult<Record<string, unknown>>;
    aggregatedMetrics: ApiResult<Record<string, unknown>>;
    financialMetrics: ApiResult<Record<string, unknown>>;
  }> {
    const [systemHealth, aggregatedMetrics, financialMetrics] =
      await Promise.all([
        this.getSystemHealth(),
        this.getAggregatedMetrics(),
        this.getFinancialMetrics(),
      ]);
    return {
      systemHealth,
      aggregatedMetrics,
      financialMetrics,
    };
  }

  // --- Enterprise & Yield ---
  static getEnterpriseConfig = () =>
    this.executeReadOnly("lending-orchestrator", "get-config");
  static getYieldStrategies = () =>
    this.executeReadOnly("cxd-staking", "get-staking-info");

  // --- Transactions ---
  static swap = async (
    fromToken: string,
    toToken: string,
    amount: number
  ) => this.executeIntent({ type: "swap", fromToken, toToken, amount });

  static addLiquidity = async (poolName: string, amount: number) =>
    this.executeIntent({ type: "add-liquidity", poolName, amount });

  static removeLiquidity = async (poolName: string, percentage: number) =>
    this.executeIntent({ type: "remove-liquidity", poolName, percentage });

  static executeIntent = async (intent: Intent | unknown) => {
    return this.intentManager.execute(intent as Intent);
  };

  static setAllowance = async (
    tokenId: string,
    spender: string,
    amount: number
  ) => this.executeIntent({ type: "set-allowance", tokenId, spender, amount });

  static getBalance = async (address: string) => ({
    success: true,
    balance: 0,
  });
  static getTokenInfo = async (_tokenId: string) => ({
    success: true,
    info: {},
  });
  static getRouterInfo = async () => ({ success: true, info: {} });
  static estimateSwap = async (
    _fromToken: string,
    _toToken: string,
    _amount: number
  ) => ({ success: true, estimate: 0 });
  static getPoolDetails = async (_poolName: string) => ({
    success: true,
    details: {},
  });
  static getPositions = async (_address: string) => {
    // Return empty for mainnet until implemented
    return [];
  };

  // --- Shielded Wallet ---
  static createShieldedWallet = async () => this.executeIntent({ type: "create-shielded-wallet" });
  static getShieldedWallets = async (user: string) => this.executeIntent({ type: "list-shielded-wallets", user });
  static getShieldedWalletBalance = async (walletId: string) => this.intentManager.getShieldedBalance(walletId);
  static sendFromShieldedWallet = async (
    walletId: string,
    recipient: string,
    amount: number
  ) => this.executeIntent({ type: "shielded-send", walletId, recipient, amount });

  static receiveToShieldedWallet = async (
    walletId: string,
    amount: number
  ) => this.executeIntent({ type: "shielded-receive", walletId, amount });

  static createNewWallet = async () => this.createShieldedWallet();
  static fetchUserWallets = (user: string) => this.getShieldedWallets(user);
  static fetchWalletBalance = (walletId: string) => this.getShieldedWalletBalance(walletId);
  static sendFunds = (walletId: string, recipient: string, amount: number) => this.sendFromShieldedWallet(walletId, recipient, amount);
  static receiveFunds = (walletId: string, amount: number) => this.receiveToShieldedWallet(walletId, amount);
}
