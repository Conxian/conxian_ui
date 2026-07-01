"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  openContractCall,
  PostConditionMode,
  uintCV,
  intCV,
  contractPrincipalCV,
  cvToHex,
} from "@stacks/transactions";
import { Tokens } from "@/lib/contracts";
import { getFungibleTokenBalances, FungibleTokenBalance, callReadOnly } from "@/lib/core-api";
import { userSession } from "@/lib/wallet";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import TokenSelect from "@/components/ui/TokenSelect";
import { parseAmount, decodeResultHex, getTupleField, getPrincipalValue } from "@/lib/utils";
import {
  CpuChipIcon,
  BoltIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

function AddLiquidityContent() {
  const searchParams = useSearchParams();
  const pair = searchParams.get("pair") || "STX-CXD";

  const [tokenA, setTokenA] = useState("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-token");
  const [tokenB, setTokenB] = useState("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.cxd-token");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [lowerTick, setLowerTick] = useState("-1000");
  const [upperTick, setUpperTick] = useState("1000");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [balances, setBalances] = useState<FungibleTokenBalance[]>([]);

  useEffect(() => {
    if (pair) {
      const parts = pair.split("-");
      if (parts.length === 2) {
        const tA = Tokens.find((t) => t.label === parts[0]);
        const tB = Tokens.find((t) => t.label === parts[1]);
        if (tA) setTokenA(tA.id);
        if (tB) setTokenB(tB.id);
      }
    }
  }, [pair]);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const addr = userData.profile.stxAddress.testnet || userData.profile.stxAddress.mainnet;
      getFungibleTokenBalances(addr).then(setBalances).catch(console.error);
    }
  }, []);

  const handleAddLiquidity = async (isConcentrated: boolean) => {
    if (!userSession.isUserSignedIn()) {
      setStatus("Please connect your wallet.");
      return;
    }

    setSending(true);
    setStatus("Preparing transaction...");

    try {
      // 1. Resolve the pool principal using the factory
      const factory = Tokens.find((t) => t.label === "FACTORY");
      if (!factory) {
        setStatus("Factory contract not found.");
        setSending(false);
        return;
      }

      const [factoryAddress, contractName] = factory.id.split(".");
      const getPoolArgs = [
        contractPrincipalCV(...(tokenA.split(".") as [string, string])),
        contractPrincipalCV(...(tokenB.split(".") as [string, string])),
      ].map(cvToHex);

      const poolRes = await callReadOnly(
        factoryAddress,
        contractName,
        "get-pool",
        factoryAddress,
        getPoolArgs,
      );

      let poolPrincipal = "";
      if (poolRes.ok && poolRes.result) {
        const decoded = decodeResultHex(poolRes.result);
        if (decoded && decoded.ok) {
          const poolField = getTupleField(decoded.value, "pool");
          const principal = getPrincipalValue(poolField);
          if (principal) poolPrincipal = principal;
        }
      }

      if (!poolPrincipal) {
        setStatus("Pool not found.");
        setSending(false);
        return;
      }

      const tokenAInfo = Tokens.find((t) => t.id === tokenA);
      const tokenBInfo = Tokens.find((t) => t.id === tokenB);

      const sorted = [tokenA, tokenB].sort();
      const t0 = sorted[0];
      const t1 = sorted[1];

      const amt0 = t0 === tokenA ? amountA : amountB;
      const amt1 = t1 === tokenB ? amountB : amountA;

      const t0Info = t0 === tokenA ? tokenAInfo : tokenBInfo;
      const t1Info = t1 === tokenB ? tokenBInfo : tokenAInfo;

      const amt0Int = BigInt(parseAmount(amt0, t0Info?.decimals || 6));
      const amt1Int = BigInt(parseAmount(amt1, t1Info?.decimals || 6));

      const [poolAddr, poolName] = poolPrincipal.split(".");

      const functionName = isConcentrated ? "add-liquidity-concentrated" : "add-liquidity";
      const functionArgs: Array<any> = [
        uintCV(amt0Int),
        uintCV(amt1Int),
        contractPrincipalCV(...(t0.split(".") as [string, string])),
        contractPrincipalCV(...(t1.split(".") as [string, string])),
      ];

      if (isConcentrated) {
        functionArgs.push(intCV(BigInt(lowerTick)));
        functionArgs.push(intCV(BigInt(upperTick)));
      }

      await openContractCall({
        contractAddress: poolAddr,
        contractName: poolName,
        functionName,
        functionArgs: functionArgs as any,
        postConditionMode: PostConditionMode.Allow,
        onFinish: () => {
          setStatus("Transaction submitted.");
          setSending(false);
        },
        onCancel: () => {
          setStatus("Transaction cancelled.");
          setSending(false);
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background terminal-text">
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Add Liquidity</span>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>Pool Type: V2 / CLMM</span>
        </div>
      </div>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase text-ink">LIQUIDITY</h1>
            <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">
              Add Liquidity
            </p>
          </div>
        </div>

        <Tabs defaultValue="standard" className="w-full max-w-4xl mx-auto space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-light border-accent/20 h-12 p-1">
            <TabsTrigger value="standard" aria-label="Standard V2 liquidity">Standard (v2)</TabsTrigger>
            <TabsTrigger value="concentrated" aria-label="Concentrated CLMM liquidity">Concentrated (CLMM)</TabsTrigger>
          </TabsList>

          <TabsContent value="standard">
            <Card className="machined-card">
              <div className="machined-header">
                <span>STANDARD LIQUIDITY</span>
                <CpuChipIcon className="w-3 h-3" />
              </div>
              <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Token A</label>
                    <TokenSelect tokens={Tokens} selectedToken={tokenA} onSelect={(id) => setTokenA(id)} balances={balances} />
                    <Input
                      type="number"
                      value={amountA}
                      onChange={(e) => setAmountA(e.target.value)}
                      className="h-14 bg-neutral-light border-accent/20 text-right font-black text-2xl tabular-nums"
                      placeholder="0.00"
                      aria-label="Amount to add"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Token B</label>
                    <TokenSelect tokens={Tokens} selectedToken={tokenB} onSelect={(id) => setTokenB(id)} balances={balances} />
                    <Input
                      type="number"
                      value={amountB}
                      onChange={(e) => setAmountB(e.target.value)}
                      className="h-14 bg-neutral-light border-accent/20 text-right font-black text-2xl tabular-nums"
                      placeholder="0.00"
                      aria-label="Amount to add"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleAddLiquidity(false)}
                  disabled={sending}
                  className="w-full h-14 bg-ink text-background-paper font-black uppercase tracking-[0.3em] text-xs hover:bg-ink-light transition-all rounded-none flex items-center justify-center gap-3"
                >
                  {sending ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" aria-hidden="true" />
                      <span>SUBMITTING...</span>
                    </>
                  ) : (
                    "ADD LIQUIDITY"
                  )}
                </Button>

                {status && (
                  <p className="text-center font-mono text-[10px] text-accent uppercase font-black tracking-[0.2em]">
                    {status}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concentrated">
            <Card className="machined-card">
              <div className="machined-header">
                <span>CONCENTRATED LIQUIDITY</span>
                <BoltIcon className="w-3 h-3 text-accent" />
              </div>
              <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Pool Configuration</label>
                      <div className="grid grid-cols-2 gap-2">
                        <TokenSelect tokens={Tokens} selectedToken={tokenA} onSelect={(id) => setTokenA(id)} balances={balances} />
                        <TokenSelect tokens={Tokens} selectedToken={tokenB} onSelect={(id) => setTokenB(id)} balances={balances} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" value={amountA} onChange={(e) => setAmountA(e.target.value)} className="h-12 bg-neutral-light border-accent/20 text-right font-black tabular-nums" placeholder="AMOUNT_A" aria-label="Token A amount" />
                      <Input type="number" value={amountB} onChange={(e) => setAmountB(e.target.value)} className="h-12 bg-neutral-light border-accent/20 text-right font-black tabular-nums" placeholder="AMOUNT_B" aria-label="Token B amount" />
                    </div>
                  </div>

                  <div className="space-y-6 bg-neutral-light p-6 border border-accent/20 rounded-sm">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-light">Range Settings</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-ink-light uppercase tracking-[0.2em]">Lower Tick</span>
                        <Input type="number" value={lowerTick} onChange={(e) => setLowerTick(e.target.value)} className="h-10 bg-background-paper border-accent/20 text-right font-mono text-xs font-black tabular-nums" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-ink-light uppercase tracking-[0.2em]">Upper Tick</span>
                        <Input type="number" value={upperTick} onChange={(e) => setUpperTick(e.target.value)} className="h-10 bg-background-paper border-accent/20 text-right font-mono text-xs font-black tabular-nums" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleAddLiquidity(true)}
                  disabled={sending}
                  className="w-full h-14 bg-ink text-background-paper font-black uppercase tracking-[0.3em] text-xs hover:bg-ink-light transition-all rounded-none flex items-center justify-center gap-3"
                >
                  {sending ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" aria-hidden="true" />
                      <span>SUBMITTING...</span>
                    </>
                  ) : (
                    "ADD CONCENTRATED LIQUIDITY"
                  )}
                </Button>

                {status && (
                  <p className="text-center font-mono text-[10px] text-accent uppercase font-black tracking-[0.2em]">
                    {status}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AddLiquidityPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center terminal-text animate-pulse font-black text-ink">Loading liquidity page...</div>}>
      <AddLiquidityContent />
    </Suspense>
  );
}
