import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { uploadMiddleware } from "../middleware/upload";
import { uploadImageController } from "../controllers/uploadController";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post(
  "/upload",
  authenticate,
  uploadMiddleware.single("image"),
  asyncHandler(uploadImageController)
);

export default router;
