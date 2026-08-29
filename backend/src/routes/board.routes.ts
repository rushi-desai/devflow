import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/board.controller";
import taskRoutes from "./task.routes";

const router = Router({ mergeParams: true });
router.use(requireAuth);

/**
 * @openapi
 * /projects/{projectId}/boards:
 *   get:
 *     summary: List boards in a project
 *     tags: [Boards]
 *   post:
 *     summary: Create a board
 *     tags: [Boards]
 */
router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));
router.get("/:boardId", asyncHandler(controller.getById));

// Nested tasks under board
router.use("/:boardId/tasks", taskRoutes);

export default router;