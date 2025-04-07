import { A } from "@solidjs/router";

export default function Home() {
  // --- Style Constants ---
  const sectionCardClasses = "p-6 bg-white rounded-lg border border-gray-200"; // Flat card style
  const headingClasses = "text-2xl font-bold text-gray-800 mb-4";
  const subHeadingClasses = "text-xl font-semibold text-gray-700 mb-3";
  const paragraphClasses = "text-base text-gray-600 mb-4 leading-relaxed"; // Standard paragraph with better line spacing
  const listClasses = "list-disc list-inside text-base text-gray-600 space-y-2 mb-4 pl-4"; // Styled list
  const linkClasses = "text-blue-600 hover:text-blue-800 hover:underline font-medium"; // Link style
  const highlightClasses = "font-semibold text-blue-700"; // Highlight key benefits

  return (
    <> {/* Constrain width for readability */}
      <h1 class={headingClasses}>Welcome to the DoHAC B2G API Accelerator</h1>

      <section class={sectionCardClasses}>
        <p class={paragraphClasses}>
          This accelerator provides a mock implementation of key Department of Health and Aged Care (DoHAC) Business-to-Government (B2G) APIs. It's designed for healthcare providers (like aged care facilities) and software vendors to build and test their integrations without needing to connect to live DoHAC systems.
        </p>
      </section>

      <section class={sectionCardClasses}>
        <h2 class={subHeadingClasses}>The Challenge: Manual Compliance & Reporting</h2>
        <p class={paragraphClasses}>
          Healthcare and aged care providers face significant administrative overhead in meeting government reporting requirements. Tasks like submitting Quality Indicators (QI), tracking Registered Nurse (RN) attendance, and ensuring provider information is up-to-date often involve:
        </p>
        <ul class={listClasses}>
          <li>Time-consuming manual data entry into multiple government portals.</li>
          <li>High risk of transcription errors, leading to inaccurate data.</li>
          <li>Delayed visibility into compliance status.</li>
          <li>Diverting valuable staff time away from direct care delivery.</li>
          <li>Increased operational costs and potential compliance penalties.</li>
        </ul>
      </section>

      <section class={sectionCardClasses}>
        <h2 class={subHeadingClasses}>The Solution: Streamlined Integration with DoHAC APIs</h2>
        <p class={paragraphClasses}>
          The DoHAC B2G APIs enable direct, secure, system-to-system data exchange, automating many compliance and reporting workflows. By integrating your software with these APIs (using this accelerator for testing), you can achieve significant benefits:
        </p>
        <ul class={listClasses}>
          <li>
            <span class={highlightClasses}>Save Time:</span> Drastically reduce the hours spent on manual data collection and submission. For example, submitting <span class="font-medium">Quality Indicators</span> or verifying <span class="font-medium">Provider Information</span> becomes a quick, automated process within your existing software.
          </li>
          <li>
            <span class={highlightClasses}>Reduce Errors:</span> Eliminate manual data entry mistakes, ensuring the information submitted to DoHAC is accurate and consistent with your internal records.
          </li>
          <li>
            <span class={highlightClasses}>Improve Compliance Monitoring:</span> Gain near real-time visibility into reporting status and key metrics, such as <span class="font-medium">Registered Nurse attendance</span>, allowing proactive management and reducing compliance risks.
          </li>
          <li>
            <span class={highlightClasses}>Lower Costs:</span> Reduce administrative overhead and potentially avoid penalties associated with errors or late submissions.
          </li>
          <li>
            <span class={highlightClasses}>Focus on Care:</span> Free up clinical and administrative staff to concentrate on providing high-quality care to residents and clients, rather than burdensome paperwork.
          </li>
        </ul>
        <p class={paragraphClasses}>
          This accelerator helps you realize these benefits faster by providing a ready-to-use mock environment. Explore the <A href="/dashboard" class={linkClasses}>Dashboard</A> to see value demonstrations or use the <A href="/api-test" class={linkClasses}>API Testbed</A> to interact directly with the mock endpoints.
        </p>
      </section>
    </>
  );
}
