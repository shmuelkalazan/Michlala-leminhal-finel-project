import { API_URL } from "./config";

type Credentials = { email: string; password: string };
type SignupPayload = Credentials & { name: string };

/**
 * Handle API response and parse JSON
 */
const handleResponse = async (res: Response) => {
  let data;
  try {
    const text = await res.text();
    if (!text) {
      throw new Error("Empty response from server");
    }
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse response: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
  
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

export const signup = async (payload: SignupPayload) => {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  const data = await handleResponse(response);
  
  // Save token for auto-login after signup
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  
  return data;
};

export const login = async (payload: Credentials) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  const data = await handleResponse(response);
  
  // Save token in localStorage
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  
  return data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: getAuthHeaders(),
  });
  
  return handleResponse(response);
};
