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
  connectApi: (apiName: "auth" | "provider" | "quality" | "nurses") => void;
  connectAllApis: () => void;
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

  // Memoize updater functions using useCallback to prevent unnecessary re-renders
  // of consuming components if the functions themselves haven't changed.

  const connectApi = useCallback((apiName: "auth" | "provider" | "quality" | "nurses") => {
    const newState = utilConnectApi(apiName); // Util function already saves state
    setDemoState(newState);
    // No need to call saveDemoState here as utilConnectApi handles it
  }, []);

  const connectAllApis = useCallback(() => {
    const newState = utilConnectAllApis(); // Util function already saves state
    setDemoState(newState);
    // No need to call saveDemoState here as utilConnectAllApis handles it
  }, []);

  const resetDemo = useCallback(() => {
    const newState = utilResetDemoState(); // Util function already saves state
    setDemoState(newState);
    // No need to call saveDemoState here as utilResetDemoState handles it
  }, []);

  const changeBackend = useCallback((backendId: string) => {
    // Check if the backendId is valid before proceeding
    if (!BACKENDS[backendId]) {
      console.error(`Backend "${backendId}" not found`);
      return; // Or handle the error appropriately
    }
    const newState = utilChangeBackend(backendId); // Util function already saves state
    setDemoState(newState);
    // No need to call saveDemoState here as utilChangeBackend handles it
  }, []);

  // The value that will be provided to consuming components
  const value = {
    demoState,
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
