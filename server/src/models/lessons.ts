import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
  title: string;
  description?: string;
  coachName: string;
  coachId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime?: string;
  type?: string;
  students?: mongoose.Types.ObjectId[];
  maxParticipants?: number;
}

const LessonSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  coachName: { type: String, required: true },
  coachId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  type: { type: String },
  students: [{ type: Schema.Types.ObjectId, ref: "User" }],
  maxParticipants: { type: Number },
});

export const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
