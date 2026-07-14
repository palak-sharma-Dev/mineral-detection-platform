import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/role";
import {
  activateUserController,
  adminDashboardController,
  adminAnalyticsController,
  customerDashboardController,
  deactivateUserController,
  deleteUserController,
  deleteSnapshotController,
  getMeController,
  getSnapshotController,
  getSubscriptionsController,
  getUsersController,
} from "../controllers/userController";

const router = Router();

router.get("/auth/me", authenticate, getMeController);
router.get("/admin/dashboard", authenticate, authorize(["admin"]), adminDashboardController);
router.get("/admin/analytics", authenticate, authorize(["admin"]), adminAnalyticsController);
router.get("/admin/users", authenticate, authorize(["admin"]), getUsersController);
router.patch("/admin/users/:id/activate", authenticate, authorize(["admin"]), activateUserController);
router.patch("/admin/users/:id/deactivate", authenticate, authorize(["admin"]), deactivateUserController);
router.delete("/admin/users/:id", authenticate, authorize(["admin"]), deleteUserController);
router.get("/admin/subscriptions", authenticate, authorize(["admin"]), getSubscriptionsController);
router.get("/snapshots", authenticate, getSnapshotController);
router.delete("/admin/snapshots/:id", authenticate, authorize(["admin"]), deleteSnapshotController);
router.get("/dashboard", authenticate, authorize(["customer"]), customerDashboardController);

export default router;
