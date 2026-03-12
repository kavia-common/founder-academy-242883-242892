#!/usr/bin/env sh
# Workspace-level Gradle wrapper shim.
# Some CI tasks invoke `./gradlew` from the workspace root. Delegate to the
# React Native app wrapper shim.
#
# Note: This file must be executable (+x) in git for `./gradlew` to work.

exec "$(dirname "$0")/fouguide_frontend/gradlew" "$@"
