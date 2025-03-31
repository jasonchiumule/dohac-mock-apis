import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDemoState } from "@/utils/demo";
import { BACKENDS } from "@/config";

export function AuthStatus() {
  const [demoState] = useState(getDemoState);
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