import { Router } from "express";
import {
  getUsers,
  getUser,
  createUserController,
  updateUserController,
  deleteUserController,
  loginController,
  addLessonController,
  removeLessonController
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUserController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

router.post("/login", loginController);

router.post("/add-lesson", addLessonController);
router.post("/remove-lesson", removeLessonController);

export default router;
