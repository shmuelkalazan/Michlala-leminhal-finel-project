import { Router } from "express";
import {
  getUsers,
  getUser,
  createUserController,
  updateUserController,
  deleteUserController,
  loginController,
  addLessonController,
  removeLessonController,
  setUserRoleController,
  setUserLanguageController
} from "../controllers/userController.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUserController);
router.post("/signup", createUserController);
router.put("/:id", authorize("admin"), updateUserController);
router.delete("/:id", authorize("admin"), deleteUserController);

router.post("/login", loginController);

router.post("/add-lesson", addLessonController);
router.post("/remove-lesson", removeLessonController);
router.put("/:id/role", authorize("admin"), setUserRoleController);
router.put("/:id/language", setUserLanguageController);

export default router;
