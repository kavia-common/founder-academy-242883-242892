import { z } from "zod";
import { apiRequest } from "./http";

/**
 * Zod schemas aligned to fouguide_backend OpenAPI models.
 * Kept lightweight and permissive where backend responses are simple.
 */

const AuthTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("bearer").optional(),
  user_id: z.string(),
});

const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  display_name: z.string(),
  created_at: z.string().or(z.date()).transform((v) => (typeof v === "string" ? v : v.toISOString())),
  bio: z.string().nullable().optional(),
  goal: z.string().nullable().optional(),
  locale: z.string().optional(),
  xp: z.number().int().optional(),
  level: z.number().int().optional(),
});

const SessionTypeSchema = z.enum(["simulation", "coaching"]);
const TurnRoleSchema = z.enum(["user", "assistant", "system"]);

const SessionTurnSchema = z.object({
  id: z.string(),
  created_at: z.string().or(z.date()).transform((v) => (typeof v === "string" ? v : v.toISOString())),
  role: TurnRoleSchema,
  content: z.string(),
});

const SessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  type: SessionTypeSchema,
  title: z.string(),
  scenario: z.string().nullable().optional(),
  created_at: z.string().or(z.date()).transform((v) => (typeof v === "string" ? v : v.toISOString())),
  ended_at: z
    .string()
    .nullable()
    .optional()
    .or(z.date().nullable())
    .transform((v) => (v == null ? null : typeof v === "string" ? v : v.toISOString())),
  turns: z.array(SessionTurnSchema).optional(),
  status: z.enum(["active", "ended"]).optional(),
});

const ProgressSnapshotSchema = z.object({
  user_id: z.string(),
  roadmap_id: z.string(),
  lessons: z
    .array(
      z.object({
        lesson_id: z.string(),
        status: z.enum(["not_started", "in_progress", "completed"]),
        updated_at: z.string().or(z.date()).transform((v) => (typeof v === "string" ? v : v.toISOString())),
      })
    )
    .optional(),
  updated_at: z.string().or(z.date()).transform((v) => (typeof v === "string" ? v : v.toISOString())),
});

const BadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
});

const LeaderboardEntrySchema = z.object({
  user_id: z.string(),
  display_name: z.string(),
  xp: z.number().int(),
  level: z.number().int(),
});

export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type SessionTurn = z.infer<typeof SessionTurnSchema>;
export type ProgressSnapshot = z.infer<typeof ProgressSnapshotSchema>;
export type Badge = z.infer<typeof BadgeSchema>;
export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

// PUBLIC_INTERFACE
export async function register(params: {
  email: string;
  password: string;
  display_name: string;
}): Promise<AuthTokenResponse> {
  /** Register a new user and receive an access token. */
  return apiRequest<AuthTokenResponse>({
    path: "/auth/register",
    method: "POST",
    body: params,
    schema: AuthTokenResponseSchema,
  });
}

// PUBLIC_INTERFACE
export async function login(params: { email: string; password: string }): Promise<AuthTokenResponse> {
  /** Login and receive an access token. */
  return apiRequest<AuthTokenResponse>({
    path: "/auth/login",
    method: "POST",
    body: params,
    schema: AuthTokenResponseSchema,
  });
}

// PUBLIC_INTERFACE
export async function logout(params: { token: string | null }): Promise<void> {
  /** Logout the current session (best-effort). */
  await apiRequest<unknown>({
    path: "/auth/logout",
    method: "POST",
    token: params.token,
  });
}

// PUBLIC_INTERFACE
export async function getMe(params: { token: string }): Promise<UserProfile> {
  /** Fetch current user's profile. */
  return apiRequest<UserProfile>({
    path: "/users/me",
    method: "GET",
    token: params.token,
    schema: UserProfileSchema,
  });
}

// PUBLIC_INTERFACE
export async function createSession(params: {
  token: string;
  type: "simulation" | "coaching";
  title: string;
  scenario?: string | null;
}): Promise<Session> {
  /** Create a new session for the authenticated user. */
  return apiRequest<Session>({
    path: "/sessions",
    method: "POST",
    token: params.token,
    body: { type: params.type, title: params.title, scenario: params.scenario ?? null },
    schema: SessionSchema,
  });
}

// PUBLIC_INTERFACE
export async function addTurn(params: {
  token: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
}): Promise<SessionTurn> {
  /** Add a conversational turn to an active session. */
  return apiRequest<SessionTurn>({
    path: `/sessions/${params.sessionId}/turns`,
    method: "POST",
    token: params.token,
    body: { role: params.role, content: params.content },
    schema: SessionTurnSchema,
  });
}

// PUBLIC_INTERFACE
export async function endSession(params: { token: string; sessionId: string }): Promise<{
  session: Session;
  xp_awarded: number;
  badges_awarded: string[];
}> {
  /** End a session and receive XP/badges awarded. */
  const schema = z.object({
    session: SessionSchema,
    xp_awarded: z.number().int(),
    badges_awarded: z.array(z.string()).optional(),
  });

  return apiRequest({
    path: `/sessions/${params.sessionId}/end`,
    method: "POST",
    token: params.token,
    schema,
  });
}

// PUBLIC_INTERFACE
export async function getProgress(params: { token: string }): Promise<ProgressSnapshot> {
  /** Get progress snapshot for the authenticated user. */
  return apiRequest<ProgressSnapshot>({
    path: "/progress",
    method: "GET",
    token: params.token,
    schema: ProgressSnapshotSchema,
  });
}

// PUBLIC_INTERFACE
export async function updateProgress(params: {
  token: string;
  roadmap_id: string;
  lesson_id: string;
  status: "not_started" | "in_progress" | "completed";
}): Promise<ProgressSnapshot> {
  /** Update progress for a lesson. */
  return apiRequest<ProgressSnapshot>({
    path: "/progress",
    method: "POST",
    token: params.token,
    body: { roadmap_id: params.roadmap_id, lesson_id: params.lesson_id, status: params.status },
    schema: ProgressSnapshotSchema,
  });
}

// PUBLIC_INTERFACE
export async function listBadges(): Promise<Badge[]> {
  /** List the global badge catalog. */
  return apiRequest<Badge[]>({
    path: "/gamification/badges",
    method: "GET",
    schema: z.array(BadgeSchema),
  });
}

// PUBLIC_INTERFACE
export async function listMyBadges(params: { token: string }): Promise<Badge[]> {
  /** List the authenticated user's earned badges. */
  return apiRequest<Badge[]>({
    path: "/gamification/me/badges",
    method: "GET",
    token: params.token,
    schema: z.array(BadgeSchema),
  });
}

// PUBLIC_INTERFACE
export async function leaderboard(params?: { limit?: number }): Promise<LeaderboardEntry[]> {
  /** Get the XP leaderboard. */
  const q = params?.limit ? `?limit=${encodeURIComponent(params.limit)}` : "";
  return apiRequest<LeaderboardEntry[]>({
    path: `/gamification/leaderboard${q}`,
    method: "GET",
    schema: z.array(LeaderboardEntrySchema),
  });
}
