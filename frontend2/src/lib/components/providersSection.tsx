import { createSignal, Show, Switch, Match, createEffect, on } from 'solid-js'; // Added createEffect, on
import type { Organization } from '~/lib/schema';
import { fetchProviders } from '~/lib/api';

// Helper function
const getAddressString = (org: Organization | undefined): string => {
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
const secondaryButtonClasses = "inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";
const errorAlertClasses = "mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm flex items-center";
const warningAlertClasses = "mt-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-700 rounded-md text-sm flex items-center";
const infoAlertClasses = "mt-4 p-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-md text-sm flex items-center"; // Updated for neutral info
const sectionCardClasses = "p-6 bg-white rounded-lg border border-gray-200";
const headingClasses = "text-xl font-semibold text-gray-800 mb-4 flex items-center";
const subHeadingClasses = "text-lg font-medium text-gray-700 mb-2";
const paragraphClasses = "text-sm text-gray-600 mb-4";
const beforeCardClasses = "border border-gray-200 p-4 rounded-md bg-gray-50";
const afterCardClasses = "border border-blue-200 p-4 rounded-md bg-green-50";
const cardHeadingClasses = "text-md font-semibold text-gray-700 mb-2 flex items-center";
const listClasses = "list-disc list-inside text-sm text-gray-600 space-y-1";
const afterListClasses = "list-disc list-inside text-sm text-green-700 space-y-1";

export default function ProviderInfoSection() {
  // --- State Management ---
  const [providerCheckState, setProviderCheckState] = createSignal<ProviderCheckState>('initial');
  const [providerError, setProviderError] = createSignal<string | null>(null);
  const [providerData, setProviderData] = createSignal<Organization[] | null>(null);
  const targetProvider = () => providerData()?.find(p => p.id === "PRV-12345");

  // Ref for scrolling
  let sectionRef: HTMLElement | undefined;

  // --- Event Handlers ---
  const handleCheckProviderAddress = async () => {
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
        setProviderCheckState('checked'); // Still 'checked' but data might be empty
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
    // Optionally scroll to top on reset as well
    sectionRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Effect for scrolling after state changes
  createEffect(on(providerCheckState, (currentState) => {
    // Scroll when state becomes 'checked' or 'error' (after loading finishes)
    if (currentState === 'checked' || currentState === 'error') {
      // Add a slight delay to ensure the content is rendered before scrolling
      setTimeout(() => {
        sectionRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50); // Small delay
    }
  }));


  return (
    // Assign ref to the main section element
    <section ref={sectionRef} class={sectionCardClasses}>
      <h2 class={headingClasses}>
        <span class="i-carbon-connect text-2xl mr-2 text-blue-600"></span> {/* Icon changed */}
        Provider ID Discovery & API Access {/* Text changed */}
      </h2>

      <Switch>
        {/* State: Initial / Error / Loading */}
        <Match when={providerCheckState() === 'initial' || providerCheckState() === 'error' || providerCheckState() === 'loading'}>
          <div class="grid md:grid-cols-2 gap-6">
            {/* Before (Manual Process Description) */}
            <div>
              <h3 class={subHeadingClasses}>Previous Method: Manual ID Lookup</h3> {/* Heading changed */}
              <p class={paragraphClasses}>
                Previously, identifying the correct Provider ID for API integration required manual searches across various systems or documentation. This could be error-prone and delay the process of interacting with provider-specific APIs. {/* Paragraph changed */}
              </p>
              {/* The paragraph displaying newAddress (previously here) is removed. */}
            </div>

            {/* Action Area */}
            <div>
              <h3 class={subHeadingClasses}>Automated Provider ID Retrieval</h3> {/* Heading changed */}
              <button
                onClick={handleCheckProviderAddress}
                disabled={providerCheckState() === 'loading'}
                class={primaryButtonClasses}
              >
                <span class={providerCheckState() === 'loading' ? "i-carbon-circle-dash animate-spin mr-2" : "i-carbon-search mr-2"}></span>
                {providerCheckState() === 'loading' ? 'Fetching ID...' : 'Fetch Provider ID via API'} {/* Text changed */}
              </button>

              {/* Error message shown here if state is 'error' */}
              <Show when={providerCheckState() === 'error' && providerError()}>
                <div class={errorAlertClasses}>
                  <span class="i-carbon-warning-alt text-lg mr-2"></span>
                  Error: {providerError()}
                </div>
              </Show>
            </div>
          </div>
        </Match>

        {/* State: Checked (API Call Successful or Errored - content below handles error display) */}
        <Match when={providerCheckState() === 'checked'}>
          {/* Results area - will be scrolled into view */}
          <h3 class={`${subHeadingClasses} mb-3`}>Provider ID Retrieval Results</h3> {/* Heading changed */}
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            {/* Before */}
            <div class={beforeCardClasses}>
              <h4 class={cardHeadingClasses}>
                <span class="i-carbon-time text-red-500 mr-2"></span>
                Manual ID Lookup (Before) {/* Heading changed */}
              </h4>
              <ul class={listClasses}>
                <li>Manually search portals or documents for Provider IDs</li> {/* Item changed */}
                <li>Risk of using incorrect or outdated IDs</li> {/* Item changed */}
                <li>Time spent on lookup instead of API integration</li> {/* Item changed */}
                <li>Potential delays in accessing necessary API endpoints</li> {/* Item added */}
              </ul>
            </div>
            {/* After */}
            <div class={afterCardClasses}>
              <h4 class={`${cardHeadingClasses} text-blue-800`}>
                <span class="i-carbon-flash text-green-700 mr-2"></span>
                API-Driven ID Retrieval (After) {/* Heading changed */}
              </h4>
              <ul class={afterListClasses}>
                <li>Single button click to fetch the Provider ID</li> {/* Item changed */}
                <li>Instant retrieval of the required ID for API calls</li> {/* Item changed */}
                <li>Ensures correct ID is used for targeted API interactions</li> {/* Item changed */}
                <li class="font-semibold">Enables streamlined API integration</li> {/* Item changed */}
                <li>Reduces setup time for API-dependent workflows</li> {/* Item added */}
                <li>Foundation for automated provider-specific processes</li> {/* Item added */}
              </ul>
            </div>
          </div>

          {/* Specific Provider Result Alert */}
          <Show when={targetProvider()} fallback={
            <div class={warningAlertClasses}>
              <span class="i-carbon-warning text-lg mr-2"></span>
              {providerData() === null ? "Loading provider data..." : providerData()?.length === 0 ? "API returned no provider data." : "Target provider (ID: PRV-12345) not found. Unable to retrieve ID."} {/* Text changed */}
            </div>
          }>
            {(provider) => (
              <div class={infoAlertClasses}> {/* Style will now be blue-themed via updated infoAlertClasses */}
                <span class="i-carbon-information text-lg mr-2"></span> {/* Icon changed to information */}
                <span>
                  API Call Successful for <strong>{provider().name || 'N/A'}</strong> (ID: {provider().id || 'N/A'}):
                  <br />
                  Provider ID <code class="font-mono bg-blue-100 px-1 rounded">{provider().id || 'N/A'}</code> has been retrieved.
                  <br />
                  This ID is required for subsequent API interactions with this provider.
                  <br />
                  Registered Address (for reference): <code class="font-mono bg-gray-100 px-1 rounded">{getAddressString(provider())}</code>.
                  {/* Address mismatch and contact authority lines removed */}
                </span>
              </div>
            )}
          </Show>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            class={`${secondaryButtonClasses} mt-6`}
          >
            <span class="i-carbon-reset mr-1"></span>
            Fetch Again / Reset {/* Text changed */}
          </button>
        </Match>
      </Switch>

      {/* General Value Proposition */}
      <div class="mt-6 pt-4 border-t border-gray-200">
        <h3 class={`${cardHeadingClasses} text-gray-800 mb-1`}>
          <span class="i-carbon-api text-lg mr-2 text-green-600"></span> {/* Icon changed */}
          Streamlined API Access {/* Heading changed */}
        </h3>
        <p class="text-sm text-gray-600">
          Automated Provider ID retrieval is the first step towards seamless integration with provider-specific APIs. This ensures that your system can accurately target and communicate with the correct provider, enabling a wide range of automated workflows and data exchange capabilities. {/* Paragraph changed */}
        </p>
      </div>
    </section>
  );
}