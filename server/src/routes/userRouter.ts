import { Router } from "express";
import {
  getUsers,
  getUser,
  getCurrentUser,
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
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.get("/", authenticate, getUsers);
router.get("/:id", authenticate, getUser);
router.post("/", createUserController);
router.post("/signup", createUserController);
router.put("/:id", authenticate, authorize("admin"), updateUserController);
router.delete("/:id", authenticate, authorize("admin"), deleteUserController);

router.post("/login", loginController);

router.post("/add-lesson", authenticate, addLessonController);
router.post("/remove-lesson", authenticate, removeLessonController);
router.put("/:id/role", authenticate, authorize("admin"), setUserRoleController);
router.put("/:id/language", authenticate, setUserLanguageController);

export default router;
