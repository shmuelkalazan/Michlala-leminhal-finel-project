import { Router } from "express";
import { getUsers, getUser, createUserController, loginController } from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUserController); 
router.post("/login", loginController);

export default router;
