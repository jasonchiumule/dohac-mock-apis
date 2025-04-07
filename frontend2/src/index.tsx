/* @refresh reload */
import "virtual:uno.css"
import { render } from 'solid-js/web'
import { Router, Route } from "@solidjs/router";
// import '~/index.css'
// import App from './App.tsx'

import Home from "~/routes/home.tsx";
import Dashboard from "~/routes/dashboard.tsx";

const root = document.getElementById('root')

if (!root) {
  throw new Error("Wrapper div not found");
}
// render(() => <App />, root!)
render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  ), root
);
