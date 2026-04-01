import React from "react";
import { ImageResponse } from "next/og";
import { getGovernanceProposals } from "@/lib/gateway";

export const runtime = "edge";

export async function GET(): Promise<ImageResponse> {
  const proposals = await getGovernanceProposals().catch(() => []);
  const p = proposals.find((pp) => pp.status === "active") || proposals[0] || null;

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

  const proposalCardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid rgba(46,64,59,0.15)",
    borderRadius: 20,
    padding: 40,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };

  const voteCardStyle: React.CSSProperties = {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    border: "1px solid rgba(46,64,59,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 6,
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
        h("div", { style: { fontSize: 52, fontWeight: 800, color: green } }, "Conxian Governance"),
        h(
          "div",
          { style: { fontSize: 24, color: "#4b5563" } },
          "One-click voting via Gateway /api/v1"
        )
      ),
      h("div", { style: { fontSize: 20, fontWeight: 700, color: gold } }, "SIDL Frame")
    ),
    h(
      "div",
      { style: proposalCardStyle },
      h("div", { style: { fontSize: 22, color: "#6b7280" } }, "Active proposal"),
      h("div", { style: { fontSize: 42, fontWeight: 800, color: green } }, p?.title || "No active proposal"),
      h("div", { style: { fontSize: 22, color: "#374151" } }, p?.description || ""),
      h(
        "div",
        { style: { display: "flex", gap: "24px", marginTop: 24 } },
        h(
          "div",
          { style: voteCardStyle },
          h("div", { style: { fontSize: 18, color: "#6b7280" } }, "Yes votes"),
          h("div", { style: { fontSize: 36, fontWeight: 800, color: green } }, String(p?.yes_votes ?? 0))
        ),
        h(
          "div",
          { style: voteCardStyle },
          h("div", { style: { fontSize: 18, color: "#6b7280" } }, "No votes"),
          h("div", { style: { fontSize: 36, fontWeight: 800, color: green } }, String(p?.no_votes ?? 0))
        )
      )
    ),
    h(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
      h("div", { style: { fontSize: 20, color: "#6b7280" } }, "Vote Yes or No."),
      h("div", { style: { fontSize: 18, color: "#6b7280" } }, p ? p.id : "")
    )
  );

  return new ImageResponse(el, { width: 1200, height: 630 });
}
