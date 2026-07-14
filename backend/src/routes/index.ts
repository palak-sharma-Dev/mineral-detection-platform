import { Router } from "express";
import authRoutes from "./auth";
import protectedRoutes from "./protected";
import historyRoutes from "./history";
import uploadRoutes from "./upload";
import predictRoutes from "./predict";
import reportRoutes from "./reports";
import subscriptionRoutes from "./subscription";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Garud AI backend is ready." });
});

router.use("/auth", authRoutes);
router.use("", protectedRoutes);
router.use("", historyRoutes);
router.use("", uploadRoutes);
router.use("", predictRoutes);
router.use("", reportRoutes);
router.use("", subscriptionRoutes);

export default router;
