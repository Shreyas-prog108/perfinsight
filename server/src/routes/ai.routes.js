import { Router } from "express";
import { body } from "express-validator";
import * as ctrl from "../controllers/ai.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(requireRoles("hr", "admin"));

router.post(
  "/recommend",
  [body("employeeIds").optional().isArray(), body("employeeIds.*").optional().isMongoId()],
  ctrl.recommend
);

export default router;
