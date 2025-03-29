import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StaffingImpact } from '@/types';

interface StaffingChartProps {
  data: StaffingImpact[];
  title: string;
  description?: string;
}

export function StaffingChart({ data, title, description }: StaffingChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-60 relative">
          <div className="flex h-full">
            {data.map((item) => (
              <div key={item.period} className="flex-1 flex flex-col justify-end items-center gap-2 relative">
                {/* Line for nurse minutes */}
                <div className="absolute top-0 bottom-0 w-full flex items-center justify-center">
                  <div 
                    className="h-1 bg-blue-500 w-full" 
                    style={{ top: `${100 - ((item.nurseMinutes / 50) * 100)}%` }}
                  ></div>
                </div>
                
                {/* Bar for quality score */}
                <div 
                  className="w-6 bg-green-500 rounded-t" 
                  style={{ height: `${(item.qualityScore / 100) * 100}%` }}
                  title={`Quality Score: ${item.qualityScore.toFixed(1)}`}
                />
                <span className="text-xs text-gray-500 mt-2">{item.period}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs">Nurse Minutes per Resident</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs">Quality Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
