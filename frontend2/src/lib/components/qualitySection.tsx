import { createSignal, Show, For, Switch, Match } from 'solid-js';
import type { Questionnaire, QuestionnaireResponse } from '~/lib/schema';
import { fetchQuestionnaires, postQuestionnaireResponse } from '~/lib/api';

// --- Style Constants --- (Re-declared for clarity, could be shared)
const primaryPurpleButtonClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed";
const primaryGreenButtonClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed";
const secondaryButtonClasses = "inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";
const errorAlertClasses = "mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm flex items-center";
const successAlertClasses = "p-4 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm flex items-center mb-6"; // Added mb-6 here
const sectionCardClasses = "p-6 bg-white rounded-lg border border-gray-200"; // Flat card style
const headingClasses = "text-xl font-semibold text-gray-800 mb-4 flex items-center";
const subHeadingClasses = "text-lg font-medium text-gray-700 mb-3"; // Darker subheading
const paragraphClasses = "text-sm text-gray-600 mb-4"; // Standard paragraph
const formInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"; // Flat input, lighter disabled bg
const formLabelClasses = "block text-sm font-medium text-gray-700 mb-1";
const beforeCardClasses = "border border-gray-200 p-4 rounded-md bg-gray-50";
const afterCardClassesGreen = "border border-green-200 p-4 rounded-md bg-green-50"; // Use green theme border
const cardHeadingClasses = "text-md font-semibold text-gray-700 mb-2 flex items-center"; // Consistent card headings
const listClasses = "list-disc list-inside text-sm text-gray-600 space-y-1";
const afterListClassesGreen = "list-disc list-inside text-sm text-green-700 space-y-1"; // Green theme color list text

