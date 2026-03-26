'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Tokens } from '@/lib/contracts';
import { FungibleTokenBalance } from '@/lib/core-api';
import TokenIcon from './TokenIcon';
import { cn, formatAmount, truncate } from '@/lib/utils';

interface TokenSelectProps {
  tokens: typeof Tokens;
  selectedToken: string;
  onSelect: (tokenId: string) => void;
  balances: FungibleTokenBalance[];
  className?: string;
}

const TokenSelect: React.FC<TokenSelectProps> = ({ tokens, selectedToken, onSelect, balances, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedTokenInfo = tokens.find(t => t.id === selectedToken);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  const handleSelect = (tokenId: string) => {
    onSelect(tokenId);
    setIsOpen(false);
  };

  const getBalance = (tokenId: string) => {
    const balance = balances.find(b => b.asset_identifier === tokenId);
    return balance?.balance || '0';
  };

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select token, current selection is ${selectedTokenInfo?.label || 'None'}`}
        className="flex items-center justify-between w-full px-4 py-2 rounded-md border border-accent/20 bg-background-light text-text hover:bg-accent/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="flex items-center overflow-hidden">
          {selectedTokenInfo && (
            <TokenIcon
              token={selectedTokenInfo.label}
              className="w-6 h-6 mr-3 shrink-0"
            />
          )}
          <span className="truncate">{selectedTokenInfo?.label || 'Select Token'}</span>
        </div>
        <svg
          className={`w-4 h-4 ml-2 transition-transform shrink-0 ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background-light border border-accent/20 rounded-md shadow-lg overflow-hidden max-h-60 overflow-y-auto">
          <ul className="py-1" role="listbox">
            {tokens.map((token) => (
              <li
                key={token.id}
                role="option"
                aria-selected={token.id === selectedToken}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(token.id);
                  }
                }}
                onClick={() => handleSelect(token.id)}
                className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent/10 text-text transition-colors focus:bg-accent/10 focus:outline-none"
              >
                <div className="flex items-center overflow-hidden">
                  <TokenIcon token={token.label} className="w-6 h-6 mr-3 shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium">{token.label}</span>
                    <span className="text-[10px] text-text-muted truncate">{truncate(token.id, 12, 10)}</span>
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <span className="text-sm font-semibold">{formatAmount(getBalance(token.id), token.decimals)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TokenSelect;
