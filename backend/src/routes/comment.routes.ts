import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/comment.controller";

const router = Router({ mergeParams: true });
router.use(requireAuth);
router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));

export default router;