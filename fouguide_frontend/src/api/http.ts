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

// PUBLIC_INTERFACE
export async function apiGet<T>(path: string, schema: z.ZodSchema<T>): Promise<T> {
  /** Typed GET request with zod validation. */
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    throw new ApiError("Request failed", { status: res.status, details: payload });
  }
  return schema.parse(payload);
}
