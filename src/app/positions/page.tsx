'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/wallet';
import { useApi } from '@/lib/api-client';
import ConnectWallet from '@/components/ConnectWallet';
import PositionCard from '@/components/PositionCard';

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

  // ⚡ Bolt: Memoize action handlers to prevent them from being recreated on every render.
  // This is a key optimization for components that render lists, as it ensures
  // that child components (like the Buttons here) receive stable function props.
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">My Positions</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your active liquidity and staking positions.
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
            <p className="text-text-secondary text-sm">No positions found.</p>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">Connect your wallet to see your positions.</p>
          <ConnectWallet />
        </div>
      )}

      {status && <p className="text-center text-sm text-error mt-6">{status}</p>}
    </div>
  );
}
