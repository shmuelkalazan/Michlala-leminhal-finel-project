import { AuthUser } from "../state/authAtom";
import { Lesson } from "../types/interface";

const BASE_URL = "http://localhost:3000";

const handle = async (res: globalThis.Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const fetchLessons = () =>
  fetch(`${BASE_URL}/lessons`).then(handle) as Promise<Lesson[]>;

export const enrollInLesson = (userId: string, lessonId: string) =>
  fetch(`${BASE_URL}/users/add-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, lessonId }),
  }).then(handle);

export const cancelLesson = (userId: string, lessonId: string) =>
  fetch(`${BASE_URL}/users/remove-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, lessonId }),
  }).then(handle);

export const fetchUserWithLessons = (user: AuthUser) => {
  if (!user?.id) throw new Error("Missing user id");
  return fetch(`${BASE_URL}/users/${user.id}`).then(handle);
};

export const createLesson = (payload: Partial<Lesson>, user?: AuthUser) =>
  fetch(`${BASE_URL}/lessons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(user ? { "x-role": user.role, "x-user-id": user.id || "" } : {}),
    },
    body: JSON.stringify(payload),
  }).then(handle);

export const updateLesson = (id: string, payload: Partial<Lesson>, user?: AuthUser) =>
  fetch(`${BASE_URL}/lessons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(user ? { "x-role": user.role, "x-user-id": user.id || "" } : {}),
    },
    body: JSON.stringify(payload),
  }).then(handle);

export const deleteLesson = (id: string, user?: AuthUser) =>
  fetch(`${BASE_URL}/lessons/${id}`, {
    method: "DELETE",
    headers: user ? { "x-role": user.role, "x-user-id": user.id || "" } : undefined,
  }).then(handle);
