import { NextRequest, NextResponse } from "next/server";
import { renderFrameHtml } from "@/lib/frames/frame-html";
import { parseFrameAction } from "@/lib/frames/farcaster";
import { getGovernanceProposals, submitGovernanceVote } from "@/lib/gateway";

type FrameState = {
  proposalId: string;
};

function absoluteUrl(req: NextRequest, path: string): string {
  const url = new URL(req.url);
  url.pathname = path;
  url.search = "";
  return url.toString();
}

function parseState(raw: string | undefined): FrameState | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as { proposalId?: unknown };
    if (typeof j?.proposalId === "string") return { proposalId: j.proposalId };
    return null;
  } catch {
    return null;
  }
}

async function render(req: NextRequest, opts?: { state?: FrameState; note?: string }): Promise<string> {
  const proposals = await getGovernanceProposals().catch(() => []);
  const active = proposals.find((p) => p.status === "active") || proposals[0] || null;

  const proposalId = opts?.state?.proposalId || active?.id || "GOV-001";
  const imageUrl = absoluteUrl(req, "/api/frames/governance/image");
  const postUrl = absoluteUrl(req, "/api/frames/governance");
  const sbtcUrl = absoluteUrl(req, "/api/frames/sbtc");

  const title = opts?.note ? `Conxian Governance (${opts.note})` : "Conxian Governance Vote";

  return renderFrameHtml({
    title,
    imageUrl,
    postUrl,
    buttons: [
      { label: "Yes" },
      { label: "No" },
      { label: "Back", action: "post", target: sbtcUrl },
    ],
    state: { proposalId },
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const html = await render(req);
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json().catch(() => null)) as unknown;
  const action = parseFrameAction(body);

  if (!action) {
    const html = await render(req);
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const state = parseState(action.untrustedData.state);
  const button = action.untrustedData.buttonIndex;
  const voter = `ubi:btc:${action.untrustedData.fid}`;

  if (button === 1 || button === 2) {
    const choice = button === 1 ? "yes" : "no";
    await submitGovernanceVote({
      proposalId: state?.proposalId || "GOV-001",
      voter,
      choice,
    }).catch(() => null);

    const html = await render(req, { state: state || { proposalId: "GOV-001" }, note: "vote recorded" });
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const html = await render(req);
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
