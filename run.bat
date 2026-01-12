@echo off
REM Windows batch file for easy setup and testing
REM Usage:
REM   setup.bat     - Install dependencies
REM   test.bat      - Run tests

setlocal enabledelayedexpansion

if "%1"=="" (
  echo Usage:
  echo   setup.bat     - Install dependencies
  echo   test.bat      - Run tests
  exit /b 0
)

if /i "%1"=="setup" (
  echo Running setup...
  node setup.js
  exit /b !ERRORLEVEL!
)

if /i "%1"=="test" (
  echo Running tests...
  node test-runner.js
  exit /b !ERRORLEVEL!
)

echo Unknown command: %1
exit /b 1
