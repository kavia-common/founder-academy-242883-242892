# Android build notes (Expo)

This repo uses an Expo-managed workflow. By default, there is **no** `android/` folder and therefore no `./gradlew` script present.

## Why CI may fail with `./gradlew: No such file or directory`
Some automated "mobile code analysis" pipelines attempt to run Gradle checks directly. That requires an `android/` directory (and a Gradle wrapper), which only exists after running an Expo prebuild.

This is an infrastructure/pipeline expectation mismatch, not an application code error.

## How to generate Android project (when supported)
From `fouguide_frontend/`:

```bash
npm install
npx expo prebuild --platform android
# then
cd android
./gradlew assembleDebug
```

## Recommended pipeline approach
For Expo-managed apps, prefer:
- `npm run lint`
- `npx expo export` (if using web/static export)
- `npx expo prebuild` step **only** in environments with Android toolchain support
