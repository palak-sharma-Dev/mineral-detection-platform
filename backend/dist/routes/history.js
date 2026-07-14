"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const historyController_1 = require("../controllers/historyController");
const router = (0, express_1.Router)();
router.get("/history", auth_1.authenticate, historyController_1.getHistoryController);
router.get("/history/:id", auth_1.authenticate, historyController_1.getUploadDetailsController);
exports.default = router;
