import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react'; // Import lazy and Suspense
import { Nav } from '@/components/layout/nav';
import { DemoProvider } from '@/context/DemoContext'; // Import the DemoProvider

// --- Lazy Load Page Components ---
const ComplianceDashboard = lazy(() => import('@/pages/compliance'));
const QualityOptimization = lazy(() => import('@/pages/quality'));

// --- Optional: Create a simple loading component ---
function LoadingFallback() {
  return (
    <div className="p-6 text-center text-gray-500">
      Loading page...
      {/* You could put a spinner here */}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      {/* --- Wrap the main content with DemoProvider --- */}
      <DemoProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Nav />
          <main className="flex-1">
            {/* --- Wrap Routes with Suspense --- */}
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<ComplianceDashboard />} />
                <Route path="/quality" element={<QualityOptimization />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          <footer className="py-4 px-6 bg-white border-t">
            <div className="text-center text-sm text-gray-500">
              DOHAC B2G API Integration Demo &copy; {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </DemoProvider> {/* --- End DemoProvider wrapper --- */}
    </Router>
  );
}
