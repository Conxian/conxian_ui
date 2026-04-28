"use client";

import React from 'react';
import { useSearchParams } from "next/navigation";
import { openContractCall } from "@stacks/connect";
import { 
  uintCV,
  intCV,
  cvToHex, 
  contractPrincipalCV, 
  PostConditionMode
} from "@stacks/transactions";
import { Tokens, CoreContracts } from '@/lib/contracts';
import { callReadOnly, getFungibleTokenBalances, FungibleTokenBalance } from "@/lib/core-api";
import { decodeResultHex, getTupleField } from "@/lib/clarity";
import { useWallet } from '@/lib/wallet';
import { parseAmount } from "@/lib/utils";

// Re-styled components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import TokenSelect from '@/components/ui/TokenSelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getPrincipalValue(json: unknown): string | null {
  if (!isRecord(json)) return null;
  if (json["type"] !== "principal") return null;
  return typeof json["value"] === "string" ? json["value"] : null;
}

function findTokenIdFromSymbol(symbol: string): string | undefined {
  const sym = symbol.trim().toLowerCase();
  if (!sym) return undefined;
  const tok = Tokens.find(
    (t) =>
      t.id.toLowerCase().includes(sym) ||
      (typeof t.label === "string" && t.label.toLowerCase().includes(sym))
  );
  return tok?.id;
}

