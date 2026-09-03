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

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return sendError(res, 400, result.error.issues[0]?.message ?? "Invalid request");
    }

    req.params = result.data as Request["params"];
    next();
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return sendError(res, 400, result.error.issues[0]?.message ?? "Invalid request");
    }

    req.query = result.data as Request["query"];
    next();
  };
};