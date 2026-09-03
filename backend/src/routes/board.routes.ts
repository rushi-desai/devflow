import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/board.controller";
import taskRoutes from "./task.routes";
import { validate, validateParams, validateQuery } from "../middleware/validate";
import { boardBodySchema, boardParamsSchema, boardQuerySchema } from "../utils/validation";

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
router.get("/", validateQuery(boardQuerySchema), asyncHandler(controller.list));
router.post("/", validate(boardBodySchema), asyncHandler(controller.create));
router.get("/:boardId", validateParams(boardParamsSchema), asyncHandler(controller.getById));

// Nested tasks under board
router.use("/:boardId/tasks", validateParams(boardParamsSchema), taskRoutes);

export default router;