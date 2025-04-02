// Removed useState
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Removed getDemoState
import { BACKENDS } from "@/config";
import { useDemoContext } from "@/context/DemoContext"; // Import the custom hook

export function AuthStatus() {
  // Get demoState from context
  const { demoState } = useDemoContext();
  const isConnected = demoState.connected;
  const backend = BACKENDS[demoState.backend];

  return (
    <div className="flex items-center space-x-2">
      <Badge
        variant={isConnected ? "default" : "outline"}
        className={isConnected ? "bg-green-500 hover:bg-green-500" : ""}
      >
        {isConnected
          ? `Connected to ${backend.name}`
          : "Not Connected"
        }
      </Badge>

      {isConnected && demoState.lastSynced && (
        <span className="text-xs text-gray-500">
          Last synced: {new Date(demoState.lastSynced).toLocaleTimeString()}
        </span>
      )}

      {!isConnected && (
        <Button size="sm" variant="ghost" className="text-xs">
          Configure Authentication
        </Button>
      )}
    </div>
  );
}
