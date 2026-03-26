'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const selectedTokenInfo = tokens.find(t => t.id === selectedToken);
  const listboxId = `token-select-${selectedToken.replace(/\./g, '-')}`;

  // ⚡ Bolt: Optimize balance lookup from O(N*M) to O(N+M) using a Map.
  const balanceMap = useMemo(() => {
    const map = new Map<string, string>();
    balances.forEach(b => map.set(b.asset_identifier, b.balance));
    return map;
  }, [balances]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  const handleSelect = (tokenId: string) => {
    onSelect(tokenId);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const index = tokens.findIndex(t => t.id === selectedToken);
        setFocusedIndex(index >= 0 ? index : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % tokens.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + tokens.length) % tokens.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(tokens[focusedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-activedescendant={focusedIndex >= 0 ? `${listboxId}-item-${focusedIndex}` : undefined}
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
          <ul id={listboxId} className="py-1" role="listbox">
            {tokens.map((token, index) => (
              <li
                id={`${listboxId}-item-${index}`}
                key={token.id}
                role="option"
                aria-selected={token.id === selectedToken}
                onClick={() => handleSelect(token.id)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  "flex items-center justify-between px-4 py-2 cursor-pointer text-text transition-colors outline-none",
                  focusedIndex === index ? "bg-accent/10" : "hover:bg-accent/5"
                )}
              >
                <div className="flex items-center overflow-hidden">
                  <TokenIcon token={token.label} className="w-6 h-6 mr-3 shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-medium">{token.label}</span>
                    <span className="text-[10px] text-text-muted truncate">{truncate(token.id, 12, 10)}</span>
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <span className="text-sm font-semibold">{formatAmount(balanceMap.get(token.id) || '0', token.decimals)}</span>
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
