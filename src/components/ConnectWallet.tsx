"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useWallet } from "@/lib/wallet";
import { Button } from "@/components/ui/Button";
import CopyButton from "./CopyButton";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StacksProvider?: any;
  }
}

export default function ConnectWallet() {
  const { stxAddress, connectWallet, signOut } = useWallet();
  const [isStacksAvailable, setIsStacksAvailable] = useState(false);

  useEffect(() => {
    if (window.StacksProvider) {
      setIsStacksAvailable(true);
    }
  }, []);

  // ⚡ Bolt: Memoize the wallet action handler.
  // This prevents the function from being recreated on every render, which is more memory-efficient.
  const handleWalletAction = useCallback(() => {
    if (stxAddress) {
      signOut();
    } else if (isStacksAvailable) {
      connectWallet();
    } else {
      window.open("https://wallet.hiro.so/", "_blank");
    }
  }, [stxAddress, isStacksAvailable, connectWallet, signOut]);

  if (stxAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-md border border-accent/30 bg-background-light px-3 h-10">
          <span
            className="text-xs font-mono font-bold text-text-muted"
            title={stxAddress}
          >
            {stxAddress.substring(0, 4)}...
            {stxAddress.substring(stxAddress.length - 4)}
          </span>
          <CopyButton textToCopy={stxAddress} ariaLabel="address" className="h-4 w-4 text-text-muted hover:text-accent transition-colors" />
        </div>
        <Button
          onClick={handleWalletAction}
          variant="outline"
          className="whitespace-nowrap h-10 font-bold uppercase tracking-widest text-xs"
          data-testid="disconnect-wallet-button"
          type="button"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleWalletAction}
      variant="default"
      className="whitespace-nowrap h-10 font-bold uppercase tracking-widest text-xs"
      data-testid="connect-wallet-button"
      type="button"
    >
      {!isStacksAvailable ? (
        <>
          Install Wallet
          <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
}
