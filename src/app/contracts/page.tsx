"use client";

import React from "react";
import { CoreContracts, explorerContractUrl, BASE_PRINCIPAL } from "@/lib/contracts";
import {
  getContractInterface,
} from "@/lib/core-api";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AppConfig } from "@/lib/config";
import { CodeBracketSquareIcon, LinkIcon } from "@heroicons/react/24/outline";

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
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Contracts</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>ABI: Dynamic</span>
          <span>Status: Ready</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-widest uppercase text-ink">CONTRACTS</h1>
              <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">Interface Explorer</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <Card className="machined-card">
              <div className="machined-header">
                <span>TARGET CONTRACT</span>
                <CodeBracketSquareIcon className="w-3 h-3" />
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Principal Origin</label>
                    <Input
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      placeholder="ST..."
                      className="bg-neutral-light border-accent/20 font-black text-xs tabular-nums"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Contract Identifier</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="dex-factory"
                      className="bg-neutral-light border-accent/20 font-black text-xs"
                    />
                  </div>
                </div>
                <Button
                  className="w-full h-12 bg-ink text-background-paper font-black uppercase tracking-[0.3em] text-[10px]"
                  onClick={loadInterface}
                  disabled={loading}
                >
                  {loading ? "SYNCING..." : "LOAD INTERFACE"}
                </Button>
              </CardContent>
            </Card>

            <Card className="machined-card">
              <div className="machined-header">
                <span>QUICK ACCESS</span>
              </div>
              <CardContent className="p-4">
                <div className="space-y-1 max-h-[350px] overflow-auto pr-2">
                  {CoreContracts.map((c) => (
                    <Button
                      key={c.id}
                      variant="ghost"
                      onClick={() => {
                        const [p, n] = c.id.split(".");
                        setPrincipal(p);
                        setName(n);
                      }}
                      className="w-full justify-between h-10 p-3 font-black text-[10px] uppercase tracking-widest hover:bg-neutral-light rounded-sm border border-transparent hover:border-accent/10 transition-all group"
                    >
                      <span className="text-ink">{c.label}</span>
                      <span className="text-ink-light font-mono text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.id.split(".")[1]}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {iface ? (
              <Card className="machined-card">
                <div className="machined-header">
                  <span>INTERFACE OUTPUT</span>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="bg-neutral-light p-6 rounded-sm border border-accent/20 font-mono text-[10px] leading-relaxed font-bold tabular-nums">
                    <pre className="overflow-auto max-h-[500px] whitespace-pre-wrap text-ink/70">
                      {JSON.stringify(iface, null, 2)}
                    </pre>
                  </div>
                  <div className="pt-4 border-t border-accent/10 flex justify-end">
                    <a
                      href={explorerContractUrl(
                        `${principal}.${name}`,
                        AppConfig.network as "devnet" | "testnet" | "mainnet"
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2"
                    >
                      <LinkIcon className="w-3 h-3" />
                      VIEW IN EXPLORER
                    </a>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-ink-light border-2 border-dashed border-accent/10 rounded-sm bg-neutral-light/30">
                <CodeBracketSquareIcon className="w-12 h-12 mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">
                  Awaiting Interface Selection...
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
