import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import EnvStatus from "@/components/EnvStatus";
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { StatCard } from "@/components/ui/StatCard";
import { VStack } from "@/components/ui/VStack";

export default function Home() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="mt-2 text-sm text-text">
          An overview of the Conxian ecosystem.
        </p>
      </div>

      <VStack className="mt-8">
        <section>
          <EnvStatus />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="TVL"
            value="$0"
            icon={<CurrencyDollarIcon className="w-5 h-5 text-text" />}
            subtext="Across Conxian protocols"
            tooltipText="Total Value Locked: The total value of assets currently held across all Conxian smart contracts."
          />
          <StatCard
            title="Active Vaults"
            value="0"
            icon={<ShieldCheckIcon className="w-5 h-5 text-text" />}
            subtext="Configured & healthy"
            tooltipText="The number of vaults that are currently active and operating within normal parameters."
          />
          <StatCard
            title="APY (Median)"
            value="0%"
            icon={<ArrowTrendingUpIcon className="w-5 h-5 text-text" />}
            subtext="Benchmarks pending"
            tooltipText="Annual Percentage Yield: The median return on investment across all staking and liquidity pools."
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vaults</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm text-text font-medium">
                <div>Name</div>
                <div>Asset</div>
                <div className="text-right">APY</div>
              </div>
              <div className="mt-4 text-sm text-text">
                No vaults available yet.
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Staking</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-background p-4">
                <div className="text-sm text-text mb-2">Total Staked</div>
                <div className="text-xl font-bold text-text">$0</div>
              </div>
              <div className="rounded-lg bg-background p-4">
                <div className="text-sm text-text mb-2">My Staked</div>
                <div className="text-xl font-bold text-text">$0</div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text">
                Compare against top DeFi, CeFi, banks, and enterprise finance.
                KPIs: APY, spread, slippage, uptime, latency.
              </p>
            </CardContent>
          </Card>
        </section>
      </VStack>
    </>
  );
}
