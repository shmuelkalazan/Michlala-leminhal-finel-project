import { Request, Response } from "express";
import * as branchService from "../services/branchService.js";

export const getBranches = async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await branchService.getAllBranches());
  } catch (e) {
    res.status(500).json({ message: "Error fetching branches" });
  }
};

export const getBranch = async (req: Request, res: Response) => {
  try {
    const branch = await branchService.getBranchById(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.status(200).json(branch);
  } catch (e) {
    res.status(500).json({ message: "Error fetching branch" });
  }
};

export const createBranchController = async (req: Request, res: Response) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) return res.status(400).json({ message: "Missing fields" });
  try {
    res.status(201).json(await branchService.createBranch({ name, address, phone }));
  } catch (e) {
    res.status(500).json({ message: "Error creating branch" });
  }
};

export const updateBranchController = async (req: Request, res: Response) => {
  try {
    const updated = await branchService.updateBranch(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Branch not found" });
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: "Error updating branch" });
  }
};

export const deleteBranchController = async (req: Request, res: Response) => {
  try {
    const deleted = await branchService.deleteBranch(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Branch not found" });
    res.status(200).json({ message: "Branch deleted" });
  } catch (e) {
    res.status(500).json({ message: "Error deleting branch" });
  }
};
