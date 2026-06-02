"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  CodeBracketIcon,
  PlayIcon,
  BackwardIcon,
  ForwardIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CubeIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState("simulation");

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      <div className="bg-neutral-light text-ink font-black py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-3">
          <CodeBracketIcon className="w-4 h-4 text-ink" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Developer Sandbox</span>
        </div>
        <div className="flex gap-4">
          {["Mainnet", "Testnet", "Simulation"].map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveTab(mode.toLowerCase())}
              className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm transition-colors ${
                activeTab === mode.toLowerCase() ? "bg-accent text-ink" : "text-ink/40 hover:bg-neutral-light"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase text-ink">SANDBOX</h1>
            <p className="text-ink font-black uppercase tracking-[0.4em] text-xs mt-2">Contract State Simulation</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-10 px-4 border-accent/40 text-ink font-black uppercase tracking-[0.2em] text-[10px]">
              <ArrowUturnLeftIcon className="w-4 h-4 mr-2" /> UNDO
            </Button>
            <Button variant="outline" className="h-10 px-4 border-accent/40 text-ink font-black uppercase tracking-[0.2em] text-[10px]">
              REDO <ArrowUturnRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-8 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>TRANSACTION_COMPOSER</span>
                <CubeIcon className="w-3 h-3 text-ink" />
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-6 bg-neutral-light border border-dashed border-accent/30 rounded-sm">
                    <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest mb-4">Execution Payload</p>
                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="flex gap-4 p-3 bg-background border border-accent/10 rounded-sm">
                        <span className="text-ink font-black uppercase">[CALL]</span>
                        <span className="text-ink font-bold">UniswapV2Router02.swapExactTokensForTokens</span>
                      </div>
                      <div className="pl-8 space-y-2 text-ink/60">
                        <p>├── path: [WETH, USDC]</p>
                        <p>├── amountIn: 1.000000000000000000</p>
                        <p>└── amountOutMin: 1850.000000</p>
                      </div>
                      <div className="flex gap-4 p-3 bg-background border border-accent/10 rounded-sm mt-4">
                        <span className="text-info font-black uppercase">[ASSERT]</span>
                        <span className="text-ink font-bold">balanceOf(msg.sender) &gt; 0</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-neutral-light border border-ghost p-6 rounded-sm text-ink">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">Execution Status</p>
                      <p className="text-lg font-black tracking-widest uppercase">Block #18,492,015</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="h-10 w-10 border-accent/20 hover:bg-accent/5">
                          <BackwardIcon className="w-5 h-5 text-ink" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-10 w-10 bg-accent border-none hover:bg-accent/80">
                          <PlayIcon className="w-5 h-5 text-ink" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-10 w-10 border-accent/20 hover:bg-accent/5">
                          <ForwardIcon className="w-5 h-5 text-ink" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-ink">T+ 45ms</p>
                        <p className="text-[9px] font-mono opacity-40">TTL: 120ms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="machined-card">
              <div className="machined-header">
                <span>TRACE_DEBUGGER</span>
                <CpuChipIcon className="w-3 h-3" />
              </div>
              <CardContent className="p-0">
                <div className="p-6 font-mono text-[10px] text-ink/70 space-y-2 bg-neutral-light max-h-[300px] overflow-auto">
                  <p className="text-ink font-bold">[0x00] JUMPDEST</p>
                  <p>[0x01] PUSH1 0x80</p>
                  <p>[0x03] PUSH1 0x40</p>
                  <p>[0x05] MSTORE</p>
                  <p className="text-success font-bold">[0x06] CALL (target=UniswapV2Pair, gas=2300)</p>
                  <p className="pl-4">├── DELEGATECALL: TransferHelper.safeTransferFrom</p>
                  <p className="pl-4">├── RETURN: true</p>
                  <p className="text-info font-bold">[0x4A] ASSERT_SUCCESS: balance_check passed</p>
                  <p className="opacity-30">...</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>STATE_PREVIEW</span>
              </div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest mb-4">Asset Balance Changes</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border border-ghost rounded-sm bg-neutral-light">
                        <span className="text-xs font-black text-ink">WETH</span>
                        <span className="text-xs font-black text-error tabular-nums">-1.000</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border border-ghost rounded-sm bg-neutral-light">
                        <span className="text-xs font-black text-ink">USDC</span>
                        <span className="text-xs font-black text-success tabular-nums">+1852.34</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-accent/10">
                    <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest mb-4">Contract State Diff</p>
                    <div className="p-4 bg-ink text-background-paper font-mono text-[9px] rounded-sm">
                      <p className="text-success">+ reserves.0: 142.1k</p>
                      <p className="text-error">- reserves.1: 82.5k</p>
                      <p className="opacity-50"> lastBlock: 18492015</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
