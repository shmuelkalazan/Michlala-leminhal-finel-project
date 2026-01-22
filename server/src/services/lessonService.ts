import { Lesson } from "../models/lessons.js";
import { User } from "../models/user.js";
import { Branch } from "../models/branch.js";
import mongoose from "mongoose";

export const getAllLessons = async () => {
  // First, check raw lessons from DB
  const rawLessons = await Lesson.find().limit(1);
  if (rawLessons.length > 0 && rawLessons[0]) {
    const rawLesson = rawLessons[0];
    console.log("Raw lesson from DB (before populate):", {
      _id: rawLesson._id,
      branchId: rawLesson.branchId,
      branchIdType: typeof rawLesson.branchId,
      branchIdValue: rawLesson.branchId?.toString()
    });
  }
  
  // Try without lean first to see if populate works better
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
  
  console.log("Lessons count:", lessons.length);
  if (lessons.length > 0 && lessons[0]) {
    const firstLesson = lessons[0];
    console.log("First lesson branchId:", firstLesson.branchId);
    console.log("First lesson branchId type:", typeof firstLesson.branchId);
    console.log("First lesson raw data:", JSON.stringify(firstLesson.toObject ? firstLesson.toObject() : firstLesson, null, 2));
    if (firstLesson.branchId) {
      const branch = firstLesson.branchId as any;
      console.log("Branch details:", {
        _id: branch._id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone
      });
    } else {
      console.log("⚠️ branchId is null/undefined - lesson might not be linked to a branch!");
    }
  }
  
  // Convert to plain objects
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

