Android CI notes

If CI runs `./gradlew` and fails with:

- `Could not find or load main class org.gradle.wrapper.GradleWrapperMain`

then the Gradle wrapper binary JAR is missing:

- `android/gradle/wrapper/gradle-wrapper.jar`

This code-generation environment cannot reliably add binary files, so you must do one of:

1) Commit the generated `gradle-wrapper.jar` (best long term), or
2) Install system Gradle in CI and run without wrapper, or
3) Download the wrapper jar during CI (see `android/gradle/wrapper/DOWNLOAD_WRAPPER_JAR.md`).

A helper script exists:

- `ci/run-gradle-or-wrapper.sh`
