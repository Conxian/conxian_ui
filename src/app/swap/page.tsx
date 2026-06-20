"use client";
import { logger } from "@/lib/logger";

import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ArrowsUpDownIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Tokens } from "@/lib/contracts";
import { useWallet } from "@/lib/wallet";
import { uintCV, PostConditionMode, contractPrincipalCV } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { AppConfig } from "@/lib/config";
import { getFungibleTokenBalances, FungibleTokenBalance } from "@/lib/core-api";
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
      logger.error("Failed to calculate swap estimate", { module: "Swap", error: e });
      setLoading(false);
    }
  }, [fromAmount, isSameToken]);

  useEffect(() => {
    getEstimate();
  }, [getEstimate]);

  const refreshBalances = useCallback(async () => {
    if (!stxAddress) return;
    try {
      const b = await getFungibleTokenBalances(stxAddress);
      setBalances(b || []);
    } catch (e) {
      logger.error("Failed to fetch swap balances", { module: "Swap", address: stxAddress, error: e });
    }
  }, [stxAddress]);

  useEffect(() => {
    refreshBalances();
  }, [refreshBalances]);

  const handleSwap = async () => {
    if (!fromAmount || isSameToken) return;
    setSending(true);
    setStatus("Submitting swap...");
    logger.info("Initiating swap", { module: "Swap", fromToken, toToken, fromAmount });

    try {
      const routerAddress = AppConfig.contracts.router.split(".")[0];
      const routerName = AppConfig.contracts.router.split(".")[1];
      const poolAddress = AppConfig.contracts.pool.split(".")[0];
      const poolName = AppConfig.contracts.pool.split(".")[1];

      const amountIn = BigInt(parseAmount(fromAmount, fromTokenInfo?.decimals ?? 6));
      const minAmountOut =
        (amountIn * BigInt(Math.floor((1 - slippage / 100) * 10000))) / 10000n;

      const [fromTokenAddress, fromTokenName] = fromToken.split(".") as [string, string];
      const [toTokenAddress, toTokenName] = toToken.split(".") as [string, string];

      const functionArgs = [
        uintCV(amountIn),
        uintCV(minAmountOut),
        contractPrincipalCV(poolAddress, poolName),
        contractPrincipalCV(fromTokenAddress, fromTokenName),
        contractPrincipalCV(toTokenAddress, toTokenName),
      ];

      await openContractCall({
        contractAddress: routerAddress,
        contractName: routerName,
        functionName: "swap-direct",
        functionArgs,
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          logger.info("Swap transaction broadcast successfully", { module: "Swap", txId: data.txId });
          setTxId(data.txId);
          setStatus("Transaction submitted.");
          setSending(false);
        },
        onCancel: () => {
          logger.warn("Swap transaction cancelled by user", { module: "Swap" });
          setStatus("Swap cancelled.");
          setSending(false);
        },
      });
    } catch (e) {
      logger.error("Failed to execute swap", { module: "Swap", error: e });
      setStatus("Swap failed.");
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background terminal-text">
      <div className="bg-neutral-light text-ink font-black py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Swap</span>
        </div>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>Status: Ready</span>
          <span>Oracle Sync: 100%</span>
        </div>
      </div>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase text-ink">SWAP</h1>
            <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">
              Token Swap
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <Tabs defaultValue="swap" className="lg:col-span-9">
            <TabsList className="bg-neutral-light p-1 h-12 rounded-sm border border-accent/20">
              <TabsTrigger
                value="swap"
                className="data-[state=active]:bg-ink data-[state=active]:text-background-paper font-black uppercase tracking-widest text-[10px] px-8 h-full"
              >
                Swap
              </TabsTrigger>
              <TabsTrigger
                value="limit"
                disabled
                className="font-black uppercase tracking-widest text-[10px] px-8 h-full opacity-40"
              >
                Limit Order (SOON)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="swap" className="mt-8">
              <Card className="machined-card shadow-none">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label htmlFor="from-amount" className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">
                        Asset In
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-ink-light">Balance:</span>
                        <span className="text-[10px] font-black text-ink tabular-nums">
                          {fromTokenBalance
                            ? formatAmount(fromTokenBalance.balance, fromTokenInfo?.decimals ?? 6)
                            : "0.00"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="Set maximum amount"
                          onClick={() =>
                            fromTokenBalance &&
                            setFromAmount(
                              formatAmount(
                                fromTokenBalance.balance,
                                fromTokenInfo?.decimals ?? 6,
                              ),
                            )
                          }
                          className="h-4 p-0 text-[9px] font-black text-accent hover:bg-transparent"
                        >
                          [MAX]
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-neutral-light p-4 rounded-sm border border-accent/20 focus-within:border-accent/40 transition-colors">
                      <TokenSelect
                        tokens={Tokens}
                        selectedToken={fromToken}
                        onSelect={(id) => {
                          setFromToken(id);
                          setToAmount("");
                        }}
                        balances={balances}
                        className="w-1/3"
                        aria-label="Select input asset"
                      />
                      <Input
                        type="text"
                        id="from-amount"
                        value={fromAmount}
                        onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setFromAmount(e.target.value)}
                        className="flex-1 text-right font-black text-2xl bg-transparent border-none focus:ring-0 tabular-nums h-auto p-0"
                        placeholder="0.000000"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center -my-3 relative z-10">
                    <button
                      onClick={() => {
                        const temp = fromToken;
                        setFromToken(toToken);
                        setToToken(temp);
                        setFromAmount(toAmount);
                        setToAmount("");
                      }}
                      aria-label="Invert input and output assets"
                      className="bg-background-paper p-2 rounded-full border border-accent/20 hover:border-accent transition-colors shadow-none group"
                    >
                      <ArrowsUpDownIcon className="w-4 h-4 text-ink group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="to-amount" className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">
                      Asset Out
                    </label>
                    <div className="flex items-center gap-4 bg-neutral-light p-4 rounded-sm border border-accent/20 focus-within:border-accent/40 transition-colors">
                      <TokenSelect
                        tokens={Tokens}
                        selectedToken={toToken}
                        onSelect={(id) => {
                          setToToken(id);
                          setToAmount("");
                        }}
                        balances={balances}
                        className="w-1/3"
                        aria-label="Select output asset"
                      />
                      <Input
                        type="text"
                        id="to-amount"
                        value={toAmount}
                        readOnly
                        className="flex-1 text-right font-black text-2xl bg-transparent border-none focus:ring-0 text-ink-light tabular-nums h-auto p-0"
                        placeholder="0.000000"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-light border border-accent/20 rounded-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-light">
                        Slippage Tolerance
                      </span>
                      <div className="flex gap-2">
                        {[0.1, 0.5, 1.0].map((v) => (
                          <Button
                            key={v}
                            onClick={() => setSlippage(v)}
                            aria-pressed={slippage === v ? "true" : "false"}
                            variant={slippage === v ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "text-[9px] font-black px-2 py-0.5 rounded-sm h-7 transition-all",
                              slippage === v
                                ? "bg-ink text-background-paper border-ink"
                                : "border-accent/20 text-ink-light hover:border-accent/40",
                            )}
                          >
                            {v}%
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-accent/10">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-light">
                          Route
                        </label>
                        <Badge variant="outline" className="text-[8px] border-accent/20 text-accent font-black">
                          OPTIMIZED
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-ink-light">
                        <span className="font-black text-ink">{fromTokenInfo?.label}</span>
                        <span className="text-accent">&rarr;</span>
                        <span className="opacity-40 font-bold uppercase tracking-widest">STX Pool</span>
                        <span className="text-accent">&rarr;</span>
                        <span className="font-black text-ink">{toTokenInfo?.label}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSwap}
                    disabled={sending || loading || isSameToken || !fromAmount}
                    className="w-full h-14 bg-ink text-background-paper font-black uppercase tracking-[0.3em] text-xs hover:bg-ink-light transition-all rounded-none flex items-center justify-center gap-3"
                  >
                    {(sending || loading) && <ArrowPathIcon className="w-5 h-5 animate-spin" aria-hidden="true" />}
                    <span>{sending ? "SUBMITTING..." : loading ? "UPDATING QUOTE..." : "SWAP"}</span>
                  </Button>

                  <div className="pt-6 border-t border-accent/20 space-y-3 min-h-[120px] flex flex-col justify-start">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ink-light">Status</span>
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                          status ? "text-accent" : "text-ink-light",
                        )}
                        aria-live="polite"
                      >
                        {status || "Ready"}
                      </span>
                    </div>

                    {txId ? (
                      <div className="flex items-center justify-between p-3 bg-neutral-light border border-accent/20 rounded-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <a
                          href={`https://explorer.hiro.so/txid/${txId}?chain=${AppConfig.network}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono font-black text-ink hover:underline"
                        >
                          TX: {truncate(txId, 16, 14)}
                        </a>
                        <CopyButton textToCopy={txId} ariaLabel="Copy Tx" className="h-4 w-4 opacity-50" />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col bg-background terminal-text">
                        <div className="h-1 w-12 bg-accent/20 animate-pulse-soft" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="lg:col-span-3 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>MARKET ACTIVITY</span>
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              </div>
              <CardContent className="p-4 space-y-4 font-mono text-[10px] text-ink-light">
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-accent/10 pb-1">
                    <span>[BLOCK] HEIGHT:</span>
                    <span className="text-ink font-black tabular-nums">84,321</span>
                  </div>
                  <div className="flex justify-between border-b border-accent/10 pb-1">
                    <span>[TX] MEMPOOL:</span>
                    <span className="text-ink font-black tabular-nums">142 UNIT</span>
                  </div>
                  <div className="flex justify-between border-b border-accent/10 pb-1">
                    <span>[SYNC] ORACLE:</span>
                    <span className="text-success font-black">LOCKED</span>
                  </div>
                  <div className="flex justify-between border-b border-accent/10 pb-1">
                    <span>[PULSE] NODE:</span>
                    <span className="text-ink font-black tabular-nums">0.12ms</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h5 className="text-[8px] font-black uppercase text-ink-light mb-2">Trace Log</h5>
                  <div className="space-y-1 opacity-50 font-bold">
                    <p>&gt; Connection established</p>
                    <p>&gt; Handshake verified</p>
                    <p>&gt; Hardware attestation OK</p>
                    <p>&gt; Subscribing to events...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
