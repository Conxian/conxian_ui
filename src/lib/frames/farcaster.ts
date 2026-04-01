export type FarcasterFrameUntrustedData = {
  fid: number;
  url: string;
  messageHash: string;
  timestamp: number;
  network?: number;
  buttonIndex: number;
  inputText?: string;
  state?: string;
  castId?: {
    fid: number;
    hash: string;
  };
};

export type FarcasterFrameTrustedData = {
  messageBytes: string;
};

export type FarcasterFrameAction = {
  untrustedData: FarcasterFrameUntrustedData;
  trustedData?: FarcasterFrameTrustedData;
};

export function parseFrameAction(body: unknown): FarcasterFrameAction | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const untrusted = b["untrustedData"] as Record<string, unknown> | undefined;
  if (!untrusted || typeof untrusted !== "object") return null;

  const fid = untrusted["fid"];
  const buttonIndex = untrusted["buttonIndex"];
  const url = untrusted["url"];
  const messageHash = untrusted["messageHash"];
  const timestamp = untrusted["timestamp"];

  if (typeof fid !== "number") return null;
  if (typeof buttonIndex !== "number") return null;
  if (typeof url !== "string") return null;
  if (typeof messageHash !== "string") return null;
  if (typeof timestamp !== "number") return null;

  return body as FarcasterFrameAction;
}
