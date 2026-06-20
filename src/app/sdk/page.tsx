"use client";

import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  CircleStackIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import CopyButton from "@/components/CopyButton";

const installCommand = "cargo add conxius-enclave-sdk && cargo add lib-conxian-core";
const configSnippet = `{
  "gateway_url": "https://gateway.conxian-labs.com",
  "kms_endpoint": "https://vault.conxian-labs.com",
  "nexus_url": "https://nexus.conxian-labs.com",
  "api_key": "[AUTH_TOKEN_REQUIRED]"
}`;

const repoCards = [
  {
    title: "Conxian Protocol",
    href: "https://github.com/Conxian/Conxian",
    description: "The core protocol standards, governance logic, and immutable ledger definitions.",
    badge: "Protocol Root",
  },
  {
    title: "Conxius Enclave SDK",
    href: "https://github.com/Conxian/conxius-enclave-sdk",
    description: "Hardware-backed signing, attestation, and secure transaction coordination.",
    badge: "Secure Compute",
  },
  {
    title: "Conxian UI",
    href: "https://github.com/Conxian/conxian_ui",
    description: "Public web interface for protocol activity, liquidity, and governance surfaces.",
    badge: "Interface Layer",
  },
];

const offerCards = [
  {
    title: "Open SDK Path",
    description: "Integrate with protocol primitives using open-source building blocks and local verification.",
    icon: CodeBracketIcon,
  },
  {
    title: "Hosted API",
    description: "Use Conxian Labs-operated gateways for managed API access and faster integration.",
    icon: BoltIcon,
  },
  {
    title: "Production Support",
    description: "Get architecture review, production guidance, and enterprise support for launch readiness.",
    icon: ShieldCheckIcon,
  },
];

const renderCards = [
  {
    title: "API Access",
    description: "Create and manage API credentials for authenticated integration workflows.",
  },
  {
    title: "Live Status",
    description: "Monitor protocol service availability and synchronization status.",
  },
  {
    title: "Deployment Support",
    description: "Move from local validation to production rollout with shared deployment guidance.",
  },
];

export default function SdkPage() {
  return (
    <div className="flex-1 flex flex-col bg-background terminal-text">
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Developer Integrations</span>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>SDK_VERSION: v2.0.4</span>
        </div>
      </div>

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
          <div>
            <h1 className="text-5xl font-black tracking-widest uppercase text-ink">SDK</h1>
            <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">
              Developer Integrations
            </p>
          </div>
          <div className="flex gap-4">
            <Button className="h-10 px-6 bg-ink text-background-paper font-black uppercase tracking-[0.2em] text-[10px]">
              CREATE API KEY
            </Button>
          </div>
        </div>

        <section className="machined-card overflow-hidden">
          <div className="machined-header">
            <div className="flex items-center gap-3">
              <CpuChipIcon className="w-3 h-3" />
              <span>INTEGRATION MODELS</span>
            </div>
            <span className="opacity-50 font-mono">STATUS: READY</span>
          </div>
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-black">OPEN_SDK</Badge>
                <Badge variant="outline" className="font-black border-accent/30 text-accent">
                  ATTESTED_GATEWAY
                </Badge>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-widest text-ink">BUILD WITH SHARED PROTOCOL PRIMITIVES</h2>
                <p className="max-w-3xl text-xs leading-relaxed text-ink-light font-bold uppercase tracking-widest">
                  The Conxian SDK family provides the core building blocks for developers integrating with protocol services, hardware-backed signing, and managed APIs.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/Conxian/lib-conxian-core" target="_blank" rel="noreferrer">
                  <Button variant="outline" className="font-black tracking-widest uppercase text-[10px]">
                    View Core Specs
                  </Button>
                </a>
                <Link href="/network">
                  <Button className="bg-ink text-background-paper font-black tracking-widest uppercase text-[10px]">
                    Monitor Live Nodes
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="bg-neutral-light border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-accent">
                  SECURITY_MODEL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[10px] leading-relaxed text-ink-light font-bold uppercase tracking-widest">
                <p>
                  <span className="text-ink">Open:</span> Protocol primitives and local verification logic.
                </p>
                <p>
                  <span className="text-ink">Managed:</span> Hosted gateway access and institutional support.
                </p>
                <p>
                  <span className="text-ink">Sovereign:</span> Private key custody and signing authority remain with the institution.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {offerCards.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="machined-card">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex w-fit rounded-sm border border-accent/20 bg-accent/5 p-3 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-ink mb-2">{title}</h3>
                <p className="text-[10px] leading-relaxed text-ink-light font-bold uppercase tracking-widest">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="machined-card">
            <div className="machined-header">
              <span>REPOSITORIES</span>
              <CircleStackIcon className="w-3 h-3" />
            </div>
            <CardContent className="space-y-4 p-6">
              {repoCards.map((repo) => (
                <div
                  key={repo.title}
                  className="p-4 border border-accent/10 bg-neutral-light rounded-sm group hover:border-accent/40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-ink">{repo.title}</h3>
                    <Badge variant="outline" className="text-[8px] font-black border-accent/20">
                      {repo.badge}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-ink-light font-bold uppercase tracking-widest mb-4">
                    {repo.description}
                  </p>
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                  >
                    Access Source
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="machined-card">
              <div className="machined-header">
                <span>INSTALLATION</span>
              </div>
              <CardContent className="p-6">
                <div className="p-4 bg-ink text-background-paper font-mono text-[10px] rounded-sm relative group tabular-nums">
                  <div className="flex justify-between items-start gap-4">
                    <pre className="whitespace-pre-wrap break-all opacity-80">{installCommand}</pre>
                    <CopyButton
                      textToCopy={installCommand}
                      ariaLabel="SDK install command"
                      className="text-background-paper opacity-40 group-hover:opacity-100"
                    />
                  </div>
                </div>
                <p className="mt-4 text-[9px] text-ink-light font-bold uppercase tracking-widest leading-relaxed">
                  Install the core crates with standard cargo dependency management.
                </p>
              </CardContent>
            </Card>

            <Card className="machined-card">
              <div className="machined-header">
                <span>CONFIGURATION</span>
              </div>
              <CardContent className="p-6">
                <div className="p-4 bg-neutral-light border border-accent/20 font-mono text-[10px] text-ink rounded-sm relative group tabular-nums">
                  <div className="flex justify-between items-start gap-4">
                    <pre className="whitespace-pre-wrap break-all opacity-80">{configSnippet}</pre>
                    <CopyButton textToCopy={configSnippet} ariaLabel="config snippet" className="opacity-40 group-hover:opacity-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3 border-t border-accent/20 pt-12">
          {renderCards.map((card) => (
            <div key={card.title} className="space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">{card.title}</h4>
              <p className="text-[10px] text-ink-light font-bold uppercase tracking-widest leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
