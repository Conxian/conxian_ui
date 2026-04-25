"use client";

import { useEffect, useState } from "react";
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
  } = useSelfLaunch();

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
    return <div className="text-center p-20 animate-pulse text-text-secondary uppercase tracking-widest font-bold">Synchronizing Launch Sequence...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-20 bg-error/5 border border-error/20 rounded-xl">
        <p className="text-error font-bold uppercase tracking-widest">Initialization Error</p>
        <p className="text-text-secondary text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-widest uppercase">
          Community Launch
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Bootstrap the future of decentralized finance through communal funding.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 border border-accent/20 bg-background-light p-1 h-12">
          <TabsTrigger value="overview" className="uppercase font-bold tracking-widest text-[10px]">Overview</TabsTrigger>
          <TabsTrigger value="contribute" className="uppercase font-bold tracking-widest text-[10px]">Contribute</TabsTrigger>
          <TabsTrigger value="progress" className="uppercase font-bold tracking-widest text-[10px]">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard" className="uppercase font-bold tracking-widest text-[10px]">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Current Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text uppercase tracking-tight">
                  {currentPhase?.name || 'N/A'}
                </div>
                <p className="text-[10px] text-text-muted mt-1 uppercase font-medium">Core Infrastructure deployment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Total Raised</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text tabular-nums">
                  {fundingProgress.current.toLocaleString()} STX
                </div>
                <p className="text-[10px] text-text-muted mt-1 uppercase font-medium">Community pool funding</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text tabular-nums">
                  {communityStats?.totalContributors || 0}
                </div>
                <p className="text-[10px] text-text-muted mt-1 uppercase font-medium">Verified active addresses</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-text-secondary">Launch Roadmap</CardTitle>
              <CardDescription className="text-xs text-text-muted">
                Milestone tracking for the Conxian network decentralization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {phases.map((phase) => (
                <div key={phase.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text uppercase tracking-tight text-sm">
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
                      className="uppercase text-[9px] font-bold tracking-widest px-2 py-0.5"
                    >
                      {phase.status}
                    </Badge>
                  </div>
                  <Progress
                    value={(phase.funding / phase.target) * 100}
                    className="h-2 bg-accent/10"
                  />
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary tabular-nums">
                    <span>
                      {phase.funding.toLocaleString()} / {phase.target.toLocaleString()} STX
                    </span>
                    <span>{phase.contributors} members</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contribute" className="space-y-6">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-text-secondary">Funding Participation</CardTitle>
              <CardDescription className="text-xs text-text-muted">
                Support the Conxian infrastructure and earn hardware-attested rewards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                   <Input
                     type="number"
                     value={contributionAmount}
                     onChange={(e) => setContributionAmount(e.target.value)}
                     placeholder="0.00"
                     className="text-right pr-12 font-bold"
                   />
                   <span className="absolute right-4 top-2.5 text-xs font-bold text-text-muted pointer-events-none">STX</span>
                </div>
                <Button onClick={handleContribute} disabled={sending} className="min-w-[120px] font-bold uppercase tracking-widest text-xs h-10">
                  {sending ? "Sending..." : "Contribute"}
                </Button>
              </div>
              <div className="p-3 bg-neutral-light rounded border border-accent/10 flex justify-between items-center">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Your Active Contribution:</span>
                 <span className="text-sm font-bold text-text tabular-nums">{userContribution.total} STX</span>
              </div>

              {txId && (
                <div
                  className="mt-6 p-4 border border-accent/20 rounded-lg bg-background-light flex items-center justify-between"
                  aria-live="polite"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Transaction Submitted</span>
                    <a
                      href={`https://explorer.hiro.so/txid/${txId}?chain=${AppConfig.network}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-xs mt-1"
                      title="View on Stacks Explorer"
                    >
                      {truncate(txId, 14, 12)}
                    </a>
                  </div>
                  <CopyButton textToCopy={txId} ariaLabel="Transaction ID" className="h-8 w-8 p-1.5 border border-accent/20" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-text-secondary">Launch Benefactors</CardTitle>
              <CardDescription className="text-xs text-text-muted">
                Real-time attribution for top protocol participants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!communityStats?.topContributors || communityStats.topContributors.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-accent/5 rounded-xl">
                    <p className="text-text-muted italic text-sm">No recorded contributions yet. The sequence is ready.</p>
                  </div>
                ) : (
                  communityStats.topContributors.map((contrib, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 border border-accent/10 rounded-lg bg-background-light hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-text-muted tabular-nums">#0{index + 1}</span>
                        <div className="font-mono text-xs font-bold text-text-primary">
                          {truncate(contrib.address, 10, 8)}
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div className="font-bold text-text tabular-nums text-sm">
                          {contrib.amount.toLocaleString()} STX
                        </div>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-[0.2em] border-accent/20 text-accent">
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
