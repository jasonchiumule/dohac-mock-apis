import { createSignal, Show } from 'solid-js';
import { lazy } from "solid-js";

// Import ALL the API functions we want to test
import {
  fetchProviders,
  fetchHealthcareServices,
  fetchQuestionnaires,
  fetchRNAttendance,
} from '~/lib/api';

// --- Style Constants ---
const primaryButtonClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
const formInputClasses = "block w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"; // Set width
const formLabelClasses = "block text-sm font-medium text-gray-700";
const codeBlockClasses = "bg-gray-50 p-4 border border-gray-200 rounded-md overflow-x-auto text-sm font-mono"; // Mono font

const Tooltip = lazy(() => import('~/lib/components/tooltip')); // Keep if used elsewhere

export default function ApiTest() {
  // --- State for API calls ---
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [apiResult, setApiResult] = createSignal<any | null>(null); // Stores result of the last call

  // --- State for Input Parameters ---
  const [organizationIdInput, setOrganizationIdInput] = createSignal("PRV-12345");
  const [serviceIdInput, setServiceIdInput] = createSignal("SVC-54321");

  // --- Generic API Fetch Handler ---
  const handleApiCall = async (fetchFn: () => Promise<any>) => {
    // ... (no changes in logic)
    setLoading(true);
    setError(null);
    setApiResult(null);
    try {
      const data = await fetchFn();
      setApiResult(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      console.error("API Call Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Specific Button Handlers ---
  const handleFetchProviders = () => handleApiCall(fetchProviders);
  const handleFetchHealthcareServices = () => handleApiCall(() => fetchHealthcareServices(organizationIdInput()));
  const handleFetchQuestionnaires = () => handleApiCall(fetchQuestionnaires);
  const handleFetchRNAttendance = () => handleApiCall(() => fetchRNAttendance(serviceIdInput()));


  return (
    // Add padding and spacing to the main container
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-800">DOHAC Mock API Testbed</h1>

      {/* --- API Call Controls --- */}
      {/* Use flex-wrap and gap for better responsive layout */}
      <div class="flex flex-wrap items-center gap-x-4 gap-y-3 p-4 border border-gray-200 rounded-md bg-white">
        <button onClick={handleFetchProviders} disabled={loading()} class={primaryButtonClasses}>
          <span class="i-carbon-building mr-2"></span> {/* Added Icon */}
          Fetch Providers
        </button>

        {/* Group related input/button */}
        <div class="flex items-center gap-2">
          <label for="orgId" class={formLabelClasses}>Org ID:</label>
          <input
            id="orgId"
            type="text"
            value={organizationIdInput()}
            onInput={(e) => setOrganizationIdInput(e.currentTarget.value)}
            disabled={loading()}
            class={formInputClasses}
          />
          <button onClick={handleFetchHealthcareServices} disabled={loading()} class={primaryButtonClasses}>
            <span class="i-carbon-cloud-services mr-2"></span> {/* Added Icon */}
            Fetch Services
          </button>
        </div>

        <button onClick={handleFetchQuestionnaires} disabled={loading()} class={primaryButtonClasses}>
          <span class="i-carbon-result mr-2"></span> {/* Added Icon */}
          Fetch Questionnaires
        </button>

        {/* Group related input/button */}
        <div class="flex items-center gap-2">
          <label for="serviceId" class={formLabelClasses}>Service ID:</label>
          <input
            id="serviceId"
            type="text"
            value={serviceIdInput()}
            onInput={(e) => setServiceIdInput(e.currentTarget.value)}
            disabled={loading()}
            class={formInputClasses}
          />
          <button onClick={handleFetchRNAttendance} disabled={loading()} class={primaryButtonClasses}>
            <span class="i-carbon-user-follow mr-2"></span> {/* Added Icon */}
            Fetch RN Attendance
          </button>
        </div>
      </div>

      {/* --- Unified Display Area --- */}
      <div class="api-result-display space-y-2">
        <h2 class="text-xl font-semibold text-gray-800">API Result</h2>
        <div class="min-h-40 p-4 border border-gray-200 rounded-md bg-white"> {/* Container for results */}
          <Show when={loading()}>
            <p class="text-sm text-gray-600 flex items-center">
              <span class="i-carbon-circle-dash animate-spin mr-2 text-blue-600"></span>
              Loading...
            </p>
          </Show>
          <Show when={error()}>
            <p class="text-sm text-red-600 font-medium flex items-center">
              <span class="i-carbon-warning-alt mr-2"></span>
              Error: {error()}
            </p>
          </Show>
          <Show when={apiResult() && !loading() && !error()}>
            <pre class={codeBlockClasses}>
              <code>{JSON.stringify(apiResult(), null, 2)}</code>
            </pre>
          </Show>
          <Show when={!apiResult() && !loading() && !error()}>
            <p class="text-sm text-gray-500 italic">Click a button above to fetch data.</p>
          </Show>
        </div>
      </div>

      {/* Simple Tooltip - Ensure zagjs is working */}
      <div class="mt-4">
        <h3 class="text-lg font-medium text-gray-700 mb-2">Component Example</h3>
        <Tooltip />
      </div>
    </div>
  );
}
