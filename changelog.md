# 0.5.13 - Update: nurse endpoint bulk csv upload
- removed: zagjs tooltip and file-upload
- update: go nurse apis and frontend solidjs nurse and api components
- add: test bench data

# 0.5.12 - Update: nurse and provider section wording
- frontend wording to make sense with the actual use case
- ready to deploy

# 0.5.11 - Update: auth and nurses endpoints
- update logging and changed some logic for the oauth2 endpoints
- update logic to nurses endpoint
- added B2G test files in /test-bench
- added bruno tests

# 0.5.10 - Update: README.md
- updated README.md with accurate information

# 0.5.9 - Update: some typos
- login to multiple government portals was showing false info

# 0.5.8 - Update: mobile select dropdown fix
- previously showed 0px width, now looks normal

# 0.5.7 - Update: mobile friendly scrollTo and css
- added createEffect with scrollTo to go back to relevant sections
- added /api to the two missing links now that the Mulesoft Proxy is working
- home link is just the icon now

# 0.5.6 - Update: apiTest, select dropdown for api calls
- replaced many buttons with a dropdown
- using zagjs select and tooltip

# 0.5.5 - Add: API tester, option of Mulesoft proxy
- using zagjs select
- update apiTest.tsx with Mulesoft backend or Go backend

# 0.5.4 - Update: text and css to fit walkthrough demo
- text updated to makes sense with walkthrough demo
- changed some css colors to match as well

# 0.5.3 - Update: css niceness for mobile
- removed solid.svg
- added mulesoft.svg
- universal div container now in layout.tsx
- inputs now not overflowing div container with w-9/10

# 0.5.2 - Update: Dockerfile for frontend2
- update to use the solidjs frontend2
- deleted frontend (the react based one)
- update fly.toml to suspend, since this is http1.1 it's all good to use

# 0.5.1 - Update: lazy import routes with suspense
- code splitting the routes via lazy imports for quicker TTI
- update home.tsx to describe the problem, solution and value
- update favicon to cardiogram

# 0.5.0 - Add: nurses section in dashboard
- working state similar to quality indicator section
- needs some modifying to make more sense
- added some bru tests
- added zagjs accordion
- update examples README doc

# 0.4.0 - Add: dashboard sections, quality and providers
- showing value for each with before and after
- added solidjs typescript docs
- update favicon.svg

# 0.3.1 - Add: go-chi compress middleware
- to serve static files in gzip or brotli if the client allows

# 0.3.0 - Add: more buttons to interact with backend apis
- breaking out schema.ts for types
- api.ts for frontend api calls
- split out layout.tsx

# 0.2.2 - Add: unocss with wind3, icons and fonts
- can use tailwind style classnames
- icons from iconify, remember to use text-base or text- attribute
- font changed to Roboto (in uno.config.ts and index.html)

# 0.2.1 - Add: router to solid frontend2
- added ~ alias for /src
- added router for a /home and /dashboard

# 0.2.0 - Add: frontend2 solidjs based
- starting from scratch, having a button call some data working
- testing code splitting and lazy loading
- added zagjs docs (ui)

# 0.1.6 - Update: trying to fix up react frontend
- still not connecting to backend properly
- going to try solidjs

# 0.1.5 - Update: docs/examples and fixed /api route
- /api routes no longer redirected into frontend spa
- docs/examples now has response object examples for all

# 0.1.4 - Update: fixed reactive updating
- now connect and reset buttons actually update the frontend reactively
- there could be components to clean up later

# 0.1.3 - Update: lazy loading and code splitting
- update vite.config.ts for react code splitting
- using lazy and suspense from react to dynamically import and allow for vite to auto code split

# 0.1.2 - Update: Simplify frontend, before/after states
- removed lots of charts.
- Created a solution for demonstrating before/after API integration value:
- Used session storage to persist demo state during a session
- Implemented conditional UI rendering based on connection status
- Created focused value widgets to highlight specific benefits of each API
- Designed a system for easily switching between different backend implementations
- Simplified the dashboards to focus on key value metrics rather than comprehensive functionality

# 0.1.1 - Update: Dockerfile and fake loading
- fake loading removed in frontend
- dockerfile now updated to work on fly.io
- fly.io deployment working
- updated readme and claude.md

# 0.1.0 - Add: spa embedding into go
- mock frontend created
- initial commit for the spa served in go web app
