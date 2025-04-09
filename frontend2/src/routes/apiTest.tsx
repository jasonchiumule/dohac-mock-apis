import { createSignal, Show, createMemo, createUniqueId, For } from 'solid-js';
import { Portal } from 'solid-js/web';

// --- Zag.js Imports ---
import * as accordion from "@zag-js/accordion";
import * as select from "@zag-js/select";
import { normalizeProps, useMachine } from "@zag-js/solid";
// import type { ValueChangeDetails as SelectValueChangeDetails } from "@zag-js/select"; // Import details type

// Import ALL the API functions we want to test
import {
  fetchProviders,
  fetchHealthcareServices,
  fetchQuestionnaires,
  fetchRNAttendance,
  postQuestionnaireResponse,
  // patchNurseAttendance, // Make sure patchNurseAttendance is imported if used later
} from '~/lib/api';

// Import necessary types for payload
import type { QuestionnaireResponse } from '~/lib/schema';

// --- Style Constants ---
const primaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
const formInputClasses = "block w-9/10 md:w-36 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
const formLabelClasses = "block text-sm font-medium text-gray-700 mb-1";
const codeBlockClasses = "bg-gray-50 p-4 border border-gray-200 rounded-md overflow-x-auto text-sm font-mono";
const textareaClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

// --- Container Style (Shared by GET and POST) ---
const sectionContainerClasses = "p-4 border border-gray-200 rounded-md bg-white shadow-sm mb-4";

// --- Accordion Style Constants (Updated) ---
const accordionTriggerClasses = "w-full flex justify-between items-center text-left text-lg text-gray-700 border-gray-200 bg-white border-1 rounded-sm font-sans";
const accordionContentClasses = "pt-4 pb-4 text-sm text-gray-600 space-y-3";

// --- Select Style Constants ---
const selectTriggerClasses = "inline-flex justify-between w-full md:w-60 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
const selectContentClasses = "absolute z-10 mt-1 w-full md:w-60 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm";
const selectItemClasses = "text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9";
const selectItemHighlightedClasses = "text-white bg-blue-600";
const selectItemTextClasses = "block truncate";
const selectItemIndicatorClasses = "absolute inset-y-0 right-0 flex items-center pr-4";

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

