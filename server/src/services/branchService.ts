import mongoose from "mongoose";
import { Branch, IBranch } from "../models/branch.js";
import { Lesson } from "../models/lessons.js";
import { User } from "../models/user.js";

/**
 * Get all branches with populated lessons
 */
export const getAllBranches = async (): Promise<IBranch[]> =>
  Branch.find().populate("lessons");

/**
 * Get branch by ID with populated lessons
 */
export const getBranchById = async (id: string): Promise<IBranch | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Branch.findById(id).populate("lessons");
};

/**
 * Create a new branch
 */
export const createBranch = async (data: {
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}): Promise<IBranch> => new Branch(data).save();

/**
 * Update branch information
 */
export const updateBranch = async (
  id: string,
  updates: Partial<IBranch>
): Promise<IBranch | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Branch.findByIdAndUpdate(id, updates, { new: true });
};

/**
 * Delete a branch
 * Also deletes all lessons associated with the branch
 * and removes lesson references from trainers and students
 */
export const deleteBranch = async (id: string): Promise<IBranch | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  // Find all lessons associated with this branch
  const lessons = await Lesson.find({ branchId: id });

  // For each lesson, remove it from users (trainers and students) and delete it
  for (const lesson of lessons) {
    // Remove lesson from all students' lessons arrays
    if (lesson.students && lesson.students.length > 0) {
      await User.updateMany(
        { _id: { $in: lesson.students } },
        { $pull: { lessons: lesson._id } }
      );
    }

    // Remove lesson from the coach's lessons array
    if (lesson.coachId) {
      await User.findByIdAndUpdate(lesson.coachId, {
        $pull: { lessons: lesson._id }
      });
    }

    // Delete the lesson
    await Lesson.findByIdAndDelete(lesson._id);
  }

  // Finally, delete the branch
  return Branch.findByIdAndDelete(id);
};
