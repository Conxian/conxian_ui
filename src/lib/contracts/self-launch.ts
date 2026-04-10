// src/lib/contracts/self-launch.ts - Smart contract integration
import { StacksNetwork, STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network";
import { callReadOnly, ReadOnlyResponse } from "../core-api";
import { standardPrincipalCV, uintCV, cvToHex, hexToCV, cvToJSON } from "@stacks/transactions";
import { BASE_PRINCIPAL } from "../contracts";

export interface LaunchPhase {
  id: string;
  name: string;
  minFunding: number;
  maxFunding: number;
  requiredContracts: string[];
  communitySupport: number;
  status: "pending" | "active" | "completed";
}

export interface Contribution {
  contributor: string;
  amount: number;
  tokensMinted: number;
  timestamp: number;
  level: string;
}

export interface TopContributor {
  address: string;
  amount: number;
  level: string;
}

export interface CommunityStats {
  totalContributors: number;
  totalFunding: number;
  averageContribution: number;
  topContributors: TopContributor[];
}

export class SelfLaunchContract {
  private network: StacksNetwork;
  private contractAddress: string;
  private contractName: string;

  constructor(network: "mainnet" | "testnet" | "devnet" = "mainnet") {
    this.network = this.getNetwork(network);
    this.contractAddress = BASE_PRINCIPAL;
    this.contractName = "self-launch-coordinator";
  }

  private getNetwork(type: "mainnet" | "testnet" | "devnet") {
    switch (type) {
      case "mainnet":
        return STACKS_MAINNET;
      case "testnet":
        return STACKS_TESTNET;
      case "devnet":
        return STACKS_TESTNET;
    }
  }

  // --- Read-Only Calls ---

  async getLaunchStatus() {
    try {
      const result = await this.readOnlyCall("get-launch-status", []);
      if (result.ok && result.result) {
        try {
          const cv = hexToCV(result.result);
          const data = cvToJSON(cv);
          return {
            phase: Number(data.value?.phase?.value || 1),
            fundingReceived: Number(data.value?.fundingReceived?.value || 0),
            fundingTarget: Number(data.value?.fundingTarget?.value || 0),
            budgetAllocated: Number(data.value?.budgetAllocated?.value || 0),
            progressPercentage: Number(data.value?.progressPercentage?.value || 0),
            contractsDeployed: Number(data.value?.contractsDeployed?.value || 0),
            systemHealth: Number(data.value?.systemHealth?.value || 0),
          };
        } catch (e) {
          console.warn("CV deserialization failed for getLaunchStatus: ", e);
          return this.getEmptyLaunchStatus();
        }
      }
      return this.getEmptyLaunchStatus();
    } catch (e) {
      console.warn("Error in getLaunchStatus:", e);
      return this.getEmptyLaunchStatus();
    }
  }

  async getFundingProgress() {
    try {
      const result = await this.readOnlyCall("get-funding-progress", []);
      if (result.ok && result.result) {
        try {
          const cv = hexToCV(result.result);
          const data = cvToJSON(cv);
          return {
            currentFunding: Number(data.value?.currentFunding?.value || 0),
            fundingTarget: Number(data.value?.fundingTarget?.value || 0),
            baseCost: Number(data.value?.baseCost?.value || 0),
            progressPercentage: Number(data.value?.progressPercentage?.value || 0),
            currentPhase: Number(data.value?.currentPhase?.value || 1),
            tokensMinted: Number(data.value?.tokensMinted?.value || 0),
          };
        } catch (e) {
          console.warn("CV deserialization failed for getFundingProgress: ", e);
          return this.getEmptyFundingProgress();
        }
      }
      return this.getEmptyFundingProgress();
    } catch (e) {
      console.warn("Error in getFundingProgress", e);
      return this.getEmptyFundingProgress();
    }
  }

  async getCommunityStats(): Promise<CommunityStats> {
    try {
      const _result = await this.readOnlyCall("get-community-stats", []);
      // Placeholder for actual implementation
      return {
        totalContributors: 0,
        totalFunding: 0,
        averageContribution: 0,
        topContributors: [],
      };
    } catch (_e) {
      return {
        totalContributors: 0,
        totalFunding: 0,
        averageContribution: 0,
        topContributors: [],
      };
    }
  }

  async getContributorLevel(contributor: string): Promise<string> {
    try {
      const args = [cvToHex(standardPrincipalCV(contributor))];
      const _result = await this.readOnlyCall("get-contributor-level", args);
      return "none";
    } catch (_e) {
      return "none";
    }
  }

  // --- Transactions ---

  async contributeFunding(account: string, amount: number) {
    return {
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: "contribute-funding",
      functionArgs: [uintCV(amount)],
      postConditions: [],
    };
  }

  // --- Helper Methods ---

  private async readOnlyCall(
    functionName: string,
    argsHex: string[]
  ): Promise<ReadOnlyResponse> {
    const sender = BASE_PRINCIPAL;
    return callReadOnly(
      this.contractAddress,
      this.contractName,
      functionName,
      sender,
      argsHex
    );
  }

  formatStxAmount(amount: number): string {
    return `${(amount / 1_000_000).toLocaleString()} STX`;
  }

  getPhaseName(phaseId: number): string {
    const phases: { [key: number]: string } = {
      1: "Bootstrap",
      2: "Micro Core",
      3: "Token System",
      4: "DEX Core",
      5: "Liquidity",
      6: "Governance",
      7: "Fully Operational",
    };
    return phases[phaseId] || "Unknown";
  }

  private getEmptyLaunchStatus() {
    return {
      phase: 1,
      fundingReceived: 0,
      fundingTarget: 0,
      budgetAllocated: 0,
      progressPercentage: 0,
      contractsDeployed: 0,
      systemHealth: 0,
    };
  }

  private getEmptyFundingProgress() {
    return {
      currentFunding: 0,
      fundingTarget: 0,
      baseCost: 0,
      progressPercentage: 0,
      currentPhase: 1,
      tokensMinted: 0,
    };
  }
}