export default function ApiTest() {
  // --- State ---
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [apiResult, setApiResult] = createSignal<any | null>(null);
  const [organizationIdInput, setOrganizationIdInput] = createSignal("PRV-12345");
  const [serviceIdInput, setServiceIdInput] = createSignal("SVC-54321");
  const [questionnaireResponsePayload, setQuestionnaireResponsePayload] = createSignal(defaultQuestionnaireResponsePayload);
  const [selectedBackendUrl, setSelectedBackendUrl] = createSignal<string>(backendOptions[0].value); // Default to Go Proxy

  // --- Backend Select State (Zag.js) ---
  // const selectCollection = createMemo(() =>
  //   select.collection({
  //     items: backendOptions,
  //     itemToString: (item) => item.label,
  //     itemToValue: (item) => item.value,
  //   })
  // );

  // FIX 1: useMachine returns the service directly
  // FIX 2: Pass options directly, not in `context`
  // FIX 3: Type `details` in onValueChange
  const selectService = useMachine(select.machine, {
    // collection: selectCollection(),
    id: createUniqueId(),
    collection: select.collection({
      items: backendOptions
    }
    ),
    defaultValue: ["/api"],
    // name: "backend-select",
    // defaultValue: [selectedBackendUrl()], // Initialize with the default backend URL
    // closeOnSelect: true,
    onValueChange: (details) => { // Explicitly type details
      if (details.value.length > 0) {
        setSelectedBackendUrl(details.value[0]);
        console.log("Backend selected:", details.value[0]);
      }
    },
  });
  const selectApi = createMemo(() => select.connect(selectService, normalizeProps));

  // --- Accordion State ---
  // FIX 1 & 2 applied here too
  const postAccordionService = useMachine(accordion.machine, {
    id: createUniqueId(),
    collapsible: true,
  });
  const postAccordionApi = createMemo(() => accordion.connect(postAccordionService, normalizeProps));

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

  const handleFetchProviders = () => handleApiCall(() => fetchProviders(selectedBackendUrl()));
  const handleFetchHealthcareServices = () => handleApiCall(() => fetchHealthcareServices(organizationIdInput(), selectedBackendUrl()));
  const handleFetchQuestionnaires = () => handleApiCall(() => fetchQuestionnaires(selectedBackendUrl()));
  const handleFetchRNAttendance = () => handleApiCall(() => fetchRNAttendance(serviceIdInput(), true, selectedBackendUrl()));
  const handlePostQuestionnaireResponse = () => {
    setError(null);
    setApiResult(null);
    try {
      const payloadObject: QuestionnaireResponse = JSON.parse(questionnaireResponsePayload());
      handleApiCall(() => postQuestionnaireResponse(payloadObject, selectedBackendUrl()));
    } catch (e) {
      const errorMessage = `Invalid JSON payload: ${e instanceof Error ? e.message : String(e)}`;
      setError(errorMessage);
      console.error(errorMessage);
      setLoading(false);
    }
  };

  // const selectedBackendLabel = createMemo(() => {
  //   const selectedValue = selectApi().valueAsString;
  //   const option = backendOptions.find(opt => opt.value === selectedValue);
  //   return option ? option.label : "Select Backend...";
  // });

  return (
    <>
      <h1 class="text-2xl font-bold text-gray-800 mb-6">DOHAC Mock API Testbed</h1>

      {/* --- Configuration Section --- */}
      <div class={sectionContainerClasses}>
        <h2 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Configuration</h2>
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div class="w-full md:w-auto">
            <label {...selectApi().getLabelProps()} class={formLabelClasses}>
              Target Backend:
            </label>
            <div class="relative">
              <button {...selectApi().getTriggerProps()} class={selectTriggerClasses} disabled={loading()}>
                <span class={selectItemTextClasses}>{selectApi().valueAsString}</span>
                <span class="i-carbon-chevron-down ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true"></span>
              </button>

              {/* FIX 4: Use `open` instead of `isOpen` */}
              <Show when={selectApi().open}>
                <Portal>
                  <div {...selectApi().getPositionerProps()}>
                    <ul {...selectApi().getContentProps()} class={selectContentClasses}>
                      <For each={backendOptions}>
                        {(item) => {
                          const itemState = selectApi().getItemState({ item });
                          return (
                            <li
                              {...selectApi().getItemProps({ item })}
                              // FIX 5: Use `highlighted` instead of `isHighlighted`
                              // FIX 6: Use `selected` instead of `isSelected`
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
      </div>

      {/* --- API Call Controls (GET) --- */}
      <div class={sectionContainerClasses}>
        <h2 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">GET Requests</h2>
        <div class="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:gap-x-6 md:gap-y-4">
          {/* Fetch Providers */}
          <div class="flex flex-col">
            <span class={formLabelClasses}>Providers:</span>
            <button onClick={handleFetchProviders} disabled={loading()} class={`${primaryButtonClasses} w-full sm:w-auto`}>
              <span class="i-carbon-building mr-2"></span>
              Fetch Providers
            </button>
          </div>

          {/* Fetch Healthcare Services */}
          <div class="flex flex-col sm:flex-row sm:items-end gap-2">
            <div>
              <label for="orgId" class={formLabelClasses}>Org ID:</label>
              <input
                id="orgId"
                type="text"
                value={organizationIdInput()}
                onInput={(e) => setOrganizationIdInput(e.currentTarget.value)}
                disabled={loading()}
                class={formInputClasses}
              />
            </div>
            <button onClick={handleFetchHealthcareServices} disabled={loading()} class={`${primaryButtonClasses} w-full sm:w-auto`}>
              <span class="i-carbon-cloud-services mr-2"></span>
              Fetch Services
            </button>
          </div>

          {/* Fetch Questionnaires */}
          <div class="flex flex-col">
            <span class={formLabelClasses}>Questionnaires:</span>
            <button onClick={handleFetchQuestionnaires} disabled={loading()} class={`${primaryButtonClasses} w-full sm:w-auto`}>
              <span class="i-carbon-result mr-2"></span>
              Fetch Questionnaires
            </button>
          </div>

          {/* Fetch RN Attendance */}
          <div class="flex flex-col sm:flex-row sm:items-end gap-2">
            <div>
              <label for="serviceId" class={formLabelClasses}>Service ID:</label>
              <input
                id="serviceId"
                type="text"
                value={serviceIdInput()}
                onInput={(e) => setServiceIdInput(e.currentTarget.value)}
                disabled={loading()}
                class={formInputClasses}
              />
            </div>
            <button onClick={handleFetchRNAttendance} disabled={loading()} class={`${primaryButtonClasses} w-full sm:w-auto`}>
              <span class="i-carbon-user-follow mr-2"></span>
              Fetch RN Attendance
            </button>
          </div>
        </div>
      </div>

      {/* --- POST QuestionnaireResponse Section (Accordion) --- */}
      <div class={sectionContainerClasses}>
        <div {...postAccordionApi().getRootProps()}>
          <div {...postAccordionApi().getItemProps({ value: "post-request" })}>
            <h3>
              <button {...postAccordionApi().getItemTriggerProps({ value: "post-request" })} class={accordionTriggerClasses}>
                <span>POST /QuestionnaireResponse</span>
                <span class="i-carbon-chevron-down transition-transform duration-200"
                  classList={{ "rotate-180": postAccordionApi().value.includes("post-request") }}
                ></span>
              </button>
            </h3>
            <div {...postAccordionApi().getItemContentProps({ value: "post-request" })} class={accordionContentClasses}>
              <div>
                <label for="qrPayload" class={formLabelClasses}>
                  QuestionnaireResponse JSON Payload:
                </label>
                <textarea
                  id="qrPayload"
                  rows="15"
                  class={textareaClasses}
                  value={questionnaireResponsePayload()}
                  onInput={(e) => setQuestionnaireResponsePayload(e.currentTarget.value)}
                  disabled={loading()}
                  placeholder="Enter QuestionnaireResponse JSON here..."
                />
                <p class="mt-1 text-xs text-gray-500">Ensure this is valid JSON matching the QuestionnaireResponse schema.</p>
              </div>
              <button onClick={handlePostQuestionnaireResponse} disabled={loading()} class={primaryButtonClasses}>
                <span class="i-carbon-send mr-2"></span>
                Post Questionnaire Response
              </button>
            </div> {/* End Accordion Content */}
          </div> {/* End Accordion Item */}
        </div> {/* End Accordion Root */}
      </div> {/* End Section Container for POST */}


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
            <p class="text-sm text-gray-500 italic">Select a backend, then click a button above or expand and click 'Post' to make an API call.</p>
          </Show>
        </div>
      </div>
    </>
  );
}
