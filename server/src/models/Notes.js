import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    desc: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024,
    },
    private: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Note = model("Note", notesSchema);
export default Note;
