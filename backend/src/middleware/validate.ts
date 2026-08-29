import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/response";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return sendError(res, 400, result.error.issues[0]?.message ?? "Invalid request");
    }

    req.body = result.data;
    next();
  };
};