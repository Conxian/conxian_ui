"use client";

import React from "react";
import { CoreContracts, Tokens } from "@/lib/contracts";
import {
  callReadOnly,
  ReadOnlyResponse,
  getContractInterface,
} from "@/lib/core-api";
import ClarityArgBuilder, {
  BuiltArgs,
  ArgType,
} from "@/components/ClarityArgBuilder";
import { decodeResultHex } from "@/lib/clarity";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ContractAbi {
  functions?: Array<{ name: string }>;
}

export default function RouterPage() {
  const router =
    CoreContracts.find((c) => c.id.endsWith(".multi-hop-router-v3")) ||
    CoreContracts[0];

  const [selected, setSelected] = React.useState<string>(router?.id || "");
  const [fnName, setFnName] = React.useState<string>("estimate-output");
  const [presetRows] = React.useState<
    Array<{ type: ArgType; value?: string }> | undefined
  >([
    {
      type: "principal",
      value: Tokens[0]?.id || "",
    },
    { type: "uint", value: "1000" },
  ]);
  const [args, setArgs] = React.useState<BuiltArgs>({ cv: [], hex: [] });
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<ReadOnlyResponse | null>(null);
  const [status, setStatus] = React.useState<string>("");

  const onBuild = (built: BuiltArgs) => setArgs(built);

  const loadInterface = React.useCallback(async () => {
    if (!selected) return;
    const [principal, name] = selected.split(".") as [string, string];
    const iface = (await getContractInterface(principal, name)) as ContractAbi;
    // Removed unused setFnList logic for brevity in this manual Forge tool
    console.log("ABI loaded for", principal, name, iface?.functions?.length);
  }, [selected]);

  React.useEffect(() => {
    loadInterface();
  }, [loadInterface]);

  const execute = async () => {
    if (!selected) return;
    const [principal, name] = selected.split(".") as [string, string];
    setLoading(true);
    setStatus("Calling contract...");
    try {
      const res = await callReadOnly(
        principal,
        name,
        fnName,
        principal, // default sender
        args.hex
      );
      setResult(res);
      setStatus(res.ok ? "Success" : "Failed");
    } catch (e) {
      setStatus("Error calling contract");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      {/* Terminal Top Bar */}
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-ghost">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Routing Simulator</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>MODE: DRY_RUN</span>
          <span>SYNC: 100%</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-widest uppercase text-ink">ROUTER</h1>
              <p className="text-accent font-bold uppercase tracking-[0.4em] text-xs mt-2">Multi-Hop Pathfinding Simulation</p>
           </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <div className="space-y-4 p-6 bg-background-paper border border-ghost rounded-xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">
                  Target Router
                </label>
                <select
                  className="w-full bg-neutral-light border border-ghost rounded-sm px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {CoreContracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">
                  Function
                </label>
                <Input
                  value={fnName}
                  onChange={(e) => setFnName(e.target.value)}
                  placeholder="estimate-output"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">
                Arguments
              </label>
              <ClarityArgBuilder
                onChange={onBuild}
                preset={presetRows}
              />
            </div>

            <Button
              className="w-full"
              onClick={execute}
              disabled={loading || !fnName}
            >
              {loading ? "Simulating..." : "Run Simulation"}
            </Button>
            {status && (
              <p className="text-xs text-center text-ink/40 mt-2">
                {status}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-background-paper border border-ghost rounded-xl min-h-[400px]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ink-light mb-4">
              Simulation Result
            </h3>
            {result ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-sm border ${
                    result.ok
                      ? "bg-success/10 border-success/20 text-success"
                      : "bg-error/10 border-error/20 text-error"
                  }`}
                >
                  <p className="text-sm font-black">
                    {result.ok ? "CALL SUCCESSFUL" : "CALL FAILED"}
                  </p>
                </div>
                <div className="bg-neutral-light p-4 rounded-sm border border-ghost">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-auto max-h-[300px]">
                    {result.ok
                      ? JSON.stringify(decodeResultHex(result.result!), null, 2)
                      : result.error}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-ink/40 border-2 border-dashed border-accent/10 rounded-sm">
                <p className="text-sm italic">
                  Run a simulation to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
