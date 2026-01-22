import { Request, Response } from "express";
import * as userService from "../services/userServic.js";
import mongoose from "mongoose";
import { AppError } from "../utils/appError.js";

/**
 * Get all users
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

/**
 * Get user by ID
 * Users can only access their own data, admins can access any user
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    
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

/**
 * Get current authenticated user
 * Returns user data in AuthUser format
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await userService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
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

/**
 * Create a new user (signup)
 * Generates JWT token for auto-login
 */
export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const newUser = await userService.registerUser({ name, email, password, role });
    
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

/**
 * Update user information
 */
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

/**
 * Delete a user
 */
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

/**
 * User login
 * Authenticates user and returns JWT token
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await userService.authenticateUser(email, password);
    
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

/**
 * Add a lesson to user's enrolled lessons
 */
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

/**
 * Remove a lesson from user's enrolled lessons
 */
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

/**
 * Update user role (admin only)
 */
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

/**
 * Update user preferred language
 */
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
