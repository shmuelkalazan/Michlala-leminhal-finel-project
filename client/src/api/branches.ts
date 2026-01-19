import { Branch } from "../types/interface";

const BASE_URL = "http://localhost:3000";

export const fetchBranches = async (): Promise<Branch[]> => {
  const response = await fetch(`${BASE_URL}/branches/public`);
  if (!response.ok) {
    throw new Error("Failed to fetch branches");
  }
  return response.json();
};
