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
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          Contract Explorer
        </h1>
        <p className="text-text-secondary">
          Inspect and interact with Conxian smart contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">
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
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">
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
                    className="w-full justify-between h-auto p-2 font-normal hover:bg-background-light"
                  >
                    <span className="text-text-primary">{c.label}</span>
                    <span className="text-text-muted opacity-0 group-hover:opacity-100 text-[10px] font-mono">
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
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">
                  Interface Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background-light p-4 rounded-md border border-accent/20">
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
            <div className="flex flex-col items-center justify-center h-[300px] text-text-muted border-2 border-dashed border-accent/10 rounded-md">
              <p className="text-sm italic">
                Load a contract interface to see details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
