@echo off
REM App-level Gradle wrapper shim for Windows runners.
REM Delegates to the Android wrapper.
call "%~dp0android\\gradlew.bat" %*
