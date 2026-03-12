import { z } from "zod";
import { apiGet } from "./http";

const HealthResponseSchema = z.any();

// PUBLIC_INTERFACE
export async function healthCheck(): Promise<unknown> {
  /** Calls backend health check endpoint. */
  return apiGet("/", HealthResponseSchema);
}
