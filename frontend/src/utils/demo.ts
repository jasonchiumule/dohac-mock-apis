/**
 * Demo utilities for before/after state management
 */

import { BACKENDS } from "../config";

// Store the demo state
export type DemoState = {
  // Whether APIs are connected (after state)
  connected: boolean;
  // Selected backend
  backend: string;
  // Timing data for showing value
  timeSaved: {
    qualityReporting: number;
    nurseCompliance: number;
    providerManagement: number;
    total: number;
  };
  // When the data was last synced
  lastSynced: string | null;
};

// Initial demo state (before state)
export const initialDemoState: DemoState = {
  connected: false,
  backend: "golang",
  timeSaved: {
    qualityReporting: 0,
    nurseCompliance: 0,
    providerManagement: 0,
    total: 0,
  },
  lastSynced: null,
};

// Get the current demo state from session storage or return initial state
export function getDemoState(): DemoState {
  try {
    const state = sessionStorage.getItem("demoState");
    return state ? JSON.parse(state) : initialDemoState;
  } catch {
    return initialDemoState;
  }
}

// Save the demo state to session storage
export function saveDemoState(state: DemoState): void {
  sessionStorage.setItem("demoState", JSON.stringify(state));
}

// Reset the demo state to initial (before) state
export function resetDemoState(): DemoState {
  const state = { ...initialDemoState };
  saveDemoState(state);
  return state;
}

// Update the demo state for a specific API (after connecting)
export function connectApi(apiName: "auth" | "provider" | "quality" | "nurses"): DemoState {
  const state = getDemoState();
  state.connected = true;
  state.lastSynced = new Date().toISOString();

  // Add time savings based on which API was connected
  switch (apiName) {
    case "quality":
      state.timeSaved.qualityReporting = 8; // Hours per month
      break;
    case "nurses":
      state.timeSaved.nurseCompliance = 12; // Hours per month
      break;
    case "provider":
      state.timeSaved.providerManagement = 4; // Hours per month
      break;
  }

  // Update total
  state.timeSaved.total = Object.values(state.timeSaved).reduce((a, b) => a + b, 0);

  saveDemoState(state);
  return state;
}

// Connect all APIs at once
export function connectAllApis(): DemoState {
  const state = getDemoState();
  state.connected = true;
  state.lastSynced = new Date().toISOString();

  // Set time savings for all APIs
  state.timeSaved = {
    qualityReporting: 8,
    nurseCompliance: 12,
    providerManagement: 4,
    total: 24, // Total hours per month
  };

  saveDemoState(state);
  return state;
}

// Change the backend
export function changeBackend(backendId: string): DemoState {
  if (!BACKENDS[backendId]) {
    throw new Error(`Backend "${backendId}" not found`);
  }

  const state = getDemoState();
  state.backend = backendId;
  saveDemoState(state);
  return state;
}

// Format time saved for display
export function formatTimeSaved(hours: number): string {
  if (hours === 0) return "0 hrs";

  const days = Math.floor(hours / 8);
  const remainingHours = hours % 8;

  if (days === 0) {
    return `${hours} hrs`;
  } else if (remainingHours === 0) {
    return `${days} days`;
  } else {
    return `${days} days, ${remainingHours} hrs`;
  }
}

// Calculate monetary value of time saved
export function calculateTimeSavingsValue(hours: number, hourlyRate: number = 45): number {
  return hours * hourlyRate;
}
