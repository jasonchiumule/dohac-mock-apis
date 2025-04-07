import { createSignal, For, Show } from 'solid-js';
// import solidLogo from '~/assets/solid.svg';
// import viteLogo from '/vite.svg';
// import '~/App.css';

import { lazy } from "solid-js";

// Import the API function and type
import { fetchProviders, Provider } from '~/lib/api';

const Tooltip = lazy(() => import('~/lib/components/tooltip'));

function App() {
  const [count, setCount] = createSignal(0);

  // --- State for API data ---
  const [providers, setProviders] = createSignal<Provider[] | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  // --- ---

  // --- Button click handler ---
  const handleFetchProviders = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    setProviders(null); // Clear previous data
    try {
      const data = await fetchProviders();
      setProviders(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch providers");
    } finally {
      setLoading(false);
    }
  };
  // --- ---

  return (
    <>
      <h1>Vite + Solid + DOHAC Mock API</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        {/* --- API Fetch Button --- */}
        <button onClick={handleFetchProviders} disabled={loading()}>
          {loading() ? 'Loading Providers...' : 'Fetch Providers'}
        </button>
        {/* --- --- */}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      {/* --- Display API Data --- */}
      <div>
        <h2>Provider Data</h2>
        <Show when={loading()}>
          <p>Loading...</p>
        </Show>
        <Show when={error()}>
          <p style={{ color: 'red' }}>Error: {error()}</p>
        </Show>
        <Show when={providers() && !loading() && !error()}>
          <ul>
            <For each={providers()}>
              {(provider) => (
                <li>{provider.name} (ID: {provider.id})</li>
              )}
            </For>
          </ul>
        </Show>
        <Show when={!providers() && !loading() && !error()}>
          <p>Click "Fetch Providers" to load data.</p>
        </Show>
      </div>
      {/* --- --- */}

      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
      <Tooltip />
    </>
  );
}

export default App;
