import { Router } from "express";
import {
  getLessons,
  getLesson,
  createLessonController,
  updateLessonController,
  deleteLessonController,
} from "../controllers/lessonController.js";

const router = Router();

router.get("/", getLessons);
router.get("/:id", getLesson);
router.post("/", createLessonController);
router.put("/:id", updateLessonController);
router.delete("/:id", deleteLessonController);

export default router;
