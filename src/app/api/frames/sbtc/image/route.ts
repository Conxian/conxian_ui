import React from "react";
import { ImageResponse } from "next/og";
import { getGatewayPrices, getGatewayReserves, getGatewayStatus } from "@/lib/gateway";
import type { PriceInfo } from "@/lib/gateway";

export const runtime = "edge";

function formatUsd(n: number | null | undefined): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "N/A";
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatRatio(n: number | null | undefined): string {
  if (typeof n !== "number" || Number.isNaN(n)) return "N/A";
  return n.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

export async function GET(): Promise<ImageResponse> {
  const [reserves, prices, status] = await Promise.all([
    getGatewayReserves().catch(() => []),
    getGatewayPrices().catch(() => ({} as Record<string, PriceInfo>)),
    getGatewayStatus().catch(() => null),
  ]);

  const sbtc = reserves.find((r) => r.asset === "sBTC") || null;
  const sbtcPrice = prices["sBTC"]?.price_usd ?? null;

  const bg = "#FDFBF7";
  const green = "#2E403B";
  const gold = "#D4A017";

  const rootStyle: React.CSSProperties = {
    width: "1200px",
    height: "630px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "64px",
    background: bg,
    color: "#333333",
    fontFamily: "ui-sans-serif, system-ui",
  };

  const cardStyle: React.CSSProperties = {
    flex: 1,
    background: "#FFFFFF",
    border: "1px solid rgba(46,64,59,0.15)",
    borderRadius: 20,
    padding: 32,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const h = React.createElement;

  const el = h(
    "div",
    { style: rootStyle },
    h(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "12px" } },
        h("div", { style: { fontSize: 52, fontWeight: 800, color: green } }, "Conxian sBTC Monitor"),
        h(
          "div",
          { style: { fontSize: 28, color: "#4b5563" } },
          "Gateway-backed reserve + price snapshot"
        )
      ),
      h("div", { style: { fontSize: 20, fontWeight: 700, color: gold } }, "SIDL Frame")
    ),
    h(
      "div",
      { style: { display: "flex", gap: "32px" } },
      h(
        "div",
        { style: cardStyle },
        h("div", { style: { fontSize: 20, color: "#6b7280" } }, "sBTC price"),
        h("div", { style: { fontSize: 44, fontWeight: 800, color: green } }, formatUsd(sbtcPrice)),
        h("div", { style: { fontSize: 18, color: "#6b7280" } }, `Source: ${prices["sBTC"]?.source || "N/A"}`)
      ),
      h(
        "div",
        { style: cardStyle },
        h("div", { style: { fontSize: 20, color: "#6b7280" } }, "sBTC collateral ratio"),
        h(
          "div",
          { style: { fontSize: 44, fontWeight: 800, color: green } },
          formatRatio(sbtc?.collateral_ratio)
        ),
        h("div", { style: { fontSize: 18, color: "#6b7280" } }, `Status: ${sbtc?.status || "N/A"}`)
      ),
      h(
        "div",
        { style: cardStyle },
        h("div", { style: { fontSize: 20, color: "#6b7280" } }, "Gateway status"),
        h("div", { style: { fontSize: 44, fontWeight: 800, color: green } }, status?.status || "unknown"),
        h("div", { style: { fontSize: 18, color: "#6b7280" } }, `TVL: ${formatUsd(status?.total_tvl_usd ?? null)}`)
      )
    ),
    h(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
      h("div", { style: { fontSize: 20, color: "#6b7280" } }, "Use Vote to cast a governance decision."),
      h("div", { style: { fontSize: 18, color: "#6b7280" } }, "Conxian Gateway /api/v1")
    )
  );

  return new ImageResponse(el, { width: 1200, height: 630 });
}
