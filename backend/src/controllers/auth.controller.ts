import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendError } from "../utils/response";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return sendError(res, 400, "Email is already registered");
    }

    return sendError(res, 500, "Unable to register user");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return sendError(res, 401, "Invalid email or password");
    }

    return sendError(res, 500, "Unable to log in");
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await authService.getCurrentUser(req.user!.userId);
    return res.status(200).json({ success: true, data: user });
  } catch {
    return sendError(res, 404, "User not found");
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await authService.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  } catch {
    return sendError(res, 500, "Unable to fetch users");
  }
};