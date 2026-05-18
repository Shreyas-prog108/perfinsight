import { Router } from "express";
import { body, query, param } from "express-validator";
import * as ctrl from "../controllers/employee.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate);
router.use(requireRoles("hr", "admin"));

router.post(
  "/",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail().normalizeEmail(),
    body("department").trim().notEmpty(),
    body("skills").optional().isArray({ min: 0 }),
    body("performanceScore").isFloat({ min: 0, max: 100 }),
    body("experience").isFloat({ min: 0 }),
    body("password").optional({ checkFalsy: true }).isLength({ min: 6 }),
  ],
  ctrl.createEmployee
);

router.get("/search", [query("department").optional().isString().trim()], ctrl.searchEmployees);
router.get("/", ctrl.listEmployees);
router.get("/:id", [param("id").isMongoId()], ctrl.getEmployee);

router.patch(
  "/:id/performance",
  [
    param("id").isMongoId(),
    body("performanceScore").isFloat({ min: 0, max: 100 }),
  ],
  ctrl.updatePerformance
);

router.delete("/:id", [param("id").isMongoId()], ctrl.deleteEmployee);

export default router;
