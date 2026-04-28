import { cvToJSON, hexToCV } from '@stacks/transactions';

export type Decoded = { ok: boolean; value: unknown } | null;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function unwrapResponse(json: unknown): Decoded {
  if (!json) return null;
  if (isRecord(json) && json.type === 'response') {
    const success = isRecord(json) && (('success' in json && Boolean(json.success)) || ('ok' in json && Boolean(json.ok)));
    const val = isRecord(json) && 'value' in json ? (json.value as unknown) : undefined;
    return { ok: Boolean(success), value: val };
  }
  return { ok: true, value: json };
}

export function decodeResultHex(hex?: string): Decoded {
  if (!hex) return null;
  try {
    const cv = hexToCV(hex);
    const json = cvToJSON(cv);
    return unwrapResponse(json);
  } catch {
    return null;
  }
}

// Safely read a tuple field from a cvToJSON result (possibly wrapped in response/value levels)
export function getTupleField(json: unknown, key: string): unknown | null {
  if (!json) return null;
  let node: unknown = json;
  if (isRecord(node) && 'value' in node) node = (node as Record<string, unknown>).value;
  if (isRecord(node) && 'value' in node) node = (node as Record<string, unknown>).value;
  if (isRecord(node) && key in node) return (node as Record<string, unknown>)[key];
  return null;
}

export function getUint(json: unknown): bigint | null {
  if (isRecord(json) && json.type === 'uint') {
    const v = (json as Record<string, unknown>).value;
    if (typeof v === 'string' || typeof v === 'number') return BigInt(v);
  }
  return null;
}

export function getPrincipalValue(json: unknown): string | null {
  if (isRecord(json) && json.type === 'principal') {
    return json.value as string;
  }
  return null;
}
