import { Request, Response } from "express";
import * as commentService from "../services/comment.service";

export const list = async (req: Request, res: Response) => {
  const data = await commentService.listComments(Number(req.params.taskId));
  return res.json({ success: true, data });
};

export const create = async (req: Request, res: Response) => {
  const data = await commentService.createComment(req.user!.userId, Number(req.params.taskId), req.body.content);
  return res.status(201).json({ success: true, data });
};