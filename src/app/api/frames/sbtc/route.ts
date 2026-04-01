import { NextRequest, NextResponse } from "next/server";
import { renderFrameHtml } from "@/lib/frames/frame-html";
import { parseFrameAction } from "@/lib/frames/farcaster";

function absoluteUrl(req: NextRequest, path: string): string {
  const url = new URL(req.url);
  url.pathname = path;
  url.search = "";
  return url.toString();
}

function render(req: NextRequest): string {
  const imageUrl = absoluteUrl(req, "/api/frames/sbtc/image");
  const postUrl = absoluteUrl(req, "/api/frames/sbtc");
  const governanceUrl = absoluteUrl(req, "/api/frames/governance");

  return renderFrameHtml({
    title: "Conxian sBTC Monitor",
    imageUrl,
    postUrl,
    buttons: [
      { label: "Refresh" },
      { label: "Vote", action: "post", target: governanceUrl },
    ],
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const html = render(req);
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json().catch(() => null)) as unknown;
  const action = parseFrameAction(body);

  if (!action) {
    const html = render(req);
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const html = render(req);
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
