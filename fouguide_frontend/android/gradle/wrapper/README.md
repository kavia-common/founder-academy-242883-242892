This folder contains the Gradle Wrapper.

Required files:
- gradle-wrapper.properties (committed)
- gradle-wrapper.jar (typically committed, binary)

If your CI environment blocks network downloads and you see errors like:
  "Could not find or load main class org.gradle.wrapper.GradleWrapperMain"
you must commit the binary `gradle-wrapper.jar` into this folder.

This repository currently commits only text files due to codegen constraints.
