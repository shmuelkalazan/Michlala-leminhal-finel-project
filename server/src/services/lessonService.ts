import { Lesson } from "../models/lessons.js";
import { User } from "../models/user.js";
import mongoose from "mongoose";

export const getAllLessons = async () => {
  return Lesson.find()
    .populate("coachId", "name email")
    .populate("students", "name email");
};

export const getLessonById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Lesson.findById(id)
    .populate("coachId", "name email")
    .populate("students", "name email");
};

export const createLesson = async (lessonData: any) => {
  const newLesson = new Lesson(lessonData);
  const savedLesson = await newLesson.save();

  if (lessonData.students && lessonData.students.length > 0) {
    await User.updateMany(
      { _id: { $in: lessonData.students } },
      { $addToSet: { lessons: savedLesson._id } }
    );
  }

  return savedLesson;
};

export const updateLesson = async (id: string, updates: any) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const updatedLesson = await Lesson.findByIdAndUpdate(id, updates, { new: true });
  return updatedLesson;
};

export const deleteLesson = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const lesson = await Lesson.findById(id);
  if (!lesson) return null;

  if (lesson.students && lesson.students.length > 0) {
    await User.updateMany(
      { _id: { $in: lesson.students } },
      { $pull: { lessons: lesson._id } }
    );
  }

  const deletedLesson = await Lesson.findByIdAndDelete(id);
  return deletedLesson;
};

