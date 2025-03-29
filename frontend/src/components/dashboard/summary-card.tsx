import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: number;
  status?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

export function SummaryCard({
  title,
  value,
  change,
  status = 'neutral',
  description,
}: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <Badge
              variant={status === 'positive' ? 'default' : status === 'negative' ? 'destructive' : 'outline'}
              className={status === 'neutral' ? 'bg-gray-100' : ''}
            >
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </Badge>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
