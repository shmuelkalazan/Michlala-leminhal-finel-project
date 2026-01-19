import { atom } from "jotai";

export type UserRole = "user" | "trainer" | "admin";

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage?: string;
};

export const authUserAtom = atom<AuthUser | null>(null);
export const currentLanguageAtom = atom<string>("en");
