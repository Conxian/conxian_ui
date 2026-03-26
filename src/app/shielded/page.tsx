'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheckIcon, PlusCircleIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
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
      const res = await api.createNewWallet();
      if (res.txId) {
        addToast(`Wallet creation initiated. Tx ID: ${truncate(res.txId, 8, 8)}`, 'success');
      } else {
        addToast('New shielded wallet created!', 'success');
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
      const res = await api.sendFunds(walletId, recipient, parseInt(sendAmount, 10));
      if (res.txId) {
        addToast(`Shielded transfer initiated. Tx ID: ${truncate(res.txId, 8, 8)}`, 'success');
      } else {
        addToast('Funds sent successfully!', 'success');
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
      const res = await api.receiveFunds(walletId, parseInt(receiveAmount, 10));
      if (res.txId) {
        addToast(`Funding initiated. Tx ID: ${truncate(res.txId, 8, 8)}`, 'success');
      } else {
        addToast('Funds received successfully!', 'success');
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">Shielded Wallets</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your private, shielded assets and transactions using Zero-Knowledge proofs.
        </p>
      </div>

      <Card className="bg-background-paper">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-8 h-8 mr-3 text-accent" />
            <div>
              <CardTitle className="text-xl font-semibold text-text">Wallets</CardTitle>
              <CardDescription className="text-text-secondary font-medium uppercase tracking-tight text-xs mt-1">
                Your Hardware-Attested Private Accounts
              </CardDescription>
            </div>
          </div>
          <Button onClick={handleCreateWallet} variant="outline" size="sm" className="border-accent/30 hover:bg-accent/10">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            New Wallet
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-20 text-center animate-pulse text-text-muted">Syncing with privacy layer...</div>
          ) : wallets.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wallets.map((wallet) => (
              <li
                key={wallet.id}
                className="p-6 rounded-lg border border-accent/20 bg-background-light shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="font-mono text-sm font-semibold text-text-primary bg-neutral-light px-2 py-1 rounded">
                    {truncate(wallet.id, 12, 10)}
                  </p>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20 font-bold uppercase tracking-widest text-[10px]">
                    Shielded
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-6 border-b border-accent/10 pb-4">
                  <span className="text-3xl font-bold text-text-primary">{wallet.balance}</span>
                  <span className="text-text-secondary font-semibold text-sm uppercase">STX</span>
                </div>

                <div className="space-y-6 pt-2">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Shielded Transfer</label>
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        type="text"
                        placeholder="Recipient Principal"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="text-xs h-9"
                      />
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="text-xs h-9 flex-1"
                        />
                        <Button onClick={() => handleSendFunds(wallet.id)} size="sm" className="shrink-0 h-9 px-4">
                          <ArrowUpCircleIcon className="w-4 h-4 mr-1.5" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-accent/5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Shielded Funding</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Amount to Shield"
                        value={receiveAmount}
                        onChange={(e) => setReceiveAmount(e.target.value)}
                        className="text-xs h-9"
                      />
                      <Button onClick={() => handleReceiveFunds(wallet.id)} size="sm" variant="secondary" className="shrink-0 h-9 px-4">
                        <ArrowDownCircleIcon className="w-4 h-4 mr-1.5" />
                        Shield
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-24 text-center space-y-4">
             <ShieldCheckIcon className="w-16 h-16 mx-auto text-text-muted/10" />
             <div className="space-y-1">
                <p className="text-text font-semibold">No Private Wallets Detected</p>
                <p className="text-text-secondary text-sm max-w-xs mx-auto">Create a shielded wallet to enable private transactions on the Conxian network.</p>
             </div>
             <Button onClick={handleCreateWallet} variant="outline" className="text-accent border-accent/30 mt-4">
                Deploy Shielded Context
             </Button>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
