// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { getAllUsers, getUserById } from "../services/userServic.js";

export const getUsers = (req: Request, res: Response): void => {
  const users = getAllUsers();
  res.json(users);
};

export const getUser = (req: Request, res: Response): void => {
  const idParam = req.params.id;
  if (!idParam) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  const id = parseInt(idParam, 10);
  const user = getUserById(id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
};
