# CLAUDE.md - Project Reference

## Project Overview
This repository contains a mock implementation of the Department of Health and Aged Care's B2G APIs for healthcare providers. The project serves as an accelerator for providers to quickly implement integrations with government reporting systems.

## APIs Implemented
1. **Authentication API** - OAuth2 authentication for developers and providers
2. **Provider & Healthcare Service API** - Organization structure and service discovery
3. **Quality Indicators API** - Quarterly quality indicator reporting
4. **Registered Nurses Attendance API** - Nurse attendance tracking

## Primary Files

### Main Structure
- `cmd/server/main.go` - Application entry point
- `internal/api/api.go` - Router configuration
- `Makefile` - Build and run commands

### Handlers
- `internal/handlers/auth/auth.go` - Authentication endpoints
- `internal/handlers/provider/provider.go` - Provider and service endpoints
- `internal/handlers/quality/quality.go` - Quality indicators endpoints
- `internal/handlers/nurses/nurses.go` - Registered nurse attendance endpoints

### Models
- `internal/models/auth.go` - Authentication data structures
- `internal/models/provider.go` - Provider and service data structures
- `internal/models/quality.go` - Quality indicators data structures
- `internal/models/nurses.go` - Registered nurse attendance data structures

### Middleware
- `internal/middleware/auth.go` - Authentication middleware

## Key Commands

### Running the Server
```bash
go run cmd/server/main.go
```
Or using make:
```bash
make run
```

### Testing Endpoints
Use the examples in `docs/examples/README.md` for testing each API.

## Linting and Testing
Run linting and type-checking with:
```bash
go vet ./...
```

Run tests with:
```bash
make test
```

## API Testing Workflow
1. Start the server with `make run`
2. Register a client with the authentication API
3. Obtain an access token
4. Use the token to access protected APIs (Provider, Quality Indicators, Registered Nurses)

## Mock Data Notes
- Authentication tokens are accepted if they begin with `mock_`
- Provider data includes examples for two organizations: "Sunset Aged Care" and "Golden Years Care"
- Quality indicators include pressure injuries, physical restraint, unplanned weight loss, falls and major injury, and medication management
- Registered nurse attendance records include both individual records and summary data

## Development Workflow
When making changes:
1. Update the relevant models if adding new data structures
2. Modify or add handlers for new endpoints
3. Update the router in `internal/api/api.go` if needed
4. Test changes using curl or a REST client
5. Document any new endpoints in the examples

## Future Enhancements
Potential areas for improvement:
- Database persistence for mock data
- More comprehensive validation rules
- Configuration file support
- Enhanced logging and monitoring