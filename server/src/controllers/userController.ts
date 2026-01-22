import { Request, Response } from "express";
import * as userService from "../services/userServic.js";
import mongoose from "mongoose";
import { AppError } from "../utils/appError.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    
    // אם המשתמש המחובר מנסה לקבל את המידע שלו, או אם הוא admin
    if (req.user && (req.user.id === id || req.user.role === "admin")) {
      const user = await userService.getUserById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // יצירת AuthUser object
    const authUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguege || "en",
    };
    
    res.status(200).json(authUser);
  } catch (error) {
    res.status(500).json({ message: "Error fetching current user", error });
  }
};

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const newUser = await userService.registerUser({ name, email, password, role });
    
    // Generate JWT token for auto-login after signup
    const { generateToken } = await import('../services/jwtService.js');
    const token = generateToken(newUser.id, newUser.role);
    
    res.status(201).json({
      user: newUser,
      token
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    const updatedUser = await userService.updateUser(id, req.body);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await userService.authenticateUser(email, password);
    
    // Generate JWT token
    const { generateToken } = await import('../services/jwtService.js');
    const token = generateToken(user.id, user.role);
    
    res.status(200).json({
      user,
      token
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Error logging in" });
  }
};

export const addLessonController = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user?.id;
    
    if (!userId || !lessonId) {
      return res.status(400).json({ message: "User must be authenticated and lessonId is required" });
    }
    
    const updatedUser = await userService.addLessonToUser(userId, lessonId);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error adding lesson to user", error });
  }
};

export const removeLessonController = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user?.id;
    
    if (!userId || !lessonId) {
      return res.status(400).json({ message: "User must be authenticated and lessonId is required" });
    }

    const updatedUser = await userService.removeLessonFromUser(userId, lessonId);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error removing lesson from user", error });
  }
};

export const setUserRoleController = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: "role is required" });
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    const updated = await userService.setUserRole(id, role);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: "Error updating role" });
  }
};

export const setUserLanguageController = async (req: Request, res: Response) => {
  try {
    const { language } = req.body;
    if (!language) return res.status(400).json({ message: "language is required" });
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    const updated = await userService.setUserLanguage(id, language);
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: "Error updating language" });
  }
};
