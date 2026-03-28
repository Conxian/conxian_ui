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

export default function TokensPage() {
  const [address, setAddress] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [stx, setStx] = React.useState<AddressBalances["stx"] | null>(null);
  const [fts, setFts] = React.useState<FungibleTokenBalance[]>([]);

  const refresh = React.useCallback(async () => {
    if (!address) return;
    setLoading(true);
    const balances = await getAddressBalances(address);
    const fungibles = await getFungibleTokenBalances(address);
    setStx(balances?.stx);
    setFts(fungibles || []);
    setLoading(false);
  }, [address]);

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
    <div className="space-y-8">
      {!address && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-text">
              Connect your wallet to view balances.
            </p>
          </CardContent>
        </Card>
      )}

      {address && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>STX Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text">
                  {stx?.balance ? `${stx.balance} STX` : "—"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                {/* This will be implemented in a future step */}
                <div className="text-2xl font-bold text-text">
                  Coming Soon
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-text">Fungible Tokens</CardTitle>
                <Button
                  onClick={refresh}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  {loading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-accent/20">
                      <th className="py-3 px-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Asset Identifier</th>
                      <th className="py-3 px-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="text-text">
                    {fts.map((t: FungibleTokenBalance) => (
                      <tr
                        key={t.asset_identifier}
                        className="border-b border-accent/20 hover:bg-accent/5 transition-colors"
                      >
                        <td className="py-3 px-4 break-all font-mono text-xs">
                          {t.asset_identifier}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">{t.balance}</td>
                      </tr>
                    ))}
                    {fts.length === 0 && (
                      <tr>
                        <td className="py-4 text-center" colSpan={2}>
                          No fungible tokens found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
