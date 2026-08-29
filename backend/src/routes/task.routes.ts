import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/task.controller";
import commentRoutes from "./comment.routes";

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
router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));
router.get("/:taskId", asyncHandler(controller.getById));
router.patch("/:taskId", asyncHandler(controller.update));
router.delete("/:taskId", asyncHandler(controller.remove));

// Nested comments under task
router.use("/:taskId/comments", commentRoutes);

export default router;