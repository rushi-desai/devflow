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

  console.error(error);
  return sendError(res, 500, "Internal server error");
};