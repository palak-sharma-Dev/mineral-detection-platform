import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createSubscriptionOrderController,
  getSubscriptionStatusController,
  verifySubscriptionPaymentController,
} from "../controllers/subscriptionController";

const router = Router();

router.get("/subscription/status", authenticate, asyncHandler(getSubscriptionStatusController));
router.post("/subscription/create-order", authenticate, asyncHandler(createSubscriptionOrderController));
router.post("/subscription/verify", authenticate, asyncHandler(verifySubscriptionPaymentController));

export default router;
