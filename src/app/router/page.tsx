"use client";

import React from "react";
import { CoreContracts } from "@/lib/contracts";
import {
  callReadOnly,
  ReadOnlyResponse,
  getContractInterface,
} from "@/lib/coreApi";
import ClarityArgBuilder, {
  BuiltArgs,
  ArgType,
} from "@/components/ClarityArgBuilder";
import { decodeResultHex } from "@/lib/clarity";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RouterPage() {
  const router =
    CoreContracts.find((c) => c.id.endsWith(".multi-hop-router-v3")) ||
    CoreContracts[0];

  const [selected, setSelected] = React.useState<string>(router?.id || "");
  const [fnName, setFnName] = React.useState<string>("estimate-output");
  const [fnList, setFnList] = React.useState<string[]>([]);
  const [presetRows] = React.useState<
    Array<{ type: ArgType; value?: string }> | undefined
  >([
    {
      type: "principal",
      value: "ST3PPMPR7SAY4CAKQ4ZMYC2Q9FAVBE813YWNJ4JE6.cxs-token",
    },
    { type: "uint", value: "1000" },
  ]);
  const [args, setArgs] = React.useState<BuiltArgs>({ cv: [], hex: [] });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ReadOnlyResponse | null>(null);
  const [status, setStatus] = React.useState<string>("");

  const onBuild = (built: BuiltArgs) => setArgs(built);

  const onEstimate = async () => {
    if (!selected || !fnName) return;
    const [contractAddress, contractName] = selected.split(".") as [
      string,
      string,
    ];
    setLoading(true);
    try {
      const res = await callReadOnly(
        contractAddress,
        contractName,
        fnName,
        "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
        args.hex
      );
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const decoded =
    result && "result" in result ? decodeResultHex(result.result) : null;

  // Load ABI and select a suitable default function
  React.useEffect(() => {
    async function loadAbi() {
      setStatus("");
      if (!selected) return;
      const [addr, name] = selected.split(".") as [string, string];
      const abi = await getContractInterface(addr, name);
      let fns: string[] = [];
      if (
        abi &&
        typeof abi === "object" &&
        "functions" in (abi as Record<string, unknown>)
      ) {
        const list = (abi as Record<string, unknown>).functions;
        if (Array.isArray(list)) {
          fns = list
            .map((f: unknown) => {
              if (
                typeof f === "object" &&
                f !== null &&
                "name" in (f as Record<string, unknown>)
              ) {
                const n = (f as Record<string, unknown>).name;
                return typeof n === "string" ? n : undefined;
              }
              return undefined;
            })
            .filter((n): n is string => typeof n === "string");
        }
      }
      setFnList(fns);
      // Prefer a function with 'estimate' in name, else keep current if exists, else fallback first
      const estimator =
        fns.find((n: string) => /estimate/i.test(n)) ||
        (fns.includes(fnName) ? fnName : fns[0]);
      if (estimator) setFnName(estimator);
    }
    loadAbi();
  }, [selected, fnName]);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-accent/20 bg-background-paper p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs block mb-1 text-text-secondary">
              Router Contract
            </label>
            <select
              aria-label="Router contract"
              className="flex h-10 w-full rounded-md border border-neutral-light bg-background-light px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {CoreContracts.filter((c) => c.label.includes("Router")).map(
                (c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} — {c.id}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="text-xs block mb-1 text-text-secondary">Function</label>
            {fnList.length > 0 ? (
              <select
                aria-label="Function"
                className="flex h-10 w-full rounded-md border border-neutral-light bg-background-light px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                value={fnName}
                onChange={(e) => setFnName(e.target.value)}
              >
                {fnList.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                aria-label="Function name"
                value={fnName}
                onChange={(e) => setFnName(e.target.value)}
                placeholder="estimate-output"
              />
            )}
          </div>
        </div>

        <ClarityArgBuilder onChange={onBuild} preset={presetRows} />

        <div className="flex items-center gap-3">
          <Button
            onClick={onEstimate}
            disabled={loading || !fnName}
            variant="outline"
            size="sm"
          >
            {loading ? "Estimating..." : "Estimate"}
          </Button>
          {status && <div className="text-xs text-text-secondary">{status}</div>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded border border-accent/20 bg-background-light p-3">
            <div className="font-medium mb-1 text-text">Raw Result</div>
            <pre className="text-xs overflow-auto text-text-secondary">
              {result ? JSON.stringify(result, null, 2) : "—"}
            </pre>
          </div>
          <div className="rounded border border-accent/20 bg-background-light p-3">
            <div className="font-medium mb-1 text-text">Decoded</div>
            <pre className="text-xs overflow-auto text-text-secondary">
              {decoded ? JSON.stringify(decoded, null, 2) : "—"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
