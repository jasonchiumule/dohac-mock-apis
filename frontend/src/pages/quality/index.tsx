// import { useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { QualityChart } from '@/components/dashboard/quality-chart';
// import { StaffingChart } from '@/components/dashboard/staffing-chart';
// import { SummaryCard } from '@/components/dashboard/summary-card';
// import { generateServiceCompliance, qualityTrends, staffingImpact } from '@/utils/mocks';
import { getDemoState } from '@/utils/demo';

// Demo components
import { DemoControls } from '@/components/demo/demo-controls';
import { QualityValueWidget } from '@/components/value-widgets/quality-value-widget';
import { NursesValueWidget } from '@/components/value-widgets/nurses-value-widget';
import { AuthStatus } from '@/components/value-widgets/auth-status';
import { ValueSummary } from '@/components/value-widgets/value-summary';

export default function QualityOptimization() {
  // const [selectedServiceId, setSelectedServiceId] = useState<string>('service-001');
  // const services = generateServiceCompliance();
  // const selectedService = services.find(s => s.service.serviceId === selectedServiceId);

  // Get demo state
  const demoState = getDemoState();
  const isConnected = demoState.connected;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Care Quality {isConnected ? 'Optimization' : 'Management'}
          </h1>
          <p className="text-muted-foreground">
            {isConnected
              ? 'Use data insights to optimize staffing and improve resident quality of care'
              : 'Monitor quality of care and staffing information'
            }
          </p>
        </div>
        <AuthStatus />
      </div>

      {/* Demo Controls */}
      <DemoControls />

      {/* Value Demonstration Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <QualityValueWidget />
        <NursesValueWidget />
      </div>

      {/* Value Summary */}
      <ValueSummary />
    </div>
  );
}
