// import { useState } from 'react';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// // import { SummaryCard } from '@/components/dashboard/summary-card';
// // import { QualityChart } from '@/components/dashboard/quality-chart';
// // import { Badge } from '@/components/ui/badge';
// import { generateServiceCompliance, generateStatistics, qualityTrends } from '@/utils/mocks';
import { getDemoState } from '@/utils/demo';

// Demo components
import { DemoControls } from '@/components/demo/demo-controls';
import { QualityValueWidget } from '@/components/value-widgets/quality-value-widget';
import { NursesValueWidget } from '@/components/value-widgets/nurses-value-widget';
import { ProviderValueWidget } from '@/components/value-widgets/provider-value-widget';
import { AuthStatus } from '@/components/value-widgets/auth-status';
import { ValueSummary } from '@/components/value-widgets/value-summary';

export default function ComplianceDashboard() {
  // const [, setSelectedTab] = useState<string>('overview');
  // const services = generateServiceCompliance();
  // const statistics = generateStatistics();

  // Get demo state
  const demoState = getDemoState();
  const isConnected = demoState.connected;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Compliance Management {isConnected ? 'Dashboard' : 'System'}
          </h1>
          <p className="text-muted-foreground">
            {isConnected
              ? 'Monitor service compliance across quality indicators and nurse staffing requirements'
              : 'Manual tracking and reporting for compliance requirements'
            }
          </p>
        </div>
        <AuthStatus />
      </div>

      {/* Demo Controls */}
      <DemoControls />

      {/* Value Demonstration Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <QualityValueWidget />
        <NursesValueWidget />
        <ProviderValueWidget />
      </div>

      {/* Value Summary */}
      <ValueSummary />

    </div>
  );
}
