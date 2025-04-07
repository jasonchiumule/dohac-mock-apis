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
