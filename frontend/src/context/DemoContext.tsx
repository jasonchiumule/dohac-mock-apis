import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import {
  DemoState,
  getDemoState,
  resetDemoState as utilResetDemoState,
  connectApi as utilConnectApi,
  connectAllApis as utilConnectAllApis,
  changeBackend as utilChangeBackend,
} from '@/utils/demo';
import { BACKENDS } from '@/config'; // Import BACKENDS

// Define the shape of the context value
interface DemoContextType {
  demoState: DemoState;
  isLoading: boolean;
  connectApi: (apiName: "auth" | "provider" | "quality" | "nurses") => Promise<void>;
  connectAllApis: () => Promise<void>;
  resetDemo: () => void;
  changeBackend: (backendId: string) => void;
}

// Create the context with a default value (or null and check)
const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Define the props for the provider component
interface DemoProviderProps {
  children: ReactNode;
}

// Create the Provider component
export function DemoProvider({ children }: DemoProviderProps) {
  // Initialize state from sessionStorage
  const [demoState, setDemoState] = useState<DemoState>(getDemoState);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize updater functions using useCallback to prevent unnecessary re-renders
  // of consuming components if the functions themselves haven't changed.

  const connectApi = useCallback(async (apiName: "auth" | "provider" | "quality" | "nurses") => {
    setIsLoading(true);
    try {
      console.log(`Connecting to ${apiName} API`);
      const newState = await utilConnectApi(apiName); // Now awaiting the async function
      setDemoState(newState);
      console.log(`${apiName} API connected successfully`);
    } catch (error) {
      console.error(`Error connecting to ${apiName} API:`, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectAllApis = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Connecting to all APIs");
      const newState = await utilConnectAllApis(); // Now awaiting the async function
      setDemoState(newState);
      console.log("All APIs connected successfully");
    } catch (error) {
      console.error("Error connecting to all APIs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetDemo = useCallback(() => {
    console.log("Resetting to before state");
    const newState = utilResetDemoState(); // This function is still synchronous
    setDemoState(newState);
    console.log("Reset complete");
  }, []);

  const changeBackend = useCallback((backendId: string) => {
    // Check if the backendId is valid before proceeding
    if (!BACKENDS[backendId]) {
      console.error(`Backend "${backendId}" not found`);
      return; // Or handle the error appropriately
    }
    console.log(`Changing backend to ${backendId}`);
    const newState = utilChangeBackend(backendId); // This function is still synchronous
    setDemoState(newState);
    console.log(`Backend changed to ${backendId}`);
  }, []);

  // The value that will be provided to consuming components
  const value = {
    demoState,
    isLoading,
    connectApi,
    connectAllApis,
    resetDemo,
    changeBackend,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// Custom hook for consuming the context
export function useDemoContext() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
}
