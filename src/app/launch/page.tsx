"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
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
import { truncate, cn } from "@/lib/utils";
import { BoltIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function LaunchPage() {
  const { stxAddress, connectWallet, addToast } = useWallet();
  const {
    currentPhase,
    fundingProgress,
    communityStats,
    userContribution,
    contribute,
    refreshData
  } = useSelfLaunch();

  const [contributionAmount, setContributionAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [txId, setTxId] = useState("");

  // Hardcoded phases for roadmap display since they aren't dynamic yet
  const phases = [
    { id: '1', name: 'Alpha Genesis', target: 50000, funding: 50000, contributors: 42, status: 'completed' },
    { id: '2', name: 'Infrastructure expansion', target: 250000, funding: fundingProgress.current, contributors: communityStats?.totalContributors || 0, status: 'active' },
    { id: '3', name: 'Mainnet Readiness', target: 1000000, funding: 0, contributors: 0, status: 'pending' },
  ];

  const handleContribute = async () => {
    if (!stxAddress) {
      addToast("Please connect your wallet to contribute", "info");
      connectWallet();
      return;
    }
    if (!contributionAmount) return;

    setSending(true);
    try {
      const res = await contribute(stxAddress, parseInt(contributionAmount, 10));
      if (res?.txId) {
        setTxId(res.txId);
        setContributionAmount("");
        refreshData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      {/* Terminal Top Bar */}
      <div className="bg-ink text-background py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Bootstrap Environment</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>ALLOCATION: OPEN</span>
          <span>QUORUM: 94.2%</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase text-ink">BOOTSTRAP</h1>
              <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">Community Funding Sequence</p>
           </div>
           <div className="text-right hidden md:block">
              <span className="text-[9px] font-black uppercase text-ink/30">Target Phase</span>
              <p className="text-xs font-mono font-black text-ink">{currentPhase?.name || "SEQUENCING..."}</p>
           </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-light border-ghost h-12 p-1">
            <TabsTrigger value="overview" className="uppercase font-black tracking-[0.2em] text-[10px]">Sequence Log</TabsTrigger>
            <TabsTrigger value="contribute" className="uppercase font-black tracking-[0.2em] text-[10px]">Contribute</TabsTrigger>
            <TabsTrigger value="progress" className="uppercase font-black tracking-[0.2em] text-[10px]">Node Distribution</TabsTrigger>
            <TabsTrigger value="leaderboard" className="uppercase font-black tracking-[0.2em] text-[10px]">Attribution</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="machined-card">
                <div className="machined-header">
                   <span>CURRENT PHASE</span>
                   <BoltIcon className="w-3 h-3" />
                </div>
                <CardContent className="p-6">
                  <div className="text-3xl font-black text-ink uppercase tracking-tighter">
                    {currentPhase?.name || 'N/A'}
                  </div>
                  <p className="text-[9px] text-ink/40 mt-3 font-black uppercase tracking-[0.2em]">Core Infrastructure Deployment</p>
                </CardContent>
              </Card>

              <Card className="machined-card">
                <div className="machined-header">
                   <span>TOTAL RAISED</span>
                   <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                </div>
                <CardContent className="p-6">
                  <div className="text-3xl font-black text-ink tabular-nums">
                    {fundingProgress.current.toLocaleString()} <span className="text-lg opacity-40">STX</span>
                  </div>
                  <p className="text-[9px] text-ink/40 mt-3 font-black uppercase tracking-[0.2em]">Community Pool Funding</p>
                </CardContent>
              </Card>

              <Card className="machined-card">
                <div className="machined-header">
                   <span>CONTRIBUTORS</span>
                   <GlobeAltIcon className="w-3 h-3" />
                </div>
                <CardContent className="p-6">
                  <div className="text-3xl font-black text-ink tabular-nums">
                    {communityStats?.totalContributors || 0}
                  </div>
                  <p className="text-[9px] text-ink/40 mt-3 font-black uppercase tracking-[0.2em]">Verified Active Nodes</p>
                </CardContent>
              </Card>
            </div>

            <Card className="machined-card">
              <div className="machined-header">
                <span>LAUNCH ROADMAP</span>
              </div>
              <CardContent className="p-8 space-y-8">
                {phases.map((phase) => (
                  <div key={phase.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-ink uppercase tracking-[0.2em] text-xs">
                        {phase.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "uppercase text-[8px] font-black tracking-[0.2em] px-2 py-0.5 border-ghost",
                          phase.status === "active" ? "text-accent" : "text-ink/30"
                        )}
                      >
                        {phase.status}
                      </Badge>
                    </div>
                    <Progress
                      value={(phase.funding / phase.target) * 100}
                      className="h-1 bg-ink/5"
                    />
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-ink/40 tabular-nums">
                      <span>
                        {phase.funding.toLocaleString()} / {phase.target.toLocaleString()} STX
                      </span>
                      <span>{phase.contributors} MEMBERS</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contribute" className="space-y-8">
            <Card className="machined-card max-w-2xl mx-auto">
              <div className="machined-header">
                <span>FUNDING PARTICIPATION</span>
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                     <Input
                       type="number"
                       value={contributionAmount}
                       onChange={(e) => setContributionAmount(e.target.value)}
                       placeholder="0.00"
                       className="text-right pr-12 font-black text-2xl h-14 bg-neutral-light border-ghost tabular-nums"
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-ink/30 pointer-events-none">STX</span>
                  </div>
                  <Button onClick={handleContribute} disabled={sending} className="min-w-[160px] h-14 bg-ink text-background font-black uppercase tracking-[0.2em] text-xs hover:bg-ink-light rounded-none">
                    {sending ? "TRANSMITTING..." : "CONTRIBUTE"}
                  </Button>
                </div>

                <div className="p-4 bg-ink/[0.02] border border-ghost rounded-sm flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/40">Active Contribution:</span>
                   <span className="text-xl font-black text-ink tabular-nums">{userContribution.total} <span className="text-xs opacity-30">STX</span></span>
                </div>

                {txId && (
                  <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">TRANSACTION_SUCCESS</span>
                      <a
                        href={`https://explorer.hiro.so/txid/${txId}?chain=${AppConfig.network}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-ink font-mono text-[10px] font-bold mt-1 hover:underline"
                      >
                        {truncate(txId, 20, 18)}
                      </a>
                    </div>
                    <CopyButton textToCopy={txId} ariaLabel="Copy TX" className="h-4 w-4 opacity-50" />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
