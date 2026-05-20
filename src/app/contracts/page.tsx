"use client";

import React from "react";
import { CoreContracts, explorerContractUrl, BASE_PRINCIPAL } from "@/lib/contracts";
import {
  getContractInterface,
} from "@/lib/core-api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AppConfig } from "@/lib/config";

export default function ContractsPage() {
  const [principal, setPrincipal] = React.useState<string>(BASE_PRINCIPAL);
  const [name, setName] = React.useState<string>("dex-factory-v2");
  const [iface, setIface] = React.useState<unknown | null>(null);
  const [loading, setLoading] = React.useState(false);

  const loadInterface = React.useCallback(async () => {
    if (!principal || !name) return;
    setLoading(true);
    const i = await getContractInterface(principal, name);
    setIface(i);
    setLoading(false);
  }, [principal, name]);

  React.useEffect(() => {
    loadInterface();
  }, [loadInterface]);

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      {/* Terminal Top Bar */}
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-ghost">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Contract Explorer</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>SOURCE: ON-CHAIN</span>
          <span>SYNC: 100%</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-widest uppercase text-ink">CONTRACTS</h1>
              <p className="text-accent font-bold uppercase tracking-[0.4em] text-xs mt-2">Institutional Smart Contract Explorer</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">
                Target Contract
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Principal</label>
                <Input
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="ST..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contract Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="dex-factory"
                />
              </div>
              <Button
                className="w-full"
                onClick={loadInterface}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load Interface"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">
                Registry Quick-Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {CoreContracts.map((c) => (
                  <Button
                    key={c.id}
                    variant="ghost"
                    onClick={() => {
                      const [p, n] = c.id.split(".");
                      setPrincipal(p);
                      setName(n);
                    }}
                    className="w-full justify-between h-auto p-2 font-normal hover:bg-neutral-light"
                  >
                    <span className="text-ink">{c.label}</span>
                    <span className="text-ink/40 opacity-0 group-hover:opacity-100 text-[10px] font-mono">
                      {c.id.split(".")[1]}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {iface ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">
                  Interface Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-neutral-light p-4 rounded-sm border border-ghost">
                  <pre className="text-xs font-mono overflow-auto max-h-[300px] whitespace-pre-wrap">
                    {JSON.stringify(iface, null, 2)}
                  </pre>
                </div>
                <div className="pt-4 border-t border-accent/10">
                  <a
                    href={explorerContractUrl(
                      `${principal}.${name}`,
                      AppConfig.network as "devnet" | "testnet" | "mainnet"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-xs hover:underline"
                  >
                    View in Explorer →
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-ink/40 border-2 border-dashed border-accent/10 rounded-sm">
              <p className="text-sm italic">
                Load a contract interface to see details
              </p>
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
