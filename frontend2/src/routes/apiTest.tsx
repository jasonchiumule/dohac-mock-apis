import { createSignal, Show, createMemo, createUniqueId } from 'solid-js';

// --- Zag.js Imports ---
import * as accordion from "@zag-js/accordion";
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
const primaryButtonClasses = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"; // Added justify-center for consistent text align
// MODIFIED: Kept w-full for mobile, md:w-36 for desktop
const formInputClasses = "block w-9/10 md:w-36 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
const formLabelClasses = "block text-sm font-medium text-gray-700 mb-1";
const codeBlockClasses = "bg-gray-50 p-4 border border-gray-200 rounded-md overflow-x-auto text-sm font-mono";
const textareaClasses = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

// --- Container Style (Shared by GET and POST) ---
const sectionContainerClasses = "p-4 border border-gray-200 rounded-md bg-white shadow-sm";

// --- Accordion Style Constants (Updated) ---
const accordionTriggerClasses = "w-full flex justify-between items-center text-left text-lg  text-gray-700 border-gray-200 bg-white border-1 rounded-sm font-sans";
const accordionContentClasses = "pt-4 pb-4 text-sm text-gray-600 space-y-3";

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


export default function ApiTest() {
  // --- State ---
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [apiResult, setApiResult] = createSignal<any | null>(null);
  const [organizationIdInput, setOrganizationIdInput] = createSignal("PRV-12345");
  const [serviceIdInput, setServiceIdInput] = createSignal("SVC-54321");
  const [questionnaireResponsePayload, setQuestionnaireResponsePayload] = createSignal(defaultQuestionnaireResponsePayload);

  // --- Accordion State ---
  const accordionService = useMachine(accordion.machine, {
    id: createUniqueId(),
    collapsible: true,
  });
  const postAccordionApi = createMemo(() => accordion.connect(accordionService, normalizeProps));

  // --- API Handlers ---
  const handleApiCall = async (fetchFn: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    setApiResult(null);
    console.log("Initiating API call...");
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
  const handleFetchProviders = () => handleApiCall(fetchProviders);
  const handleFetchHealthcareServices = () => handleApiCall(() => fetchHealthcareServices(organizationIdInput()));
  const handleFetchQuestionnaires = () => handleApiCall(fetchQuestionnaires);
  const handleFetchRNAttendance = () => handleApiCall(() => fetchRNAttendance(serviceIdInput()));
  const handlePostQuestionnaireResponse = () => {
    setError(null);
    setApiResult(null);
    try {
      const payloadObject: QuestionnaireResponse = JSON.parse(questionnaireResponsePayload());
      handleApiCall(() => postQuestionnaireResponse(payloadObject));
    } catch (e) {
      const errorMessage = `Invalid JSON payload: ${e instanceof Error ? e.message : String(e)}`;
      setError(errorMessage);
      console.error(errorMessage);
      setLoading(false); // Ensure loading is false on parse error
    }
  };


  return (
    <>
      <h1 class="text-2xl font-bold text-gray-800">DOHAC Mock API Testbed</h1>

      {/* --- API Call Controls (GET) --- */}
      <div class={sectionContainerClasses}>
        <h2 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">GET Requests</h2>
        <div class="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:gap-x-6 md:gap-y-4">
          {/* Fetch Providers */}
          <div class="flex flex-col">
            <span class={formLabelClasses}>Providers:</span>
            {/* Added w-full sm:w-auto to this button for consistency on small screens */}
            <button onClick={handleFetchProviders} disabled={loading()} class={`${primaryButtonClasses} w-full sm:w-auto`}>
              <span class="i-carbon-building mr-2"></span>
              Fetch Providers
            </button>
          </div>

          {/* Fetch Healthcare Services */}
          <div class="flex flex-col sm:flex-row sm:items-end gap-2">
            {/* MODIFIED: Removed flex-grow from this div */}
            <div>
              <label for="orgId" class={formLabelClasses}>Org ID:</label>
              <input
                id="orgId"
                type="text"
                value={organizationIdInput()}
                onInput={(e) => setOrganizationIdInput(e.currentTarget.value)}
                disabled={loading()}
                class={formInputClasses} // Has w-full md:w-36
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
            {/* Added w-full sm:w-auto to this button for consistency on small screens */}
            <button onClick={handleFetchQuestionnaires} disabled={loading()} class={`${primaryButtonClasses} w-full sm:w-auto`}>
              <span class="i-carbon-result mr-2"></span>
              Fetch Questionnaires
            </button>
          </div>

          {/* Fetch RN Attendance */}
          <div class="flex flex-col sm:flex-row sm:items-end gap-2">
            {/* MODIFIED: Removed flex-grow from this div */}
            <div>
              <label for="serviceId" class={formLabelClasses}>Service ID:</label>
              <input
                id="serviceId"
                type="text"
                value={serviceIdInput()}
                onInput={(e) => setServiceIdInput(e.currentTarget.value)}
                disabled={loading()}
                class={formInputClasses} // Has w-full md:w-36
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
      <div class="api-result-display space-y-2">
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
            <p class="text-sm text-gray-500 italic">Click a button above or expand and click 'Post' to make an API call.</p>
          </Show>
        </div>
      </div>
    </>
  );
}
