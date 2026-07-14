import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { getPredictionStatusController, getPredictionResultController } from "../controllers/predictController";

const router = Router();

router.get("/predict/status/:jobId", authenticate, asyncHandler(getPredictionStatusController));
router.get("/predict/result/:jobId", authenticate, asyncHandler(getPredictionResultController));

export default router;
