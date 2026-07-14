"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
router.post("/register", (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Name is required"), (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"), validation_1.validateRequest, (0, asyncHandler_1.asyncHandler)(authController_1.registerController));
router.post("/login", (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"), (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"), validation_1.validateRequest, (0, asyncHandler_1.asyncHandler)(authController_1.loginController));
exports.default = router;
