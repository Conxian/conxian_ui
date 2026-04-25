"use client";

import SystemStatus from "@/components/ui/SystemStatus";
import CoreContracts from "@/components/ui/CoreContracts";
import { ReadinessDashboard } from "@/components/ReadinessDashboard";

export default function Overview() {
  return (
    <div className="space-y-10 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-widest uppercase">System Overview</h1>
        <p className="mt-2 text-sm text-text-secondary">
          A high-level view of the Conxian ecosystem and technical readiness.
        </p>
      </div>

      <section>
        <ReadinessDashboard />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <SystemStatus />
        </section>

        <section>
          <CoreContracts />
        </section>
      </div>
    </div>
  );
}
