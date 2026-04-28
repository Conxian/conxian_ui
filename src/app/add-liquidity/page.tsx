"use client";

import React, { useState, Suspense, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Tokens } from "@/lib/contracts";
import { useWallet } from "@/lib/wallet";
import {
  uintCV,
  intCV,
  PostConditionMode,
  contractPrincipalCV,
  cvToHex,
} from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { AppConfig } from "@/lib/config";
import {
  getFungibleTokenBalances,
  FungibleTokenBalance,
  callReadOnly,
} from "@/lib/core-api";
import { parseAmount } from "@/lib/utils";
import TokenSelect from "@/components/ui/TokenSelect";
import { Input } from "@/components/ui/Input";
import { decodeResultHex, getTupleField, getPrincipalValue } from "@/lib/clarity";
import { CpuChipIcon, BoltIcon } from "@heroicons/react/24/outline";

function AddLiquidityContent() {
  const { stxAddress, connectWallet } = useWallet();
  const [tokenA, setTokenA] = useState(Tokens[0].id);
  const [tokenB, setTokenB] = useState(Tokens[1].id);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [lowerTick, setLowerTick] = useState("-5000");
  const [upperTick, setUpperTick] = useState("5000");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [balances, setBalances] = useState<FungibleTokenBalance[]>([]);

  useEffect(() => {
    if (stxAddress) {
      getFungibleTokenBalances(stxAddress).then(setBalances);
    }
  }, [stxAddress]);

  const handleAddLiquidity = async (isConcentrated: boolean) => {
    if (!stxAddress) {
      connectWallet();
      return;
    }
    setSending(true);
    setStatus("SYNCHRONIZING_LIQUIDITY_PROTOCOL...");

    try {
        const factoryAddress = AppConfig.contracts.factory.split(".")[0];
        const contractName = AppConfig.contracts.factory.split(".")[1];

        const getPoolArgs = [
            contractPrincipalCV(...(tokenA.split(".") as [string, string])),
            contractPrincipalCV(...(tokenB.split(".") as [string, string]))
        ].map(cvToHex);

        const poolRes = await callReadOnly(
            factoryAddress,
            contractName,
            "get-pool",
            factoryAddress,
            getPoolArgs
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
            setStatus("PROTOCOL_ERROR: POOL_NOT_DETECTED");
            setSending(false);
            return;
        }

        const tokenAInfo = Tokens.find(t => t.id === tokenA);
        const tokenBInfo = Tokens.find(t => t.id === tokenB);

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
        const functionArgs: Array<any> /* eslint-disable-line @typescript-eslint/no-explicit-any */ = [
            uintCV(amt0Int),
            uintCV(amt1Int),
            contractPrincipalCV(...(t0.split(".") as [string, string])),
            contractPrincipalCV(...(t1.split(".") as [string, string]))
        ];

        if (isConcentrated) {
            functionArgs.push(intCV(BigInt(lowerTick)));
            functionArgs.push(intCV(BigInt(upperTick)));
        }

        await openContractCall({
            contractAddress: poolAddr,
            contractName: poolName,
            functionName: functionName,
            functionArgs: functionArgs as any /* eslint-disable-line @typescript-eslint/no-explicit-any */,
            postConditionMode: PostConditionMode.Allow,
            onFinish: () => {
                setStatus("BROADCAST_SUCCESS");
                setSending(false);
            },
            onCancel: () => {
                setStatus("ABORTED");
                setSending(false);
            }
        });

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`FAULT: ${msg}`);
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      <div className="bg-ink text-background py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Liquidity Provision Environment</span>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <span>YIELD_SOURCE: DET_v3</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase text-ink">LIQUIDITY</h1>
              <p className="text-accent font-bold uppercase tracking-[0.4em] text-xs mt-2">Automated Market Making Protocol</p>
           </div>
        </div>

        <Tabs defaultValue="standard" className="w-full max-w-4xl mx-auto space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-neutral-light border-ghost h-12 p-1">
            <TabsTrigger value="standard" className="uppercase font-black tracking-[0.2em] text-[10px]">Standard (v2)</TabsTrigger>
            <TabsTrigger value="concentrated" className="uppercase font-black tracking-[0.2em] text-[10px]">Concentrated (CLMM)</TabsTrigger>
          </TabsList>

          <TabsContent value="standard">
            <Card className="machined-card">
              <div className="machined-header">
                 <span>EXECUTION_VECTOR_STANDARD</span>
                 <CpuChipIcon className="w-3 h-3" />
              </div>
              <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Asset Alpha</label>
                    <TokenSelect
                      tokens={Tokens}
                      selectedToken={tokenA}
                      onSelect={(id) => setTokenA(id)}
                      balances={balances}
                    />
                    <Input
                      type="number"
                      value={amountA}
                      onChange={(e) => setAmountA(e.target.value)}
                      className="h-14 bg-neutral-light border-ghost text-right font-black text-2xl tabular-nums"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Asset Beta</label>
                    <TokenSelect
                      tokens={Tokens}
                      selectedToken={tokenB}
                      onSelect={(id) => setTokenB(id)}
                      balances={balances}
                    />
                    <Input
                      type="number"
                      value={amountB}
                      onChange={(e) => setAmountB(e.target.value)}
                      className="h-14 bg-neutral-light border-ghost text-right font-black text-2xl tabular-nums"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => handleAddLiquidity(false)}
                  disabled={sending}
                  className="w-full h-14 bg-ink text-background font-black uppercase tracking-[0.3em] text-xs hover:bg-ink-light transition-all rounded-none"
                >
                  {sending ? 'TRANSMITTING...' : 'INITIATE PROVISION'}
                </Button>

                {status && <p className="text-center font-mono text-[10px] text-accent uppercase font-black tracking-[0.2em]">{status}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concentrated">
            <Card className="machined-card">
              <div className="machined-header">
                 <span>EXECUTION_VECTOR_CONCENTRATED</span>
                 <BoltIcon className="w-3 h-3 text-accent" />
              </div>
              <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Pair Configuration</label>
                      <div className="grid grid-cols-2 gap-2">
                        <TokenSelect tokens={Tokens} selectedToken={tokenA} onSelect={id => setTokenA(id)} balances={balances} />
                        <TokenSelect tokens={Tokens} selectedToken={tokenB} onSelect={id => setTokenB(id)} balances={balances} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" value={amountA} onChange={e => setAmountA(e.target.value)} className="h-12 bg-neutral-light border-ghost text-right font-black" placeholder="QTY_A" />
                      <Input type="number" value={amountB} onChange={e => setAmountB(e.target.value)} className="h-12 bg-neutral-light border-ghost text-right font-black" placeholder="QTY_B" />
                    </div>
                  </div>

                  <div className="space-y-6 bg-ink/[0.02] p-6 border border-ghost rounded-sm">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Range Parameters</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-ink/30 uppercase tracking-[0.2em]">Lower_Tick</span>
                        <Input type="number" value={lowerTick} onChange={e => setLowerTick(e.target.value)} className="h-10 bg-white border-ghost text-right font-mono text-xs" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-ink/30 uppercase tracking-[0.2em]">Upper_Tick</span>
                        <Input type="number" value={upperTick} onChange={e => setUpperTick(e.target.value)} className="h-10 bg-white border-ghost text-right font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleAddLiquidity(true)}
                  disabled={sending}
                  className="w-full h-14 bg-ink text-background font-black uppercase tracking-[0.3em] text-xs hover:bg-ink-light transition-all rounded-none"
                >
                  {sending ? 'TRANSMITTING...' : 'INITIATE CONCENTRATED PROVISION'}
                </Button>

                {status && <p className="text-center font-mono text-[10px] text-accent uppercase font-black tracking-[0.2em]">{status}</p>}
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
    <Suspense fallback={<div className="p-20 text-center terminal-text animate-pulse">SYNCHRONIZING PROTOCOL...</div>}>
      <AddLiquidityContent />
    </Suspense>
  );
}
