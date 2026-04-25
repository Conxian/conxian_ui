"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  ArrowsUpDownIcon,
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
import { formatAmount, parseAmount, truncate, cn } from "@/lib/utils";
import TokenSelect from "@/components/ui/TokenSelect";
import { getFungibleTokenBalances, FungibleTokenBalance } from "@/lib/core-api";
import CopyButton from "@/components/CopyButton";

export default function SwapPage() {
  const { stxAddress, connectWallet } = useWallet();
  const [fromToken, setFromToken] = useState(Tokens[0]?.id || "");
  const [toToken, setToToken] = useState(Tokens[1]?.id || "");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [txId, setTxId] = useState("");
  const [balances, setBalances] = useState<FungibleTokenBalance[]>([]);

  const fromTokenInfo = Tokens.find((t) => t.id === fromToken);
  const fromTokenBalance = balances.find((b) => b.asset_identifier === fromToken);
  const isSameToken = fromToken === toToken;

  const getEstimate = useCallback(async () => {
    if (!fromAmount || parseFloat(fromAmount) === 0 || isSameToken) {
      setToAmount("");
      return;
    }
    setLoading(true);
    // Simulation: in a real app, you'd call a contract or API here
    setTimeout(() => {
      setToAmount((parseFloat(fromAmount) * 0.98).toString());
      setLoading(false);
    }, 500);
  }, [fromAmount, isSameToken]);

  const handleSwap = async () => {
    if (!stxAddress) {
      connectWallet();
      return;
    }

    setSending(true);
    setStatus("Initiating swap...");
    try {
      // Manual implementation of swap-direct call
      const router = AppConfig.contracts.router;
      const [routerAddress, routerName] = router.split(".");
      const pool = AppConfig.contracts.pool;
      const [poolAddress, poolName] = pool.split(".");

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
              setStatus("Transaction submitted!");
              setSending(false);
          },
          onCancel: () => {
              setStatus("Transaction canceled");
              setSending(false);
          }
      });
      
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
      setSending(false);
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleMax = () => {
    if (fromTokenBalance) {
      setFromAmount(formatAmount(fromTokenBalance.balance, fromTokenInfo?.decimals ?? 6));
    }
  };

  const handleFromTokenChange = (tokenId: string) => {
    setFromToken(tokenId);
    setToAmount("");
  };

  const handleToTokenChange = (tokenId: string) => {
    setToToken(tokenId);
    setToAmount("");
  };

  const invertTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount("");
  };

  React.useEffect(() => {
    getEstimate();
  }, [getEstimate]);

  React.useEffect(() => {
    if (stxAddress) {
      getFungibleTokenBalances(stxAddress).then(setBalances);
    }
  }, [stxAddress]);

  return (
    <div className="space-y-8 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-widest uppercase">Swap</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Institutional-grade liquidity engine for instant asset exchange.
        </p>
      </div>

      <Tabs defaultValue="simple" className="w-full max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2 bg-background-light border border-accent/20 p-1 h-11">
          <TabsTrigger value="simple" className="uppercase font-bold tracking-widest text-[10px]">Standard</TabsTrigger>
          <TabsTrigger value="optimized" disabled className="uppercase font-bold tracking-widest text-[10px]">Institutional</TabsTrigger>
        </TabsList>
        <TabsContent value="simple" className="mt-6">
          <Card className="bg-background-paper border-accent/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Execution Matrix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Token */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="from-amount" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                    Asset In
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-muted">
                      BAL: {fromTokenBalance ? formatAmount(fromTokenBalance.balance, fromTokenInfo?.decimals ?? 6) : "0.00"}
                    </span>
                    {fromTokenBalance && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMax}
                        className="h-auto py-0 px-1.5 text-[9px] font-black text-accent border border-accent/20 hover:bg-accent/10 uppercase tracking-tighter"
                      >
                        MAX
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-neutral-light p-2 rounded-lg border border-accent/10">
                  <TokenSelect
                    tokens={Tokens}
                    selectedToken={fromToken}
                    onSelect={handleFromTokenChange}
                    balances={balances}
                    className="w-1/2 border-none shadow-none bg-transparent"
                  />
                  <Input
                    type="text"
                    id="from-amount"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    className="w-1/2 text-right font-bold text-lg border-none focus-visible:ring-0 bg-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Invert Button */}
              <div className="flex justify-center -my-3 relative z-10">
                <Button
                  onClick={invertTokens}
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background-paper border-accent/30 h-8 w-8 shadow-md hover:bg-neutral-light"
                  aria-label="Invert tokens"
                >
                  <ArrowsUpDownIcon className="h-4 w-4 text-accent transition-transform duration-500 active:rotate-180" />
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <label htmlFor="to-amount" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Asset Out</label>
                <div className="flex items-center gap-2 bg-neutral-light p-2 rounded-lg border border-accent/10">
                  <TokenSelect
                    tokens={Tokens}
                    selectedToken={toToken}
                    onSelect={handleToTokenChange}
                    balances={balances}
                    className="w-1/2 border-none shadow-none bg-transparent"
                  />
                  <Input
                    type="text"
                    id="to-amount"
                    value={toAmount}
                    readOnly
                    className="w-1/2 text-right font-bold text-lg border-none focus-visible:ring-0 bg-transparent text-text-secondary"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Slippage */}
              <div className="pt-2">
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Slippage Tolerance</label>
                    <span className="text-[9px] font-bold text-accent">{slippage}%</span>
                 </div>
                 <div className="flex gap-2">
                    {[0.1, 0.5, 1.0].map((val) => (
                      <Button
                        key={val}
                        variant={slippage === val ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSlippage(val)}
                        className="flex-1 h-7 text-[10px] font-bold border-accent/20"
                        aria-pressed={slippage === val}
                      >
                        {val}%
                      </Button>
                    ))}
                 </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {stxAddress ? (
                  <Button
                    onClick={handleSwap}
                    disabled={loading || sending || isSameToken || !fromAmount}
                    className="w-full h-12 text-sm font-bold uppercase tracking-widest"
                  >
                    {sending ? "Processing..." : loading ? "Calculating..." : "Execute Swap"}
                  </Button>
                ) : (
                  <Button onClick={connectWallet} className="w-full h-12 text-sm font-bold uppercase tracking-widest">
                    Connect Wallet
                  </Button>
                )}
              </div>
              
              <div
                className={cn(
                  "text-center text-sm mt-2 min-h-[3rem] flex flex-col items-center justify-center transition-opacity duration-300",
                  (status || txId) ? "opacity-100" : "opacity-0"
                )}
                aria-live="polite"
              >
                {status && <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{status}</p>}
                {txId && (
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={`https://explorer.hiro.so/txid/${txId}?chain=${AppConfig.network}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-[10px]"
                      title="View on Stacks Explorer"
                    >
                      {truncate(txId, 12, 10)}
                    </a>
                    <CopyButton textToCopy={txId} ariaLabel="Transaction ID" className="h-6 w-6 p-1 border border-accent/10" />
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
