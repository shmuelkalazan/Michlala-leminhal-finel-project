import { AuthUser } from "../state/authAtom";
import { Lesson } from "../types/interface";
import { getAuthHeaders } from "./auth";

const BASE_URL = "http://localhost:3000";

/**
 * Handle API response and parse JSON
 */
const handle = async (res: globalThis.Response) => {
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

export const fetchLessons = () =>
  fetch(`${BASE_URL}/lessons`).then(handle) as Promise<Lesson[]>;

export const enrollInLesson = (lessonId: string) =>
  fetch(`${BASE_URL}/users/add-lesson`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ lessonId }),
  }).then(handle);

export const cancelLesson = (lessonId: string) =>
  fetch(`${BASE_URL}/users/remove-lesson`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ lessonId }),
  }).then(handle);

export const fetchUserWithLessons = (user: AuthUser) => {
  if (!user?.id) throw new Error("Missing user id");
  return fetch(`${BASE_URL}/users/${user.id}`, {
    headers: getAuthHeaders(),
  }).then(handle);
};

export const createLesson = (payload: Partial<Lesson>) =>
  fetch(`${BASE_URL}/lessons`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }).then(handle);

export const updateLesson = (id: string, payload: Partial<Lesson>) =>
  fetch(`${BASE_URL}/lessons/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }).then(handle);

export const deleteLesson = (id: string) =>
  fetch(`${BASE_URL}/lessons/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then(handle);
