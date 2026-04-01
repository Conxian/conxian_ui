export type FrameButton = {
  label: string;
  action?: "post" | "link";
  target?: string;
};

export function renderFrameHtml(opts: {
  title: string;
  imageUrl: string;
  postUrl: string;
  buttons: FrameButton[];
  state?: Record<string, unknown>;
}): string {
  const buttons = opts.buttons.slice(0, 4);
  const state = opts.state ? JSON.stringify(opts.state) : null;

  const meta: string[] = [];
  meta.push(`<meta property="og:title" content="${escapeAttr(opts.title)}" />`);
  meta.push(`<meta property="og:image" content="${escapeAttr(opts.imageUrl)}" />`);

  meta.push(`<meta property="fc:frame" content="vNext" />`);
  meta.push(`<meta property="fc:frame:image" content="${escapeAttr(opts.imageUrl)}" />`);
  meta.push(`<meta property="fc:frame:image:aspect_ratio" content="1.91:1" />`);
  meta.push(`<meta property="fc:frame:post_url" content="${escapeAttr(opts.postUrl)}" />`);

  if (state) {
    meta.push(`<meta property="fc:frame:state" content="${escapeAttr(state)}" />`);
  }

  buttons.forEach((b, idx) => {
    const i = idx + 1;
    meta.push(`<meta property="fc:frame:button:${i}" content="${escapeAttr(b.label)}" />`);
    if (b.action) {
      meta.push(`<meta property="fc:frame:button:${i}:action" content="${escapeAttr(b.action)}" />`);
    }
    if (b.target) {
      meta.push(`<meta property="fc:frame:button:${i}:target" content="${escapeAttr(b.target)}" />`);
    }
  });

  return `<!DOCTYPE html>
<html>
  <head>
    <title>${escapeHtml(opts.title)}</title>
    ${meta.join("\n    ")}
  </head>
  <body>
    <h1>${escapeHtml(opts.title)}</h1>
  </body>
</html>`;
}

function escapeAttr(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
