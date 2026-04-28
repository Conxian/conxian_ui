"use client";

import SystemStatus from "@/components/ui/SystemStatus";
import CoreContracts from "@/components/ui/CoreContracts";
import { ReadinessDashboard } from "@/components/ReadinessDashboard";

export default function Overview() {
  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      {/* Top Bar placeholder */}
      <div className="bg-ink text-background py-2 px-6 flex justify-between items-center border-b border-ghost">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol System Architecture</span>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>DOC_VERSION: v1.4</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase text-ink">ARCHITECTURE</h1>
              <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">Full Stack System Overview</p>
           </div>
        </div>

        <section className="space-y-12">
          <ReadinessDashboard />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <SystemStatus />
            <CoreContracts />
          </div>
        </section>
      </main>
    </div>
  );
}
