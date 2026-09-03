import { Request, Response } from "express";
import * as projectService from "../services/project.service";
import { sendError } from "../utils/response";

export const list = async (req: Request, res: Response) => {
  const organizationId = Number(req.params.organizationId || req.query.organizationId);
  if (!organizationId) {
    return sendError(res, 400, "organizationId is required");
  }
  const data = await projectService.listProjects(organizationId, req.user!.userId);
  return res.json({ success: true, data });
};

export const getById = async (req: Request, res: Response) => {
  const data = await projectService.getProjectById(Number(req.params.projectId), req.user!.userId);
  return res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const organizationId = Number(req.params.organizationId || req.body.organizationId);
  if (!organizationId) {
    return sendError(res, 400, "organizationId is required");
  }
  if (!req.body.name || !req.body.name.trim()) {
    return sendError(res, 400, "Project name is required");
  }

  const data = await projectService.createProject(
    organizationId,
    req.user!.userId,
    {
      name: req.body.name.trim(),
      description: req.body.description ? String(req.body.description).trim() : undefined
    }
  );
  return res.status(201).json({ success: true, data });
};