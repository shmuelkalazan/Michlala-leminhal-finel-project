import mongoose from "mongoose";
import { Branch, IBranch } from "../models/branch.js";

export const getAllBranches = async (): Promise<IBranch[]> =>
  Branch.find().populate("lessons");

export const getBranchById = async (id: string): Promise<IBranch | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Branch.findById(id).populate("lessons");
};

export const createBranch = async (data: {
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}): Promise<IBranch> => new Branch(data).save();

export const updateBranch = async (
  id: string,
  updates: Partial<IBranch>
): Promise<IBranch | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Branch.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteBranch = async (id: string): Promise<IBranch | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Branch.findByIdAndDelete(id);
};
