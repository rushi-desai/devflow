import { z } from "zod";

const credentialsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(255, "Email is too long"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = credentialsSchema;
export const loginSchema = credentialsSchema.omit({ name: true });

const positiveId = z.coerce.number().int().positive("ID must be a positive integer");

export const organizationParamsSchema = z.object({ organizationId: positiveId });
export const projectParamsSchema = z.object({ projectId: positiveId });
export const boardParamsSchema = z.object({ boardId: positiveId });
export const taskParamsSchema = z.object({ taskId: positiveId });

export const organizationQuerySchema = z.object({ organizationId: positiveId.optional() });
export const projectQuerySchema = z.object({ organizationId: positiveId.optional() });
export const boardQuerySchema = z.object({ projectId: positiveId.optional() });
export const taskQuerySchema = z.object({ boardId: positiveId.optional() });

export const organizationBodySchema = z.object({
  name: z.string().trim().min(2, "Organization name must be at least 2 characters").max(100, "Organization name is too long")
});

export const memberBodySchema = z.object({
  userId: positiveId.optional(),
  email: z.string().trim().email("Enter a valid email").optional()
}).refine((data) => Boolean(data.userId) !== Boolean(data.email), {
  message: "Provide either a userId or email"
});

export const projectBodySchema = z.object({
  organizationId: positiveId.optional(),
  name: z.string().trim().min(2, "Project name must be at least 2 characters").max(150, "Project name is too long"),
  description: z.string().trim().max(2000, "Description is too long").optional()
});

export const boardBodySchema = z.object({
  projectId: positiveId.optional(),
  name: z.string().trim().min(2, "Board name must be at least 2 characters").max(100, "Board name is too long")
});

export const taskBodySchema = z.object({
  boardId: positiveId.optional(),
  title: z.string().trim().min(1, "Task title is required").max(200, "Task title is too long").optional(),
  description: z.string().trim().max(5000, "Description is too long").optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  assigneeId: positiveId.nullable().optional()
});

export const taskCreateBodySchema = taskBodySchema.extend({
  title: z.string().trim().min(1, "Task title is required").max(200, "Task title is too long")
});

export const commentBodySchema = z.object({
  content: z.string().trim().min(1, "Comment cannot be empty").max(5000, "Comment is too long")
});

export const parsePositiveId = (value: unknown) => positiveId.parse(value);