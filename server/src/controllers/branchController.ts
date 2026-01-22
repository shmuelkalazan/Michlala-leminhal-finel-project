import { Request, Response } from "express";
import * as branchService from "../services/branchService.js";

/**
 * Get all branches
 */
export const getBranches = async (_req: Request, res: Response) => {
  try {
    res.status(200).json(await branchService.getAllBranches());
  } catch (e) {
    res.status(500).json({ message: "Error fetching branches" });
  }
};

/**
 * Get a single branch by ID
 */
export const getBranch = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Branch ID is required" });
    const branch = await branchService.getBranchById(id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.status(200).json(branch);
  } catch (e) {
    res.status(500).json({ message: "Error fetching branch" });
  }
};

/**
 * Create a new branch
 * Accepts location as string "lat,lon" or separate latitude/longitude
 */
export const createBranchController = async (req: Request, res: Response) => {
  const { name, address, phone, latitude, longitude, location } = req.body;
  if (!name || !address || !phone) return res.status(400).json({ message: "Missing fields" });
  try {
    let latNum: number | undefined;
    let lonNum: number | undefined;

    // Parse location string format "lat,lon"
    if (location && typeof location === 'string' && location.trim()) {
      const parts = location.split(',').map(s => s.trim());
      if (parts.length === 2 && parts[0] && parts[1]) {
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon)) {
          latNum = lat;
          lonNum = lon;
        }
      }
    } else {
      // Use separate latitude and longitude
      latNum =
        latitude === undefined || latitude === null || latitude === ""
          ? undefined
          : Number(latitude);
      lonNum =
        longitude === undefined || longitude === null || longitude === ""
          ? undefined
          : Number(longitude);
    }

    const payload: {
      name: string;
      address: string;
      phone: string;
      latitude?: number;
      longitude?: number;
    } = {
      name: String(name),
      address: String(address),
      phone: String(phone),
    };

    if (typeof latNum === "number" && Number.isFinite(latNum)) payload.latitude = latNum;
    if (typeof lonNum === "number" && Number.isFinite(lonNum)) payload.longitude = lonNum;

    res.status(201).json(await branchService.createBranch(payload));
  } catch (e) {
    res.status(500).json({ message: "Error creating branch" });
  }
};

/**
 * Update an existing branch
 * Accepts location as string "lat,lon" or separate latitude/longitude
 */
export const updateBranchController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Branch ID is required" });
    
    const { location, latitude, longitude, ...rest } = req.body;
    
    let updates: any = { ...rest };
    
    // Parse location string format "lat,lon"
    if (location && typeof location === 'string' && location.trim()) {
      const parts = location.split(',').map(s => s.trim());
      if (parts.length === 2 && parts[0] && parts[1]) {
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon)) {
          updates.latitude = lat;
          updates.longitude = lon;
        }
      }
    } else if (latitude !== undefined || longitude !== undefined) {
      // Use separate latitude and longitude
      if (latitude !== undefined && latitude !== null && latitude !== "") {
        const lat = Number(latitude);
        if (!isNaN(lat) && Number.isFinite(lat)) {
          updates.latitude = lat;
        }
      }
      if (longitude !== undefined && longitude !== null && longitude !== "") {
        const lon = Number(longitude);
        if (!isNaN(lon) && Number.isFinite(lon)) {
          updates.longitude = lon;
        }
      }
    }
    
    const updated = await branchService.updateBranch(id, updates);
    if (!updated) return res.status(404).json({ message: "Branch not found" });
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: "Error updating branch" });
  }
};

/**
 * Delete a branch
 */
export const deleteBranchController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Branch ID is required" });
    const deleted = await branchService.deleteBranch(id);
    if (!deleted) return res.status(404).json({ message: "Branch not found" });
    res.status(200).json({ message: "Branch deleted" });
  } catch (e) {
    res.status(500).json({ message: "Error deleting branch" });
  }
};
