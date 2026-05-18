import { Router } from "express";
import { body } from "express-validator";
import * as ctrl from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").optional().isIn(["admin", "hr"]),
  ],
  ctrl.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
  ],
  ctrl.login
);

router.get("/me", authenticate, ctrl.me);

export default router;
