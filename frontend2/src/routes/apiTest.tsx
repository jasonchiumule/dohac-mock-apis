import { createSignal, Show, createMemo, createUniqueId, For } from 'solid-js';
import { Portal } from 'solid-js/web';

// --- Zag.js Imports ---
import * as select from "@zag-js/select";
import * as tooltip from "@zag-js/tooltip";
import { normalizeProps, useMachine } from "@zag-js/solid";

// Import ALL the API functions we want to test
import {
  fetchProviders,
  fetchHealthcareServices,
  fetchQuestionnaires,
  fetchRNAttendance,
  postQuestionnaireResponse,
} from '~/lib/api';

// Import necessary types for payload
import type { QuestionnaireResponse } from '~/lib/schema';

// --- Style Constants ---
const primaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
const formInputClasses = "block w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
const formLabelClasses = "block text-sm font-medium text-gray-700 mb-1";
const codeBlockClasses = "bg-gray-50 p-4 border border-gray-200 rounded-md overflow-x-auto text-sm font-mono";
const textareaClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
const sectionContainerClasses = "p-4 border border-gray-200 rounded-md bg-white shadow-sm mb-4";

// --- Select Component Styles ---
const selectTriggerClasses = "inline-flex justify-between w-full md:w-60 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
// UPDATED: Use border, match trigger width
const selectContentClasses = "absolute z-10 mt-1 w-full md:w-50 bg-white shadow-lg max-h-60 rounded-md py-1 text-base border border-gray-300 overflow-auto focus:outline-none sm:text-sm";
const selectItemClasses = "text-gray-900 cursor-default select-none relative py-2 pr-9 list-none";
const selectItemHighlightedClasses = "text-white bg-blue-600";
const selectItemTextClasses = "block truncate";
const selectItemIndicatorClasses = "absolute inset-y-0 right-0 flex items-center pr-4";

// --- Tooltip Styles ---
const tooltipTriggerButtonClasses = "inline-flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"; // ADDED: Styles for consistency
const tooltipContentClasses = "bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-50";

// --- Default JSON Payload for QuestionnaireResponse ---
const defaultQuestionnaireResponsePayload = JSON.stringify({
  resourceType: "QuestionnaireResponse",
  questionnaire: "QC-20230630",
  status: "completed",
  subject: {
    reference: "HealthcareService/SVC-54321",
    display: "Sunset Residential Care"
  },
  author: {
    "reference": "Organization/PRV-12345",
    "display": "Sunset Aged Care"
  },
  authored: new Date().toISOString(),
  item: [ /* ... payload items ... */]
}, null, 2);

// --- Backend Options ---
interface BackendOption {
  label: string;
  value: string;
}
const backendOptions: BackendOption[] = [
  { label: "Default (Go Proxy)", value: "/api" },
  { label: "Mulesoft Proxy", value: "https://dohac-accelerator-0ks4d8.yz4tr9-1.aus-s1.cloudhub.io/api" },
];

// --- API Call Definitions ---
type InputRequirement = 'orgId' | 'serviceId' | 'payload';
interface ApiCallDefinition {
  id: string; // Used as value for select
  label: string; // Used as display label for select
  description: string;
  type: 'GET' | 'POST';
  requiredInputs: InputRequirement[];
}

const apiCallDefinitions: ApiCallDefinition[] = [
  {
    id: 'fetchProviders',
    label: 'GET /api/Provider',
    description: 'Fetches a list of all provider Organizations.',
    type: 'GET',
    requiredInputs: [],
  },
  {
    id: 'fetchHealthcareServices',
    label: 'GET /HealthcareService',
    description: 'Fetches Healthcare Services associated with a specific Organization ID.',
    type: 'GET',
    requiredInputs: ['orgId'],
  },
  {
    id: 'fetchQuestionnaires',
    label: 'GET /api/Questionnaire',
    description: 'Fetches a list of available Questionnaires.',
    type: 'GET',
    requiredInputs: [],
  },
  {
    id: 'fetchRNAttendance',
    label: 'GET /api/RegisteredNurseAttendance',
    description: 'Fetches RN Attendance Observations for a specific Service ID.',
    type: 'GET',
    requiredInputs: ['serviceId'],
  },
  {
    id: 'postQuestionnaireResponse',
    label: 'POST /QuestionnaireResponse',
    description: 'Submits a new Questionnaire Response.',
    type: 'POST',
    requiredInputs: ['payload'],
  },
  // Add future API calls here
];

