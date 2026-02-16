import { Lesson } from "../models/lessons.js";
import { User } from "../models/user.js";
import { Branch } from "../models/branch.js";
import mongoose from "mongoose";

/**
 * Get all lessons with populated coach, branch, and students
 * @returns Array of lessons with populated relationships
 */
export const getAllLessons = async () => {
  const lessons = await Lesson.find()
    .populate({
      path: "coachId",
      select: "name email"
    })
    .populate({
      path: "branchId",
      select: "name address phone"
    })
    .populate({
      path: "students",
      select: "name email"
    });
  
  // Convert to plain objects and format branchId
  return lessons.map((lesson: any) => {
    const lessonObj = lesson.toObject ? lesson.toObject() : lesson;
    
    // Ensure branchId is properly formatted
    if (lessonObj.branchId) {
      if (typeof lessonObj.branchId === 'object' && lessonObj.branchId._id) {
        const branch = lessonObj.branchId as any;
        return {
          ...lessonObj,
          branchId: {
            _id: branch._id.toString(),
            name: branch.name || '',
            address: branch.address || '',
            phone: branch.phone || ''
          }
        };
      }
    }
    
    return lessonObj;
  });
};

/**
 * Get a single lesson by ID with populated relationships
 * @param id - Lesson ID
 * @returns Lesson object or null if not found
 */
export const getLessonById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const lesson = await Lesson.findById(id)
    .populate({
      path: "coachId",
      select: "name email"
    })
    .populate({
      path: "branchId",
      select: "name address phone"
    })
    .populate({
      path: "students",
      select: "name email"
    });
  
  if (!lesson) return null;
  
  const lessonObj = lesson.toObject ? lesson.toObject() : lesson;
  
  // Ensure branchId is properly formatted
  if (lessonObj.branchId && typeof lessonObj.branchId === 'object' && lessonObj.branchId._id) {
    const branch = lessonObj.branchId as any;
    return {
      ...lessonObj,
      branchId: {
        _id: branch._id.toString(),
        name: branch.name || '',
        address: branch.address || '',
        phone: branch.phone || ''
      }
    };
  }
  
  return lessonObj;
};

/**
 * Create a new lesson and link it to branch and students
 * @param lessonData - Lesson data including branchId
 * @returns Created lesson with populated relationships
 */
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

  // Return with populated fields
  const populated = await Lesson.findById(savedLesson._id)
    .populate({
      path: "coachId",
      select: "name email"
    })
    .populate({
      path: "branchId",
      select: "name address phone"
    })
    .populate({
      path: "students",
      select: "name email"
    });
  
  if (!populated) return null;
  
  const lessonObj = populated.toObject ? populated.toObject() : populated;
  
  if (lessonObj.branchId && typeof lessonObj.branchId === 'object' && lessonObj.branchId._id) {
    const branch = lessonObj.branchId as any;
    return {
      ...lessonObj,
      branchId: {
        _id: branch._id.toString(),
        name: branch.name || '',
        address: branch.address || '',
        phone: branch.phone || ''
      }
    };
  }
  
  return lessonObj;
};

/**
 * Update a lesson and manage branch relationships
 * @param id - Lesson ID
 * @param updates - Update data
 * @returns Updated lesson with populated relationships
 */
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
  
  // Return with populated fields
  if (updatedLesson) {
    const populated = await Lesson.findById(id)
      .populate({
        path: "coachId",
        select: "name email"
      })
      .populate({
        path: "branchId",
        select: "name address phone"
      })
      .populate({
        path: "students",
        select: "name email"
      });
    
    if (!populated) return null;
    
    const lessonObj = populated.toObject ? populated.toObject() : populated;
    
    if (lessonObj.branchId && typeof lessonObj.branchId === 'object' && lessonObj.branchId._id) {
      const branch = lessonObj.branchId as any;
      return {
        ...lessonObj,
        branchId: {
          _id: branch._id.toString(),
          name: branch.name || '',
          address: branch.address || '',
          phone: branch.phone || ''
        }
      };
    }
    
    return lessonObj;
  }
  
  return null;
};

/**
 * Delete a lesson and remove it from related branches and users
 * @param id - Lesson ID
 * @returns Deleted lesson or null if not found
 */
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

