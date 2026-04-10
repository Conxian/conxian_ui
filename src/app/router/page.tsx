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
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Router Simulator
        </h1>
        <p className="text-text-secondary">
          Simulate multi-hop routing and pathfinding on-chain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <div className="space-y-4 p-6 bg-background-paper border border-accent/20 rounded-xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Target Router
                </label>
                <select
                  className="w-full bg-background-light border border-accent/20 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
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
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">
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
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                Arguments
              </label>
              <ClarityArgBuilder
                onBuild={onBuild}
                initialRows={presetRows}
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
              <p className="text-xs text-center text-text-muted mt-2">
                {status}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-background-paper border border-accent/20 rounded-xl min-h-[400px]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">
              Simulation Result
            </h3>
            {result ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-md border ${
                    result.ok
                      ? "bg-green-500/10 border-green-500/20 text-green-600"
                      : "bg-red-500/10 border-red-500/20 text-red-600"
                  }`}
                >
                  <p className="text-sm font-bold">
                    {result.ok ? "CALL SUCCESSFUL" : "CALL FAILED"}
                  </p>
                </div>
                <div className="bg-background-light p-4 rounded-md border border-accent/20">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-auto max-h-[300px]">
                    {result.ok
                      ? JSON.stringify(decodeResultHex(result.result!), null, 2)
                      : result.error}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-text-muted border-2 border-dashed border-accent/10 rounded-md">
                <p className="text-sm italic">
                  Run a simulation to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
