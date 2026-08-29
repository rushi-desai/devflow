import { z } from "zod";

const credentialsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = credentialsSchema;
export const loginSchema = credentialsSchema.omit({ name: true });