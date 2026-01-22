import mongoose from "mongoose";
import { Branch, IBranch } from "../models/branch.js";

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
 */
export const deleteBranch = async (id: string): Promise<IBranch | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Branch.findByIdAndDelete(id);
};
