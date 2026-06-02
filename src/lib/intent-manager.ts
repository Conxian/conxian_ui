import { logger } from "./logger";
import { AppConfig } from "./config";

export interface Intent {
  type: string;
  payload?: any;
  [key: string]: any;
}

export class IntentManager {
  private gatewayUrl: string;

  constructor() {
    this.gatewayUrl = AppConfig.gatewayUrl;
  }

  async execute(intent: Intent) {
    logger.info("Executing intent via gateway", { module: "IntentManager", gateway: this.gatewayUrl, intent });

    try {
      const response = await fetch(`${this.gatewayUrl}/v1/intent/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(intent),
      });

      if (!response.ok) {
        const msg = await response.text();
        logger.error("Intent execution failed", { module: "IntentManager", message: msg });
        throw new Error(msg);
      }

      return await response.json();
    } catch (e) {
      logger.error("Network error during intent execution", { module: "IntentManager", error: e });
      throw e;
    }
  }

  async getShieldedBalance(walletId: string) {
    return this.execute({ type: "get-shielded-balance", walletId });
  }
}

export const intentManager = new IntentManager();
