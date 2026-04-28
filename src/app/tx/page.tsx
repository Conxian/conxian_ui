"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { AppConfig } from "@/lib/config";
import { CoreContracts, Tokens } from "@/lib/contracts";
import { userSession } from "@/lib/wallet";
import ClarityArgBuilder, {
  BuiltArgs,
} from "@/components/ClarityArgBuilder";
import { openContractCall } from "@stacks/connect";
import { createNetwork } from "@stacks/network";
import type { StacksNetwork } from "@stacks/network";
import { getContractInterface } from "@/lib/core-api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

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

  const [selected, setSelected] = React.useState<string>(
    `${CoreContracts[0].id}`
  );
  const [fnName, setFnName] = React.useState<string>("");
  const [args, setArgs] = React.useState<BuiltArgs>({ cv: [], hex: [] });
  const [abi, setAbi] = React.useState<ContractAbi | null>(null);
  const [abiLoading, setAbiLoading] = React.useState(false);

  // Initialize from template
  React.useEffect(() => {
    if (templateParam === "swap") {
      const router = CoreContracts.find((c) =>
        c.id.includes("multi-hop-router")
      );
      if (router) {
        setSelected(router.id);
        setFnName("swap-x-for-y");
      }
    }
  }, [templateParam]);

  // Load ABI
  React.useEffect(() => {
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
    if (!userSession.isUserSignedIn()) {
      alert("Please connect wallet first");
      return;
    }
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
      onFinish: (data) => {
        console.log("Broadcast success:", data.txId);
      },
    });
  };

  return (
    <div className="space-y-10 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-widest text-text-primary uppercase">
          Transaction Forge
        </h1>
        <p className="text-text-secondary">
          Craft and broadcast manual contract calls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="p-6 bg-background-paper border border-accent/20 rounded-xl space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Target Contract
                </label>
                <select
                  className="w-full bg-background-light border border-accent/20 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none"
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
                  Function Name
                </label>
                <div className="relative">
                  <Input
                    value={fnName}
                    onChange={(e) => setFnName(e.target.value)}
                    placeholder={abiLoading ? "Loading ABI..." : "Function name"}
                    className={cn(abiLoading && "animate-pulse")}
                  />
                  {abi?.functions && (
                    <div className="absolute right-2 top-2">
                      <select
                        className="bg-transparent text-[10px] uppercase font-bold border-none focus:ring-0 cursor-pointer focus:outline-none"
                        onChange={(e) => setFnName(e.target.value)}
                        value={fnName}
                      >
                        <option value="">Select Function</option>
                        {abi.functions.map((f) => (
                          <option key={f.name} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                Arguments Builder
              </label>
              <ClarityArgBuilder
                onChange={onBuild}
                preset={
                  templateParam === "swap"
                    ? [
                        { type: "principal", value: Tokens[0]?.id || "" },
                        { type: "principal", value: Tokens[1]?.id || "" },
                        { type: "uint", value: "1000" },
                      ]
                    : undefined
                }
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={broadcast}
              disabled={!fnName || args.cv.length === 0}
            >
              Sign & Broadcast
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-background-paper border border-accent/20 rounded-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary font-bold uppercase tracking-widest text-text-secondary">
              Transaction Payload
            </h3>
            <div className="bg-background-light p-4 rounded-md border border-accent/20">
              <div className="space-y-2 text-xs font-mono">
                <p>
                  <span className="text-text-muted">contract:</span>{" "}
                  {selected}
                </p>
                <p>
                  <span className="text-text-muted">function:</span>{" "}
                  {fnName || "---"}
                </p>
                <div className="pt-2">
                  <span className="text-text-muted">arguments:</span>
                  <pre className="mt-1 text-[10px] text-accent overflow-auto max-h-[200px]">
                    {args.hex.length > 0
                      ? args.hex.map((h, i) => `[${i}]: ${h}`).join("\n")
                      : "No arguments built"}
                  </pre>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-md bg-accent/5 border border-accent/10">
              <p className="text-[10px] text-text-secondary leading-relaxed">
                This tool interacts directly with the smart contract ABI. Ensure
                argument types and counts match the function signature to avoid
                on-chain reversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TxPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading transaction tools...</div>}>
      <TxContent />
    </React.Suspense>
  );
}