function AddLiquidityContent() {
  const searchParams = useSearchParams();
  const pairParam = searchParams.get("pair");
  const tokenAParam = searchParams.get("tokenA");
  const tokenBParam = searchParams.get("tokenB");

  const [tokenA, setTokenA] = React.useState(Tokens[0].id);
  const [tokenB, setTokenB] = React.useState(Tokens[1].id);
  const [amountA, setAmountA] = React.useState('100');
  const [amountB, setAmountB] = React.useState('200');

  // Concentrated Liquidity State
  const [lowerTick, setLowerTick] = React.useState('-1000');
  const [upperTick, setUpperTick] = React.useState('1000');

  const [balances, setBalances] = React.useState<FungibleTokenBalance[]>([]);
  const [status, setStatus] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const { connectWallet, stxAddress } = useWallet();

  React.useEffect(() => {
    if (stxAddress) {
      getFungibleTokenBalances(stxAddress).then(setBalances);
    }
  }, [stxAddress]);

  React.useEffect(() => {
    let nextA: string | undefined;
    let nextB: string | undefined;

    if (tokenAParam && Tokens.some((t) => t.id === tokenAParam)) {
      nextA = tokenAParam;
    }
    if (tokenBParam && Tokens.some((t) => t.id === tokenBParam)) {
      nextB = tokenBParam;
    }

    if ((!nextA || !nextB) && pairParam) {
      const [symA, symB] = pairParam.split("-");
      if (!nextA && symA) nextA = findTokenIdFromSymbol(symA);
      if (!nextB && symB) nextB = findTokenIdFromSymbol(symB);
    }

    if (nextA) setTokenA(nextA);
    if (nextB) setTokenB(nextB);
  }, [tokenAParam, tokenBParam, pairParam]);

  const handleAddLiquidity = async (isConcentrated = false) => {
    if (!stxAddress) {
      setStatus('Please connect wallet to add liquidity');
      return;
    }
    if (!tokenA || !tokenB || !amountA || !amountB) {
      setStatus('Please fill in all fields');
      return;
    }

    setSending(true);
    setStatus('Resolving pool...');

    try {
        // 1. Find Pool via Factory
        const factory = CoreContracts.find((c) => c.id.endsWith(".dex-factory-v2"));
        if (!factory) throw new Error("DEX Factory not found");
        
        const [factoryAddress, factoryName] = factory.id.split(".") as [string, string];
        const [tokenAAddress, tokenAName] = tokenA.split(".") as [string, string];
        const [tokenBAddress, tokenBName] = tokenB.split(".") as [string, string];
        const getPoolArgs = [
            cvToHex(contractPrincipalCV(tokenAAddress, tokenAName)),
            cvToHex(contractPrincipalCV(tokenBAddress, tokenBName)),
        ];

        const poolRes = await callReadOnly(
            factoryAddress,
            factoryName,
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
            setStatus("Pool not found. You may need to create it first.");
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
        const functionArgs: any[] = [ /* eslint-disable-line @typescript-eslint/no-explicit-any */
            uintCV(amt0Int),
            uintCV(amt1Int),
            contractPrincipalCV(...(t0.split(".") as [string, string])),
            contractPrincipalCV(...(t1.split(".") as [string, string]))
        ];

        if (isConcentrated) {
            // Use intCV for signed tick values
            functionArgs.push(intCV(BigInt(lowerTick)));
            functionArgs.push(intCV(BigInt(upperTick)));
        }

        await openContractCall({
            contractAddress: poolAddr,
            contractName: poolName,
            functionName: functionName,
            functionArgs: functionArgs,
            postConditionMode: PostConditionMode.Allow,
            postConditions: [],
            onFinish: (data) => {
                setStatus(`Liquidity added. Tx ID: ${data.txId}`);
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

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-widest uppercase">Add Liquidity</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Provide liquidity to earn trading fees and rewards.
        </p>
      </div>

      <Tabs defaultValue="standard" className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard (v2)</TabsTrigger>
          <TabsTrigger value="concentrated">Concentrated (CLMM)</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card className="bg-background-paper">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Standard Liquidity</CardTitle>
              <CardDescription>Full-range liquidity provision for automated market making.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Token A */}
              <div className="space-y-2">
                <label htmlFor="token-a" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Token A</label>
                <div className="flex items-center gap-2">
                  <TokenSelect
                    tokens={Tokens}
                    selectedToken={tokenA}
                    onSelect={(id) => setTokenA(id)}
                    balances={balances}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    id="amount-a"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    className="w-full text-right"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {/* Token B */}
              <div className="space-y-2">
                <label htmlFor="token-b" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Token B</label>
                <div className="flex items-center gap-2">
                  <TokenSelect
                    tokens={Tokens}
                    selectedToken={tokenB}
                    onSelect={(id) => setTokenB(id)}
                    balances={balances}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    id="amount-b"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    className="w-full text-right"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {stxAddress ? (
                  <Button
                    onClick={() => handleAddLiquidity(false)}
                    disabled={sending}
                    className="w-full"
                  >
                    {sending ? 'Adding...' : 'Add Liquidity'}
                  </Button>
                ) : (
                  <Button onClick={connectWallet} className="w-full">
                    Connect Wallet
                  </Button>
                )}
              </div>

              {status && <p className="text-center text-sm text-text mt-4">{status}</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concentrated">
          <Card className="bg-background-paper">
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-text-secondary">Concentrated Liquidity</CardTitle>
              <CardDescription>Provide liquidity within a specific price range for higher capital efficiency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="token-a-cl" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Token A</label>
                  <TokenSelect
                    tokens={Tokens}
                    selectedToken={tokenA}
                    onSelect={(id) => setTokenA(id)}
                    balances={balances}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    id="amount-a-cl"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
                    className="w-full text-right"
                    placeholder="0.0"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="token-b-cl" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Token B</label>
                  <TokenSelect
                    tokens={Tokens}
                    selectedToken={tokenB}
                    onSelect={(id) => setTokenB(id)}
                    balances={balances}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    id="amount-b-cl"
                    value={amountB}
                    onChange={(e) => setAmountB(e.target.value)}
                    className="w-full text-right"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-accent/10">
                <div className="space-y-2">
                  <label htmlFor="lower-tick" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Lower Tick</label>
                  <Input
                    type="number"
                    id="lower-tick"
                    value={lowerTick}
                    onChange={(e) => setLowerTick(e.target.value)}
                    className="w-full text-right"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="upper-tick" className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Upper Tick</label>
                  <Input
                    type="number"
                    id="upper-tick"
                    value={upperTick}
                    onChange={(e) => setUpperTick(e.target.value)}
                    className="w-full text-right"
                  />
                </div>
              </div>

              <div className="pt-4">
                {stxAddress ? (
                  <Button
                    onClick={() => handleAddLiquidity(true)}
                    disabled={sending}
                    variant="secondary"
                    className="w-full"
                  >
                    {sending ? 'Adding...' : 'Add Concentrated Liquidity'}
                  </Button>
                ) : (
                  <Button onClick={connectWallet} className="w-full">
                    Connect Wallet
                  </Button>
                )}
              </div>

              {status && <p className="text-center text-sm text-text mt-4">{status}</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AddLiquidityPage() {
  return (
    <React.Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <AddLiquidityContent />
    </React.Suspense>
  );
}
