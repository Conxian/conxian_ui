import { describe, expect, it } from "vitest";
import { renderFrameHtml } from "@/lib/frames/frame-html";

describe("renderFrameHtml", () => {
  it("renders required frame meta tags", () => {
    const html = renderFrameHtml({
      title: "Test Frame",
      imageUrl: "https://example.com/image.png",
      postUrl: "https://example.com/post",
      buttons: [{ label: "One" }, { label: "Two", action: "post", target: "https://example.com/next" }],
      state: { proposalId: "GOV-001" },
    });

    expect(html).toContain('property="fc:frame"');
    expect(html).toContain('content="vNext"');
    expect(html).toContain('property="fc:frame:image"');
    expect(html).toContain('property="fc:frame:post_url"');
    expect(html).toContain('property="fc:frame:button:1"');
    expect(html).toContain('property="fc:frame:button:2"');
    expect(html).toContain('property="fc:frame:state"');
  });
});
