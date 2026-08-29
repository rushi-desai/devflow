import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/project.controller";
import boardRoutes from "./board.routes";

const router = Router({ mergeParams: true });
router.use(requireAuth);

/**
 * @openapi
 * /organizations/{organizationId}/projects:
 *   get:
 *     summary: List projects in organization
 *     tags: [Projects]
 *   post:
 *     summary: Create a project
 *     tags: [Projects]
 */
router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));
router.get("/:projectId", asyncHandler(controller.getById));

// Nested boards under project
router.use("/:projectId/boards", boardRoutes);

export default router;