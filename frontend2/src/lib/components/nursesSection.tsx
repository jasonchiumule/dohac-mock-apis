import { createSignal, Show, For, Switch, Match, createEffect, on } from 'solid-js'; // Added createEffect, on
// Import API functions - corrected fetchNurseAttendances to fetchRNAttendance
import { fetchRNAttendance, patchNurseAttendance } from '~/lib/api';
// Import types from schema.ts instead of defining locally
import type { RNAttendanceBundle, EncounterPatchPayload } from '~/lib/schema'; // Use RNAttendanceBundle and add EncounterPatchPayload

// --- Style Constants --- (Reused/Adapted from QualityIndicatorsSection)
const primaryBlueButtonClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"; // Changed to Blue theme
const primaryGreenButtonClasses = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed";
const secondaryButtonClasses = "inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";
const errorAlertClasses = "mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm flex items-center";
const successAlertClasses = "p-4 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm flex items-center mb-6"; // Added mb-6
const sectionCardClasses = "p-6 bg-white rounded-lg border border-gray-200"; // Flat card style
const headingClasses = "text-xl font-semibold text-gray-800 mb-4 flex items-center";
const subHeadingClasses = "text-lg font-medium text-gray-700 mb-3"; // Darker subheading
const paragraphClasses = "text-sm text-gray-600 mb-4"; // Standard paragraph
const formInputClasses = "mt-1 block w-9/10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"; // Flat input, blue focus
const formLabelClasses = "block text-sm font-medium text-gray-700 mb-1";
const beforeCardClasses = "border border-gray-200 p-4 rounded-md bg-gray-50";
const afterCardClasses = "border border-green-200 p-4 rounded-md bg-green-50"; // Use blue theme border
const cardHeadingClasses = "text-md font-semibold text-gray-700 mb-2 flex items-center"; // Consistent card headings
const listClasses = "list-disc list-inside text-sm text-gray-600 space-y-1";
const afterListClasses = "list-disc list-inside text-sm text-green-700 space-y-1"; // Blue theme color list text

