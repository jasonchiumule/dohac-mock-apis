import { createSignal, Show, Switch, Match } from 'solid-js';
import type { Organization } from '~/lib/schema';
import { fetchProviders } from '~/lib/api';

//
const newAddress = '99 Flamingo Parade, Melbourne, VIC 3000';

// Helper function (kept local as it's only used here)
const getAddressString = (org: Organization | undefined): string => {
  // ... (no changes in helper function logic)
  if (!org || !org.address || org.address.length === 0) {
    return "Address not available";
  }
  const primaryAddr = org.address.find(a => a.use === 'work');
  const addr = primaryAddr || org.address[0];
  const lineString = Array.isArray(addr.line) ? addr.line.join(', ') : (addr.line || 'N/A');
  return `${lineString}, ${addr.city || 'N/A'}, ${addr.state || 'N/A'} ${addr.postalCode || 'N/A'}`;
};

// Define possible states for the component
type ProviderCheckState = 'initial' | 'loading' | 'checked' | 'error';

// --- Style Constants ---
const primaryButtonClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
const secondaryButtonClasses = "inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"; // Using indigo focus for secondary as example
const errorAlertClasses = "mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm flex items-center";
// const successAlertClasses = "p-3 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm flex items-center";
const warningAlertClasses = "mt-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-md text-sm flex items-center";
const infoAlertClasses = errorAlertClasses;
const sectionCardClasses = "p-6 bg-white rounded-lg border border-gray-200"; // Flat card style
const headingClasses = "text-xl font-semibold text-gray-800 mb-4 flex items-center";
const subHeadingClasses = "text-lg font-medium text-gray-700 mb-2"; // Darker subheading
const paragraphClasses = "text-sm text-gray-600 mb-4"; // Standard paragraph
const beforeCardClasses = "border border-gray-200 p-4 rounded-md bg-gray-50";
const afterCardClasses = "border border-blue-200 p-4 rounded-md bg-green-50"; // Use theme color border
const cardHeadingClasses = "text-md font-semibold text-gray-700 mb-2 flex items-center"; // Consistent card headings
const listClasses = "list-disc list-inside text-sm text-gray-600 space-y-1";
const afterListClasses = "list-disc list-inside text-sm text-green-700 space-y-1"; // Theme color list text

