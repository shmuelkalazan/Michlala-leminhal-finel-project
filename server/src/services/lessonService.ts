import { Lesson } from "../models/lessons.js";
import { User } from "../models/user.js";
import { Branch } from "../models/branch.js";
import mongoose from "mongoose";

export const getAllLessons = async () => {
  return Lesson.find()
    .populate("coachId", "name email")
    .populate("branchId", "name address")
    .populate("students", "name email");
};

export const getLessonById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Lesson.findById(id)
    .populate("coachId", "name email")
    .populate("branchId", "name address")
    .populate("students", "name email");
};

export const createLesson = async (lessonData: any) => {
  if (!lessonData.branchId) {
    throw new Error("Branch ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(lessonData.branchId)) {
    throw new Error("Invalid Branch ID");
  }

  const branchExists = await Branch.findById(lessonData.branchId);
  if (!branchExists) {
    throw new Error("Branch not found");
  }

  const newLesson = new Lesson(lessonData);
  const savedLesson = await newLesson.save();

  await Branch.findByIdAndUpdate(lessonData.branchId, {
    $addToSet: { lessons: savedLesson._id }
  });

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

  const lesson = await Lesson.findById(id);
  if (!lesson) return null;

  if (updates.branchId) {
    if (!mongoose.Types.ObjectId.isValid(updates.branchId)) {
      throw new Error("Invalid Branch ID");
    }

    const branchExists = await Branch.findById(updates.branchId);
    if (!branchExists) {
      throw new Error("Branch not found");
    }

    if (lesson.branchId && lesson.branchId.toString() !== updates.branchId) {
      await Branch.findByIdAndUpdate(lesson.branchId, {
        $pull: { lessons: lesson._id }
      });
    }

    await Branch.findByIdAndUpdate(updates.branchId, {
      $addToSet: { lessons: lesson._id }
    });
  }

  const updatedLesson = await Lesson.findByIdAndUpdate(id, updates, { new: true });
  return updatedLesson;
};

export const deleteLesson = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const lesson = await Lesson.findById(id);
  if (!lesson) return null;

  if (lesson.branchId) {
    await Branch.findByIdAndUpdate(lesson.branchId, {
      $pull: { lessons: lesson._id }
    });
  }

  if (lesson.students && lesson.students.length > 0) {
    await User.updateMany(
      { _id: { $in: lesson.students } },
      { $pull: { lessons: lesson._id } }
    );
  }

  const deletedLesson = await Lesson.findByIdAndDelete(id);
  return deletedLesson;
};

