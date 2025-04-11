import { createSignal, Show, For, Switch, Match, createEffect, on } from 'solid-js'; // Added createEffect, on
import type { Questionnaire, QuestionnaireResponse } from '~/lib/schema';
import { fetchQuestionnaires, postQuestionnaireResponse } from '~/lib/api';

// --- Style Constants ---
const primaryPurpleButtonClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed";
const primaryGreenButtonClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed";
const secondaryButtonClasses = "inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";
const errorAlertClasses = "mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm flex items-center";
const successAlertClasses = "p-4 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm flex items-center mb-6";
const sectionCardClasses = "p-6 bg-white rounded-lg border border-gray-200";
const headingClasses = "text-xl font-semibold text-gray-800 mb-4 flex items-center";
const subHeadingClasses = "text-lg font-medium text-gray-700 mb-3";
const paragraphClasses = "text-sm text-gray-600 mb-4";
const formInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";
const formLabelClasses = "block text-sm font-medium text-gray-700 mb-1";
const beforeCardClasses = "border border-gray-200 p-4 rounded-md bg-gray-50";
const afterCardClassesGreen = "border border-green-200 p-4 rounded-md bg-green-50";
const cardHeadingClasses = "text-md font-semibold text-gray-700 mb-2 flex items-center";
const listClasses = "list-disc list-inside text-sm text-gray-600 space-y-1";
const afterListClassesGreen = "list-disc list-inside text-sm text-green-700 space-y-1";

export default function QualityIndicatorsSection() {
  // --- Quality Indicator State ---
  const [qiState, setQiState] = createSignal<'initial' | 'loadingForm' | 'formVisible' | 'submitting' | 'submitted'>('initial');
  const [qiLoadingError, setQiLoadingError] = createSignal<string | null>(null);
  const [qiSubmitError, setQiSubmitError] = createSignal<string | null>(null);
  const [questionnaire, setQuestionnaire] = createSignal<Questionnaire | null>(null);
  const [formAnswers, setFormAnswers] = createSignal<Record<string, string>>({});

  // Refs for scrolling
  let sectionRef: HTMLElement | undefined;
  let submitErrorRef: HTMLDivElement | undefined;

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
        const initialAnswers: Record<string, string> = {};
        loadedQuestionnaire.item?.forEach(group => {
          group.item?.forEach(item => {
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
    setFormAnswers(prev => ({ ...prev, [linkId]: value }));
  };

  const handleSubmitQIResponse = async () => {
    const currentQuestionnaire = questionnaire();
    if (!currentQuestionnaire) return;
    setQiState('submitting');
    setQiSubmitError(null); // Clear previous errors

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
          const answerValue = formAnswers()[qItem.linkId] ?? '';
          const answerField = { valueString: answerValue };
          return {
            linkId: qItem.linkId,
            text: qItem.text,
            answer: [answerField]
          };
        }) ?? []
      })) ?? []
    };

    console.log("Submitting Payload (Validation Skipped):", JSON.stringify(responsePayload, null, 2));

    try {
      await postQuestionnaireResponse(responsePayload);
      setQiState('submitted');
    } catch (err: any) {
      setQiSubmitError(err.message || "Failed to submit response.");
      setQiState('formVisible'); // Go back to form on error
    }
  };

  // Effect for scrolling after state changes
  createEffect(on([qiState, qiSubmitError], ([currentState, currentError]) => {
    // Scroll to top when successfully submitted
    if (currentState === 'submitted') {
      sectionRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Scroll to error message if submission failed
    else if (currentState === 'formVisible' && currentError) {
      // Slight delay ensures the error div is rendered before scrolling
      setTimeout(() => {
        submitErrorRef?.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Center error vertically
      }, 50); // Small delay
    }
    // Optionally scroll to form when it becomes visible after loading
    else if (currentState === 'formVisible' && !currentError && questionnaire()) { // Check questionnaire() to avoid scroll on initial load if form isn't ready
      // Can uncomment this if desired, but often less jarring not to scroll here
      // setTimeout(() => { // Delay might be needed if form takes time to render complex data
      //     sectionRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // }, 50);
    }
  }));

  return (
    // Assign ref to the main section element
    <section ref={sectionRef} class={sectionCardClasses}>
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
                                {item.required ? <span class="text-gray-400 ml-1 text-xs">(Required in spec)</span> : ''}
                              </label>
                              <input
                                type={item.type === 'integer' || item.type === 'decimal' ? 'number' : 'text'}
                                id={item.linkId}
                                name={item.linkId}
                                value={formAnswers()[item.linkId] ?? ''}
                                onInput={(e) => handleInputChange(item.linkId, e.currentTarget.value)}
                                class={formInputClasses}
                                disabled={qiState() === 'submitting'}
                                step={item.type === 'decimal' ? 'any' : '1'}
                                placeholder={item.type === 'integer' || item.type === 'decimal' ? 'e.g., 123' : 'e.g., Description and comments'}
                              />
                            </div>
                          )}
                        </For>
                      </div>
                    )}
                  </For>

                  {/* Assign ref to the error message container */}
                  <Show when={qiSubmitError()}>
                    <div ref={submitErrorRef} class={`${errorAlertClasses} mb-4 mt-0`}>
                      <span class="i-carbon-warning-alt text-lg mr-2"></span>
                      Error submitting: {qiSubmitError()}
                    </div>
                  </Show>

                  <button
                    type="submit"
                    disabled={qiState() === 'submitting'}
                    class={primaryGreenButtonClasses}
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
          {/* Success message and benefits section will be scrolled into view by the effect */}
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
                  <li class="font-semibold">Time Saved: ~3-4 hours per service/quarter</li>
                  <li>Eliminated manual entry errors</li>
                  <li>Improved submission timeliness (e.g., 100% on-time rate)</li>
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
