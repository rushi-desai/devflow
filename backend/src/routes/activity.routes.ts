import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/activity.controller";

const router = Router();
router.use(requireAuth);
router.get("/", asyncHandler(controller.list));

export default router;