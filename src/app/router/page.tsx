"use client";

import React from "react";
import { logger } from "@/lib/logger";
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
import { Card, CardContent } from "@/components/ui/Card";
import { CpuChipIcon, BoltIcon } from "@heroicons/react/24/outline";

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
    try {
      const iface = (await getContractInterface(principal, name)) as ContractAbi;
      logger.info("ABI loaded for", { module: "RouterPage", principal, name, functions: iface?.functions?.length });
    } catch (e) {
      logger.error("Failed to load ABI", { module: "RouterPage", principal, name, error: e });
    }
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
      if (!res.ok) {
        logger.warn("Contract call returned error", { module: "RouterPage", principal, name, fnName, error: res.error });
      }
    } catch (e) {
      setStatus("Error calling contract");
      logger.error("Router execution error", { module: "RouterPage", error: e });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
       {/* Terminal Top Bar */}
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Pathfinding Simulator</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>HOPS: MAX_4</span>
          <span>EST_ACCURACY: 99.9%</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-widest uppercase text-ink">ROUTING</h1>
              <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">Multi-Hop Output Prediction</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <Card className="machined-card">
               <div className="machined-header">
                 <span>SIMULATION PARAMETERS</span>
                 <CpuChipIcon className="w-3 h-3" />
               </div>
               <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Target Router</label>
                    <select
                      className="w-full bg-neutral-light border border-accent/20 rounded-sm px-4 py-3 text-xs font-black uppercase tracking-widest focus:ring-1 focus:ring-accent focus:outline-none text-ink"
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                    >
                      {CoreContracts.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Prediction Logic</label>
                    <Input
                      value={fnName}
                      onChange={(e) => setFnName(e.target.value)}
                      placeholder="estimate-output"
                      className="h-12 bg-neutral-light border-accent/20 font-black text-xs tabular-nums"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Input Vector Construction</label>
                  <div className="p-6 bg-neutral-light border border-accent/20 rounded-sm">
                    <ClarityArgBuilder
                      onChange={onBuild}
                      preset={presetRows}
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-14 bg-ink text-background-paper font-black uppercase tracking-[0.3em] text-xs hover:bg-ink-light rounded-none transition-all"
                  onClick={execute}
                  disabled={loading || !fnName}
                >
                  {loading ? "SIMULATING..." : "RUN_PATHFINDING_SIMULATION"}
                </Button>
                {status && <p className="text-center font-mono text-[10px] text-accent uppercase font-black tracking-[0.2em]">{status}</p>}
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <Card className="machined-card">
              <div className="machined-header">
                <span>SIMULATION OUTPUT DATA</span>
                <BoltIcon className="w-3 h-3 text-accent" />
              </div>
              <CardContent className="p-8">
                {result ? (
                  <div className="space-y-6">
                    <div
                      className={`p-4 rounded-sm border font-black text-[10px] tracking-widest uppercase ${
                        result.ok
                          ? "bg-success/5 border-success/20 text-success"
                          : "bg-error/5 border-error/20 text-error"
                      }`}
                    >
                      {result.ok ? "SIMULATION_SUCCESS" : "SIMULATION_FAULT"}
                    </div>
                    <div className="bg-neutral-light p-6 rounded-sm border border-accent/20 font-mono text-[10px] font-bold tabular-nums">
                      <pre className="whitespace-pre-wrap break-all overflow-auto max-h-[400px] text-ink/70">
                        {result.ok
                          ? JSON.stringify(decodeResultHex(result.result!), null, 2)
                          : result.error}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-ink/20 border-2 border-dashed border-accent/10 rounded-sm bg-neutral-light/30">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                      Awaiting Simulation Execution...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
