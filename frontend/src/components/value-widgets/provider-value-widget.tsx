// Removed useState
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Removed getDemoState
import { useDemoContext } from "@/context/DemoContext"; // Import the custom hook

export function ProviderValueWidget() {
  // Get demoState from context
  const { demoState } = useDemoContext();
  const isConnected = demoState.connected;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Provider & Service Management</CardTitle>
            <CardDescription>
              {isConnected
                ? "Automated synchronization with government registries"
                : "Manual provider and service information management"}
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
              <h3 className="text-sm font-medium mb-2">Provider Information</h3>
              <div className="space-y-2 mb-3">
                <div>
                  <label className="block text-xs text-gray-500">Provider Name</label>
                  <input
                    type="text"
                    defaultValue="Sunset Aged Care"
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Provider Number</label>
                  <input
                    type="text"
                    placeholder="Enter government provider ID..."
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">ABN</label>
                  <input
                    type="text"
                    placeholder="Enter ABN..."
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
              </div>

              <h3 className="text-sm font-medium mb-2">Service Information</h3>
              <div className="space-y-2 mb-3">
                <div>
                  <label className="block text-xs text-gray-500">Service Name</label>
                  <input
                    type="text"
                    defaultValue="Sunset Residential Facility"
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Service ID</label>
                  <input
                    type="text"
                    placeholder="Enter government service ID..."
                    className="w-full p-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Service Type</label>
                  <select className="w-full p-1 border rounded text-sm">
                    <option>Residential Aged Care</option>
                    <option>Home Care</option>
                    <option>Respite Care</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-start space-x-2">
                <Button size="sm">Save</Button>
                <Button size="sm" variant="outline">Cancel</Button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>Current process challenges:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Manual entry and verification of provider details</li>
                <li>Risk of inconsistency with government records</li>
                <li>Time-consuming updates when details change</li>
                <li>Difficulty tracking multiple services and locations</li>
              </ul>
            </div>
          </div>
        ) : (
          // After state (content remains the same)
          <div className="space-y-4">
            <div className="border rounded-md p-3 bg-blue-50 border-blue-200">
              <h3 className="text-sm font-medium mb-2 text-blue-800">Provider Information Synchronized</h3>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Provider Name</span>
                  <span className="font-medium text-sm">Sunset Aged Care</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Provider Number</span>
                  <span className="font-medium text-sm">PRV-12345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">ABN</span>
                  <span className="font-medium text-sm">12 345 678 901</span>
                </div>
              </div>

              <h3 className="text-sm font-medium mb-2 text-blue-800">Services</h3>
              <div className="space-y-2 mb-3">
                <div className="p-2 bg-white rounded border border-blue-200 text-sm">
                  <div className="font-medium">Sunset Residential Facility</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-blue-700">Service ID</span>
                    <span>SVC-54321</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Type</span>
                    <span>Residential Aged Care</span>
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-blue-200 text-sm">
                  <div className="font-medium">Sunset Home Care</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-blue-700">Service ID</span>
                    <span>SVC-54322</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Type</span>
                    <span>Home Care</span>
                  </div>
                </div>
              </div>

              <div className="flex">
                <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                  Refresh Provider Data
                </Button>
              </div>
            </div>

            <div className="p-2 bg-green-50 rounded-md border border-green-200">
              <div className="text-sm font-medium text-green-800">Value Created</div>
              <div className="text-sm text-green-700 mt-1">
                <ul className="list-disc list-inside space-y-1">
                  <li>Perfect alignment with government records</li>
                  <li>1 hour saved per update</li>
                  <li>Eliminated data entry errors</li>
                  <li>Automatic service discovery</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
