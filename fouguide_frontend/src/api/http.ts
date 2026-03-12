import { z } from "zod";
import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, opts?: { status?: number; details?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.details = opts?.details;
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

function buildAuthHeader(token?: string | null): Record<string, string> {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// PUBLIC_INTERFACE
export async function apiRequest<T>(params: {
  /** Path beginning with `/` (e.g. `/auth/login`). */
  path: string;
  method: HttpMethod;
  /** Optional Bearer token. */
  token?: string | null;
  /** Optional JSON body (will be JSON.stringify'd). */
  body?: unknown;
  /** Optional zod schema to validate response. If omitted, returns payload as-is. */
  schema?: z.ZodSchema<T>;
}): Promise<T> {
  /** Typed API request with optional auth and optional zod validation. */
  const res = await fetch(`${API_BASE_URL}${params.path}`, {
    method: params.method,
    headers: {
      Accept: "application/json",
      ...(params.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...buildAuthHeader(params.token),
    },
    body: params.body !== undefined ? JSON.stringify(params.body) : undefined,
  });

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    // Backend returns ApiError envelope; surface message if present.
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as any).message)
        : "Request failed";
    throw new ApiError(message, { status: res.status, details: payload });
  }

  if (!params.schema) return payload as T;
  return params.schema.parse(payload);
}

// PUBLIC_INTERFACE
export async function apiGet<T>(path: string, schema: z.ZodSchema<T>): Promise<T> {
  /** Typed GET request with zod validation. */
  return apiRequest<T>({ path, method: "GET", schema });
}
