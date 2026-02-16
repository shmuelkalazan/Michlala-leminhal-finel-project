import mongoose, { Document, Schema } from "mongoose";

export interface IBranch extends Document {
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  lessons?: mongoose.Types.ObjectId[];
}

const BranchSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
});

export const Branch = mongoose.model<IBranch>("Branch", BranchSchema);
