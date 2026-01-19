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

router.post("/",  authorize("admin", "trainer"), createLessonController);
router.put("/:id",  authorize("admin", "trainer"), updateLessonController);
router.delete("/:id",  authorize("admin", "trainer"), deleteLessonController);

export default router;
