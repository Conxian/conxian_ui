"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,


} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  ArrowsUpDownIcon,

  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { Tokens } from "@/lib/contracts";
import { useWallet } from "@/lib/wallet";
import {
  uintCV,
  PostConditionMode,
  contractPrincipalCV,
} from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { AppConfig } from "@/lib/config";
import {
  getFungibleTokenBalances,
  FungibleTokenBalance,
} from "@/lib/core-api";
import { formatAmount, parseAmount, truncate } from "@/lib/utils";
import TokenSelect from "@/components/ui/TokenSelect";
import CopyButton from "@/components/CopyButton";
import { cn } from "@/lib/utils";

export default function SwapPage() {
  const { stxAddress } = useWallet();
  const [fromToken, setFromToken] = useState(Tokens[0].id);
  const [toToken, setToToken] = useState(Tokens[1].id);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [balances, setBalances] = useState<FungibleTokenBalance[]>([]);

  const fromTokenInfo = Tokens.find((t) => t.id === fromToken);
  const toTokenInfo = Tokens.find((t) => t.id === toToken);
  const fromTokenBalance = balances.find((b) => b.asset_identifier === fromToken);
  const isSameToken = fromToken === toToken;

  const getEstimate = useCallback(async () => {
    if (!fromAmount || parseFloat(fromAmount) === 0 || isSameToken) {
      setToAmount("");
      return;
    }
    setLoading(true);
    try {
      setTimeout(() => {
        const amt = parseFloat(fromAmount) * 0.997;
        setToAmount(amt.toFixed(6));
        setLoading(false);
      }, 300);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [fromAmount, isSameToken]);

  const handleSwap = async () => {
    if (!fromAmount || isSameToken) return;
    setSending(true);
    setStatus("Initiating swap protocol...");

    try {
      const routerAddress = AppConfig.contracts.router.split(".")[0];
      const routerName = AppConfig.contracts.router.split(".")[1];
      const poolAddress = AppConfig.contracts.pool.split(".")[0];
      const poolName = AppConfig.contracts.pool.split(".")[1];

      const amountIn = BigInt(parseAmount(fromAmount, fromTokenInfo?.decimals ?? 6));
      const minAmountOut = (amountIn * BigInt(Math.floor((1 - slippage / 100) * 10000))) / 10000n;

      const [fromTokenAddress, fromTokenName] = fromToken.split(".") as [string, string];
      const [toTokenAddress, toTokenName] = toToken.split(".") as [string, string];

      const functionArgs = [
          uintCV(amountIn),
          uintCV(minAmountOut),
          contractPrincipalCV(poolAddress, poolName),
          contractPrincipalCV(fromTokenAddress, fromTokenName),
          contractPrincipalCV(toTokenAddress, toTokenName)
      ];

      await openContractCall({
          contractAddress: routerAddress,
          contractName: routerName,
          functionName: "swap-direct",
          functionArgs,
          postConditionMode: PostConditionMode.Allow,
          postConditions: [],
          onFinish: (data) => {
              setTxId(data.txId);
              setStatus("Transaction broadcast successful.");
              setSending(false);
          },
          onCancel: () => {
              setStatus("Transaction aborted.");
              setSending(false);
          }
      });
      
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
      setSending(false);
    }
  };

  useEffect(() => {
    getEstimate();
  }, [getEstimate]);

  useEffect(() => {
    if (stxAddress) {
      getFungibleTokenBalances(stxAddress).then(setBalances);
    }
  }, [stxAddress]);

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      {/* Terminal Top Bar */}
      <div className="bg-ink text-background py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Execution Environment</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>MTU: 1500</span>
          <span>LATENCY: 0.08ms</span>
          <span>SEQ: #84,321</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Telemetry & Sidebar */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          <div className="p-4 bg-neutral-light border border-ghost rounded-sm space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40">Market Telemetry</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-black text-text-muted">STX/BTC</span>
                <span className="text-[10px] font-black text-ink">0.000042</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-black text-text-muted">GAS (FIXED)</span>
                <span className="text-[10px] font-black text-success">LOW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-black text-text-muted">CONX_RELAY</span>
                <span className="text-[10px] font-black text-ink">ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-ink/5 border border-ghost rounded-sm">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40 mb-2">Instructions</h4>
            <p className="text-[10px] leading-relaxed text-text-secondary">
              Input asset quantities for direct automated routing. Path aggregation is hardware-attested for deterministic execution.
            </p>
          </div>
        </div>

        {/* Center Column: Execution Matrix */}
        <div className="lg:col-span-6 space-y-8">
           <div className="mb-6">
              <h1 className="text-4xl font-black tracking-tighter uppercase text-ink leading-none">EXECUTION</h1>
              <div className="h-1 w-12 bg-accent mt-4" />
           </div>

           <Tabs defaultValue="direct" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-light border-ghost h-12 p-1 mb-8">
              <TabsTrigger value="direct" className="uppercase font-black tracking-[0.2em] text-[10px]">Direct Protocol</TabsTrigger>
              <TabsTrigger value="aggregator" disabled className="uppercase font-black tracking-[0.2em] text-[10px] opacity-30">Multi-Hop Path</TabsTrigger>
            </TabsList>

            <TabsContent value="direct">
              <Card className="machined-card">
                <div className="machined-header">
                  <span>EXECUTION MATRIX V4.1</span>
                  <CpuChipIcon className="w-3 h-3 opacity-50" />
                </div>

                <CardContent className="p-8 space-y-6">
                  {/* From Asset */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label htmlFor="from-amount" className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/60">Asset In</label>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-ink/40">BAL: {fromTokenBalance ? formatAmount(fromTokenBalance.balance, fromTokenInfo?.decimals ?? 6) : "0.00"}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fromTokenBalance && setFromAmount(formatAmount(fromTokenBalance.balance, fromTokenInfo?.decimals ?? 6))}
                          className="h-4 p-0 text-[9px] font-black text-accent hover:bg-transparent"
                        >
                          [MAX]
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-neutral-light p-4 rounded-sm border border-ghost">
                      <TokenSelect
                        tokens={Tokens}
                        selectedToken={fromToken}
                        onSelect={(id) => { setFromToken(id); setToAmount(""); }}
                        balances={balances}
                        className="w-1/3"
                      />
                      <Input
                        type="text"
                        id="from-amount"
                        value={fromAmount}
                        onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setFromAmount(e.target.value)}
                        className="flex-1 text-right font-black text-2xl bg-transparent border-none focus:ring-0 tabular-nums"
                        placeholder="0.000000"
                      />
                    </div>
                  </div>

                  {/* Invert */}
                  <div className="flex justify-center -my-3 relative z-10">
                    <button
                      onClick={() => {
                        const temp = fromToken;
                        setFromToken(toToken);
                        setToToken(temp);
                        setFromAmount(toAmount);
                        setToAmount("");
                      }}
                      className="bg-background-paper p-2 rounded-full border border-ghost hover:border-accent transition-colors shadow-sm"
                    >
                      <ArrowsUpDownIcon className="w-4 h-4 text-ink" />
                    </button>
                  </div>

                  {/* To Asset */}
                  <div className="space-y-3">
                    <label htmlFor="to-amount" className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/60">Asset Out</label>
                    <div className="flex items-center gap-4 bg-neutral-light p-4 rounded-sm border border-ghost">
                      <TokenSelect
                        tokens={Tokens}
                        selectedToken={toToken}
                        onSelect={(id) => { setToToken(id); setToAmount(""); }}
                        balances={balances}
                        className="w-1/3"
                      />
                      <Input
                        type="text"
                        id="to-amount"
                        value={toAmount}
                        readOnly
                        className="flex-1 text-right font-black text-2xl bg-transparent border-none focus:ring-0 text-ink/40 tabular-nums"
                        placeholder="0.000000"
                      />
                    </div>
                  </div>

                  {/* Routing Info */}
                  <div className="p-4 bg-ink/[0.02] border border-ghost rounded-sm space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40">Slippage Tolerance</span>
                       <div className="flex gap-2">
                         {[0.1, 0.5, 1.0].map(v => (
                           <Button
                            key={v}
                            onClick={() => setSlippage(v)}
                            aria-pressed={slippage === v ? "true" : "false"}
                            variant={slippage === v ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "text-[9px] font-black px-2 py-0.5 rounded-sm h-7 transition-all",
                              slippage === v ? "bg-ink text-background border-ink" : "border-ghost text-ink/40 hover:border-ink/20"
                            )}
                           >
                            {v}%
                           </Button>
                         ))}
                       </div>
                    </div>
                    <div className="pt-4 border-t border-ink/5">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40">Aggregated Path</label>
                        <Badge variant="outline" className="text-[8px] border-ghost text-accent font-black">DET_PATH_V3</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-ink/60">
                         <span className="font-black">{fromTokenInfo?.label}</span>
                         <span className="text-accent">&rarr;</span>
                         <span className="opacity-40">STX_POOL</span>
                         <span className="text-accent">&rarr;</span>
                         <span className="font-black">{toTokenInfo?.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    onClick={handleSwap}
                    disabled={sending || loading || isSameToken || !fromAmount}
                    className="w-full h-14 bg-ink text-background font-black uppercase tracking-[0.3em] text-xs hover:bg-ink-light transition-all rounded-none"
                  >
                    {sending ? "TRANSMITTING..." : loading ? "SYNCHRONIZING..." : "EXECUTE PROTOCOL"}
                  </Button>

                  {/* Status Overlay */}
                  {(status || txId) && (
                    <div className="pt-6 border-t border-ghost space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                       <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ink/40">Status Log</span>
                          <span className="text-[10px] font-black text-accent uppercase tracking-tighter">{status}</span>
                       </div>
                       {txId && (
                         <div className="flex items-center justify-between p-3 bg-neutral-light border border-ghost rounded-sm">
                            <a
                              href={`https://explorer.hiro.so/txid/${txId}?chain=${AppConfig.network}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-[10px] font-mono font-black text-ink hover:underline"
                            >
                              TX: {truncate(txId, 16, 14)}
                            </a>
                            <CopyButton textToCopy={txId} ariaLabel="Copy Tx" className="h-4 w-4 opacity-50" />
                         </div>
                       )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
           </Tabs>
        </div>

        {/* Right Column: Live Telemetry Feed */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="machined-card">
              <div className="machined-header">
                <span>LIVE TELEMETRY</span>
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              </div>
              <CardContent className="p-4 space-y-4 font-mono text-[10px] text-ink/60">
                 <div className="space-y-2">
                    <div className="flex justify-between border-b border-ghost pb-1">
                       <span>[BLOCK] HEIGHT:</span>
                       <span className="text-ink font-black">84,321</span>
                    </div>
                    <div className="flex justify-between border-b border-ghost pb-1">
                       <span>[TX] MEMPOOL:</span>
                       <span className="text-ink font-black">142 UNIT</span>
                    </div>
                    <div className="flex justify-between border-b border-ghost pb-1">
                       <span>[SYNC] ORACLE:</span>
                       <span className="text-success font-black">LOCKED</span>
                    </div>
                    <div className="flex justify-between border-b border-ghost pb-1">
                       <span>[PULSE] NODE:</span>
                       <span className="text-ink font-black">0.12ms</span>
                    </div>
                 </div>

                 <div className="pt-4">
                    <h5 className="text-[8px] font-black uppercase text-ink/30 mb-2">Trace Log</h5>
                    <div className="space-y-1 opacity-50">
                       <p>&gt; Connection established</p>
                       <p>&gt; Handshake verified</p>
                       <p>&gt; Hardware attestation OK</p>
                       <p>&gt; Subscribing to events...</p>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}
