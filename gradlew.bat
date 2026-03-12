@echo off
REM Workspace-level Gradle wrapper shim for Windows runners.
REM Delegates to the app-level shim.
call "%~dp0fouguide_frontend\\gradlew.bat" %*
