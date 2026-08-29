import { Request, Response } from "express";
import * as taskService from "../services/task.service";
import { sendError } from "../utils/response";

export const list = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId || req.query.boardId);
  if (!boardId) {
    return sendError(res, 400, "boardId is required");
  }
  const data = await taskService.listTasks(boardId);
  return res.json({ success: true, data });
};

export const getById = async (req: Request, res: Response) => {
  try {
    const data = await taskService.getTaskById(Number(req.params.taskId));
    return res.json({ success: true, data });
  } catch {
    return sendError(res, 404, "Task not found");
  }
};

export const create = async (req: Request, res: Response) => {
  const boardId = Number(req.params.boardId || req.body.boardId);
  if (!boardId) {
    return sendError(res, 400, "boardId is required");
  }
  if (!req.body.title || !req.body.title.trim()) {
    return sendError(res, 400, "Task title is required");
  }

  const data = await taskService.createTask(req.user!.userId, boardId, {
    title: req.body.title.trim(),
    description: req.body.description ? String(req.body.description).trim() : undefined,
    status: req.body.status,
    assigneeId: req.body.assigneeId
  });
  return res.status(201).json({ success: true, data });
};

export const update = async (req: Request, res: Response) => {
  const data = await taskService.updateTask(req.user!.userId, Number(req.params.taskId), req.body);
  return res.json({ success: true, data });
};

export const remove = async (req: Request, res: Response) => {
  const data = await taskService.deleteTask(req.user!.userId, Number(req.params.taskId));
  return res.json({ success: true, data });
};