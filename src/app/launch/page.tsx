"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useWallet } from "@/lib/wallet";
import { useSelfLaunch } from "@/lib/hooks/use-self-launch";
import { Input } from "@/components/ui/Input";
import { AppConfig } from "@/lib/config";
import CopyButton from "@/components/CopyButton";
import { truncate } from "@/lib/utils";

export default function LaunchPage() {
  const { stxAddress, addToast } = useWallet();
  const {
    currentPhase,
    fundingProgress,
    communityStats,
    userContribution,
    isLoading,
    error,
    contribute,
    getUserContribution,
  } = useSelfLaunch('testnet');

  const [contributionAmount, setContributionAmount] = useState("100");
  const [sending, setSending] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);

  useEffect(() => {
    if (stxAddress) {
      getUserContribution(stxAddress);
    }
  }, [stxAddress, getUserContribution]);

  const handleContribute = async () => {
    const amount = Number(contributionAmount);
    if (!stxAddress) {
      addToast("Please connect your wallet to contribute.", "info");
      return;
    }

    setSending(true);
    setTxId(null);
    try {
      const result = await contribute(stxAddress, amount);
      if (result.success && result.txId) {
        setTxId(result.txId);
        addToast(`Successfully contributed ${amount} STX! Transaction submitted.`, "success");
      } else {
        addToast(result.error || "Contribution failed.", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("An unexpected error occurred during contribution.", "error");
    } finally {
      setSending(false);
    }
  };

  const phases = currentPhase ? [{
    id: currentPhase.id,
    name: currentPhase.name,
    funding: fundingProgress.current,
    target: fundingProgress.target,
    contributors: communityStats?.totalContributors || 0,
    contracts: currentPhase.requiredContracts,
    status: currentPhase.status as "pending" | "active" | "completed",
  }] : [];

  if (isLoading && !currentPhase) {
    return <div className="text-center p-8">Loading launch data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">
          Conxian Community Launch
        </h1>
        <p className="mt-2 text-sm text-text/80">
          Help bootstrap the future of DeFi through community funding.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 border border-accent/20">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text">
                  {currentPhase?.name || 'N/A'}
                </div>
                <p className="text-text/80">Core infrastructure deployment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Raised</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text">
                  {fundingProgress.current} STX
                </div>
                <p className="text-text/80">Community contributions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text">
                  {communityStats?.totalContributors || 0}
                </div>
                <p className="text-text/80">Active community members</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Launch Progress</CardTitle>
              <CardDescription>
                Track our journey to full decentralization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {phases.map((phase) => (
                <div key={phase.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-text">
                      {phase.name}
                    </span>
                    <Badge
                      variant={
                        phase.status === "completed"
                          ? "default"
                          : phase.status === "active"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {phase.status}
                    </Badge>
                  </div>
                  <Progress
                    value={(phase.funding / phase.target) * 100}
                    className="h-2 bg-accent/20"
                  />
                  <div className="flex justify-between text-sm text-text/80">
                    <span>
                      {phase.funding} / {phase.target} STX
                    </span>
                    <span>{phase.contributors} contributors</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contribute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contribute to the Launch</CardTitle>
              <CardDescription>
                Support the Conxian network and earn rewards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="STX Amount"
                  className="max-w-xs"
                />
                <Button onClick={handleContribute} disabled={sending}>
                  {sending ? "Sending..." : "Contribute"}
                </Button>
              </div>
              <div className="text-sm text-text/80">
                Your contribution: {userContribution.total || 0} STX
              </div>

              {txId && (
                <div
                  className="mt-4 p-4 border border-accent/20 rounded-md bg-background-light flex items-center justify-between"
                  aria-live="polite"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-text-secondary uppercase">Transaction Submitted</span>
                    <a
                      href={`https://explorer.hiro.so/txid/${txId}?chain=${AppConfig.network}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-sm mt-1"
                      title="View on Stacks Explorer"
                    >
                      {truncate(txId, 12, 10)}
                    </a>
                  </div>
                  <CopyButton textToCopy={txId} ariaLabel="Transaction ID" className="h-8 w-8 p-1.5" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Contributors</CardTitle>
              <CardDescription>
                Top contributors to the Conxian launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!communityStats?.topContributors || communityStats.topContributors.length === 0 ? (
                  <p className="text-center text-text/80 py-8">
                    No contributions yet. Be the first!
                  </p>
                ) : (
                  communityStats.topContributors.map((contrib, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border border-accent/20 rounded-md bg-background-light"
                    >
                      <div>
                        <div className="font-medium text-text">
                          {truncate(contrib.address, 10, 8)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-text">
                          {contrib.amount} STX
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {contrib.level}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
