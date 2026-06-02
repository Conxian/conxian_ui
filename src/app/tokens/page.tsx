"use client";

import React from "react";
import { userSession } from "@/lib/wallet";
import {
  getAddressBalances,
  getFungibleTokenBalances,
  AddressBalances,
  FungibleTokenBalance,
} from "@/lib/core-api";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatAmount } from "@/lib/utils";
import { useSelfLaunch } from "@/lib/hooks/use-self-launch";
import { logger } from "@/lib/logger";

export default function TokensPage() {
  const [address, setAddress] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [stx, setStx] = React.useState<AddressBalances["stx"] | null>(null);
  const [fts, setFts] = React.useState<FungibleTokenBalance[]>([]);
  const { userContribution, getUserContribution } = useSelfLaunch();

  const refresh = React.useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        getAddressBalances(address),
        getFungibleTokenBalances(address),
        getUserContribution(address)
      ]);

      const balances = results[0];
      const fungibles = results[1];

      if (balances.status === 'fulfilled') setStx(balances.value?.stx || null);
      else logger.error("Failed to fetch address balances", { module: 'Tokens', address, error: balances.reason });

      if (fungibles.status === 'fulfilled') setFts(fungibles.value || []);
      else logger.error("Failed to fetch fungible token balances", { module: 'Tokens', address, error: fungibles.reason });

    } catch (err) {
      logger.error("Failed to refresh token balances", { module: 'Tokens', address, error: err });
    } finally {
      setLoading(false);
    }
  }, [address, getUserContribution]);

  React.useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      const addr =
        data?.profile?.stxAddress?.testnet ||
        data?.profile?.stxAddress?.mainnet ||
        "";
      setAddress(addr);
    } else {
      setAddress("");
    }
  }, []);

  React.useEffect(() => {
    if (address) refresh();
  }, [address, refresh]);

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
       {/* Terminal Top Bar */}
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Asset Custody</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>SAFE: LOCKED</span>
          <span>ENTROPY: 256bit</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-widest uppercase text-ink">TOKENS</h1>
              <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">Real-Time Ledger Audit</p>
           </div>
        </div>

        {!address && (
          <Card className="machined-card max-w-xl mx-auto">
            <CardContent className="pt-6">
              <p className="text-center text-ink/40 font-black uppercase tracking-widest text-[10px] py-12">
                Authorization Required to Disclose Ledger State.
              </p>
            </CardContent>
          </Card>
        )}

        {address && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="machined-card">
                <div className="machined-header">
                  <span>STX BALANCE</span>
                </div>
                <CardContent className="p-6">
                  <div className="text-3xl font-black text-ink tabular-nums">
                    {stx?.balance ? `${formatAmount(stx.balance, 6)}` : "0.00"} <span className="text-lg opacity-40">STX</span>
                  </div>
                  <p className="text-[9px] text-ink/40 mt-3 font-black uppercase tracking-[0.2em]">Available for transaction</p>
                </CardContent>
              </Card>
              <Card className="machined-card">
                <div className="machined-header">
                  <span>LAUNCH CONTRIBUTION</span>
                </div>
                <CardContent className="p-6">
                  <div className="text-3xl font-black text-ink tabular-nums">
                    {userContribution.total} <span className="text-lg opacity-40">STX</span>
                  </div>
                  <p className="text-[9px] text-ink/40 mt-3 font-black uppercase tracking-[0.2em]">Current Tier: {userContribution.level}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="machined-card">
              <div className="machined-header">
                <span>FUNGIBLE TOKEN INVENTORY</span>
                <Button
                  onClick={refresh}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="h-6 px-3 bg-ink text-background-paper border-none"
                >
                  {loading ? "SYNC..." : "REFRESH"}
                </Button>
              </div>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ASSET_IDENTIFIER_VECTOR</TableHead>
                      <TableHead className="text-right">BALANCE_UNIT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fts.map((t: FungibleTokenBalance) => (
                      <TableRow key={t.asset_identifier}>
                        <TableCell className="font-mono text-[9px] text-ink break-all font-black">
                          {t.asset_identifier}
                        </TableCell>
                        <TableCell className="text-right font-black tabular-nums text-ink text-[12px]">
                          {formatAmount(t.balance, 6)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {fts.length === 0 && (
                      <TableRow>
                        <TableCell className="py-20 text-center text-ink/20 font-black uppercase tracking-widest text-[10px]" colSpan={2}>
                          NO_FUNGIBLE_ASSETS_DETECTED
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
