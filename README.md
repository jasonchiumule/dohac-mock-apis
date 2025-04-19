# DoHAC Mock APIs & SPA

This project provides a mock backend server written in Go (using Chi) that simulates several Department of Health and Aged Care (DoHAC) Business-to-Government (B2G) APIs.

It also embeds and serves a SolidJS Single Page Application (SPA) that provides a user interface for demonstrating the value of these APIs and testing interactions with the mock endpoints.

## Features

*   **Go Backend:** Uses the Chi router for handling HTTP requests.
*   **Mock APIs:** Provides mock implementations for:
    *   Authentication (`/api/oauth2/...`)
    *   Provider (`/api/Provider`)
    *   HealthcareService (`/api/HealthcareService`)
    *   Questionnaire (`/api/Questionnaire`)
    *   QuestionnaireResponse (`/api/QuestionnaireResponse`)
    *   RegisteredNurseAttendance (`/api/RegisteredNurseAttendance`)
*   **Embedded Frontend:** The SolidJS SPA (from the `frontend2` directory) is built and embedded directly into the Go binary using Go's `embed` package.
*   **SPA Serving:** The Go server serves the `index.html` of the SPA for the root route (`/`) and relies on the SPA's router (Solid Router) for client-side navigation. Static assets (`/assets/*`, `favicon.svg`) are served directly.
*   **CORS Enabled:** The API endpoints have permissive CORS headers for easier development.

## Technology Stack

*   **Backend:** Go 1.21+, Chi v5
*   **Frontend:** SolidJS, Vite, Bun, UnoCSS, Zag.js
*   **Embedding:** Go `embed` package

## Project Structure

*   `cmd/server/`: Contains the main Go application (`main.go`) and the `spa` directory where the built frontend assets are embedded from.
*   `internal/`: Contains the Go backend logic:
    *   `api/`: Router setup.
    *   `handlers/`: HTTP handlers for each API resource group.
    *   `middleware/`: Custom middleware (e.g., mock auth).
    *   `models/`: Struct definitions for API resources.
*   `frontend2/`: Contains the SolidJS SPA source code.

## Prerequisites

*   Go (version 1.21 or later recommended)
*   Bun (for building the frontend)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd dohac-mock-apis
    ```

2.  **Build the Frontend SPA:**
    *   Navigate to the frontend directory:
        ```bash
        cd frontend2
        ```
    *   Install dependencies:
        ```bash
        bun install
        ```
    *   Build the SPA:
        ```bash
        bun run build
        ```
        This will generate the static assets in the `frontend2/dist` directory.

3.  **Prepare Embedded Files:**
    *   Ensure the `cmd/server/spa` directory exists. If not, create it.
    *   Copy the contents of the `frontend2/dist` directory into the `cmd/server/spa` directory.
        ```bash
        # From the frontend2 directory:
        rm -rf ../cmd/server/spa/* # Clear old files (optional)
        cp -R dist/* ../cmd/server/spa/
        ```
       *(Alternatively, adjust the frontend build process to output directly to `cmd/server/spa`)*

4.  **Run the Go Server:**
    *   Navigate to the server directory:
        ```bash
        cd ../cmd/server
        ```
    *   Run the server:
        ```bash
        go run main.go
        ```

5.  **Access the Application:**
    *   Open your web browser and go to `http://localhost:8080` (or the port specified by the `PORT` environment variable).

## API Endpoints

The mock APIs are served under the `/api` path. Examples:

*   `GET /api/health`
*   `POST /api/oauth2/access-tokens`
*   `GET /api/Provider`
*   `GET /api/HealthcareService?organization=PRV-12345`
*   `GET /api/Questionnaire`
*   `POST /api/QuestionnaireResponse`
*   `GET /api/RegisteredNurseAttendance?service=SVC-54321`
*   `PATCH /api/RegisteredNurseAttendance/RN-12345`

Refer to the handler code in `internal/handlers/` for details on mock data and behavior. The SPA's "API Test" page (`/api-test`) allows direct interaction with these endpoints.

## Configuration

*   **Port:** The server runs on port `8080` by default. You can change this by setting the `PORT` environment variable.
    ```bash
    PORT=3000 go run main.go
    ```
