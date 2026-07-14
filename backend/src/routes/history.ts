import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { getHistoryController, getUploadDetailsController } from "../controllers/historyController";

const router = Router();

router.get("/history", authenticate, getHistoryController);
router.get("/history/:id", authenticate, getUploadDetailsController);

export default router;
