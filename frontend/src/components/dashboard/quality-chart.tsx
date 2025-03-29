import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QualityTrend } from '@/types';

interface QualityChartProps {
  data: QualityTrend[];
  title: string;
  description?: string;
}

export function QualityChart({ data, title, description }: QualityChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-80 relative p-6">
          {/* Using a basic implementation for the chart since we don't have access to specific chart libraries */}
          <div className="flex h-full">
            {data.map((item) => (
              <div key={item.period} className="flex-1 flex flex-col justify-end items-center gap-2">
                <div
                  className="w-4 bg-blue-500 rounded-t"
                  style={{ height: `${(item.pressureInjuries / 15) * 100}%` }}
                  title={`Pressure Injuries: ${item.pressureInjuries.toFixed(1)}`}
                />
                <div
                  className="w-4 bg-green-500 rounded-t"
                  style={{ height: `${(item.physicalRestraint / 15) * 100}%` }}
                  title={`Physical Restraint: ${item.physicalRestraint.toFixed(1)}`}
                />
                <div
                  className="w-4 bg-yellow-500 rounded-t"
                  style={{ height: `${(item.unplannedWeightLoss / 15) * 100}%` }}
                  title={`Weight Loss: ${item.unplannedWeightLoss.toFixed(1)}`}
                />
                <div
                  className="w-4 bg-red-500 rounded-t"
                  style={{ height: `${(item.fallsMajorInjury / 15) * 100}%` }}
                  title={`Falls: ${item.fallsMajorInjury.toFixed(1)}`}
                />
                <div
                  className="w-4 bg-purple-500 rounded-t"
                  style={{ height: `${(item.medicationManagement / 15) * 100}%` }}
                  title={`Medication: ${item.medicationManagement.toFixed(1)}`}
                />
                <span className="text-xs text-gray-500 mt-2">{item.period}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs">Pressure Injuries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs">Physical Restraint</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs">Weight Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs">Falls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-xs">Medication</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
