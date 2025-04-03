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
