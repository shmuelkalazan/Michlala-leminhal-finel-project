import { User, IUser } from "../models/user.js";
import bcrypt from "bcrypt";

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = new User({ ...data, role: "user", password: hashedPassword });
  return await user.save();
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const loginUser = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  const user = await User.findOne({ email });
  console.log(user);

  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
};
