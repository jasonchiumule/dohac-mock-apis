import { createSignal, Show } from 'solid-js';
import { lazy } from "solid-js";

// Import ALL the API functions we want to test
import {
  fetchProviders,
  fetchHealthcareServices,
  fetchQuestionnaires,
  fetchRNAttendance,
} from '~/lib/api';
// No specific result types needed here if displaying raw JSON

const Tooltip = lazy(() => import('~/lib/components/tooltip')); // Keep if used elsewhere

function App() {
  // --- State for API calls ---
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [apiResult, setApiResult] = createSignal<any | null>(null); // Stores result of the last call

  // --- State for Input Parameters ---
  const [organizationIdInput, setOrganizationIdInput] = createSignal("PRV-12345");
  const [serviceIdInput, setServiceIdInput] = createSignal("SVC-54321");

  // --- Generic API Fetch Handler ---
  // Helper to reduce repetition in specific handlers
  const handleApiCall = async (fetchFn: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    setApiResult(null);
    try {
      const data = await fetchFn();
      setApiResult(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      console.error("API Call Failed:", err); // Log the full error
    } finally {
      setLoading(false);
    }
  };

  // --- Specific Button Handlers ---
  const handleFetchProviders = () => handleApiCall(fetchProviders);

  const handleFetchHealthcareServices = () => handleApiCall(
    () => fetchHealthcareServices(organizationIdInput())
  );

  const handleFetchQuestionnaires = () => handleApiCall(fetchQuestionnaires);

  const handleFetchRNAttendance = () => handleApiCall(
    () => fetchRNAttendance(serviceIdInput()) // Defaulting summary=true as in api.ts
  );


  return (
    <>
      <h1>DOHAC Mock API Testbed</h1>

      {/* --- API Call Controls --- */}
      <div class="api-controls" style={{ "display": "flex", "flex-wrap": "wrap", "gap": "10px", "margin-bottom": "20px" }}>
        <button onClick={handleFetchProviders} disabled={loading()}>
          Fetch Providers
        </button>

        <div style={{ "display": "flex", "gap": "5px", "align-items": "center" }}>
          <label for="orgId">Org ID:</label>
          <input
            id="orgId"
            type="text"
            value={organizationIdInput()}
            onInput={(e) => setOrganizationIdInput(e.currentTarget.value)}
            disabled={loading()}
            style={{ "width": "100px" }}
          />
          <button onClick={handleFetchHealthcareServices} disabled={loading()}>
            Fetch Services
          </button>
        </div>

        <button onClick={handleFetchQuestionnaires} disabled={loading()}>
          Fetch Questionnaires
        </button>

        <div style={{ "display": "flex", "gap": "5px", "align-items": "center" }}>
          <label for="serviceId">Service ID:</label>
          <input
            id="serviceId"
            type="text"
            value={serviceIdInput()}
            onInput={(e) => setServiceIdInput(e.currentTarget.value)}
            disabled={loading()}
            style={{ "width": "100px" }}
          />
          <button onClick={handleFetchRNAttendance} disabled={loading()}>
            Fetch RN Attendance
          </button>
        </div>
      </div>

      {/* --- Unified Display Area --- */}
      <div class="api-result-display">
        <h2>API Result</h2>
        <Show when={loading()}>
          <p>Loading...</p>
        </Show>
        <Show when={error()}>
          <p style={{ color: 'red' }}>Error: {error()}</p>
        </Show>
        <Show when={apiResult() && !loading() && !error()}>
          <pre style={{ "background-color": "#f4f4f4", "padding": "10px", "border": "1px solid #ccc", "overflow-x": "auto" }}>
            <code>{JSON.stringify(apiResult(), null, 2)}</code>
          </pre>
        </Show>
        <Show when={!apiResult() && !loading() && !error()}>
          <p>Click a button above to fetch data.</p>
        </Show>
      </div>

      <Tooltip />
    </>
  );
}

export default App;
