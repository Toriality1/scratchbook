import { Schema, model, Types } from "mongoose";

export interface INote extends Document {
  title: string;
  desc: string;
  private: boolean;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      minlength: [3, "Description must be at least 3 characters"],
      maxlength: [1024, "Description cannot exceed 1024 characters"],
    },
    private: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = model<INote>("Note", noteSchema);

export default Note;
