import ProviderInfoSection from '~/lib/components/providersSection';
import QualityIndicatorsSection from '~/lib/components/qualitySection';

export default function Dashboard() {
  return (
    // Add padding consistent with layout's main area
    <div class="space-y-8">
      {/* Consistent heading style */}
      <h1 class="text-3xl font-bold text-gray-800 mb-6">API Value Demonstration Dashboard</h1>

      {/* --- Provider Information Management Section --- */}
      <ProviderInfoSection />

      <br />
      {/* --- Quality Indicators Reporting Section --- */}
      <QualityIndicatorsSection />

      {/* Add more sections here for other APIs if needed */}

    </div>
  );
}
