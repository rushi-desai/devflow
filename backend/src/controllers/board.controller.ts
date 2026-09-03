import { Request, Response } from "express";
import * as boardService from "../services/board.service";
import { sendError } from "../utils/response";

export const list = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId || req.query.projectId);
  if (!projectId) {
    return sendError(res, 400, "projectId is required");
  }
  const data = await boardService.listBoards(projectId, req.user!.userId);
  return res.json({ success: true, data });
};

export const getById = async (req: Request, res: Response) => {
  const data = await boardService.getBoardById(Number(req.params.boardId), req.user!.userId);
  return res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId || req.body.projectId);
  if (!projectId) {
    return sendError(res, 400, "projectId is required");
  }
  if (!req.body.name || !req.body.name.trim()) {
    return sendError(res, 400, "Board name is required");
  }

  const data = await boardService.createBoard(
    projectId,
    req.body.name.trim(),
    req.user!.userId
  );
  return res.status(201).json({ success: true, data });
};