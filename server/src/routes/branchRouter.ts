import { Router } from "express";
import { authorize } from "../middlewares/authorize.js";
import {
  getBranches,
  getBranch,
  createBranchController,
  updateBranchController,
  deleteBranchController,
} from "../controllers/branchController.js";

const router = Router();

router.get("/", authorize("admin"), getBranches);
router.get("/:id", authorize("admin"), getBranch);
router.post("/", authorize("admin"), createBranchController);
router.put("/:id", authorize("admin"), updateBranchController);
router.delete("/:id", authorize("admin"), deleteBranchController);

export default router;
