"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { AppConfig } from "@/lib/config";
import { CoreContracts, Tokens } from "@/lib/contracts";
import { userSession } from "@/lib/wallet";
import ClarityArgBuilder, {
  BuiltArgs,
  ArgType,
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
  const [presetRows, setPresetRows] = React.useState<
    Array<{ type: ArgType; value?: string }> | undefined
  >(undefined);
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<string>("");
  const [abiFunctions, setAbiFunctions] = React.useState<string[]>([]);
  const [abiLoading, setAbiLoading] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<"basic" | "advanced">("basic");
  const [abiFns, setAbiFns] = React.useState<AbiFn[]>([]);

  const onBuild = (built: BuiltArgs) => {
    setArgs(built);
  };

  const onSubmit = async () => {
    setStatus("");
    const [contractAddress, contractName] = selected.split(".");
    if (!contractAddress || !contractName || !fnName) {
      setStatus("Missing contract or function name");
      return;
    }
    try {
      setSending(true);
      await openContractCall({
        network: getNetwork(),
        contractAddress,
        contractName,
        functionName: fnName,
        functionArgs: args.cv,
        userSession,
        onFinish: (data) => {
          setStatus(`Submitted. Tx ID: ${data?.txId || "(see wallet)"}`);
          setSending(false);
        },
        onCancel: () => {
          setStatus("Cancelled by user");
          setSending(false);
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
      setSending(false);
    }
  };

  const contracts = [...Tokens, ...CoreContracts];

  // Load ABI and extract function names when contract changes
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setAbiLoading(true);
      try {
        const [addr, name] = selected.split(".");
        const abi = (await getContractInterface(addr, name)) as ContractAbi | null;
        const fns: AbiFn[] = Array.isArray(abi?.functions)
          ? (abi!.functions as AbiFn[])
          : [];
        const names: string[] = fns
          .map((f) =>
            typeof f?.name === "string" ? (f.name as string) : undefined
          )
          .filter((n): n is string => typeof n === "string");
        if (!cancelled) {
          setAbiFunctions(names);
          setAbiFns(fns);
        }
      } catch {
        if (!cancelled) setAbiFunctions([]);
      } finally {
        if (!cancelled) setAbiLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  // Keep fnName consistent with available abiFunctions without re-fetching
  React.useEffect(() => {
    if (fnName && abiFunctions.length > 0 && !abiFunctions.includes(fnName)) {
      setFnName("");
    }
  }, [abiFunctions, fnName]);

  const paramMeta = React.useMemo(() => {
    if (!fnName) return undefined;
    const fn = abiFns.find((f) => f?.name === fnName);
    const args = Array.isArray(fn?.args) ? fn!.args : undefined;
    if (!args) return undefined;
    const toType = (t: unknown): string | undefined => {
      if (typeof t === "string") return t;
      try {
        return t ? JSON.stringify(t) : undefined;
      } catch {
        return undefined;
      }
    };
    return args.map((a) => ({
      name: typeof a?.name === "string" ? a.name : undefined,
      type: toType(a?.type),
    }));
  }, [fnName, abiFns]);

  const hasFunction = React.useCallback(
    async (contractId: string, fn: string): Promise<boolean> => {
      const [addr, name] = contractId.split(".");
      const abi = (await getContractInterface(addr, name)) as ContractAbi | null;
      const names: string[] = Array.isArray(abi?.functions)
        ? (abi!.functions as AbiFn[])
            .map((f) =>
              typeof f?.name === "string" ? (f.name as string) : undefined
            )
            .filter((n): n is string => typeof n === "string")
        : [];
      return names.includes(fn);
    },
    []
  );

  const applyTemplate = React.useCallback(async (tpl: string) => {
    setStatus("");
    if (tpl === "sip10-transfer") {
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok ? await hasFunction(tok.id, "transfer") : false;
      if (!supported) {
        setStatus("Template not supported: transfer");
        setPresetRows(undefined);
        return;
      }
      setFnName("transfer");
      setPresetRows([
        { type: "uint", value: "1" },
        {
          type: "principal",
          value: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
        },
        {
          type: "principal",
          value: "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
        },
        { type: "optional-none" },
      ]);
    } else if (tpl === "sip10-approve") {
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok ? await hasFunction(tok.id, "approve") : false;
      if (!supported) {
        setStatus("Template not supported: approve");
        setPresetRows(undefined);
        return;
      }
      setFnName("approve");
      setPresetRows([
        {
          type: "principal",
          value: "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
        },
        { type: "uint", value: "1000" },
      ]);
    } else if (tpl === "sip10-transfer-from") {
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok
        ? await hasFunction(tok.id, "transfer-from")
        : false;
      if (!supported) {
        setStatus("Template not supported: transfer-from");
        setPresetRows(undefined);
        return;
      }
      setFnName("transfer-from");
      setPresetRows([
        {
          type: "principal",
          value: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
        },
        {
          type: "principal",
          value: "ST3Y8QXTPYK6ZVMQ2BNN0R1B1RZ7RZ87GHN3Z3P43",
        },
        {
          type: "principal",
          value: "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
        },
        { type: "uint", value: "1" },
        { type: "optional-none" },
      ]);
    } else if (tpl === "pool-add-liquidity") {
      const pool =
        CoreContracts.find((c) => c.id.endsWith(".liquidity-pool")) ||
        CoreContracts.find((c) => c.kind === "dex") ||
        CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool
        ? await hasFunction(pool.id, "add-liquidity")
        : false;
      if (!supported) {
        setStatus("Template not supported: add-liquidity");
        setPresetRows(undefined);
        return;
      }
      setFnName("add-liquidity");
      setPresetRows([
        { type: "uint", value: "1000" },
        { type: "uint", value: "1000" },
        { type: "uint", value: "0" },
      ]);
    } else if (tpl === "pool-remove-liquidity") {
      const pool =
        CoreContracts.find((c) => c.id.endsWith(".liquidity-pool")) ||
        CoreContracts.find((c) => c.kind === "dex") ||
        CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool
        ? await hasFunction(pool.id, "remove-liquidity")
        : false;
      if (!supported) {
        setStatus("Template not supported: remove-liquidity");
        setPresetRows(undefined);
        return;
      }
      setFnName("remove-liquidity");
      setPresetRows([
        { type: "uint", value: "100" },
        { type: "uint", value: "0" },
        { type: "uint", value: "0" },
      ]);
    } else if (tpl === "pool-swap-exact-in") {
      const pool =
        CoreContracts.find((c) => c.id.endsWith(".liquidity-pool")) ||
        CoreContracts.find((c) => c.kind === "dex") ||
        CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool
        ? await hasFunction(pool.id, "swap-exact-in")
        : false;
      if (!supported) {
        setStatus("Template not supported: swap-exact-in");
        setPresetRows(undefined);
        return;
      }
      setFnName("swap-exact-in");
      setPresetRows([
        { type: "uint", value: "100" },
        { type: "uint", value: "1" },
        { type: "bool", value: "true" },
        { type: "uint", value: String(Date.now()) },
      ]);
    } else if (tpl === "pool-swap-exact-out") {
      const pool =
        CoreContracts.find((c) => c.id.endsWith(".liquidity-pool")) ||
        CoreContracts.find((c) => c.kind === "dex") ||
        CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool
        ? await hasFunction(pool.id, "swap-exact-out")
        : false;
      if (!supported) {
        setStatus("Template not supported: swap-exact-out");
        setPresetRows(undefined);
        return;
      }
      setFnName("swap-exact-out");
      setPresetRows([
        { type: "uint", value: "100" },
        { type: "uint", value: "1000" },
        { type: "bool", value: "true" },
        { type: "uint", value: String(Date.now()) },
      ]);
    } else {
      setPresetRows(undefined);
    }
  }, [hasFunction]);

  React.useEffect(() => {
    if (!templateParam) return;
    applyTemplate(templateParam);
  }, [templateParam, applyTemplate]);

  return (
    <div className="space-y-8">
      <form
        className="rounded-lg border border-accent/20 bg-background-paper p-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        noValidate
      >
        <div
          className="flex items-center gap-4 text-text"
          role="radiogroup"
          aria-labelledby="mode-label"
        >
          <span id="mode-label" className="text-xs font-medium">
            Interface Mode
          </span>
          <label className="text-xs flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="ui-mode"
              value="basic"
              checked={mode === "basic"}
              onChange={() => setMode("basic")}
              className="accent-accent"
            />
            Basic
          </label>
          <label className="text-xs flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="ui-mode"
              value="advanced"
              checked={mode === "advanced"}
              onChange={() => setMode("advanced")}
              className="accent-accent"
            />
            Advanced
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label
              htmlFor="contract-select"
              className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-1"
            >
              Contract
            </label>
            <select
              id="contract-select"
              aria-label="Contract"
              className="flex h-10 w-full rounded-md border border-accent/20 bg-background-light px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} — {c.id}
                </option>
              ))}
            </select>
          </div>
          {mode === "advanced" && (
            <div>
              <label
                htmlFor="function-select"
                className="text-xs block mb-1 text-text"
              >
                Function
              </label>
              {abiFunctions.length > 0 ? (
                <select
                  id="function-select"
                  className="flex h-10 w-full rounded-md border border-accent/20 bg-background-light px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  value={fnName}
                  onChange={(e) => setFnName(e.target.value)}
                >
                  <option value="" disabled>
                    {abiLoading ? "Loading..." : "Choose function"}
                  </option>
                  {abiFunctions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id="function-select"
                  aria-label="Function name"
                  value={fnName}
                  onChange={(e) => setFnName(e.target.value)}
                  placeholder={abiLoading ? "Loading ABI..." : "Function name"}
                />
              )}
            </div>
          )}
          <div>
            <label
              htmlFor="network"
              className="text-xs block mb-1 text-text"
            >
              Network
            </label>
            <Input
              id="network"
              aria-label="Network"
              value={AppConfig.network}
              readOnly
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label
              htmlFor="template-select"
              className="text-xs font-bold text-text-secondary uppercase tracking-widest block mb-1"
            >
              Template
            </label>
            <select
              id="template-select"
              aria-label="Template"
              aria-describedby="template-help"
              className="flex h-10 w-full rounded-md border border-accent/20 bg-background-light px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onChange={(e) => applyTemplate(e.target.value)}
              defaultValue=""
            >
              <option value="">None</option>
              <option value="sip10-transfer">SIP-010 transfer</option>
              <option value="sip10-approve">SIP-010 approve</option>
              <option value="sip10-transfer-from">SIP-010 transfer-from</option>
              <option value="pool-add-liquidity">Pool add-liquidity</option>
              <option value="pool-remove-liquidity">
                Pool remove-liquidity
              </option>
              <option value="pool-swap-exact-in">Pool swap-exact-in</option>
              <option value="pool-swap-exact-out">Pool swap-exact-out</option>
            </select>
            <div id="template-help" className="text-xs text-text mt-1">
              Choose a template to prefill common arguments. Advanced editor is
              available below.
            </div>
          </div>
        </div>

        {mode === "advanced" ? (
          <ClarityArgBuilder
            onChange={onBuild}
            preset={presetRows}
            paramMeta={paramMeta}
          />
        ) : (
          <details>
            <summary className="text-xs cursor-pointer text-accent hover:text-accent/80">
              Show advanced argument editor
            </summary>
            <div className="mt-2">
              <ClarityArgBuilder
                onChange={onBuild}
                preset={presetRows}
                paramMeta={paramMeta}
              />
            </div>
          </details>
        )}

        <div className="rounded-md border border-accent/20 bg-background-light p-3 space-y-2">
          <h3 className="text-sm font-medium text-text">Preview</h3>
          <div className="text-xs text-text">
            Contract: <code className="text-text">{selected}</code>
          </div>
          <div className="text-xs text-text">
            Function: <code className="text-text">{fnName || "-"}</code>
          </div>
          <div className="text-xs text-text">
            Args (hex):{" "}
            {args.hex.length > 0 ? (
              <span className="break-all text-text">
                [
                {args.hex.map((h, i) => (
                  <span key={i} className="inline-block mr-1">
                    {h}
                    {i < args.hex.length - 1 ? "," : ""}
                  </span>
                ))}
                ]
              </span>
            ) : (
              <span>-</span>
            )}
          </div>
          <div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(JSON.stringify(args.hex));
                } catch {
                }
              }}
              disabled={args.hex.length === 0}
            >
              Copy Args (hex)
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={sending || !fnName}
            aria-busy={sending}
            className="px-8"
          >
            {sending ? "Sending..." : "Open Wallet"}
          </Button>
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "text-xs font-medium text-text-secondary transition-opacity duration-300 min-h-[1rem]",
              status ? "opacity-100" : "opacity-0"
            )}
          >
            {status}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function TxPage() {
  return (
    <React.Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <TxContent />
    </React.Suspense>
  );
}