export default function QualityIndicatorsSection() {
  // --- Quality Indicator State ---
  const [qiState, setQiState] = createSignal<'initial' | 'loadingForm' | 'formVisible' | 'submitting' | 'submitted'>('initial');
  const [qiLoadingError, setQiLoadingError] = createSignal<string | null>(null);
  const [qiSubmitError, setQiSubmitError] = createSignal<string | null>(null);
  const [questionnaire, setQuestionnaire] = createSignal<Questionnaire | null>(null);
  // State holds form values as strings, as they come from input elements
  const [formAnswers, setFormAnswers] = createSignal<Record<string, string>>({});

  // --- Event Handlers ---
  const handleLoadQuestionnaire = async () => {
    setQiState('loadingForm');
    setQiLoadingError(null);
    setQuestionnaire(null);
    setFormAnswers({});
    try {
      const data = await fetchQuestionnaires();
      if (data && data.length > 0) {
        const loadedQuestionnaire = data[0];
        setQuestionnaire(loadedQuestionnaire);
        // Initialize all answers as empty strings
        const initialAnswers: Record<string, string> = {};
        loadedQuestionnaire.item?.forEach(group => {
          group.item?.forEach(item => {
            // Initialize with empty string regardless of type or required status
            initialAnswers[item.linkId] = '';
          });
        });
        setFormAnswers(initialAnswers);
        setQiState('formVisible');
      } else {
        throw new Error("No questionnaires found.");
      }
    } catch (err: any) {
      setQiLoadingError(err.message || "Failed to load questionnaire.");
      setQiState('initial');
    }
  };

  const handleInputChange = (linkId: string, value: string) => {
    // Store input value directly as string
    setFormAnswers(prev => ({ ...prev, [linkId]: value }));
  };

  const handleSubmitQIResponse = async () => {
    const currentQuestionnaire = questionnaire();
    if (!currentQuestionnaire) return; // Should not happen in 'formVisible' state, but good check
    setQiState('submitting');
    setQiSubmitError(null);

    // --- PAYLOAD CONSTRUCTION (VALIDATION SKIPPED) ---
    // Construct the response payload directly from the current formAnswers state.
    // No validation (e.g., required fields, numeric checks) is performed here.
    // The raw string values from the form inputs (including empty strings) are sent.
    const responsePayload: QuestionnaireResponse = {
      resourceType: 'QuestionnaireResponse',
      questionnaire: `Questionnaire/${currentQuestionnaire.id}`,
      status: 'completed',
      subject: { reference: "HealthcareService/SVC-54321", display: "Sunset Residential Care" },
      author: { reference: "Organization/PRV-12345", display: "Sunset Aged Care" },
      item: currentQuestionnaire.item?.map(groupItem => ({
        linkId: groupItem.linkId,
        text: groupItem.text,
        item: groupItem.item?.map(qItem => {
          // Get the raw string value from the form state, default to empty string if missing
          const answerValue = formAnswers()[qItem.linkId] ?? '';

          // Directly use the string value in valueString, regardless of the question type or content.
          const answerField = { valueString: answerValue };

          return {
            linkId: qItem.linkId,
            text: qItem.text,
            // Always include the answer array with the valueString field, even if the string is empty.
            answer: [answerField]
          };
        }) ?? [] // Handle case where a group might have no items
      })) ?? [] // Handle case where questionnaire might have no groups
    };
    // --- END PAYLOAD CONSTRUCTION ---

    console.log("Submitting Payload (Validation Skipped):", JSON.stringify(responsePayload, null, 2)); // Log payload for debugging

    try {
      await postQuestionnaireResponse(responsePayload);
      setQiState('submitted');
    } catch (err: any) {
      setQiSubmitError(err.message || "Failed to submit response.");
      setQiState('formVisible'); // Go back to form on error
    }
  };

  return (
    <section class={sectionCardClasses}>
      <h2 class={headingClasses}>
        <span class="i-carbon-result text-2xl mr-2 text-purple-600"></span>
        Quality Indicators (QI) Reporting
      </h2>

      <Switch>
        {/* State A: Initial */}
        <Match when={qiState() === 'initial' || qiState() === 'loadingForm'}>
          <p class={paragraphClasses}>
            Manual QI reporting involves tedious data collection, calculation, and portal entry each quarter.
          </p>
          <button
            onClick={handleLoadQuestionnaire}
            disabled={qiState() === 'loadingForm'}
            class={primaryPurpleButtonClasses}
          >
            <span class={qiState() === 'loadingForm' ? "i-carbon-circle-dash animate-spin mr-2" : "i-carbon-download mr-2"}></span>
            {qiState() === 'loadingForm' ? 'Loading...' : 'Load Current QI Questionnaire'}
          </button>
          <Show when={qiLoadingError()}>
            <div class={errorAlertClasses}>
              <span class="i-carbon-warning-alt text-lg mr-2"></span>
              Error loading questionnaire: {qiLoadingError()}
            </div>
          </Show>
        </Match>

        {/* State B: Form Visible */}
        <Match when={qiState() === 'formVisible' || qiState() === 'submitting'}>
          <Show when={questionnaire()} fallback={<p class={paragraphClasses}>Loading form...</p>}>
            {(q) => (
              <>
                <h3 class={subHeadingClasses}>{q().title}</h3>
                <p class={paragraphClasses}>
                  Enter any data below. Input validation is skipped for this demonstration, and the API allows direct submission regardless of content.
                </p>
                {/* Use onSubmit on the form, but the handler doesn't validate */}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmitQIResponse(); }}>
                  <For each={q().item}>
                    {(group) => (
                      <div class="space-y-4 border border-gray-100 p-4 rounded-md mb-6 bg-white">
                        <h4 class={cardHeadingClasses}>{group.text}</h4>
                        <For each={group.item}>
                          {(item) => (
                            <div>
                              <label for={item.linkId} class={formLabelClasses}>
                                {item.text}
                                {/* Keep visual cue for required, but doesn't block submission */}
                                {item.required ? <span class="text-gray-400 ml-1 text-xs">(Required in spec)</span> : ''}
                              </label>
                              <input
                                // Use type="number" for UX hints, but value is handled as string
                                type={item.type === 'integer' || item.type === 'decimal' ? 'number' : 'text'}
                                id={item.linkId}
                                name={item.linkId}
                                value={formAnswers()[item.linkId] ?? ''} // Access string value
                                onInput={(e) => handleInputChange(item.linkId, e.currentTarget.value)}
                                // Remove the browser-level `required` attribute to prevent its blocking behavior
                                // required={item.required} // REMOVED
                                class={formInputClasses}
                                disabled={qiState() === 'submitting'}
                                step={item.type === 'decimal' ? 'any' : '1'} // Allow decimals in number input
                                placeholder={item.type === 'integer' || item.type === 'decimal' ? 'e.g., 123' : 'e.g., Text'}
                              />
                            </div>
                          )}
                        </For>
                      </div>
                    )}
                  </For>

                  <Show when={qiSubmitError()}>
                    <div class={`${errorAlertClasses} mb-4 mt-0`}>
                      <span class="i-carbon-warning-alt text-lg mr-2"></span>
                      Error submitting: {qiSubmitError()}
                    </div>
                  </Show>

                  <button
                    type="submit" // Keep as submit type
                    disabled={qiState() === 'submitting'}
                    class={primaryGreenButtonClasses} // Green for submit
                  >
                    <span class={qiState() === 'submitting' ? "i-carbon-circle-dash animate-spin mr-2" : "i-carbon-send-alt mr-2"}></span>
                    {qiState() === 'submitting' ? 'Submitting...' : 'Submit QI Response via API'}
                  </button>
                </form>
              </>
            )}
          </Show>
        </Match>

        {/* State C: Submitted */}
        <Match when={qiState() === 'submitted'}>
          <div class={successAlertClasses}>
            <span class="i-carbon-checkmark-outline text-lg mr-2"></span>
            QI Response Submitted Successfully via API!
          </div>

          {/* Savings Statistics */}
          <div>
            <h3 class={subHeadingClasses}>Automated Reporting Benefits</h3>
            <div class="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <div class={beforeCardClasses}>
                <h4 class={cardHeadingClasses}>
                  <span class="i-carbon-time text-red-500 mr-2"></span>
                  Manual Process (Before)
                </h4>
                <ul class={listClasses}>
                  <li>Collect data from multiple systems</li>
                  <li>Manually calculate indicators</li>
                  <li>Enter data into government portal</li>
                  <li>Time Requirement: ~3-4 hours per service/quarter</li>
                  <li>Risk of manual entry errors</li>
                </ul>
              </div>
              {/* After */}
              <div class={afterCardClassesGreen}>
                <h4 class={`${cardHeadingClasses} text-green-800`}>
                  <span class="i-carbon-flash text-green-600 mr-2"></span>
                  API Integration (After)
                </h4>
                <ul class={afterListClassesGreen}>
                  <li>Automated data aggregation (potential)</li>
                  <li>Direct submission via API</li>
                  <li>Automated data validation rules (potential backend)</li>
                  <li class="font-semibold">Time Saved: ~2 hours per service/quarter</li>
                  <li>Eliminated manual entry errors</li>
                  <li>Improved submission timeliness (e.g., 100% on-time rate)</li>
                  <li class="font-semibold">Estimated Cost Saving: ~$100-150 per service/quarter*</li>
                </ul>
                <p class="text-xs text-green-600 mt-2">*Based on average admin/clinical hourly rates.</p>
              </div>
            </div>
          </div>

          {/* Option to reload form */}
          <button
            onClick={() => setQiState('initial')}
            class={`${secondaryButtonClasses} mt-6`}
          >
            <span class="i-carbon-reset mr-1"></span>
            Start New Report
          </button>
        </Match>
      </Switch>

      {/* General Value Proposition for QI */}
      <div class="mt-6 pt-4 border-t border-gray-200">
        <h3 class={`${cardHeadingClasses} text-gray-800 mb-1`}>
          <span class="i-carbon-chart-line text-lg mr-2 text-green-600"></span>
          Value Proposition
        </h3>
        <p class="text-sm text-gray-600">
          Integrating with the Quality Indicators API drastically reduces manual effort, minimizes errors, ensures timely compliance, and frees up staff time for care delivery. Data becomes readily available for internal analysis and improvement initiatives.
        </p>
      </div>
    </section>
  );
}
