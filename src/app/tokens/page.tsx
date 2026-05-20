"use client";

import React from "react";
import { userSession } from "@/lib/wallet";
import {
  getAddressBalances,
  getFungibleTokenBalances,
  AddressBalances,
  FungibleTokenBalance,
} from "@/lib/core-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
      const [balances, fungibles] = await Promise.all([
        getAddressBalances(address),
        getFungibleTokenBalances(address),
        getUserContribution(address)
      ]);
      setStx(balances?.stx || null);
      setFts(fungibles || []);
    } catch (err) {
      console.error("Failed to refresh balances", err);
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
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Asset Custody Explorer</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>HODL: ACTIVE</span>
          <span>VALUATION: USD_EST</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-widest uppercase text-ink">ASSETS</h1>
              <p className="text-accent font-bold uppercase tracking-[0.4em] text-xs mt-2">Personal Liquidity Distribution</p>
           </div>
        </div>

      {!address && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-ink">
              Connect your wallet to view balances.
            </p>
          </CardContent>
        </Card>
      )}

      {address && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">STX Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-ink tabular-nums">
                  {stx?.balance ? `${formatAmount(stx.balance, 6)} STX` : "0.00 STX"}
                </div>
                <p className="text-xs text-ink/40 mt-1 uppercase">Available for transaction</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">Launch Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-ink tabular-nums">
                  {userContribution.total} STX
                </div>
                <p className="text-xs text-ink/40 mt-1 uppercase">Tier: {userContribution.level}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-ink-light">Fungible Tokens</CardTitle>
                <Button
                  onClick={refresh}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  {loading ? "Syncing..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset Identifier</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fts.map((t: FungibleTokenBalance) => (
                    <TableRow key={t.asset_identifier}>
                      <TableCell className="font-mono text-xs text-ink break-all">
                        {t.asset_identifier}
                      </TableCell>
                      <TableCell className="text-right font-black tabular-nums">
                        {formatAmount(t.balance, 6)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {fts.length === 0 && (
                    <TableRow>
                      <TableCell className="py-12 text-center text-ink/40 italic" colSpan={2}>
                        No fungible tokens detected in this account.
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
