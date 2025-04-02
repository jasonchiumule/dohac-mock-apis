// Removed useState
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// Removed getDemoState
import { useDemoContext } from "@/context/DemoContext"; // Import the custom hook
import { formatTimeSaved, calculateTimeSavingsValue } from "@/utils/demo";


export function ValueSummary() {
  // Get demoState from context
  const { demoState } = useDemoContext();
  const isConnected = demoState.connected;

  // Calculate derived values based on demoState
  const monthlyHours = demoState.timeSaved.total;
  const annualHours = monthlyHours * 12;
  const annualDays = annualHours / 8;
  const annualValue = calculateTimeSavingsValue(annualHours);

  // Calculate compliance improvement percentage based on connection status
  const complianceImprovement = isConnected ? 23 : 0;

  // Calculate data accuracy improvement percentage based on connection status
  const dataAccuracyImprovement = isConnected ? 85 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>API Integration Value Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          // Before state (content remains the same)
          <div className="space-y-3 text-sm text-gray-500">
            <p>
              Connect to the Department of Health and Aged Care APIs to see the value
              they can bring to your organization.
            </p>
            <p>
              Benefits include:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Reduced administrative burden</li>
              <li>Improved data accuracy</li>
              <li>Enhanced compliance monitoring</li>
              <li>More time for resident care</li>
            </ul>
          </div>
        ) : (
          // After state (calculations now use reactive state)
          <div className="space-y-3">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Administrative Time Saved</span>
                  <span className="text-sm font-medium">{formatTimeSaved(monthlyHours)} per month</span>
                </div>
                <Progress value={monthlyHours > 0 ? 100 : 0} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Compliance Rate Improvement</span>
                  <span className="text-sm font-medium">{complianceImprovement}%</span>
                </div>
                <Progress value={complianceImprovement} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Data Accuracy Improvement</span>
                  <span className="text-sm font-medium">{dataAccuracyImprovement}%</span>
                </div>
                <Progress value={dataAccuracyImprovement} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <div className="text-lg font-bold text-green-800">{formatTimeSaved(annualHours)}</div>
                <div className="text-sm text-green-700">Time saved annually</div>
              </div>

              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <div className="text-lg font-bold text-blue-800">${annualValue.toLocaleString()}</div>
                <div className="text-sm text-blue-700">Annual value created</div>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-md border border-purple-200 mt-2">
              <div className="text-sm font-medium text-purple-800 mb-1">Other Benefits</div>
              <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                <li>100% on-time reporting</li>
                <li>Enhanced audit readiness</li>
                <li>Real-time compliance monitoring</li>
                <li>{(annualDays).toFixed(0)} more days for resident care</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
