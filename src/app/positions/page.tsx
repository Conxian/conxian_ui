'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/wallet';
import { useApi } from '@/lib/api-client';
import ConnectWallet from '@/components/ConnectWallet';
import PositionCard from '@/components/PositionCard';
import { Button } from '@/components/ui/Button';

interface Position {
  pair: string;
  liquidity: number;
  balance: number;
}

export default function PositionsPage() {
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [status, setStatus] = React.useState('');
  const { stxAddress } = useWallet();
  const api = useApi();
  const router = useRouter();

  const handleAdd = useCallback((pair: string) => {
    const params = new URLSearchParams({ pair });
    router.push(`/add-liquidity?${params.toString()}`);
  }, [router]);

  const handleRemove = useCallback((pair: string) => {
    const params = new URLSearchParams({ template: 'pool-remove-liquidity', pair });
    router.push(`/tx?${params.toString()}`);
  }, [router]);

  React.useEffect(() => {
    if (stxAddress) {
      api.getPositions(stxAddress)
        .then(setPositions)
        .catch(err => {
          console.error('Error fetching positions:', err);
          setStatus('Failed to load positions.');
        });
    }
  }, [stxAddress, api]);

  return (
    <div className="space-y-10 bg-background min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-text tracking-widest uppercase">My Portfolio</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your active liquidity and staking positions on Conxian.
        </p>
      </div>

      {stxAddress ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {positions.length > 0 ? (
            positions.map((pos) => (
              <PositionCard
                key={pos.pair}
                pair={pos.pair}
                liquidity={pos.liquidity}
                balance={pos.balance}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-accent/10 rounded-xl">
               <p className="text-text-secondary italic">No active positions detected in this wallet.</p>
               <Button onClick={() => router.push('/swap')} variant="outline" className="mt-4 border-accent/30 text-accent">
                 Explore Liquidity Pools
               </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-background-light border border-accent/20 rounded-xl">
          <p className="text-text-secondary mb-6 font-medium">Connect your wallet to see your portfolio.</p>
          <ConnectWallet />
        </div>
      )}

      {status && <p className="text-center text-sm text-error mt-6 font-bold uppercase tracking-widest">{status}</p>}
    </div>
  );
}
