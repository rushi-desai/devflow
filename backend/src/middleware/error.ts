import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { sendError } from "../utils/response";

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return sendError(res, 404, "Resource not found");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return sendError(res, 400, "A record with that value already exists");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
    return sendError(res, 400, "A referenced resource does not exist");
  }

  if (error instanceof Error) {
    const messages: Record<string, [number, string]> = {
      ORGANIZATION_NOT_FOUND: [404, "Organization not found"],
      PROJECT_NOT_FOUND: [404, "Project not found"],
      BOARD_NOT_FOUND: [404, "Board not found"],
      TASK_NOT_FOUND: [404, "Task not found"],
      ASSIGNEE_NOT_FOUND: [400, "Assignee is not a member of this organization"]
    };
    const response = messages[error.message];
    if (response) {
      return sendError(res, response[0], response[1]);
    }
  }

  console.error(error);
  return sendError(res, 500, "Internal server error");
};