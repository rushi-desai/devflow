import { Request, Response } from "express";
import * as organizationService from "../services/organization.service";
import { sendError } from "../utils/response";

export const list = async (req: Request, res: Response) => {
  const data = await organizationService.listOrganizations(req.user!.userId);
  return res.json({ success: true, data });
};

export const getById = async (req: Request, res: Response) => {
  try {
    const data = await organizationService.getOrganizationById(
      Number(req.params.organizationId),
      req.user!.userId
    );
    return res.json({ success: true, data });
  } catch {
    return sendError(res, 404, "Organization not found");
  }
};

export const create = async (req: Request, res: Response) => {
  if (!req.body.name || !req.body.name.trim()) {
    return sendError(res, 400, "Organization name is required");
  }
  const data = await organizationService.createOrganization(req.user!.userId, req.body.name.trim());
  return res.status(201).json({ success: true, data });
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const data = await organizationService.addMember(
      Number(req.params.organizationId),
      req.user!.userId,
      {
        userId: req.body.userId ? Number(req.body.userId) : undefined,
        email: req.body.email ? String(req.body.email) : undefined
      }
    );
    return res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "USER_NOT_FOUND") {
        return sendError(res, 404, "User with this email not found");
      }
      if (error.message === "ALREADY_A_MEMBER") {
        return sendError(res, 400, "User is already a member of this organization");
      }
      if (error.message === "INVALID_MEMBER_DATA") {
        return sendError(res, 400, "Please provide a valid userId or email");
      }
    }
    return sendError(res, 500, "Unable to add member");
  }
};

export const listMembers = async (req: Request, res: Response) => {
  const data = await organizationService.listMembers(
    Number(req.params.organizationId),
    req.user!.userId
  );
  return res.json({ success: true, data });
};