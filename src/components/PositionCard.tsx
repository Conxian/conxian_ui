import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PositionCardProps {
  pair: string;
  liquidity: number;
  balance: number;
  onAdd: (pair: string) => void;
  onRemove: (pair: string) => void;
}

const PositionCard = React.memo(({ pair, liquidity, balance, onAdd, onRemove }: PositionCardProps) => {
  return (
    <Card className="bg-background-paper border-accent/20">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-text-secondary">{pair}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Liquidity Value</p>
          <p className="text-xl font-bold text-text tabular-nums">${liquidity.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">My LP Balance</p>
          <p className="text-xl font-bold text-text tabular-nums">${balance.toLocaleString()}</p>
        </div>
        <div className="flex gap-4 pt-4 border-t border-accent/5">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] font-bold uppercase tracking-widest border-accent/30"
            onClick={() => onAdd(pair)}
          >
            Add More
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] font-bold uppercase tracking-widest border-accent/30"
            onClick={() => onRemove(pair)}
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

PositionCard.displayName = 'PositionCard';

export default PositionCard;
