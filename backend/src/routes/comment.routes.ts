import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/comment.controller";
import { validate, validateParams } from "../middleware/validate";
import { commentBodySchema, taskParamsSchema } from "../utils/validation";

const router = Router({ mergeParams: true });
router.use(requireAuth);
router.get("/", validateParams(taskParamsSchema), asyncHandler(controller.list));
router.post("/", validateParams(taskParamsSchema), validate(commentBodySchema), asyncHandler(controller.create));

export default router;