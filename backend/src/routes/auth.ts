import { Router } from "express";
import { body } from "express-validator";
import { registerController, loginController } from "../controllers/authController";
import { validateRequest } from "../middleware/validation";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post(
  "/register",
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validateRequest,
  asyncHandler(registerController)
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
  asyncHandler(loginController)
);

export default router;
