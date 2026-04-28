'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
  const [positions, setPositions] = useState<Position[]>([]);
  const [status, setStatus] = useState('');
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

  useEffect(() => {
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
    <div className="flex flex-col min-h-screen bg-background terminal-text">
      <div className="bg-ink text-background py-2 px-6 flex justify-between items-center border-b border-ghost">
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Asset Custody Interface</span>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <span>HODL: ACTIVE</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-ghost pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase text-ink">PORTFOLIO</h1>
              <p className="text-accent font-bold uppercase tracking-[0.4em] text-xs mt-2">Active Liquidity & Staking Positions</p>
           </div>
        </div>

        {stxAddress ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="col-span-full py-32 text-center border-2 border-dashed border-ghost rounded-sm bg-ink/[0.01]">
                 <div className="mb-6 opacity-20 flex justify-center">
                    <div className="h-16 w-16 border-4 border-ink rounded-full flex items-center justify-center font-black text-2xl tracking-tighter">?</div>
                 </div>
                 <p className="text-ink/40 font-black uppercase tracking-widest text-xs">Zero active positions detected in custody.</p>
                 <Button onClick={() => router.push('/swap')} className="mt-8 bg-ink text-background font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-none">
                   SYNC_LIQUIDITY_POOLS
                 </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-32 machined-card max-w-xl mx-auto">
            <p className="text-ink/60 mb-8 font-black uppercase tracking-widest text-xs">Authorization required for asset disclosure.</p>
            <ConnectWallet />
          </div>
        )}

        {status && <p className="text-center font-mono text-[10px] text-error font-black uppercase tracking-widest mt-10">{status}</p>}
      </main>
    </div>
  );
}
