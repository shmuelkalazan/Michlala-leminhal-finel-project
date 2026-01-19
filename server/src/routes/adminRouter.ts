import { Router } from "express";
import { authorize } from "../middlewares/authorize.js";
import { adminDashboardController } from "../controllers/adminController.js";

const router = Router();

router.get("/dashboard", authorize("admin"), adminDashboardController);

export default router;
