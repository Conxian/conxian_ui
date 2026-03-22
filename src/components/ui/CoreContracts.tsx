
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CoreContracts as ContractsRegistry, explorerContractUrl, NETWORK } from "@/lib/contracts";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

export default function CoreContracts() {
  // Key contracts to highlight
  const highlightedKinds = ["security", "oracle", "dex", "governance", "core"];
  const contracts = ContractsRegistry.filter(c => highlightedKinds.includes(c.kind)).slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract</TableHead>
              <TableHead>Kind</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Explorer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium text-text-primary">
                  {contract.label}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {contract.kind}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-xs text-text-secondary">Active</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={explorerContractUrl(contract.id, NETWORK === "devnet" ? "testnet" : NETWORK)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:underline font-medium"
                  >
                    View
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
