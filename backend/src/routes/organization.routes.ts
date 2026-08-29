import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/organization.controller";
import projectRoutes from "./project.routes";

const router = Router();
router.use(requireAuth);

/**
 * @openapi
 * /organizations:
 *   get:
 *     summary: List user's organizations
 *     tags: [Organizations]
 *   post:
 *     summary: Create organization
 *     tags: [Organizations]
 */
router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));
router.get("/:organizationId", asyncHandler(controller.getById));
router.get("/:organizationId/members", asyncHandler(controller.listMembers));
router.post("/:organizationId/members", asyncHandler(controller.addMember));

// Nested projects under organization
router.use("/:organizationId/projects", projectRoutes);

export default router;