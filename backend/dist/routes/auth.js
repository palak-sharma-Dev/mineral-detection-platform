"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.post("/register", (0, express_validator_1.body)("name")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"), (0, express_validator_1.body)("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"), validation_1.validateRequest, (0, asyncHandler_1.asyncHandler)(authController_1.registerController));
router.post("/login", (0, express_validator_1.body)("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(), (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"), validation_1.validateRequest, (0, asyncHandler_1.asyncHandler)(authController_1.loginController));
exports.default = router;
