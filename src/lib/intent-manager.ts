import { AppConfig } from "./config";
import { logger } from "./logger";

export interface Intent {
  type: string;
  [key: string]: unknown;
}

export class IntentManager {
  private gatewayUrl: string;
  private apiKey: string;

  constructor() {
    this.gatewayUrl = AppConfig.gatewayUrl;
    this.apiKey = AppConfig.apiKey;
  }

  async execute(intent: Intent) {
    logger.info("Executing intent via gateway", {
      module: "IntentManager",
      gatewayUrl: this.gatewayUrl,
      intentType: intent.type,
    });

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (this.apiKey) {
        headers["x-api-key"] = this.apiKey;
      }

      const response = await fetch(`${this.gatewayUrl}/v1/intent/execute`, {
        method: "POST",
        headers,
        body: JSON.stringify(intent),
      });

      if (!response.ok) {
        const fallbackMessage = `Gateway returned status ${response.status}`;
        const errorData = await response.json().catch(() => ({} as { error?: string }));
        const message =
          typeof errorData.error === "string" && errorData.error.trim().length > 0
            ? errorData.error
            : fallbackMessage;

        logger.error("Intent execution failed", {
          module: "IntentManager",
          status: response.status,
          message,
        });
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      logger.error("Network error during intent execution", {
        module: "IntentManager",
        error,
      });
      throw error;
    }
  }

  async getShieldedBalance(walletId: string) {
    return this.execute({ type: "get-shielded-balance", walletId });
  }
}

export const intentManager = new IntentManager();
