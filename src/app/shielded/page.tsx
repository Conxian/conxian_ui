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
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const { stxAddress, addToast } = useWallet();
  const api = useApi();

  const fetchWallets = useCallback(async () => {
    if (stxAddress) {
      const result = await api.fetchUserWallets(stxAddress);
      if (result.success && result.result) {
        // Assuming result.result is a Clarity list value
        const walletIds = (result.result as { value: { value: string }[] }).value.map(
          (v) => v.value
        );
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
    }
  }, [stxAddress, api]);

  const handleCreateWallet = async () => {
    if (!stxAddress) return;
    try {
      await api.createNewWallet();
      addToast('New shielded wallet created! Fetching updated list...', 'success');
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
      await api.sendFunds(walletId, recipient, parseInt(sendAmount, 10));
      addToast('Funds sent successfully!', 'success');
      fetchWallets(); // Refresh balances
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
      await api.receiveFunds(walletId, parseInt(receiveAmount, 10));
      addToast('Funds received successfully!', 'success');
      fetchWallets(); // Refresh balances
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
        <p className="mt-2 text-sm text-text">
          Manage your private, shielded assets and transactions.
        </p>
      </div>

      <Card className="bg-background-paper">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-8 h-8 mr-3 text-accent" />
            <div>
              <CardTitle className="text-xl font-semibold text-text">Wallets</CardTitle>
              <CardDescription className="text-text-muted">Your private accounts</CardDescription>
            </div>
          </div>
          <Button onClick={handleCreateWallet} variant="outline" size="sm" className="border-accent/20 hover:bg-accent/10">
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Create Wallet
          </Button>
        </CardHeader>
        <CardContent>
          {wallets.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wallets.map((wallet) => (
              <li
                key={wallet.id}
                className="p-5 rounded-md border border-accent/10 bg-background-light shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <p className="font-mono font-medium text-text">{truncate(wallet.id, 10, 8)}</p>
                  <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">Active</Badge>
                </div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-2xl font-bold text-text">{wallet.balance}</span>
                  <span className="text-text-muted text-sm uppercase">STX</span>
                </div>

                <div className="space-y-4 pt-4 border-t border-accent/5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase">Send Assets</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        type="text"
                        placeholder="Amount"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="w-24 text-sm"
                      />
                      <Button onClick={() => handleSendFunds(wallet.id)} size="sm" className="shrink-0">
                        <ArrowUpCircleIcon className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase">Receive Assets</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Amount"
                        value={receiveAmount}
                        onChange={(e) => setReceiveAmount(e.target.value)}
                        className="text-sm"
                      />
                      <Button onClick={() => handleReceiveFunds(wallet.id)} size="sm" variant="secondary" className="shrink-0">
                        <ArrowDownCircleIcon className="w-4 h-4 mr-1" />
                        Receive
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-20 text-center space-y-3">
             <ShieldCheckIcon className="w-12 h-12 mx-auto text-text-muted/20" />
             <p className="text-text-muted">No shielded wallets found.</p>
             <Button onClick={handleCreateWallet} variant="link" className="text-accent">Create your first wallet</Button>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
