import { User, IUser } from "../models/user.js";
import { Lesson } from "../models/lessons.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { AppError } from "../utils/appError.js";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: IUser["role"];
  preferredLanguage?: string;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const toAuthUser = (user: IUser): AuthUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  preferredLanguage: user.preferredLanguege || "en",
});

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = new User({
    ...data,
    role: (data.role as IUser["role"]) || "user",
    password: hashedPassword,
  });
  return await user.save();
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: IUser["role"];
}): Promise<AuthUser> => {
  const email = normalizeEmail(data.email);
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = new User({
    ...data,
    email,
    role: data.role || "user",
    password: hashedPassword,
  });

  await user.save();
  return toAuthUser(user);
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().populate("lessons", "name date time type");
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await User.findById(id).populate("lessons", "name date time type");
};

export const updateUser = async (
  id: string,
  updates: Partial<IUser>
): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  return await User.findByIdAndUpdate(id, updates, { new: true });
};

export const setUserRole = async (
  id: string,
  role: IUser["role"]
): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findByIdAndUpdate(id, { role }, { new: true });
};

export const setUserLanguage = async (
  id: string,
  language: string
): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findByIdAndUpdate(id, { preferredLanguege: language }, { new: true });
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const user = await User.findById(id);
  if (!user) return null;

  if (user.lessons && user.lessons.length > 0) {
    await Lesson.updateMany(
      { _id: { $in: user.lessons } },
      { $pull: { students: user._id } }
    );
  }

  return await User.findByIdAndDelete(id);
};


export const loginUser = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;
  return user;
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  return toAuthUser(user);
};

export const addLessonToUser = async (
  userId: string,
  lessonId: string
): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
    return null;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { lessons: lessonId } },
    { new: true }
  );
  if (updatedUser) {
    await Lesson.findByIdAndUpdate(
      lessonId,
      { $addToSet: { students: userId } },
      { new: true }
    );
  }

  return updatedUser;
};

export const removeLessonFromUser = async (
  userId: string,
  lessonId: string
): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(lessonId)) {
    return null;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { lessons: lessonId } },
    { new: true }
  );

  if (updatedUser) {
    await Lesson.findByIdAndUpdate(
      lessonId,
      { $pull: { students: userId } },
      { new: true }
    );
  }

  return updatedUser;
};