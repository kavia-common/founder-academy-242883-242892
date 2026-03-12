# FouGuide Frontend (React Native / Expo)

Ocean Professional themed mobile/web UI for FouGuide.

## Run
```bash
npm install
npm run start
```

## Environment variables
Create a `.env` (already present in this environment) or update it with:

- `EXPO_PUBLIC_API_BASE_URL` – Base URL of the FastAPI backend.
  - Example: `https://<your-backend-host>`
  - Default in code: `http://localhost:3001`

See `.env.example`.

## App flows implemented
- Auth flow (Welcome / Sign In / Sign Up)
  - Currently **mock auth** (backend OpenAPI only exposes `/` health check at the moment).
- Onboarding (2 questions) with backend connectivity check (non-blocking)
- App tabs:
  - Dashboard: three-panel layout (Roadmap / AI Chat / Metrics) that stacks on small screens
  - Simulations list
  - Profile: sign-out + backend diagnostics
- Full-screen Simulation modal conversation

## Notes
- Replace mock auth in `src/state/AuthContext.tsx` once backend auth endpoints exist.
- Typed API scaffolding is in `src/api/*` (uses `zod` for runtime validation).
- CI / containerized "mobile code analysis" may report: `./gradlew: No such file or directory`.
  - This is an infrastructure limitation (no Android gradle wrapper present) and is not caused by app source code.
