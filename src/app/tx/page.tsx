"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppConfig } from "@/lib/config";
import { CoreContracts, Tokens } from "@/lib/contracts";

import ClarityArgBuilder, {
  BuiltArgs,
} from "@/components/ClarityArgBuilder";
import { openContractCall } from "@stacks/connect";
import { createNetwork } from "@stacks/network";
import type { StacksNetwork } from "@stacks/network";
import { getContractInterface } from "@/lib/core-api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { BoltIcon, CodeBracketSquareIcon } from "@heroicons/react/24/outline";

type AbiArg = { name?: string; type?: unknown };
type AbiFn = { name?: string; args?: AbiArg[] };
type ContractAbi = { functions?: AbiFn[] };

function getNetwork(): StacksNetwork {
  const name = AppConfig.network as "mainnet" | "testnet" | "devnet";
  if (name === "devnet") {
    return createNetwork({
      network: "devnet",
      client: { baseUrl: AppConfig.coreApiUrl },
    });
  }
  return createNetwork(name);
}

function TxContent() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");

  const [selected, setSelected] = useState<string>(CoreContracts[0].id);
  const [fnName, setFnName] = useState<string>("");
  const [args, setArgs] = useState<BuiltArgs>({ cv: [], hex: [] });
  const [abi, setAbi] = useState<ContractAbi | null>(null);
  const [abiLoading, setAbiLoading] = useState(false);

  useEffect(() => {
    if (templateParam === "swap") {
      const router = CoreContracts.find((c) => c.id.includes("multi-hop-router"));
      if (router) {
        setSelected(router.id);
        setFnName("swap-x-for-y");
      }
    }
  }, [templateParam]);

  useEffect(() => {
    if (!selected) return;
    const [p, n] = selected.split(".");
    setAbiLoading(true);
    getContractInterface(p, n)
      .then((res) => setAbi(res as ContractAbi))
      .catch(() => setAbi(null))
      .finally(() => setAbiLoading(false));
  }, [selected]);

  const onBuild = (built: BuiltArgs) => setArgs(built);

  const broadcast = async () => {
    const [contractAddress, contractName] = selected.split(".");
    await openContractCall({
      contractAddress,
      contractName,
      functionName: fnName,
      functionArgs: args.cv,
      network: getNetwork(),
      appDetails: {
        name: "Conxian UI",
        icon: window.location.origin + "/conxian-mark-b.svg",
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      <div className="bg-ink text-background py-2 px-6 flex justify-between items-center border-b border-ghost">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Smart Contract Interaction Forge</span>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <span>MODE: RAW_CALL</span>
          <span>AUTH: JWT_LOCKED</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase text-ink">FORGE</h1>
              <p className="text-accent font-bold uppercase tracking-[0.4em] text-xs mt-2">Manual Transaction Crafting</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>CONTRACT CONFIGURATION</span>
                <CodeBracketSquareIcon className="w-3 h-3" />
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Target Contract</label>
                    <select
                      className="w-full bg-neutral-light border border-ghost rounded-sm px-4 py-3 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-accent focus:outline-none"
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                    >
                      {CoreContracts.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Function Entry Point</label>
                    <div className="relative">
                      <Input
                        value={fnName}
                        onChange={(e) => setFnName(e.target.value)}
                        placeholder={abiLoading ? "SYNCHRONIZING ABI..." : "FUNCTION_NAME"}
                        className={cn("h-12 bg-neutral-light border-ghost font-black text-xs", abiLoading && "animate-pulse")}
                      />
                      {abi?.functions && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <select
                            className="bg-transparent text-[9px] font-black uppercase border-none focus:ring-0 cursor-pointer text-accent"
                            onChange={(e) => setFnName(e.target.value)}
                            value={fnName}
                          >
                            <option value="">BROWSE ABI</option>
                            {abi.functions.map((f) => (
                              <option key={f.name} value={f.name}>{f.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink/40">Argument Vector Construction</label>
                  <div className="p-6 bg-neutral-light border border-ghost rounded-sm">
                    <ClarityArgBuilder
                      onChange={onBuild}
                      preset={templateParam === "swap" ? [
                        { type: "principal", value: Tokens[0]?.id || "" },
                        { type: "principal", value: Tokens[1]?.id || "" },
                        { type: "uint", value: "1000" },
                      ] : undefined}
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-14 bg-ink text-background font-black uppercase tracking-[0.3em] text-xs hover:bg-ink-light rounded-none transition-all"
                  onClick={broadcast}
                  disabled={!fnName || args.cv.length === 0}
                >
                  EXECUTE TRANSACTION PROTOCOL
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>TRANSACTION PAYLOAD ANALYZER</span>
                <BoltIcon className="w-3 h-3 text-accent" />
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="bg-ink text-white/90 p-6 rounded-sm font-mono text-[11px] leading-relaxed">
                  <p className="text-accent mb-4 font-black tracking-widest">{/* RAW HEX PAYLOAD */}</p>
                  <div className="space-y-2 break-all opacity-70">
                    <p><span className="text-white/30">ID:</span> {selected}</p>
                    <p><span className="text-white/30">FN:</span> {fnName || "---"}</p>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-white/30 mb-2">ARGUMENTS:</p>
                      {args.hex.length > 0 ? (
                        <div className="space-y-1">
                          {args.hex.map((h, i) => <p key={i}>[{i}]: {h}</p>)}
                        </div>
                      ) : <p className="italic">NO ARGS BUILT</p>}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-accent/5 border border-accent/10 rounded-sm">
                   <p className="text-[10px] font-bold text-ink-light leading-relaxed uppercase tracking-widest">
                     Deterministic verification required before broadcast. Ensure arguments match Clarity ABI signatures to prevent enclave rejection.
                   </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TxPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center terminal-text animate-pulse">SYNCHRONIZING FORGE...</div>}>
      <TxContent />
    </Suspense>
  );
}
