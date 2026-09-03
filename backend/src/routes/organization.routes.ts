import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../middleware/async-handler";
import * as controller from "../controllers/organization.controller";
import projectRoutes from "./project.routes";
import { validate, validateParams } from "../middleware/validate";
import { memberBodySchema, organizationBodySchema, organizationParamsSchema } from "../utils/validation";

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
router.post("/", validate(organizationBodySchema), asyncHandler(controller.create));
router.get("/:organizationId", validateParams(organizationParamsSchema), asyncHandler(controller.getById));
router.get("/:organizationId/members", validateParams(organizationParamsSchema), asyncHandler(controller.listMembers));
router.post("/:organizationId/members", validateParams(organizationParamsSchema), validate(memberBodySchema), asyncHandler(controller.addMember));

// Nested projects under organization
router.use("/:organizationId/projects", validateParams(organizationParamsSchema), projectRoutes);

export default router;