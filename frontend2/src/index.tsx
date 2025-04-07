/* @refresh reload */
import "virtual:uno.css"
import { render } from 'solid-js/web'
import { Router, Route } from "@solidjs/router";
import { lazy, Suspense } from "solid-js";

// Import Layout (must be eager if used in Router root)
import { Layout } from '~/lib/components/layout';

// Lazy load ALL route components
const Home = lazy(() => import('~/routes/home')); // Lazy load Home
const Dashboard = lazy(() => import('~/routes/dashboard'));
const ApiTest = lazy(() => import('~/routes/apiTest'));

const root = document.getElementById('root')

if (!root) {
  throw new Error("Wrapper div not found");
}

// Define a common fallback or specific ones
const RouteLoadingFallback = () => <div>Loading route...</div>;

// Render the application
render(
  () => (
    <Router root={Layout}>
      {/* You can wrap multiple lazy routes in one Suspense if they share a fallback */}
      <Suspense fallback={<RouteLoadingFallback />}>
        <Route path="/" component={Home} />
        <Route path="/api-test" component={ApiTest} />
        <Route path="/dashboard" component={Dashboard} />
      </Suspense>
    </Router>
  ), root
);
