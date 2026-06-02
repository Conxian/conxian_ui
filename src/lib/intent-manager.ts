import { AppConfig } from "./config";
import { logger } from "./logger";

export interface Intent {
  type: string;
  [key: string]: string | number | boolean | unknown;
}

export class IntentManager {
  private gatewayUrl: string;
  private apiKey: string;

  constructor() {
    this.gatewayUrl = AppConfig.gatewayUrl;
    this.apiKey = AppConfig.apiKey;
  }

  async execute(intent: Intent) {
    logger.info("Sending action to gateway", { gatewayUrl: this.gatewayUrl, intent });

    try {
      const response = await fetch(`${this.gatewayUrl}/v1/intent/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify(intent),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Gateway returned status ${response.status}`);
      }

      return await response.json();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error("Action failed", { error: msg });
      return {
        status: "failed",
        error: msg,
      };
    }
  }

  async getShieldedBalance(walletId: string) {
    try {
      const response = await fetch(`${this.gatewayUrl}/v1/shielded/balance/${walletId}`, {
        headers: {
          "x-api-key": this.apiKey,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch private balance");
      return await response.json();
    } catch (error: unknown) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}
