"use client";

import Link from "next/link";
import { ArrowTopRightOnSquareIcon, BoltIcon, CircleStackIcon, CodeBracketIcon, CpuChipIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import CopyButton from "@/components/CopyButton";

const installCommand = "cargo add conxius-enclave-sdk && cargo add lib-conxian-core";
const configSnippet = `{
  \"gateway_url\": \"https://gateway.conxian-labs.com\",
  \"kms_endpoint\": \"https://vault.conxian-labs.com\",
  \"nexus_url\": \"https://nexus.conxian-labs.com\",
  \"api_key\": \"<render-managed-or-dashboard-issued-key>\"
}`;

const repoCards = [
  {
    title: "Conxian Core",
    href: "https://github.com/Conxian/lib-conxian-core",
    description: "Shared protocol primitives, models, and reusable logic for gateway, platform, and downstream integrations.",
    badge: "Core primitives",
  },
  {
    title: "Conxius Enclave SDK",
    href: "https://github.com/Conxian/conxius-enclave-sdk",
    description: "Hardware-backed signing, attestation, policy, and secure transaction coordination for sovereign deployments.",
    badge: "Secure compute",
  },
];

const offerCards = [
  {
    title: "Open SDK path",
    description: "Use the SDKs locally, build against public repos, and integrate into internal tooling without buying the SDK itself.",
    icon: CodeBracketIcon,
  },
  {
    title: "Hosted acceleration",
    description: "Use Conxian Labs-operated gateway, vault, and nexus services when speed, support, or managed operations matter.",
    icon: BoltIcon,
  },
  {
    title: "Enterprise deployment",
    description: "Add sovereign controls, architecture reviews, SLAs, and production support for institutional programs.",
    icon: ShieldCheckIcon,
  },
];

const renderCards = [
  {
    title: "Interactive onboarding",
    description: "Plan selector, config builder, issued credentials, and guided integration steps fit a Render-backed portal well.",
  },
  {
    title: "Live proof surface",
    description: "Use a deployed app to show API health, sample payloads, environment status, and interactive demos without exposing internals.",
  },
  {
    title: "Sales to engineering bridge",
    description: "A Render surface can connect pricing, contact capture, sandbox access, and technical validation in one path.",
  },
];

export default function SdkPage() {
  return (
    <div className="space-y-10 terminal-text pb-10">
      <section className="machined-card overflow-hidden">
        <div className="machined-header">
          <div className="flex items-center gap-3">
            <CpuChipIcon className="w-3 h-3" />
            <span>SDK STOREFRONT SURFACE</span>
          </div>
          <span className="opacity-50">FIRST_PASS</span>
        </div>
        <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Open SDK</Badge>
              <Badge variant="outline">Hosted services optional</Badge>
              <Badge variant="outline">Render-ready portal candidate</Badge>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-[0.12em] text-ink">BUILD AGAINST CONXIAN WITHOUT LOSING THE SALES PATH</h1>
              <p className="max-w-3xl text-sm leading-7 text-ink-light font-bold">
                This surface turns the SDK story into a usable public entry point: open-source building blocks, hosted service acceleration,
                and a clearer path into production support. It is meant to sit between the public site narrative and the deeper technical repos.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/Conxian/lib-conxian-core" target="_blank" rel="noreferrer">
                <Button variant="secondary">View core repo</Button>
              </a>
              <a href="https://github.com/Conxian/conxius-enclave-sdk" target="_blank" rel="noreferrer">
                <Button variant="outline">View enclave SDK</Button>
              </a>
              <Link href="/network">
                <Button variant="outline">See live surface</Button>
              </Link>
            </div>
          </div>
          <Card className="h-full">
            <CardHeader>
              <CardDescription>Proposed public packaging</CardDescription>
              <CardTitle>Offer boundary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[11px] leading-6 text-ink-light font-bold">
              <p><span className="text-ink">Open:</span> SDK source, local integration, repo access, and self-managed engineering work.</p>
              <p><span className="text-ink">Paid:</span> managed gateway, vault, nexus, support, and enterprise delivery layers.</p>
              <p><span className="text-ink">Not transferred:</span> custody, signing control, or ownership of user assets.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {offerCards.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader>
              <div className="mb-4 inline-flex w-fit rounded-sm border border-accent/20 bg-accent/5 p-3 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] leading-6 text-ink-light font-bold">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="machined-header">
            <span>SDK FAMILY MAP</span>
            <span className="opacity-40">PUBLIC_REPOS</span>
          </div>
          <CardContent className="space-y-4 pt-6">
            {repoCards.map((repo) => (
              <div key={repo.title} className="rounded-sm border border-accent/15 bg-neutral-light p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CircleStackIcon className="h-4 w-4 text-accent" />
                    <h3 className="text-xs font-black tracking-[0.2em] text-ink">{repo.title}</h3>
                  </div>
                  <Badge variant="outline">{repo.badge}</Badge>
                </div>
                <p className="mb-3 text-[11px] leading-6 text-ink-light font-bold">{repo.description}</p>
                <a href={repo.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                  Open repository
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <div className="machined-header">
            <span>STARTER COMMAND</span>
            <span className="opacity-40">COPY_READY</span>
          </div>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-sm border border-accent/15 bg-neutral-light p-4 font-mono text-[11px] leading-6 text-ink">
              <div className="flex items-start justify-between gap-4">
                <pre className="whitespace-pre-wrap break-all">{installCommand}</pre>
                <CopyButton textToCopy={installCommand} ariaLabel="SDK install command" />
              </div>
            </div>
            <p className="text-[11px] leading-6 text-ink-light font-bold">
              The storefront should eventually issue generated snippets per plan, environment, and service entitlement instead of relying on static docs alone.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="machined-header">
            <span>HOSTED SERVICE WIRING</span>
            <span className="opacity-40">RENDER_FIT</span>
          </div>
          <CardContent className="pt-6">
            <div className="rounded-sm border border-accent/15 bg-neutral-light p-4 font-mono text-[11px] leading-6 text-ink">
              <div className="flex items-start justify-between gap-4">
                <pre className="whitespace-pre-wrap break-all">{configSnippet}</pre>
                <CopyButton textToCopy={configSnippet} ariaLabel="hosted service config" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="machined-header">
            <span>WHY RENDER FOR THE NEXT STEP</span>
            <span className="opacity-40">INTERACTIVE_LAYER</span>
          </div>
          <CardContent className="space-y-4 pt-6">
            {renderCards.map((card) => (
              <div key={card.title} className="rounded-sm border border-accent/15 bg-neutral-light p-4">
                <h3 className="mb-2 text-xs font-black tracking-[0.2em] text-ink">{card.title}</h3>
                <p className="text-[11px] leading-6 text-ink-light font-bold">{card.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Next planning layer</CardDescription>
            <CardTitle>Portal capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[11px] leading-6 text-ink-light font-bold">
            <p>- API key issuance and environment selection</p>
            <p>- interactive config generation</p>
            <p>- sandbox and health visibility</p>
            <p>- plan comparison and enterprise capture</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Gaps found in current public story</CardDescription>
            <CardTitle>Immediate cleanup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[11px] leading-6 text-ink-light font-bold">
            <p>- unify repo naming across site and app</p>
            <p>- remove placeholder credential language from the site</p>
            <p>- present SDK as a family, not a single vague package</p>
            <p>- align docs, pricing, and enterprise paths</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Suggested public flow</CardDescription>
            <CardTitle>Entry sequence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[11px] leading-6 text-ink-light font-bold">
            <p>- learn the SDK shape</p>
            <p>- pick open vs hosted path</p>
            <p>- generate config</p>
            <p>- move into docs, repos, or enterprise</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
