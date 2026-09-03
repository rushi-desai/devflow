import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/project.controller";
import boardRoutes from "./board.routes";
import { validate, validateParams, validateQuery } from "../middleware/validate";
import { projectBodySchema, projectParamsSchema, projectQuerySchema } from "../utils/validation";

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
router.get("/", validateQuery(projectQuerySchema), asyncHandler(controller.list));
router.post("/", validate(projectBodySchema), asyncHandler(controller.create));
router.get("/:projectId", validateParams(projectParamsSchema), asyncHandler(controller.getById));

// Nested boards under project
router.use("/:projectId/boards", validateParams(projectParamsSchema), boardRoutes);

export default router;