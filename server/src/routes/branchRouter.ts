import { Router } from "express";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/auth.js";
import {
  getBranches,
  getBranch,
  createBranchController,
  updateBranchController,
  deleteBranchController,
} from "../controllers/branchController.js";

const router = Router();

router.get("/public", getBranches);
router.get("/", authenticate, authorize("admin"), getBranches);
router.get("/:id", authenticate, authorize("admin"), getBranch);
router.post("/", authenticate, authorize("admin"), createBranchController);
router.put("/:id", authenticate, authorize("admin"), updateBranchController);
router.delete("/:id", authenticate, authorize("admin"), deleteBranchController);

export default router;
