import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Nav } from '@/components/layout/nav';
import ComplianceDashboard from '@/pages/compliance';
import QualityOptimization from '@/pages/quality';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ComplianceDashboard />} />
            <Route path="/quality" element={<QualityOptimization />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="py-4 px-6 bg-white border-t">
          <div className="text-center text-sm text-gray-500">
            DOHAC B2G API Integration Demo &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </Router>
  );
}
