import { describe, it, expect, vi } from 'vitest';
import { ContractInteractions } from '../lib/contract-interactions';
import { CoreContracts } from '../lib/contracts';

// --- Mocks and Setup ---

vi.mock('../lib/core-api', () => ({
  callReadOnly: vi.fn().mockImplementation((principal, _name, functionName) => {
    if (functionName === 'get-price' && principal === 'ST456') {
      return Promise.resolve({ ok: false, error: 'Network error' });
    }
    return Promise.resolve({ ok: true, result: '0x01' });
  }),
}));

const VALID_STX_ADDR_A = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const VALID_STX_ADDR_B = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'; // Using same valid address to avoid checksum issues

describe('Contract Interactions', () => {
  it('should export ContractInteractions class', () => {
    expect(ContractInteractions).toBeDefined();
  });

  it('should have static methods for common operations', () => {
    expect(ContractInteractions.getPair).toBeInstanceOf(Function);
    expect(ContractInteractions.createPair).toBeInstanceOf(Function);
    expect(ContractInteractions.addLiquidity).toBeInstanceOf(Function);
    expect(ContractInteractions.removeLiquidity).toBeInstanceOf(Function);
    expect(ContractInteractions.swap).toBeInstanceOf(Function);
    expect(ContractInteractions.getPrice).toBeInstanceOf(Function);
    expect(ContractInteractions.getTokenBalance).toBeInstanceOf(Function);
  });

  it('should have all required contracts configured', () => {
    // Updated to match actual backend contracts from Clarinet.toml
    const requiredContracts = ['circuit-breaker', 'oracle-aggregator', 'swap-manager', 'pool-template'];
    requiredContracts.forEach((idPart) => {
      const contract = CoreContracts.find((c) => c.id.includes(idPart));
      expect(contract, `${idPart} not found`).toBeDefined();
    });
  });

  it('should have correct contract address format', () => {
    CoreContracts.forEach((contract) => {
      expect(contract.id).toMatch(/^ST[0-9A-Z]+\.[a-zA-Z0-9-]+$/);
    });
  });

  it('should have proper contract kinds', () => {
    // Updated to match actual contract kinds from aligned contracts.ts
    const validKinds = ['dex', 'oracle', 'token', 'vault', 'governance', 'security', 'core', 'treasury', 'dimensional', 'lending', 'automation'];
    CoreContracts.forEach((contract) => {
      expect(validKinds).toContain(contract.kind);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing contracts gracefully', async () => {
      const originalFind = CoreContracts.find;
      CoreContracts.find = vi.fn().mockReturnValue(undefined);

      const resultFail = await ContractInteractions.getPair(VALID_STX_ADDR_A, VALID_STX_ADDR_B);
      expect(resultFail.success).toBe(false);
      expect(resultFail.error).toBe('pool-template contract not found');

      CoreContracts.find = originalFind;
    });

    it('should handle network errors gracefully', async () => {
      const oracleContract = { id: 'ST456.oracle-aggregator', kind: 'oracle' };
      const originalFind = CoreContracts.find;
      CoreContracts.find = vi.fn().mockImplementation(() => {
          return oracleContract;
      });

      const result = await ContractInteractions.getPrice(VALID_STX_ADDR_A);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Read-only call failed: Network error');

      CoreContracts.find = originalFind;
    });
  });
});
