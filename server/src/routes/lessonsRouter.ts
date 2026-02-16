import { Router } from "express";
import {
  getLessons,
  getLesson,
  createLessonController,
  updateLessonController,
  deleteLessonController,
} from "../controllers/lessonController.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", getLessons);
router.get("/:id", getLesson);

router.post("/", authenticate, authorize("trainer"), createLessonController);
router.put("/:id", authenticate, authorize("trainer"), updateLessonController);
router.delete("/:id", authenticate, authorize("trainer"), deleteLessonController);

export default router;
