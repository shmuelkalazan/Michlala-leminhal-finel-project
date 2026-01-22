import { Router } from "express";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/auth.js";
import { adminDashboardController } from "../controllers/adminController.js";

const router = Router();

router.get("/dashboard", authenticate, authorize("admin"), adminDashboardController);

export default router;
