import { Router } from "express";
import { getUsers, getUser } from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
