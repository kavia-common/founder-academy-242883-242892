# FouGuide frontend ↔ backend integration

## Backend base URL

The frontend uses:

- `EXPO_PUBLIC_API_BASE_URL` (recommended), or
- defaults to `http://localhost:3001`

See: `src/api/config.ts`.

### Examples

Local backend:
- `EXPO_PUBLIC_API_BASE_URL=http://localhost:3001`

Kavia preview backend:
- Set `EXPO_PUBLIC_API_BASE_URL` to the publicly reachable `https://...:3001` URL shown for the backend container.

## Auth

Backend expects a Bearer token:

- `Authorization: Bearer <access_token>`

Tokens are returned from:
- `POST /auth/register`
- `POST /auth/login`

The frontend persists `access_token` to AsyncStorage and uses it for all authenticated endpoints.

## Smoke flow

In the app, open **Simulation** screen and run **Live backend smoke flow**:

- `/users/me`
- `/sessions` (create)
- `/sessions/{id}/turns`
- `/sessions/{id}/end`
- `/progress`
- `/gamification/me/badges`
- `/gamification/leaderboard`

This verifies end-to-end request/response contracts against the backend OpenAPI.
