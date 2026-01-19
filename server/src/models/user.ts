import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "user" | "trainer" | "admin";
  lessons?: mongoose.Types.ObjectId[];
  preferredLanguege?: string;
  registrationDate?: Date;
  isPayed?: Boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ["user", "trainer", "admin"],
    default: "user",
    required: true,
  },
  preferredLanguege: { type: String, default: "en" },
  registrationDate: { type: Date },
  isPayed: { type: Boolean, default: false },
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return { ...ret, id: ret._id };
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);
