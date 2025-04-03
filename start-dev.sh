#!/bin/bash

# Use tput for more reliable terminal colors
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
NC=$(tput sgr0) # Reset color

# Get script directory (project root)
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="${PROJECT_ROOT}/frontend2"

# Destination for the built frontend files
DESTINATION="${PROJECT_ROOT}/cmd/server/spa"

# Check if destination exists, delete if necessary
if [ -d "$DESTINATION" ]; then
  echo "${YELLOW}Deleting existing destination directory '$DESTINATION'...${NC}"
  rm -rf "$DESTINATION"
  if [ $? -ne 0 ]; then
    echo "${RED}Error: Could not delete existing destination directory.${NC}"
    exit 1
  fi
fi

# Create the destination directory
echo "${YELLOW}Creating destination directory '$DESTINATION'...${NC}"
mkdir -p "$DESTINATION"
if [ $? -ne 0 ]; then
    echo "${RED}Error: Could not create destination directory.${NC}"
    exit 1
fi

# Build the frontend
echo "${YELLOW}Building frontend with bun...${NC}"
cd "$FRONTEND_DIR"
bun run build
if [ $? -ne 0 ]; then
  echo "${RED}Error: bun build failed in '$FRONTEND_DIR'.${NC}"
  exit 1
fi

# Define source after build
SOURCE="${FRONTEND_DIR}/dist"

# Check source after build
if [ ! -d "$SOURCE" ]; then
  echo "${RED}Error: Source directory '$SOURCE' does not exist after build.${NC}"
  exit 1
fi

echo "${YELLOW}Starting copy from '$SOURCE' to '$DESTINATION'...${NC}"

# Copy files recursively, preserving timestamps and permissions
rsync -av "$SOURCE/" "$DESTINATION/"

if [ $? -eq 0 ]; then
  echo "${GREEN}Copy completed successfully!${NC}"
else
  echo "${RED}Copy failed!${NC}"
  exit 1
fi

# Run the Go server
echo "${YELLOW}Starting server...${NC}"
cd "$PROJECT_ROOT"
go run cmd/server/main.go
