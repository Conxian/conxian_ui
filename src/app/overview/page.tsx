
import SystemStatus from "@/components/ui/SystemStatus";
import CoreContracts from "@/components/ui/CoreContracts";

export default function Overview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text">System Overview</h1>
      <p className="mt-2 text-sm text-text-secondary">
        A high-level view of the Conxian ecosystem.
      </p>

      <div className="mt-8 space-y-10">
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
