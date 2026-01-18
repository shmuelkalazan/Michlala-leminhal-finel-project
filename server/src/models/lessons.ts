import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
  name?: string;
  type?: string;
  coachName: string;
  coachId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  students?: mongoose.Types.ObjectId[];
}

const LessonSchema: Schema = new Schema({
  name: { type: String },
  type: { type: String },
  coachName: { type: String, required: true },
  coachId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
