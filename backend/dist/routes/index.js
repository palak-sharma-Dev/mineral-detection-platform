"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const protected_1 = __importDefault(require("./protected"));
const history_1 = __importDefault(require("./history"));
const upload_1 = __importDefault(require("./upload"));
const predict_1 = __importDefault(require("./predict"));
const reports_1 = __importDefault(require("./reports"));
const subscription_1 = __importDefault(require("./subscription"));
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    res.json({ message: "Garud AI backend is ready." });
});
router.use("/auth", auth_1.default);
router.use("", protected_1.default);
router.use("", history_1.default);
router.use("", upload_1.default);
router.use("", predict_1.default);
router.use("", reports_1.default);
router.use("", subscription_1.default);
exports.default = router;
