import { Router } from "express";
import {
  getLessons,
  getLesson,
  createLessonController,
  updateLessonController,
  deleteLessonController,
} from "../controllers/lessonController.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router();

router.get("/", getLessons);
router.get("/:id", getLesson);

router.post("/",  authorize("admin", "coach"), createLessonController);

router.put("/:id",  authorize("admin", "coach"), updateLessonController);

router.delete("/:id",  authorize("admin"), deleteLessonController);

export default router;