// Helper to create Zag.js compatible items from API definitions
const apiCallSelectOptions = apiCallDefinitions.map(def => ({
  label: def.label,
  value: def.id, // Use the unique id as the value
}));

export default function ApiTest() {
  // --- State ---
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [apiResult, setApiResult] = createSignal<any | null>(null);
  const [organizationIdInput, setOrganizationIdInput] = createSignal("PRV-12345");
  const [serviceIdInput, setServiceIdInput] = createSignal("SVC-54321");
  const [questionnaireResponsePayload, setQuestionnaireResponsePayload] = createSignal(defaultQuestionnaireResponsePayload);
  const [selectedBackendUrl, setSelectedBackendUrl] = createSignal<string>(backendOptions[0].value); // Default to Go Proxy
  const [selectedApiCallId, setSelectedApiCallId] = createSignal<string>(apiCallDefinitions[0].id); // Default to first API call ID

  // --- Backend Select State (Zag.js) ---
  const backendSelectService = useMachine(select.machine, {
    // Add context for proper initialization
    id: createUniqueId(),
    collection: select.collection({ items: backendOptions }),
    defaultValue: ["/api"],
    // selectedItems: [backendOptions.find(opt => opt.value === selectedBackendUrl())!], // Initialize with default
    onValueChange: (details) => {
      if (details.items.length > 0) {
        setSelectedBackendUrl(details.items[0].value);
        console.log("Backend selected:", details.items[0].value);
      }
    },

  });
  const backendSelectApi = createMemo(() => select.connect(backendSelectService, normalizeProps));

  // --- API Call Select State (Zag.js) --- NEW
  const apiCallSelectService = useMachine(select.machine, {
    // Add context for proper initialization
    id: createUniqueId(),
    collection: select.collection({ items: apiCallSelectOptions }),
    // selectedItems: [apiCallSelectOptions.find(opt => opt.value === selectedApiCallId())!], // Initialize with default
    defaultValue: ["fetchProviders"],
    onValueChange: (details) => {
      if (details.items.length > 0) {
        setSelectedApiCallId(details.items[0].value);
        console.log("API Call selected:", details.items[0].value);
      }
    },

  });
  const apiCallSelectApi = createMemo(() => select.connect(apiCallSelectService, normalizeProps));

  // --- Tooltip State (Zag.js) ---
  const tooltipService = useMachine(tooltip.machine, {
    // Add context for proper initialization
    id: createUniqueId(),
    openDelay: 300,
    closeDelay: 100,

  });
  const tooltipApi = createMemo(() => tooltip.connect(tooltipService, normalizeProps));

  // --- Derived State ---
  const selectedApiDefinition = createMemo(() => {
    return apiCallDefinitions.find(def => def.id === selectedApiCallId());
  });

  const selectedApiDescription = createMemo(() => {
    return selectedApiDefinition()?.description ?? "No API selected";
  });

  // --- API Handlers ---
  const handleApiCall = async (fetchFn: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    setApiResult(null);
    console.log(`Initiating API call to backend: ${selectedBackendUrl()}`);
    try {
      const data = await fetchFn();
      console.log("API call successful, data:", data);
      setApiResult(data);
    } catch (err: any) {
      const errorMessage = err.message || "An unknown error occurred";
      setError(errorMessage);
      console.error("API Call Failed:", err);
    } finally {
      console.log("API call finished.");
      setLoading(false);
    }
  };

  const handleSelectedApiRequest = () => {
    const definition = selectedApiDefinition();
    if (!definition) {
      setError("No valid API call selected.");
      return;
    }

    const backend = selectedBackendUrl();

    switch (definition.id) {
      case 'fetchProviders':
        handleApiCall(() => fetchProviders(backend));
        break;
      case 'fetchHealthcareServices':
        handleApiCall(() => fetchHealthcareServices(organizationIdInput(), backend));
        break;
      case 'fetchQuestionnaires':
        handleApiCall(() => fetchQuestionnaires(backend));
        break;
      case 'fetchRNAttendance':
        // Assuming the boolean flag is for `allHistory` or similar
        handleApiCall(() => fetchRNAttendance(serviceIdInput(), true, backend));
        break;
      case 'postQuestionnaireResponse':
        setError(null); // Clear previous errors specifically for POST
        setApiResult(null);
        setLoading(true); // Set loading immediately for POST before parsing
        try {
          const payloadObject: QuestionnaireResponse = JSON.parse(questionnaireResponsePayload());
          // JSON is valid, proceed with the generic handler
          handleApiCall(() => postQuestionnaireResponse(payloadObject, backend));
        } catch (e) {
          const errorMessage = `Invalid JSON payload: ${e instanceof Error ? e.message : String(e)}`;
          setError(errorMessage);
          console.error(errorMessage);
          setLoading(false); // Ensure loading is reset if JSON parse fails
        }
        break;
      default:
        setError(`API call definition not implemented: ${definition.id}`);
        console.error(`API call definition not implemented: ${definition.id}`);
    }
  };

  return (
    <>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">DOHAC Mock API Testbed</h1>

      {/* --- Configuration Section --- */}
      <div class={sectionContainerClasses}>
        <h2 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Configuration</h2>
        <div class="w-full md:w-auto">
          {/* Backend Select */}
          <label {...backendSelectApi().getLabelProps()} class={formLabelClasses}>
            Target Backend:
          </label>
          <div class="relative">
            <button {...backendSelectApi().getTriggerProps()} class={selectTriggerClasses} disabled={loading()}>
              {/* Display selected item label */}
              <span class={selectItemTextClasses}>{backendSelectApi().selectedItems.length > 0 ? backendSelectApi().selectedItems[0].label : 'Select Backend...'}</span>
              <span class="i-carbon-chevron-down ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true"></span>
            </button>

            <Show when={backendSelectApi().open}>
              <Portal>
                <div {...backendSelectApi().getPositionerProps()}>
                  <ul {...backendSelectApi().getContentProps()} class={selectContentClasses}>
                    <For each={backendOptions}>
                      {(item) => {
                        const itemProps = backendSelectApi().getItemProps({ item });
                        const itemState = backendSelectApi().getItemState({ item });
                        return (
                          <li
                            {...itemProps}
                            class={`${selectItemClasses} ${itemState.highlighted ? selectItemHighlightedClasses : ''}`}
                          >
                            <span class={`${selectItemTextClasses} ${itemState.selected ? 'font-semibold' : 'font-normal'}`}>
                              {item.label}
                            </span>
                            <Show when={itemState.selected}>
                              <span class={`${selectItemIndicatorClasses} ${itemState.highlighted ? 'text-white' : 'text-blue-600'}`}>
                                <span class="i-carbon-checkmark h-5 w-5" aria-hidden="true"></span>
                              </span>
                            </Show>
                          </li>
                        );
                      }}
                    </For>
                  </ul>
                </div>
              </Portal>
            </Show>
          </div>
        </div>
      </div>

      {/* --- API Call Section --- */}
      <div class={sectionContainerClasses}>
        <h2 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">API Call</h2>

        {/* API Select Dropdown & Info Tooltip */}
        {/* UPDATED: Use items-center for alignment, gap for spacing */}
        <div class="mb-4 flex items-center gap-2">
          <div class="flex-grow">
            {/* API Call Select (Zag.js) */}
            <label {...apiCallSelectApi().getLabelProps()} class={formLabelClasses}>
              Select API Call:
            </label>
            <div class="relative">
              <button {...apiCallSelectApi().getTriggerProps()} class={selectTriggerClasses} disabled={loading()}>
                {/* Display selected item label */}
                <span class={selectItemTextClasses}>{apiCallSelectApi().selectedItems.length > 0 ? apiCallSelectApi().selectedItems[0].label : 'Select API...'}</span>
                <span class="i-carbon-chevron-down ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true"></span>
              </button>

              <Show when={apiCallSelectApi().open}>
                <Portal>
                  <div {...apiCallSelectApi().getPositionerProps()}>
                    <ul {...apiCallSelectApi().getContentProps()} class={selectContentClasses}>
                      <For each={apiCallSelectOptions}>
                        {(item) => {
                          const itemProps = apiCallSelectApi().getItemProps({ item });
                          const itemState = apiCallSelectApi().getItemState({ item });
                          return (
                            <li
                              {...itemProps}
                              class={`${selectItemClasses} ${itemState.highlighted ? selectItemHighlightedClasses : ''}`}
                            >
                              <span class={`${selectItemTextClasses} ${itemState.selected ? 'font-semibold' : 'font-normal'}`}>
                                {item.label}
                              </span>
                              <Show when={itemState.selected}>
                                <span class={`${selectItemIndicatorClasses} ${itemState.highlighted ? 'text-white' : 'text-blue-600'}`}>
                                  <span class="i-carbon-checkmark h-5 w-5" aria-hidden="true"></span>
                                </span>
                              </Show>
                            </li>
                          );
                        }}
                      </For>
                    </ul>
                  </div>
                </Portal>
              </Show>
            </div>
          </div>

          {/* Tooltip Trigger (Information Icon) */}
          {/* UPDATED: Apply button styles, align with select */}
          <div class="self-end pb-[1px]"> {/* Adjust vertical alignment slightly */}
            <button {...tooltipApi().getTriggerProps()} class={tooltipTriggerButtonClasses} disabled={loading()}>
              <span class="i-carbon-information text-xl align-middle"></span>
            </button>
          </div>

          {/* Tooltip Content */}
          <Show when={tooltipApi().open}>
            <Portal>
              <div {...tooltipApi().getPositionerProps()}>
                <div {...tooltipApi().getContentProps()} class={tooltipContentClasses}>
                  {selectedApiDescription()}
                </div>
              </div>
            </Portal>
          </Show>
        </div>

        {/* Dynamic Input Fields Area */}
        <div class="mb-4 space-y-4">
          <Show when={selectedApiDefinition()?.requiredInputs.includes('orgId')}>
            <div>
              <label for="orgIdInput" class={formLabelClasses}>Organization ID:</label>
              <input
                id="orgIdInput"
                type="text"
                value={organizationIdInput()}
                onInput={(e) => setOrganizationIdInput(e.currentTarget.value)}
                disabled={loading()}
                class={formInputClasses}
                placeholder="e.g., PRV-12345"
              />
            </div>
          </Show>
          <Show when={selectedApiDefinition()?.requiredInputs.includes('serviceId')}>
            <div>
              <label for="serviceIdInput" class={formLabelClasses}>Service ID:</label>
              <input
                id="serviceIdInput"
                type="text"
                value={serviceIdInput()}
                onInput={(e) => setServiceIdInput(e.currentTarget.value)}
                disabled={loading()}
                class={formInputClasses}
                placeholder="e.g., SVC-54321"
              />
            </div>
          </Show>
          <Show when={selectedApiDefinition()?.requiredInputs.includes('payload')}>
            <div>
              <label for="qrPayload" class={formLabelClasses}>
                {selectedApiDefinition()?.label} JSON Payload:
              </label>
              <textarea
                id="qrPayload"
                rows="15"
                class={textareaClasses}
                value={questionnaireResponsePayload()}
                onInput={(e) => setQuestionnaireResponsePayload(e.currentTarget.value)}
                disabled={loading()}
                placeholder="Enter valid JSON payload here..."
              />
              <p class="mt-1 text-xs text-gray-500">Ensure this is valid JSON for the selected request type.</p>
            </div>
          </Show>
        </div>

        {/* Unified Fetch Button */}
        <div>
          <button onClick={handleSelectedApiRequest} disabled={loading()} class={`${primaryButtonClasses} w-full sm:w-auto`}>
            <span class="i-carbon-send mr-2"></span>
            Send Request ({selectedApiDefinition()?.type})
          </button>
        </div>
      </div>

      {/* --- Unified Display Area --- */}
      <div class="api-result-display space-y-2 mb-4">
        <h2 class="text-xl font-semibold text-gray-800">API Result / Status</h2>
        <div class="min-h-40 p-4 border border-gray-200 rounded-md bg-white shadow-sm">
          <Show when={loading()}>
            <p class="text-sm text-gray-600 flex items-center">
              <span class="i-carbon-circle-dash animate-spin mr-2 text-blue-600 text-lg"></span>
              Loading...
            </p>
          </Show>
          <Show when={error()}>
            <p class="text-sm text-red-600 font-medium break-words">
              <span class="i-carbon-warning-alt mr-2 align-middle"></span>
              <span class="font-bold">Error:</span> {error()}
            </p>
          </Show>
          <Show when={apiResult() && !loading() && !error()}>
            <h3 class="text-sm font-medium text-green-700 mb-2">Success:</h3>
            <pre class={codeBlockClasses}>
              <code>{JSON.stringify(apiResult(), null, 2)}</code>
            </pre>
          </Show>
          <Show when={!apiResult() && !loading() && !error()}>
            <p class="text-sm text-gray-500 italic">Select a backend and API call, fill required inputs, then click 'Send Request'.</p>
          </Show>
        </div>
      </div>
    </>
  );
}
