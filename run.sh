#!/bin/bash

# Cross-platform setup and test script
# Usage:
#   ./run.sh setup     - Install dependencies
#   ./run.sh test      - Run tests

if [ $# -eq 0 ]; then
  echo "Usage:"
  echo "  ./run.sh setup     - Install dependencies"
  echo "  ./run.sh test      - Run tests"
  exit 0
fi

if [ "$1" = "setup" ]; then
  echo "Running setup..."
  node setup.js
  exit $?
fi

if [ "$1" = "test" ]; then
  echo "Running tests..."
  node test-runner.js
  exit $?
fi

echo "Unknown command: $1"
exit 1
