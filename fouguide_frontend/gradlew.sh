#!/usr/bin/env sh
# Alias for CI scripts that call `./gradlew.sh`.
exec "$(dirname "$0")/gradlew" "$@"
