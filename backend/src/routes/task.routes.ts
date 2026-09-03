import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/task.controller";
import commentRoutes from "./comment.routes";
import { validate, validateParams, validateQuery } from "../middleware/validate";
import { taskBodySchema, taskCreateBodySchema, taskParamsSchema, taskQuerySchema } from "../utils/validation";

const router = Router({ mergeParams: true });
router.use(requireAuth);

/**
 * @openapi
 * /boards/{boardId}/tasks:
 *   get:
 *     summary: List tasks on board
 *     tags: [Tasks]
 *   post:
 *     summary: Create task on board
 *     tags: [Tasks]
 * /boards/{boardId}/tasks/{taskId}:
 *   patch:
 *     summary: Update task
 *     tags: [Tasks]
 */
router.get("/", validateQuery(taskQuerySchema), asyncHandler(controller.list));
router.post("/", validate(taskCreateBodySchema), asyncHandler(controller.create));
router.get("/:taskId", validateParams(taskParamsSchema), asyncHandler(controller.getById));
router.patch("/:taskId", validateParams(taskParamsSchema), validate(taskBodySchema), asyncHandler(controller.update));
router.delete("/:taskId", validateParams(taskParamsSchema), asyncHandler(controller.remove));

// Nested comments under task
router.use("/:taskId/comments", validateParams(taskParamsSchema), commentRoutes);

export default router;