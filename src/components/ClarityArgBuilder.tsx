"use client";

import React from "react";
import {
  ClarityValue,
  cvToHex,
  uintCV,
  intCV,
  trueCV,
  falseCV,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  bufferCV,
  noneCV,
  someCV,
} from "@stacks/transactions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export type ArgType =
  | "uint"
  | "int"
  | "bool"
  | "principal"
  | "ascii"
  | "utf8"
  | "buffer-hex"
  | "optional-none"
  | "optional-some-uint"
  | "optional-some-int"
  | "optional-some-bool"
  | "optional-some-principal"
  | "optional-some-ascii"
  | "optional-some-utf8"
  | "optional-some-buffer-hex";

export type BuiltArgs = { cv: ClarityValue[]; hex: string[] };

type Row = { id: string; type: ArgType; value: string; opt?: 'none' | 'some' | null };
type ParamMeta = { name?: string; type?: string };

// ⚡ Bolt: Memoize the ArgRow component to prevent re-renders of the entire list.
// When one argument's value changes, only that specific row component will re-render,
// not all of them. This significantly improves UI performance for functions with many arguments.
const ArgRow = React.memo(function ArgRow({
  row,
  onUpdate,
  onRemove,
  paramMeta,
}: {
  row: Row;
  onUpdate: (id: string, patch: Partial<Row>) => void;
  onRemove: (id: string) => void;
  paramMeta?: ParamMeta;
}) {
  // These helpers are pure functions, so duplicating them here is safe and avoids prop-drilling.
  const isOptionalType = (t: ArgType): boolean => t.startsWith('optional-');
  const inferOptionalMode = (t: ArgType): Row['opt'] => {
    if (!isOptionalType(t)) return null;
    return t === 'optional-none' ? 'none' : 'some';
  };
  const baseFromOptional = (t: ArgType): ArgType => {
    if (!isOptionalType(t)) return t;
    if (t === 'optional-none') return 'uint'; // default base
    const m = t.replace('optional-some-', '') as ArgType;
    return (['uint','int','bool','principal','ascii','utf8','buffer-hex'] as ArgType[]).includes(m) ? m : 'uint';
  };
  const toOptional = (base: ArgType, mode: Row['opt']): ArgType => {
    if (!mode) return base;
    if (mode === 'none') return 'optional-none' as ArgType;
    return (`optional-some-${base}`) as ArgType;
  };

  return (
    <div className="grid gap-2 md:grid-cols-6 items-center">
      <label htmlFor={`arg-type-${row.id}`} className="text-xs col-span-1">Type</label>
      <select
        id={`arg-type-${row.id}`}
        className="border border-accent/20 rounded px-2 py-1 col-span-2 bg-background-light text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        value={row.type}
        onChange={(e) => onUpdate(row.id, { type: e.target.value as ArgType })}
      >
        <option value="uint">uint</option>
        <option value="int">int</option>
        <option value="bool">bool</option>
        <option value="principal">principal</option>
        <option value="ascii">ascii</option>
        <option value="utf8">utf8</option>
        <option value="buffer-hex">buffer-hex</option>
        <option value="optional-none">optional-none</option>
        <option value="optional-some-uint">optional-some-uint</option>
        <option value="optional-some-int">optional-some-int</option>
        <option value="optional-some-bool">optional-some-bool</option>
        <option value="optional-some-principal">optional-some-principal</option>
        <option value="optional-some-ascii">optional-some-ascii</option>
        <option value="optional-some-utf8">optional-some-utf8</option>
        <option value="optional-some-buffer-hex">optional-some-buffer-hex</option>
      </select>
      <div className="col-span-3 flex items-center gap-2">
        <label htmlFor={`arg-optional-toggle-${row.id}`} className="text-xs">Optional</label>
        <input id={`arg-optional-toggle-${row.id}`} type="checkbox" className="accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" checked={Boolean(row.opt) || isOptionalType(row.type)} onChange={(e) => {
          const enabled = e.target.checked;
          if (!enabled) {
            const base = baseFromOptional(row.type);
            onUpdate(row.id, { type: base, opt: null });
          } else {
            const base = isOptionalType(row.type) ? baseFromOptional(row.type) : row.type;
            onUpdate(row.id, { type: base, opt: 'some' });
          }
        }} />
        {(Boolean(row.opt) || isOptionalType(row.type)) && (
          <select id={`arg-optional-kind-${row.id}`} aria-label="Optional kind" className="border border-accent/20 rounded px-2 py-1 bg-background-light text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" value={row.opt ?? inferOptionalMode(row.type) ?? 'some'} onChange={(e) => {
            const mode = e.target.value as Row['opt'];
            const base = baseFromOptional(row.type);
            onUpdate(row.id, { type: toOptional(base, mode), opt: mode });
          }}>
            <option value="some">some(...)</option>
            <option value="none">none</option>
          </select>
        )}
      </div>
      {(() => {
        const optionalEnabled = Boolean(row.opt) || isOptionalType(row.type);
        const optionalKind = row.opt ?? inferOptionalMode(row.type) ?? 'some';
        const isNone = optionalEnabled && optionalKind === 'none';
        const base = baseFromOptional(row.type);
        const meta = paramMeta;
        const labelText = `Value${meta ? ` — ${meta.name ?? 'arg'}${meta.type ? ` (${meta.type})` : ''}` : ''}`;
        if (isNone) {
          return (
            <>
              <label htmlFor={`arg-value-${row.id}`} className="text-xs col-span-1">{labelText}</label>
              <Input id={`arg-value-${row.id}`} className="col-span-2 opacity-50" disabled aria-disabled="true" value="" readOnly />
            </>
          );
        }
        if (base === 'bool') {
          const checked = (row.value || '').toLowerCase() === 'true';
          return (
            <>
              <label htmlFor={`arg-value-${row.id}`} className="text-xs col-span-1">{labelText}</label>
              <input
                id={`arg-value-${row.id}`}
                type="checkbox"
                className="col-span-2 accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                checked={checked}
                onChange={(e) => onUpdate(row.id, { value: e.target.checked ? 'true' : 'false' })}
              />
            </>
          );
        }
        if (base === 'uint' || base === 'int') {
          return (
            <>
              <label htmlFor={`arg-value-${row.id}`} className="text-xs col-span-1">{labelText}</label>
              <Input
                id={`arg-value-${row.id}`}
                type="number"
                inputMode="numeric"
                step="1"
                {...(base === 'uint' ? { min: 0 } : {})}
                className="col-span-2"
                value={row.value}
                onChange={(e) => onUpdate(row.id, { value: e.target.value })}
              />
            </>
          );
        }
        if (base === 'buffer-hex') {
          return (
            <>
              <label htmlFor={`arg-value-${row.id}`} className="text-xs col-span-1">{labelText}</label>
              <Input
                id={`arg-value-${row.id}`}
                className="col-span-2"
                value={row.value}
                onChange={(e) => onUpdate(row.id, { value: e.target.value })}
                placeholder="0x..."
                pattern="^(0x)?[0-9a-fA-F]*$"
                title="Hex string, with or without 0x prefix"
              />
            </>
          );
        }
        return (
          <>
            <label htmlFor={`arg-value-${row.id}`} className="text-xs col-span-1">{labelText}</label>
            <Input
              id={`arg-value-${row.id}`}
              className="col-span-2"
              value={row.value}
              onChange={(e) => onUpdate(row.id, { value: e.target.value })}
              placeholder={base === 'principal' ? 'ST...' : ''}
            />
          </>
        );
      })()}
      <div className="text-right">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRemove(row.id)}
          className="text-xs h-7 px-2"
        >
          Remove
        </Button>
      </div>
    </div>
  );
});

