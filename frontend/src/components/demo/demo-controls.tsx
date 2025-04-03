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
  const { demoState, isLoading, connectApi, connectAllApis, resetDemo, changeBackend } = useDemoContext();

  // Handle backend change - directly call context function
  const handleBackendChange = (value: string) => {
    changeBackend(value);
    console.log(`Switched to backend: ${BACKENDS[value].name}`);
  };

  // Handle connect actions - directly call context functions
  const handleConnect = async (api?: "auth" | "provider" | "quality" | "nurses") => {
    try {
      if (api) {
        await connectApi(api);
        console.log(`Connected to ${api} API`);
      } else {
        await connectAllApis();
        console.log("Connected to all APIs");
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Handle reset - directly call context function
  const handleReset = () => {
    resetDemo();
    console.log("Reset to before state");
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
                disabled={isLoading}
                onClick={() => handleConnect()}
              >
                <span>
                  {isLoading ? "Connecting..." : (demoState.connected ? "Refresh All Data" : "Connect All APIs")}
                </span>
              </Button>

              <Button
                className="w-full font-medium border-red-500 text-red-600 hover:bg-red-50"
                variant="outline"
                size="lg"
                disabled={isLoading}
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
                disabled={isLoading}
                onClick={() => handleConnect("provider")}
              >
                {isLoading ? "Connecting..." : "Provider API"}
              </Button>

              <Button
                className="w-full mb-2"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleConnect("quality")}
              >
                {isLoading ? "Connecting..." : "Quality Indicators API"}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleConnect("nurses")}
              >
                {isLoading ? "Connecting..." : "Registered Nurses API"}
              </Button>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
