import { Request, Response } from "express";
import * as lessonService from "../services/lessonService.js";

export const getLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await lessonService.getAllLessons();
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lessons", error });
  }
};

export const getLesson = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Lesson ID is required" });
    }
    const lesson = await lessonService.getLessonById(id);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lesson", error });
  }
};

export const createLessonController = async (req: Request, res: Response) => {
  try {
    const newLesson = await lessonService.createLesson(req.body);
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: "Error creating lesson", error });
  }
};

export const updateLessonController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Lesson ID is required" });
    }
    const updatedLesson = await lessonService.updateLesson(id, req.body);
    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: "Error updating lesson", error });
  }
};

export const deleteLessonController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Lesson ID is required" });
    }
    const deletedLesson = await lessonService.deleteLesson(id);
    if (!deletedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lesson", error });
  }
};
