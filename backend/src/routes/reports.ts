import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  downloadReportController,
  getReportByIdController,
  getReportsController,
} from "../controllers/reportController";

const router = Router();

router.get("/reports", authenticate, asyncHandler(getReportsController));
router.get("/reports/:id", authenticate, asyncHandler(getReportByIdController));
router.get("/reports/:id/download", authenticate, asyncHandler(downloadReportController));

export default router;
