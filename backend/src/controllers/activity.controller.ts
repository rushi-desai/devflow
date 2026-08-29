import { Request, Response } from "express";
import * as activityService from "../services/activity.service";

export const list = async (req: Request, res: Response) => {
  const data = await activityService.listActivities(req.user!.userId);
  return res.json({ success: true, data });
};