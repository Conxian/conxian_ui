'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheckIcon, PlusCircleIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { useApi } from '@/lib/api-client';
import { useWallet } from '@/lib/wallet';
import { Input } from '@/components/ui/Input';
import { truncate } from '@/lib/utils';

interface ShieldedWallet {
  id: string;
  balance: string;
}

export default function Shielded() {
  const [wallets, setWallets] = useState<ShieldedWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const { stxAddress, addToast } = useWallet();
  const api = useApi();

  const fetchWallets = useCallback(async () => {
    if (!stxAddress) return;
    setLoading(true);
    try {
      const result = await api.fetchUserWallets(stxAddress);
      if (result.success && result.result) {
        const walletData = result.result as { value: { value: string }[] };
        const walletIds = walletData.value?.map(v => v.value) || [];

        const walletDetails = await Promise.all(
          walletIds.map(async (id: string) => {
            const balanceResult = await api.fetchWalletBalance(id);
            return {
              id,
              balance: balanceResult.success && balanceResult.result ? balanceResult.result.toString() : '0',
            };
          })
        );
        setWallets(walletDetails);
      }
    } catch (error) {
      console.error('Error fetching shielded wallets:', error);
      addToast('Failed to load shielded wallets.', 'error');
    } finally {
      setLoading(false);
    }
  }, [stxAddress, api, addToast]);

  const handleCreateWallet = async () => {
    if (!stxAddress) {
      addToast('Please connect your wallet first.', 'info');
      return;
    }
    try {
      const res = (await api.createNewWallet()) as { success: boolean; txId?: string; error?: string };
      if (res.txId) {
        addToast(`Wallet creation initiated. Tx ID: ${truncate(res.txId, 8, 8)}`, 'success');
      } else if (res.success) {
        addToast('New shielded wallet created!', 'success');
      } else {
        addToast(res.error || 'Failed to create shielded wallet.', 'error');
      }
      fetchWallets();
    } catch (error) {
      console.error(error);
      addToast('Failed to create shielded wallet.', 'error');
    }
  };

  const handleSendFunds = async (walletId: string) => {
    if (!recipient || !sendAmount) {
      addToast('Please provide a recipient and amount.', 'info');
      return;
    }
    try {
      const res = (await api.sendFunds(walletId, recipient, parseInt(sendAmount, 10))) as { success: boolean; txId?: string; error?: string };
      if (res.txId) {
        addToast(`Shielded transfer initiated. Tx ID: ${truncate(res.txId, 8, 8)}`, 'success');
      } else if (res.success) {
        addToast('Funds sent successfully!', 'success');
      } else {
        addToast(res.error || 'Failed to send funds.', 'error');
      }
      setSendAmount('');
      setRecipient('');
      fetchWallets();
    } catch (error) {
      console.error(error);
      addToast('Failed to send funds.', 'error');
    }
  };

  const handleReceiveFunds = async (walletId: string) => {
    if (!receiveAmount) {
      addToast('Please provide an amount to receive.', 'info');
      return;
    }
    try {
      const res = (await api.receiveFunds(walletId, parseInt(receiveAmount, 10))) as { success: boolean; txId?: string; error?: string };
      if (res.txId) {
        addToast(`Funding initiated. Tx ID: ${truncate(res.txId, 8, 8)}`, 'success');
      } else if (res.success) {
        addToast('Funds received successfully!', 'success');
      } else {
        addToast(res.error || 'Failed to receive funds.', 'error');
      }
      setReceiveAmount('');
      fetchWallets();
    } catch (error) {
      console.error(error);
      addToast('Failed to receive funds.', 'error');
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return (
    <div className="flex flex-col min-h-screen bg-background terminal-text">
       {/* Terminal Top Bar */}
      <div className="bg-neutral-light text-ink py-2 px-6 flex justify-between items-center border-b border-accent/20">
        <div className="flex items-center gap-4">
          <div className="h-1.5 w-1.5 rounded-full bg-info animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Privacy Layer v1.0 (SHIELDED)</span>
        </div>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          <span>ZK_PROOFS: ACTIVE</span>
          <span>MIX_LEVEL: HIGH</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-end border-b border-accent/20 pb-6">
           <div>
              <h1 className="text-5xl font-black tracking-widest uppercase text-ink">SHIELDED</h1>
              <p className="text-accent font-black uppercase tracking-[0.4em] text-xs mt-2">Zero-Knowledge Private Asset Custody</p>
           </div>
           <Button onClick={handleCreateWallet} className="bg-ink text-background-paper font-black uppercase tracking-[0.2em] text-[10px] h-10 px-6">
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              DEPLOY_SHIELDED_CONTEXT
           </Button>
        </div>

        <Card className="machined-card">
          <div className="machined-header">
             <div className="flex items-center">
                <ShieldCheckIcon className="w-3 h-3 mr-2 text-accent" />
                <span>PRIVATE_HARDWARE_ENCLAVES</span>
             </div>
          </div>
          <CardContent className="p-8">
            {loading ? (
              <div className="py-20 text-center animate-pulse text-ink/40 font-black uppercase text-[10px] tracking-[0.2em]">Syncing with privacy layer...</div>
            ) : wallets.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {wallets.map((wallet) => (
                <li
                  key={wallet.id}
                  className="p-8 rounded-sm border border-accent/20 bg-neutral-light/30 transition-all hover:bg-neutral-light/50"
                >
                  <div className="flex justify-between items-start mb-6">
                    <p className="font-mono text-[10px] font-black text-ink bg-background-paper border border-accent/10 px-3 py-1.5 rounded-sm tabular-nums">
                      {truncate(wallet.id, 12, 10)}
                    </p>
                    <Badge variant="secondary">
                      Shielded
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2 mb-8 border-b border-accent/10 pb-6">
                    <span className="text-4xl font-black text-ink tabular-nums">{wallet.balance}</span>
                    <span className="text-ink/40 font-black text-sm uppercase tracking-widest">STX</span>
                  </div>

                  <div className="space-y-8 pt-2">
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-ink/40 uppercase tracking-[0.2em]">Shielded Transfer Vector</label>
                      <div className="grid grid-cols-1 gap-3">
                        <Input
                          type="text"
                          placeholder="RECIPIENT_PRINCIPAL"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          className="bg-background-paper border-accent/20 font-black text-[10px] h-10"
                        />
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="QTY"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            className="bg-background-paper border-accent/20 font-black text-[10px] h-10 flex-1 tabular-nums"
                          />
                          <Button onClick={() => handleSendFunds(wallet.id)} className="shrink-0 h-10 px-6 bg-ink text-background-paper font-black uppercase text-[10px] tracking-widest">
                            <ArrowUpCircleIcon className="w-3 h-3 mr-2" />
                            EXEC_SEND
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-accent/10">
                      <label className="text-[9px] font-black text-ink/40 uppercase tracking-[0.2em]">Shielded Funding Protocol</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="QTY_TO_SHIELD"
                          value={receiveAmount}
                          onChange={(e) => setReceiveAmount(e.target.value)}
                          className="bg-background-paper border-accent/20 font-black text-[10px] h-10 flex-1 tabular-nums"
                        />
                        <Button onClick={() => handleReceiveFunds(wallet.id)} variant="outline" className="shrink-0 h-10 px-6 font-black uppercase text-[10px] tracking-widest border-accent/20 text-ink/60 hover:text-ink">
                          <ArrowDownCircleIcon className="w-3 h-3 mr-2" />
                          EXEC_SHIELD
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-24 text-center space-y-6">
               <ShieldCheckIcon className="w-16 h-16 mx-auto text-ink/10" />
               <div className="space-y-2">
                  <p className="text-ink font-black uppercase tracking-[0.2em] text-sm">No Private Wallets Detected</p>
                  <p className="text-ink-light text-[10px] max-w-xs mx-auto font-bold uppercase tracking-widest leading-relaxed">
                    Deploy a shielded context to enable hardware-attested private transactions.
                  </p>
               </div>
               <Button onClick={handleCreateWallet} className="bg-ink text-background-paper font-black uppercase tracking-[0.2em] text-[10px] h-12 px-8 mt-6">
                  DEPLOY_SHIELDED_CONTEXT
               </Button>
            </div>
          )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
