import { Branch } from "../types/interface";
import { API_URL } from "./config";

export const fetchBranches = async (): Promise<Branch[]> => {
  const response = await fetch(`${API_URL}/branches/public`);
  if (!response.ok) {
    throw new Error("Failed to fetch branches");
  }
  return response.json();
};
