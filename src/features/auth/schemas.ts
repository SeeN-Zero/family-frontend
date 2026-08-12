import { z } from "zod";

export const loginSchema = z.object({
  idToken: z.string().trim().min(1, "TOKEN_GOOGLE_TIDAK_VALID"),
});

export type LoginRequest = z.output<typeof loginSchema>;
