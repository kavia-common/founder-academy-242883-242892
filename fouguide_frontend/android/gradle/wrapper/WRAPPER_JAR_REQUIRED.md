`gradle-wrapper.jar` is required

The Gradle wrapper script (`gradlew`) requires the binary:

- `android/gradle/wrapper/gradle-wrapper.jar`

If it is missing, you will see (exactly):

- `Could not find or load main class org.gradle.wrapper.GradleWrapperMain`

Fix options:

## Option A (recommended): commit the jar
Generate it locally (or in a build environment that has Gradle installed), then commit it:

1) Ensure a Gradle installation exists (any recent version is fine)
2) From `android/` run:
   - `gradle wrapper --gradle-version 8.10.2`
3) Commit:
   - `android/gradle/wrapper/gradle-wrapper.jar`
   - `android/gradle/wrapper/gradle-wrapper.properties`
   - `android/gradlew` / `android/gradlew.bat`

## Option B: CI installs Gradle and avoids wrapper
If your CI image already has `gradle` installed, you can run tasks without the wrapper:

- `cd founder-academy-242883-242892/fouguide_frontend/android && gradle tasks`

This avoids needing `gradle-wrapper.jar`.
