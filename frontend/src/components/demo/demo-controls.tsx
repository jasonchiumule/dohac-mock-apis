import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BACKENDS } from "@/config";
import {
  connectAllApis,
  connectApi,
  formatTimeSaved,
  getDemoState,
  resetDemoState
} from "@/utils/demo";

export function DemoControls() {
  const [demoState, setDemoState] = useState(getDemoState());

  // Handle backend change
  const handleBackendChange = (value: string) => {
    const newState = { ...demoState, backend: value };
    setDemoState(newState);

    // In a real implementation, this would update the API client configuration
    console.log(`Switched to backend: ${BACKENDS[value].name}`);
  };

  // Handle connect actions
  const handleConnect = (api?: "auth" | "provider" | "quality" | "nurses") => {
    if (api) {
      const newState = connectApi(api);
      setDemoState(newState);
    } else {
      const newState = connectAllApis();
      setDemoState(newState);
    }
  };

  // Handle reset
  const handleReset = () => {
    const newState = resetDemoState();
    setDemoState(newState);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Demo Controls</CardTitle>
        <CardDescription>
          Control the demonstration to show before/after state of API integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Backend Selection</label>
              <Select value={demoState.backend} onValueChange={handleBackendChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a backend" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BACKENDS).map(([id, config]) => (
                    <SelectItem key={id} value={id}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full font-medium"
                variant="outline"
                size="lg"
                onClick={() => handleConnect()}
              >
                <span>
                  {demoState.connected ? "Refresh All Data" : "Connect All APIs"}
                </span>
              </Button>

              <Button
                className="w-full font-medium border-red-500 text-red-600 hover:bg-red-50"
                variant="outline"
                size="lg"
                onClick={handleReset}
              >
                <span>Reset to Before State</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium mb-1">Connect Individual APIs</h3>

            <div>
              <Button
                className="w-full mb-2"
                variant="outline"
                onClick={() => handleConnect("provider")}
              >
                Provider API
              </Button>

              <Button
                className="w-full mb-2"
                variant="outline"
                onClick={() => handleConnect("quality")}
              >
                Quality Indicators API
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleConnect("nurses")}
              >
                Registered Nurses API
              </Button>
            </div>
          </div>
        </div>

        {demoState.connected && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm font-medium mb-2">Value Demonstrated</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Time Saved:</div>
              <div className="font-bold">{formatTimeSaved(demoState.timeSaved.total)} per month</div>

              <div>Quality Reporting:</div>
              <div>{formatTimeSaved(demoState.timeSaved.qualityReporting)} per month</div>

              <div>Nurse Compliance:</div>
              <div>{formatTimeSaved(demoState.timeSaved.nurseCompliance)} per month</div>

              <div>Provider Management:</div>
              <div>{formatTimeSaved(demoState.timeSaved.providerManagement)} per month</div>

              <div className="col-span-2 mt-2 text-green-600">
                Estimated Annual Value: ${(demoState.timeSaved.total * 12 * 45).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
