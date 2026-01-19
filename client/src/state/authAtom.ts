import { atom } from "jotai";

export type UserRole = "user" | "trainer" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export const authUserAtom = atom<AuthUser | null>(null);