export default function ProviderInfoSection() {
  // --- State Management ---
  const [providerCheckState, setProviderCheckState] = createSignal<ProviderCheckState>('initial');
  const [providerError, setProviderError] = createSignal<string | null>(null);
  const [providerData, setProviderData] = createSignal<Organization[] | null>(null);
  const targetProvider = () => providerData()?.find(p => p.id === "PRV-12345");

  // --- Event Handlers ---
  const handleCheckProviderAddress = async () => {
    // ... (no changes in logic)
    setProviderCheckState('loading');
    setProviderError(null);
    setProviderData(null);
    try {
      const data = await fetchProviders();
      setProviderData(data);
      if (data && data.length > 0) {
        setProviderCheckState('checked');
      } else if (data) {
        console.warn("API returned an empty list of providers.");
        setProviderCheckState('checked');
      } else {
        throw new Error("No provider data received from API.");
      }
    } catch (err: any) {
      console.error("Error fetching provider data:", err);
      setProviderError(err.message || "Failed to fetch provider data.");
      setProviderCheckState('error');
    }
  };

  const handleReset = () => {
    setProviderCheckState('initial');
    setProviderError(null);
    setProviderData(null);
  };

  return (
    <section class={sectionCardClasses}>
      <h2 class={headingClasses}>
        <span class="i-carbon-building text-2xl mr-2 text-blue-600"></span>
        Provider Information Management
      </h2>

      <Switch>
        {/* State: Initial / Error / Loading */}
        <Match when={providerCheckState() === 'initial' || providerCheckState() === 'error' || providerCheckState() === 'loading'}>
          <div class="grid md:grid-cols-2 gap-6">
            {/* Before (Manual Process Description) */}
            <div>
              <h3 class={subHeadingClasses}>Manual Process</h3>
              <p class={paragraphClasses}>
                Manually checking provider details across different government portals is time-consuming. Updates require remembering to call or log in separately, risking outdated information and potential compliance issues.
              </p>
              <p class={`${paragraphClasses} font-bold`}> We recently moved to <code class="font-mono bg-yellow-100 px-1 rounded">{newAddress}</code></p>
            </div>

            {/* Action Area */}
            <div>
              <h3 class={subHeadingClasses}>Automated Check</h3>
              <button
                onClick={handleCheckProviderAddress}
                disabled={providerCheckState() === 'loading'}
                class={primaryButtonClasses}
              >
                <span class={providerCheckState() === 'loading' ? "i-carbon-circle-dash animate-spin mr-2" : "i-carbon-search mr-2"}></span>
                {providerCheckState() === 'loading' ? 'Checking...' : 'Check Registered Address via API'}
              </button>

              <Show when={providerCheckState() === 'error' && providerError()}>
                <div class={errorAlertClasses}>
                  <span class="i-carbon-warning-alt text-lg mr-2"></span>
                  Error: {providerError()}
                </div>
              </Show>
            </div>
          </div>
        </Match>

        {/* State: Checked (API Call Successful) */}
        <Match when={providerCheckState() === 'checked'}>
          <h3 class={`${subHeadingClasses} mb-3`}>API Check Results</h3>
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            {/* Before */}
            <div class={beforeCardClasses}>
              <h4 class={cardHeadingClasses}>
                <span class="i-carbon-time text-red-500 mr-2"></span>
                Manual Process (Before)
              </h4>
              <ul class={listClasses}>
                <li>Log in to multiple portals (My Aged Care, PRODA)</li>
                <li>Search for provider details</li>
                <li>Manually compare with internal records</li>
                <li>Time Requirement: ~5-15 mins per check</li>
                <li>Risk of overlooking discrepancies</li>
              </ul>
            </div>
            {/* After */}
            <div class={afterCardClasses}>
              {/* Use theme color for heading text */}
              <h4 class={`${cardHeadingClasses} text-blue-800`}>
                <span class="i-carbon-flash text-green-700 mr-2"></span>
                API Integration (After)
              </h4>
              <ul class={afterListClasses}>
                <li>Single button click within existing system</li>
                <li>Instant fetch of registered data</li>
                <li>Direct comparison or flag for review</li>
                <li class="font-semibold">Time Saved: ~5-15 mins per check</li>
                <li>Reduced administrative burden and costly admin related errors</li>
                <li>Improved data accuracy and compliance timeliness</li>
              </ul>
              <p class="text-xs text-blue-600 mt-2">*Based on average admin hourly rates.</p>
            </div>
          </div>

          {/* Specific Provider Result Alert */}
          <Show when={targetProvider()} fallback={
            // Use warning style for not found/empty data
            <div class={warningAlertClasses}>
              <span class="i-carbon-warning text-lg mr-2"></span> {/* Changed icon */}
              {providerData() === null ? "Loading provider data..." : providerData()?.length === 0 ? "API returned no provider data." : "Target provider (ID: PRV-12345) not found in the API results."}
            </div>
          }>
            {(provider) => ( // Use render prop form for safety
              <div class={infoAlertClasses}> {/* Use info/error style */}
                <span class="i-carbon-warning-alt text-lg mr-2"></span>
                <span>
                  API Check Result for <strong>{provider().name || 'N/A'}</strong> (ID: {provider().id || 'N/A'}):
                  <br />
                  Government registered address is <code class="font-mono bg-red-100 px-1 rounded">{getAddressString(provider())}</code>.
                  <br />
                  Our database address is <code class="font-mono bg-red-100 px-1 rounded">{newAddress}</code>.
                  <br />Address mismatch, please contact the relevant authority (e.g., Health.gov.au on <a href="tel:1800020103" class="underline hover:text-gray-800">1800 020 103</a>) to update address.
                </span>
              </div>
            )}
          </Show>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            // Use secondary style
            class={`${secondaryButtonClasses} mt-6`}
          >
            <span class="i-carbon-reset mr-1"></span>
            Check Again / Reset
          </button>
        </Match>

      </Switch>

      {/* General Value Proposition */}
      <div class="mt-6 pt-4 border-t border-gray-200">
        {/* Use standard card heading style */}
        <h3 class={`${cardHeadingClasses} text-gray-800 mb-1`}>
          <span class="i-carbon-chart-line text-lg mr-2 text-green-600"></span>
          Value Proposition
        </h3>
        <p class="text-sm text-gray-600"> {/* Standard paragraph */}
          Automated checks via API reduce administrative overhead, minimize manual errors, and ensure provider information is consistent and up-to-date. Future API capabilities might allow direct updates, further streamlining compliance workflows.
        </p>
      </div>
    </section>
  );
}
