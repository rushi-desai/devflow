import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!token || !process.env.JWT_SECRET) {
    return sendError(res, 401, "Authentication required");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof payload === "string" || typeof payload.userId !== "number") {
      return sendError(res, 401, "Invalid token");
    }

    req.user = payload as jwt.JwtPayload & { userId: number };
    next();
  } catch {
    return sendError(res, 401, "Invalid or expired token");
  }
};