export default function ClarityArgBuilder({ onChange, preset, paramMeta }: { onChange: (args: BuiltArgs) => void; preset?: Array<{ type: ArgType; value?: string }>; paramMeta?: Array<ParamMeta> }) {
  const [rows, setRows] = React.useState<Row[]>([]);

  // Helpers (defined here because they are used in `build` and `useEffect`)
  const isOptionalType = React.useCallback((t: ArgType): boolean => t.startsWith('optional-'), []);
  const toOptional = React.useCallback((base: ArgType, mode: Row['opt']): ArgType => {
    if (!mode) return base;
    if (mode === 'none') return 'optional-none' as ArgType;
    return (`optional-some-${base}`) as ArgType;
  }, []);

  // Apply preset rows when provided
  React.useEffect(() => {
    if (preset) {
      const built: Row[] = preset.map(p => ({
        id: crypto.randomUUID(),
        type: p.type,
        value: p.value ?? "",
        opt: (isOptionalType(p.type) ? (p.type === 'optional-none' ? 'none' : 'some') : null) as Row['opt'],
      }));
      setRows(built);
    }
  }, [preset, isOptionalType]);

  const addRow = React.useCallback(() => {
    setRows((r) => [...r, { id: crypto.randomUUID(), type: "uint", value: "", opt: null }]);
  }, []);

  const removeRow = React.useCallback((id: string) => {
    setRows((r) => r.filter((x) => x.id !== id));
  }, []);

  const updateRow = React.useCallback((id: string, patch: Partial<Row>) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const build = React.useCallback((): BuiltArgs => {
    const cvs: ClarityValue[] = [];
    for (const row of rows) {
      const { type, value, opt } = row;
      const effectiveType: ArgType = isOptionalType(type) ? type : toOptional(type, opt ?? null);
      switch (effectiveType) {
        case "uint": cvs.push(uintCV(BigInt(value || "0"))); break;
        case "int": cvs.push(intCV(BigInt(value || "0"))); break;
        case "bool": cvs.push((value || "").toLowerCase() === "true" ? trueCV() : falseCV()); break;
        case "principal": cvs.push(standardPrincipalCV(value)); break;
        case "ascii": cvs.push(stringAsciiCV(value)); break;
        case "utf8": cvs.push(stringUtf8CV(value)); break;
        case "buffer-hex": {
          const hex = value.startsWith("0x") ? value.slice(2) : value;
          const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) || []);
          cvs.push(bufferCV(bytes));
          break;
        }
        case "optional-none": cvs.push(noneCV()); break;
        case "optional-some-uint": cvs.push(someCV(uintCV(BigInt(value || "0")))); break;
        case "optional-some-int": cvs.push(someCV(intCV(BigInt(value || "0")))); break;
        case "optional-some-bool": cvs.push(someCV((value || "").toLowerCase() === "true" ? trueCV() : falseCV())); break;
        case "optional-some-principal": cvs.push(someCV(standardPrincipalCV(value))); break;
        case "optional-some-ascii": cvs.push(someCV(stringAsciiCV(value))); break;
        case "optional-some-utf8": cvs.push(someCV(stringUtf8CV(value))); break;
        case "optional-some-buffer-hex": {
          const hex = value.startsWith("0x") ? value.slice(2) : value;
          const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) || []);
          cvs.push(someCV(bufferCV(bytes)));
          break;
        }
        default: break;
      }
    }
    const hex = cvs.map((cv) => cvToHex(cv));
    return { cv: cvs, hex };
  }, [rows, isOptionalType, toOptional]);

  React.useEffect(() => {
    onChange(build());
  }, [rows, build, onChange]);

  return (
    <fieldset className="space-y-3" aria-describedby="args-help">
      <legend className="font-medium">Function Arguments</legend>
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="text-xs h-7 px-2"
        >
          Add Arg
        </Button>
      </div>
      {rows.length === 0 && (
        <div id="args-help" className="text-xs text-text">
          No args. Click Add Arg.
        </div>
      )}
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <ArgRow
            key={row.id}
            row={row}
            onUpdate={updateRow}
            onRemove={removeRow}
            paramMeta={paramMeta?.[idx]}
          />
        ))}
      </div>
    </fieldset>
  );
}
