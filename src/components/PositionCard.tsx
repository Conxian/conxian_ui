
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-text tracking-tight">{pair}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Liquidity</p>
          <p className="text-xl font-bold text-text">${liquidity.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">My Balance</p>
          <p className="text-xl font-bold text-text">${balance.toLocaleString()}</p>
        </div>
        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onAdd(pair)}
          >
            Add
          </Button>
          <Button
            variant="outline"
            className="w-full"
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
