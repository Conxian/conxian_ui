import { describe, it, expect, vi, beforeEach } from "vitest";

const mockHexValue = "0x746869732d69732d612d6d6f636b"; // "this-is-a-mock"
const mockGetSystemHealth = vi.hoisted(() => vi.fn());
const mockGetAggregatedMetrics = vi.hoisted(() => vi.fn());
const mockGetFinancialMetrics = vi.hoisted(() => vi.fn());
const mockGetStakingInfo = vi.hoisted(() => vi.fn());
const mockGetPair = vi.hoisted(() => vi.fn());
const mockGetRoute = vi.hoisted(() => vi.fn());
const mockGetPrice = vi.hoisted(() => vi.fn());
const mockGetDashboardMetrics = vi.hoisted(() => vi.fn());

// Mock the entire contract-interactions module before anything else is imported
vi.mock("@/lib/contract-interactions", () => ({
  ContractInteractions: {
    getSystemHealth: mockGetSystemHealth,
    getAggregatedMetrics: mockGetAggregatedMetrics,
    getFinancialMetrics: mockGetFinancialMetrics,
    getStakingInfo: mockGetStakingInfo,
    getPair: mockGetPair,
    getRoute: mockGetRoute,
    getPrice: mockGetPrice,
    getDashboardMetrics: mockGetDashboardMetrics,
  },
}));

import { ApiService } from "../lib/api-services";

describe("API Service", () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    vi.clearAllMocks();

    // Setup default successful mock implementations
    mockGetSystemHealth.mockResolvedValue({
      success: true,
      result: { result: mockHexValue },
    });
    mockGetAggregatedMetrics.mockResolvedValue({
      success: true,
      result: { result: mockHexValue },
    });
    mockGetFinancialMetrics.mockResolvedValue({
      success: true,
      result: { result: mockHexValue },
    });
    mockGetStakingInfo.mockResolvedValue({
      success: true,
      result: { result: mockHexValue },
    });
    mockGetPair.mockResolvedValue({
      success: true,
      result: { result: mockHexValue },
    });
    mockGetDashboardMetrics.mockImplementation(async () => {
      const [systemHealth, aggregatedMetrics, financialMetrics] =
        await Promise.all([
          mockGetSystemHealth(),
          mockGetAggregatedMetrics(),
          mockGetFinancialMetrics(),
        ]);
      return { systemHealth, aggregatedMetrics, financialMetrics };
    });
  });

  it("should expose all contract interaction methods", () => {
    expect(ApiService.getPair).toBeDefined();
    expect(ApiService.getSystemHealth).toBeDefined();
    expect(ApiService.getStakingInfo).toBeDefined();
  });

  describe("Dashboard Metrics", () => {
    it("should fetch all dashboard metrics correctly", async () => {
      const metrics = await ApiService.getDashboardMetrics();

      expect(mockGetSystemHealth).toHaveBeenCalled();
      expect(mockGetAggregatedMetrics).toHaveBeenCalled();
      expect(mockGetFinancialMetrics).toHaveBeenCalled();

      expect(metrics.systemHealth.success).toBe(true);
      expect(metrics.systemHealth.result?.result).toEqual(mockHexValue);
      expect(metrics.aggregatedMetrics.success).toBe(true);
      expect(metrics.financialMetrics.success).toBe(true);
    });

    it("should handle errors in individual metric fetching", async () => {
      // Override the default mock for this specific test
      mockGetSystemHealth.mockResolvedValueOnce({
        success: false,
        error: "System health check failed",
      });

      const metrics = await ApiService.getDashboardMetrics();

      expect(metrics.systemHealth.success).toBe(false);
      expect(metrics.systemHealth.error).toBe("System health check failed");
      expect(metrics.aggregatedMetrics.success).toBe(true);
    });
  });

  describe("Service Implementations", () => {
    it("should get system health", async () => {
      const result = await ApiService.getSystemHealth();
      expect(result.success).toBe(true);
      expect(result.result?.result).toEqual(mockHexValue);
      expect(mockGetSystemHealth).toHaveBeenCalled();
    });

    it("should get staking info for a user", async () => {
      const user = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
      const result = await ApiService.getStakingInfo(user);
      expect(result.success).toBe(true);
      expect(result.result?.result).toEqual(mockHexValue);
      expect(mockGetStakingInfo).toHaveBeenCalledWith(user);
    });

    it("should handle fetch errors gracefully", async () => {
      mockGetSystemHealth.mockRejectedValue(
        new Error("Network request failed")
      );

      const result = await ApiService.getSystemHealth();
      expect(result.success).toBe(false);
      expect(result.error).toContain("Network request failed");
    });

    it("should handle missing contracts gracefully", async () => {
      mockGetSystemHealth.mockResolvedValueOnce({
        success: false,
        error: "conxian-protocol contract not found",
      });

      const result = await ApiService.getSystemHealth();
      expect(result.success).toBe(false);
      expect(result.error).toContain("not found");
    });
  });
});
