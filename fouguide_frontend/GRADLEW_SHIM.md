Gradle wrapper shim (`./gradlew`)

Some CI systems run Gradle commands from the project root and expect a wrapper script at:

- `./gradlew`

Expo/React Native Android projects typically place the wrapper under:

- `./android/gradlew`

This repository includes a small shim script at `./gradlew` that delegates to `./android/gradlew`.

If CI still fails with `./gradlew: No such file or directory`, ensure the shim and the android wrapper are marked executable (+x) in git.
