import { Request, Response } from "express";
import { getAdminDashboard } from "../services/adminService.js";

export const adminDashboardController = async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await getAdminDashboard());
  } catch (e) {
    res.status(500).json({ message: "Error building dashboard" });
  }
};
