"use client";

import React from "react";
import { CoreContracts, Tokens, explorerContractUrl } from "@/lib/contracts";
import {
  getContractInterface,
  callReadOnly,
  ReadOnlyResponse,
} from "@/lib/coreApi";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AppConfig } from "@/lib/config";

export default function ContractsPage() {
  const [principal, setPrincipal] = React.useState<string>(
    "ST3PPMPR7SAY4CAKQ4ZMYC2Q9FAVBE813YWNJ4JE6"
  );
  const [name, setName] = React.useState<string>("dex-factory");
  const [iface, setIface] = React.useState<unknown | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [fnName, setFnName] = React.useState<string>("");
  const [args, setArgs] = React.useState<string>("");
  const [sender, setSender] = React.useState<string>(
    "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"
  );
  const [callRes, setCallRes] = React.useState<ReadOnlyResponse | null>(null);

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

  const onSelect = (id: string) => {
    const [p, n] = id.split(".");
    setPrincipal(p);
    setName(n);
    setIface(null);
  };

  const makeReadOnly = async () => {
    if (!fnName) return;
    setCallRes(null);
    const argsHex = args
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await callReadOnly(principal, name, fnName, sender, argsHex);
    setCallRes(res);
  };

  const all = [...Tokens, ...CoreContracts];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Contract</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2 text-text-secondary">
            <select
              aria-label="Select contract"
              className="flex h-10 w-full rounded-md border border-neutral-light bg-background-light px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              value={`${principal}.${name}`}
              onChange={(e) => onSelect(e.target.value)}
            >
              {all.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} — {c.id}
                </option>
              ))}
            </select>
            <div>
              <span className="font-medium text-text">Explorer:</span>{" "}
              <a
                className="text-accent hover:underline"
                href={explorerContractUrl(
                  `${principal}.${name}`,
                  AppConfig.network as "devnet" | "testnet" | "mainnet"
                )}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            </div>
            <Button onClick={loadInterface} disabled={loading} variant="outline" size="sm">
              {loading ? "Loading..." : "Fetch Interface"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto text-text-secondary bg-background-light p-2 rounded border border-accent/20">
              {iface ? JSON.stringify(iface, null, 2) : "No interface loaded"}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Read-Only Call</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="text-xs block mb-1 text-text-secondary">
                Function Name
              </label>
              <Input
                value={fnName}
                onChange={(e) => setFnName(e.target.value)}
                placeholder="get-balance-of"
              />
            </div>
            <div>
              <label className="text-xs block mb-1 text-text-secondary">Sender</label>
              <Input
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="ST..."
              />
            </div>
            <div>
              <label className="text-xs block mb-1 text-text-secondary">
                Arguments (hex, one per line)
              </label>
              <textarea
                value={args}
                onChange={(e) => setArgs(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-neutral-light bg-background-light px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                placeholder="0x0000000000000000000000000000000000000000\n0x0000000000000000000000000000000000000001"
              />
            </div>
          </div>
          <div className="mt-3">
            <Button onClick={makeReadOnly} variant="outline" size="sm">
              Call
            </Button>
          </div>
          <div className="mt-3">
            <pre className="text-xs overflow-auto text-text-secondary bg-background-light p-2 rounded border border-accent/20">
              {callRes ? JSON.stringify(callRes, null, 2) : "No call yet"}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
