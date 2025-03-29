.PHONY: build run test clean

# Default build target
build:
	go build -o bin/server cmd/server/main.go

# Run the server
run:
	go run cmd/server/main.go

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Run with a specific port
run-port:
	PORT=3000 go run cmd/server/main.go

# Initialize project 
init:
	go mod tidy