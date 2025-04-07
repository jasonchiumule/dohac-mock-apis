/* @refresh reload */
import "virtual:uno.css"
import { render } from 'solid-js/web'
import { Router, Route } from "@solidjs/router"; // Import A for navigation links

// Import your routes
import Home from "~/routes/home.tsx";
import Dashboard from "~/routes/dashboard.tsx";
import ApiTest from "~/routes/apiTest.tsx";

// Import the logo asset
// import solidLogo from '~/assets/solid.svg';
import { Layout } from '~/lib/components/layout';

const root = document.getElementById('root')

if (!root) {
  throw new Error("Wrapper div not found");
}
// Render the application
render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/api-test" component={ApiTest} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  ), root
);