// --- Component ---
export default function NursesSection() {
  // --- Nurse Attendance State ---
  const [nurseState, setNurseState] = createSignal<'initial' | 'loading' | 'formVisible' | 'submitting' | 'submitted'>('initial');
  const [loadingError, setLoadingError] = createSignal<string | null>(null);
  const [submitError, setSubmitError] = createSignal<string | null>(null);
  // Use the imported RNAttendanceBundle type
  const [attendanceBundle, setAttendanceBundle] = createSignal<RNAttendanceBundle | null>(null);
  const [recordToUpdateId, setRecordToUpdateId] = createSignal<string | null>(null);
  const [updateNote, setUpdateNote] = createSignal('');
  const [reportingStatus, setReportingStatus] = createSignal('');
  const [absenceReason, setAbsenceReason] = createSignal('');

  // Refs for scrolling
  let sectionRef: HTMLElement | undefined;
  let submitErrorRef: HTMLDivElement | undefined;

  // Hardcoded Service ID for the demo
  const DEMO_SERVICE_ID = 'SVC-54321';
  // Hardcoded Record ID to patch (assuming it's the first one fetched in the summary)
  const DEMO_RECORD_ID_TO_PATCH = 'RN-12345';

  // --- Event Handlers ---
  const handleFetchAttendance = async () => {
    setNurseState('loading');
    setLoadingError(null);
    setAttendanceBundle(null);
    setRecordToUpdateId(null);
    setUpdateNote(''); // Reset note input
    setReportingStatus('');
    setAbsenceReason('');

    try {
      const data = await fetchRNAttendance(DEMO_SERVICE_ID, false);
      console.log("Fetched Attendance Data:", data);
      if (data && data.entry && data.entry.length > 0) {
        setAttendanceBundle(data);
        const record = data.entry.find(e => e.resource.id === DEMO_RECORD_ID_TO_PATCH);
        if (record) {
          setRecordToUpdateId(record.resource.id);
        } else {
          console.warn(`Demo record ${DEMO_RECORD_ID_TO_PATCH} not found in summary. Targetting first record if available.`);
          if (data.entry[0]?.resource?.id) {
            setRecordToUpdateId(data.entry[0].resource.id);
          } else {
            console.error("First record or its ID is missing in the attendance bundle.");
            throw new Error("Could not find a valid record ID in the fetched data.");
          }
        }
        setNurseState('formVisible');
      } else {
        if (data && !data.entry) {
          throw new Error(`Attendance data received but 'entry' array is missing for service ${DEMO_SERVICE_ID}.`);
        } else {
          throw new Error(`No attendance records found for service ${DEMO_SERVICE_ID}.`);
        }
      }
    } catch (err: any) {
      console.error("Error fetching attendance:", err);
      setLoadingError(err.message || "Failed to load attendance data.");
      setNurseState('initial');
    }
  };

  const handleNoteChange = (value: string) => {
    setUpdateNote(value);
  };

  const handleUpdateAttendance = async () => {
    const recordId = recordToUpdateId();
    const status = reportingStatus();
    
    if (!recordId) {
      setSubmitError("No record selected or available for update.");
      return;
    }
    
    if (!status) {
      setSubmitError("Please select a reporting scenario.");
      return;
    }

    setNurseState('submitting');
    setSubmitError(null);

    let reportingNote = status === 'full-coverage'
      ? 'Monthly Report: Nurse was on-site for 24hrs that day'
      : `Monthly Report: Nurse was not on-site for full/part of the day. Reason: ${absenceReason() || 'Not specified'}`;
    
    if (updateNote()) {
      reportingNote += `. Additional notes: ${updateNote()}`;
    }

    const patchPayload: EncounterPatchPayload = {
      note: [{ text: reportingNote }]
    };

    console.log(`Submitting monthly report PATCH for record ${recordId}:`, JSON.stringify(patchPayload, null, 2));

    try {
      await patchNurseAttendance(recordId, patchPayload);
      setNurseState('submitted');
    } catch (err: any) {
      console.error("Error submitting monthly report:", err);
      setSubmitError(err.message || "Failed to submit monthly report.");
      setNurseState('formVisible');
    }
  };

  // Helper to format date/time
  const formatDateTime = (isoString: string | undefined): string => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  }

  // Effect for scrolling after state changes
  createEffect(on([nurseState, submitError], ([currentState, currentError]) => {
    // Scroll to top when successfully submitted
    if (currentState === 'submitted') {
      sectionRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Scroll to error message if submission failed
    // Check if error is set *and* we are back in the formVisible state (after trying to submit)
    else if (currentState === 'formVisible' && currentError) {
      // We need a slight delay to ensure the DOM is updated before scrolling
      setTimeout(() => {
        submitErrorRef?.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Center error vertically
      }, 50); // Small delay
    }
    // Optionally scroll to form when it becomes visible after loading (less jarring than submit scroll)
    else if (currentState === 'formVisible' && !currentError) {
      // Could scroll sectionRef here too if desired, but might be less necessary
      // sectionRef?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));

  return (
    // Assign ref to the main section element
    <section ref={sectionRef} class={sectionCardClasses}>
      <h2 class={headingClasses}>
        <span class="i-carbon-user-nurse text-2xl mr-2 text-blue-600"></span>
        Mandatory Monthly RN Attendance Reporting
      </h2>

      <Switch>
        {/* State A: Initial */}
        <Match when={nurseState() === 'initial' || nurseState() === 'loading'}>
          <p class={paragraphClasses}>
            Monthly RN attendance reporting is mandatory for compliance. Manual compilation of 24-hour coverage records and absence documentation is time-consuming and error-prone.
          </p>
          <button
            onClick={handleFetchAttendance}
            disabled={nurseState() === 'loading'}
            class={primaryBlueButtonClasses}
          >
            <span class={nurseState() === 'loading' ? "i-carbon-circle-dash animate-spin mr-2" : "i-carbon-download mr-2"}></span>
            {nurseState() === 'loading' ? 'Loading...' : `Fetch Monthly Attendance Data (Service: ${DEMO_SERVICE_ID})`}
          </button>
          <Show when={loadingError()}>
            <div class={errorAlertClasses}>
              <span class="i-carbon-warning-alt text-lg mr-2"></span>
              Error loading data: {loadingError()}
            </div>
          </Show>
        </Match>

        {/* State B: Form Visible (Display Summary + Update Option) */}
        <Match when={nurseState() === 'formVisible' || nurseState() === 'submitting'}>
          <Show when={attendanceBundle()} fallback={<p class={paragraphClasses}>Loading data...</p>}>
            {(bundle) => (
              <>
                <h3 class={subHeadingClasses}>Attendance Summary for {bundle().entry?.[0]?.resource?.subject?.display ?? DEMO_SERVICE_ID}</h3>
                <p class={paragraphClasses}>
                  Below is attendance data for monthly reporting. Select the appropriate scenario and submit your monthly report for record <code class="text-xs bg-gray-100 p-1 rounded">{recordToUpdateId() ?? 'N/A'}</code>.
                </p>

                {/* Display Fetched Data Summary */}
                <div class="mb-6 space-y-3 max-h-60 overflow-y-auto border border-gray-200 p-3 rounded-md bg-gray-50">
                  <For each={bundle().entry} fallback={<p class="text-sm text-gray-500">No attendance records found in the bundle.</p>}>
                    {(entry) => (
                      <div class="text-sm border-b border-gray-100 pb-2 last:border-b-0">
                        <p><strong>Record ID:</strong> {entry.resource.id}</p>
                        <p><strong>Nurse:</strong> {entry.resource.performer?.[0]?.actor?.display ?? 'Unknown'}</p>
                        <p><strong>Period:</strong> {formatDateTime(entry.resource.period?.start)} - {formatDateTime(entry.resource.period?.end)}</p>
                        <p><strong>Status:</strong> {entry.resource.status}</p>
                        <Show when={entry.resource.note && entry.resource.note.length > 0}>
                          <p><strong>Notes:</strong> {entry.resource.note?.map(n => n.text).join(', ')}</p>
                        </Show>
                      </div>
                    )}
                  </For>
                </div>

                {/* Form for Monthly Reporting Update */}
                <Show when={recordToUpdateId()}>
                  <form onSubmit={(e) => { e.preventDefault(); handleUpdateAttendance(); }}>
                    <div class="mb-4">
                      <label class={formLabelClasses}>
                        Monthly Reporting Status for Record <code class="text-xs bg-gray-100 p-1 rounded">{recordToUpdateId()}</code>:
                      </label>
                      <select
                        value={reportingStatus()}
                        onChange={(e) => setReportingStatus(e.currentTarget.value)}
                        class={formInputClasses}
                        disabled={nurseState() === 'submitting'}
                      >
                        <option value="">Select reporting scenario...</option>
                        <option value="full-coverage">Nurse was on-site for 24hrs that day</option>
                        <option value="partial-absence">Nurse was not on-site for full/part of the day</option>
                      </select>
                    </div>

                    <Show when={reportingStatus() === 'partial-absence'}>
                      <div class="mb-4">
                        <label for="absenceReason" class={formLabelClasses}>
                          Reason for absence/partial coverage:
                        </label>
                        <textarea
                          id="absenceReason"
                          name="absenceReason"
                          rows={2}
                          value={absenceReason()}
                          onInput={(e) => setAbsenceReason(e.currentTarget.value)}
                          class={formInputClasses}
                          placeholder="e.g., Sick leave, Emergency call-out, Scheduled break coverage"
                          disabled={nurseState() === 'submitting'}
                        />
                      </div>
                    </Show>

                    <div class="mb-4">
                      <label for="updateNote" class={formLabelClasses}>
                        Additional Notes (Optional):
                      </label>
                      <textarea
                        id="updateNote"
                        name="updateNote"
                        rows={2}
                        value={updateNote()}
                        onInput={(e) => handleNoteChange(e.currentTarget.value)}
                        class={formInputClasses}
                        placeholder="Additional reporting details or corrections"
                        disabled={nurseState() === 'submitting'}
                      />
                    </div>

                    {/* Assign ref to the error message container */}
                    <Show when={submitError()}>
                      <div ref={submitErrorRef} class={`${errorAlertClasses} mb-4 mt-0`}>
                        <span class="i-carbon-warning-alt text-lg mr-2"></span>
                        Error submitting update: {submitError()}
                      </div>
                    </Show>

                    <button
                      type="submit"
                      disabled={nurseState() === 'submitting' || !recordToUpdateId()}
                      class={primaryGreenButtonClasses}
                    >
                      <span class={nurseState() === 'submitting' ? "i-carbon-circle-dash animate-spin mr-2" : "i-carbon-send-alt mr-2"}></span>
                      {nurseState() === 'submitting' ? 'Submitting Monthly Report...' : 'Submit Monthly Report via API (PATCH)'}
                    </button>
                  </form>
                </Show>
                <Show when={!recordToUpdateId()}>
                  <p class="text-sm text-orange-600">Could not identify a specific record ID to target for the update demo.</p>
                </Show>
              </>
            )}
          </Show>
        </Match>

        {/* State C: Submitted */}
        <Match when={nurseState() === 'submitted'}>
          {/* Success message and benefits section will be scrolled into view by the effect */}
          <div class={successAlertClasses}>
            <span class="i-carbon-checkmark-outline text-lg mr-2"></span>
            Monthly Attendance Report Submitted Successfully via API!
          </div>

          {/* Savings Statistics */}
          <div>
            <h3 class={subHeadingClasses}>Automated Monthly Reporting Benefits</h3>
            <div class="grid md:grid-cols-2 gap-6">
              {/* Before */}
              <div class={beforeCardClasses}>
                <h4 class={cardHeadingClasses}>
                  <span class="i-carbon-time text-red-500 mr-2"></span>
                  Manual Monthly Reporting (Before)
                </h4>
                <ul class={listClasses}>
                  <li>Manual compilation of daily attendance records</li>
                  <li>Paper-based or spreadsheet tracking of 24hr coverage</li>
                  <li>Manual documentation of absences and reasons</li>
                  <li>Time-consuming monthly report preparation</li>
                  <li>Risk of missing compliance deadlines</li>
                  <li>Difficulty tracking patterns across multiple nurses</li>
                </ul>
              </div>
              {/* After */}
              <div class={afterCardClasses}>
                <h4 class={`${cardHeadingClasses} text-blue-800`}>
                  <span class="i-carbon-flash text-green-600 mr-2"></span>
                  API-Driven Reporting (After)
                </h4>
                <ul class={afterListClasses}>
                  <li>Automated monthly report generation</li>
                  <li>Standardized reporting of coverage scenarios</li>
                  <li>Structured absence reason documentation</li>
                  <li class="font-semibold">Reduced Monthly Reporting Time: 80% time savings</li>
                  <li>Consistent compliance with reporting requirements</li>
                  <li>Real-time visibility into coverage patterns</li>
                  <li class="font-semibold">Automated Audit Trail Generation</li>
                </ul>
                <p class="text-xs text-green-600 mt-2">*Ensures timely submission of mandatory monthly reports.</p>
              </div>
            </div>
          </div>

          {/* Option to reload form */}
          <button
            onClick={() => setNurseState('initial')}
            class={`${secondaryButtonClasses} mt-6`}
          >
            <span class="i-carbon-reset mr-1"></span>
            Fetch Again / Start Over
          </button>
        </Match>
      </Switch>

      {/* General Value Proposition for RN Attendance */}
      <div class="mt-6 pt-4 border-t border-gray-200">
        <h3 class={`${cardHeadingClasses} text-gray-800 mb-1`}>
          <span class="i-carbon-chart-line text-lg mr-2 text-blue-600"></span>
          Monthly Reporting Value Proposition
        </h3>
        <p class="text-sm text-gray-600">
          Automating mandatory monthly RN attendance reporting through API integration ensures consistent compliance, reduces administrative burden, and provides structured documentation of 24-hour coverage scenarios and absence reasons. This streamlines regulatory reporting and improves audit readiness.
        </p>
      </div>
    </section>
  );
}