import { User } from "../models/user.js";
import { Lesson } from "../models/lessons.js";
import { Branch } from "../models/branch.js";

export const getAdminDashboard = async () => {
  const totalUsers = await User.countDocuments();
  const totalLessons = await Lesson.countDocuments();
  const totalBranches = await Branch.countDocuments();

  const usersLessons = await User.aggregate([
    { $project: { name: 1, email: 1, role: 1, lessonsCount: { $size: { $ifNull: ["$lessons", []] } } } },
    { $sort: { lessonsCount: -1 } },
  ]);

  const trainersOccupancy = await Lesson.aggregate([
    { $group: { _id: "$coachId", lessonsCount: { $sum: 1 }, studentsCount: { $sum: { $size: { $ifNull: ["$students", []] } } } } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "trainer" } },
    { $unwind: "$trainer" },
    { $project: { trainerId: "$_id", trainerName: "$trainer.name", trainerEmail: "$trainer.email", lessonsCount: 1, studentsCount: 1 } },
    { $sort: { studentsCount: -1 } },
  ]);

  const branchesOccupancy = await Branch.aggregate([
    { $lookup: { from: "lessons", localField: "lessons", foreignField: "_id", as: "branchLessons" } },
    { $addFields: { activeRegistrations: { $sum: { $map: { input: "$branchLessons", as: "l", in: { $size: { $ifNull: ["$$l.students", []] } } } } } } },
    { $project: { name: 1, address: 1, phone: 1, activeRegistrations: 1 } },
    { $sort: { activeRegistrations: -1 } },
  ]);

  return { totals: { totalUsers, totalLessons, totalBranches }, branchesOccupancy, trainersOccupancy, usersLessons };
};
