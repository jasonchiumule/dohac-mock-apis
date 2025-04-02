// Removed useState
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Removed getDemoState
import { useDemoContext } from "@/context/DemoContext"; // Import the custom hook

export function QualityValueWidget() {
  // Get demoState from context
  const { demoState } = useDemoContext();
  const isConnected = demoState.connected;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Quality Indicators Reporting</CardTitle>
            <CardDescription>
              {isConnected
                ? "Automated submission and analysis of quality indicators"
                : "Manual quarterly reporting to the Department"}
            </CardDescription>
          </div>
          <Badge variant={isConnected ? "default" : "outline"}>
            {isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          // Before state (content remains the same)
          <div className="space-y-4">
            <div className="border rounded-md p-3 bg-gray-50">
              <h3 className="text-sm font-medium mb-2">Q1 2024 Submission Required</h3>
              <p className="text-sm text-gray-500 mb-3">
                Quality indicators must be submitted by April 21, 2024 (14 days remaining)
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Pressure Injuries</div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter value..."
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>

                <div>Physical Restraint</div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter value..."
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>

                <div>Unplanned Weight Loss</div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter value..."
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>

                <div>Falls with Major Injury</div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter value..."
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>

                <div>Medication Management</div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter value..."
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
              </div>

              <div className="mt-3 flex">
                <Button size="sm" variant="outline" >Submit Manually</Button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>Current process:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Collect data from multiple systems</li>
                <li>Manually calculate indicators</li>
                <li>Enter data into the government portal</li>
                <li>Time requirement: 3-4 hours per service</li>
              </ul>
            </div>
          </div>
        ) : (
          // After state (content remains the same)
          <div className="space-y-4">
            <div className="border rounded-md p-3 bg-blue-50 border-blue-200">
              <h3 className="text-sm font-medium mb-2 text-blue-800">Q1 2024 Submission Ready</h3>
              <p className="text-sm text-blue-700 mb-3">
                Quality data has been automatically collected and is ready for submission
              </p>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pressure Injuries</span>
                  <span className="font-medium">4.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Physical Restraint</span>
                  <span className="font-medium">1.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Unplanned Weight Loss</span>
                  <span className="font-medium">7.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Falls with Major Injury</span>
                  <span className="font-medium">2.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Medication Management</span>
                  <span className="font-medium">4.7%</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button size="sm" variant="outline">Submit via API</Button>
                <Badge variant="outline" className="bg-white">Validated ✓</Badge>
              </div>
            </div>

            <div className="p-2 bg-green-50 rounded-md border border-green-200">
              <div className="text-sm font-medium text-green-800">Value Created</div>
              <div className="text-sm text-green-700 mt-1">
                <ul className="list-disc list-inside space-y-1">
                  <li>2 hours saved per service per quarter</li>
                  <li>Automated data validation</li>
                  <li>Eliminated manual entry errors</li>
                  <li>100% on-time submission rate</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
