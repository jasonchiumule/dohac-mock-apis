# DOHAC Mock APIs

A mock implementation of the Department of Health and Aged Care's B2G APIs for healthcare providers.

## Notes
Frontend uses bun, vite, react, typescript + swc and shadcnui
Install via shadcnui first, then get AI to write

- Create demo with something here, need to simplify the dashboard likely
- pull things from the backend
- update docker and fly.io deploy

## Overview

This project provides a mock server that implements the following APIs:

1. **Authentication API**: OAuth2 authentication and client registration
2. **Provider Healthcare Service API**: Provider and service discovery
3. **Quality Indicators API**: Questionnaire retrieval and submission
4. **Registered Nurses API**: Attendance tracking and reporting

The mock server is intended for accelerating development and testing of systems that integrate with the Department's APIs, without requiring access to production systems.

## Getting Started

### Prerequisites

- Go 1.16 or higher
- Bun 1.0+ (for the frontend demo)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/jasonchiu/dohac-mock-apis.git
   cd dohac-mock-apis
   ```

2. Install dependencies:
   ```
   go mod download
   cd frontend && bun install
   ```

### Running the Server

Start the server:
```
go run cmd/server/main.go
```

The server will start on port 8080 by default. You can configure a different port using the `PORT` environment variable. The server will also serve the built frontend from the `/cmd/server/spa` directory.

For development, you can start the frontend separately:
```
cd frontend && bun run dev
```

The development frontend will start on port 5173 by default.

### Building the Frontend

To build the frontend for production:
```
cd frontend && bun run build
```

The built files will be placed in the `/cmd/server/spa` directory automatically.

## API Documentation

The API documentation is based on the OpenAPI specifications provided in the `llm-context` directory. The mock implementation follows these specifications but simplifies some aspects, particularly authentication.

For detailed examples and usage scenarios, see the [examples documentation](docs/examples/README.md).

## Features

- **Simplified Authentication**: Mock OAuth2 implementation that accepts any token that starts with "mock_"
- **Example Data**: Pre-populated with example data for providers, services, quality indicators, and nurse attendances
- **Full API Implementation**: Implements all endpoints from the original APIs
- **Realistic Responses**: Returns properly structured FHIR-compliant responses
- **Demo Frontend**: Interactive dashboards demonstrating the value of API integration

## Architecture

The application uses the following structure:

- `cmd/server`: Main application entry point
- `cmd/server/spa`: Serving the built frontend files
- `internal/api`: API configuration and router setup
- `internal/handlers`: Request handlers for each API
- `internal/middleware`: Middleware components, including authentication
- `internal/models`: Data models for the API resources
- `docs/examples`: Documentation and examples
- `frontend`: React-based demo application (Bun, Vite, TypeScript, shadcn/ui) showcasing API integration value

## Value Demonstration

The project includes two demonstration scenarios:

1. **Automated Compliance Management System**: Integrates all APIs to provide a real-time compliance dashboard, reducing administrative burden and ensuring regulatory requirements are met.

2. **Care Quality Optimization Platform**: Correlates nurse staffing data with quality indicators to enable data-driven staffing decisions and improve resident outcomes.

These demonstrations showcase how API integration delivers tangible benefits:
- Reduced administrative burden
- Improved data accuracy
- Enhanced compliance monitoring
- More time for resident care

## Limitations

This is a mock implementation intended for development and testing. It has the following limitations:

- Simplified authentication with no real JWT validation
- In-memory data storage with pre-defined examples
- No validation of business rules or constraints
- No integration with external systems

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Fly.io Notes
tag the images with this, `fly deploy --image-label [semver]`
- build cicd.sh
  - git push
  - tests
  - docker build, run
  - fly deploy --image-label [semver]
