// import { useContext } from "react"; // Import useContext
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BACKENDS } from "@/config";
import { useDemoContext } from "@/context/DemoContext"; // Import the custom hook
// import {
//   // Removed getDemoState, resetDemoState, connectApi, connectAllApis
//   formatTimeSaved,
// } from "@/utils/demo";

export function DemoControls() {
  // Get state and functions from context
  const { demoState, connectApi, connectAllApis, resetDemo, changeBackend } = useDemoContext();

  // Handle backend change - directly call context function
  const handleBackendChange = (value: string) => {
    changeBackend(value);
    console.log(`Switched to backend: ${BACKENDS[value].name}`);
  };

  // Handle connect actions - directly call context functions
  const handleConnect = (api?: "auth" | "provider" | "quality" | "nurses") => {
    if (api) {
      connectApi(api);
    } else {
      connectAllApis();
    }
  };

  // Handle reset - directly call context function
  const handleReset = () => {
    resetDemo();
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
              {/* Use demoState from context */}
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
                  {/* Use demoState from context */}
                  {demoState.connected ? "Refresh All Data" : "Connect All APIs"}
                </span>
              </Button>

              <Button
                className="w-full font-medium border-red-500 text-red-600 hover:bg-red-50"
                variant="outline"
                size="lg"
                onClick={handleReset} // Use handleReset which calls context function
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
                onClick={() => handleConnect("provider")} // Use handleConnect
              >
                Provider API
              </Button>

              <Button
                className="w-full mb-2"
                variant="outline"
                onClick={() => handleConnect("quality")} // Use handleConnect
              >
                Quality Indicators API
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleConnect("nurses")} // Use handleConnect
              >
                Registered Nurses API
              </Button>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
