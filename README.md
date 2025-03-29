# DOHAC Mock APIs

A mock implementation of the Department of Health and Aged Care's B2G APIs for healthcare providers.

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

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/jasonchiu/dohac-mock-apis.git
   cd dohac-mock-apis
   ```

2. Install dependencies:
   ```
   go mod download
   ```

### Running the Server

Start the server:
```
go run cmd/server/main.go
```

The server will start on port 8080 by default. You can configure a different port using the `PORT` environment variable.

## API Documentation

The API documentation is based on the OpenAPI specifications provided in the `llm-context` directory. The mock implementation follows these specifications but simplifies some aspects, particularly authentication.

For detailed examples and usage scenarios, see the [examples documentation](docs/examples/README.md).

## Features

- **Simplified Authentication**: Mock OAuth2 implementation that accepts any token that starts with "mock_"
- **Example Data**: Pre-populated with example data for providers, services, quality indicators, and nurse attendances
- **Full API Implementation**: Implements all endpoints from the original APIs
- **Realistic Responses**: Returns properly structured FHIR-compliant responses

## Architecture

The application uses the following structure:

- `cmd/server`: Main application entry point
- `internal/api`: API configuration and router setup
- `internal/handlers`: Request handlers for each API
- `internal/middleware`: Middleware components, including authentication
- `internal/models`: Data models for the API resources
- `docs/examples`: Documentation and examples

## Limitations

This is a mock implementation intended for development and testing. It has the following limitations:

- Simplified authentication with no real JWT validation
- In-memory data storage with pre-defined examples
- No validation of business rules or constraints
- No integration with external systems

## License

This project is licensed under the MIT License - see the LICENSE file for details.