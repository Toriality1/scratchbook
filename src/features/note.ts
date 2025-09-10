import logger from "../utils/logger.js";
import { z } from "zod";
import { ApiError } from "../errors/ApiError.js";
import { Router } from "express";
import mongoose, { Schema, model, Types } from "mongoose";
import { auth } from "./user.js";
import { validate } from "../middleware/validate.js";
import { INTERNAL_SERVER_ERROR } from "../utils/constants.js";
import type { Request, Response } from "express";

// ----------------------------------------- \\
// Constants
// ----------------------------------------- \\
const TITLE_REQUIRED = "Title is required";
const TITLE_MIN_LENGTH = 3;
const TITLE_MIN_LENGTH_MSG = `Title must be at least ${TITLE_MIN_LENGTH} characters`;
const TITLE_MAX_LENGTH = 100;
const TITLE_MAX_LENGTH_MSG = `Title cannot exceed ${TITLE_MAX_LENGTH} characters`;
const DESCRIPTION_REQUIRED = "Description is required";
const DESCRIPTION_MIN_LENGTH = 3;
const DESCRIPTION_MIN_LENGTH_MSG = `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`;
const DESCRIPTION_MAX_LENGTH = 1024;
const DESCRIPTION_MAX_LENGTH_MSG = `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`;
const PRIVATE_REQUIRED = "Please set the note as private or public";
const ERROR_NOT_FOUND = "Note not found";
const ERROR_UNAUTHORIZED = "You are not authorized to view this note";

// ----------------------------------------- \\
// Types
// ----------------------------------------- \\
interface CreateNoteData {
  title: string;
  desc: string;
  private: boolean;
  userId?: string;
}

interface UpdateNoteData {
  title?: string;
  desc?: string;
  private?: boolean;
}

export interface INote extends Document {
  title: string;
  desc: string;
  private: boolean;
  user?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ----------------------------------------- \\
// Errors
// ----------------------------------------- \\
class NoteError extends ApiError {
  constructor(message: string, statusCode: number = 400) {
    super(statusCode, message);
  }
}

// ----------------------------------------- \\
// Models
// ----------------------------------------- \\
const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, TITLE_REQUIRED],
      trim: true,
      minlength: [TITLE_MIN_LENGTH, TITLE_MIN_LENGTH_MSG],
      maxlength: [TITLE_MAX_LENGTH, TITLE_MAX_LENGTH_MSG],
    },
    desc: {
      type: String,
      required: [true, DESCRIPTION_REQUIRED],
      minlength: [DESCRIPTION_MIN_LENGTH, DESCRIPTION_MIN_LENGTH_MSG],
      maxlength: [DESCRIPTION_MAX_LENGTH, DESCRIPTION_MAX_LENGTH_MSG],
    },
    private: {
      type: Boolean,
      required: [true, PRIVATE_REQUIRED],
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Note = model<INote>("Note", noteSchema);

// ----------------------------------------- \\
// Services
// ----------------------------------------- \\
const createNote = async ({
  title,
  desc,
  private: isPrivate,
  userId,
}: CreateNoteData) => {
  const newNote = new Note({ title, desc, private: isPrivate, user: userId });
  const savedNote = await newNote.save();
  return await savedNote.populate("user", "_id username");
};

const getNoteById = async (id: string, userId?: string) => {
  const note = await Note.findById(id).populate("user", "_id username");
  if (!note) {
    throw new NoteError(ERROR_NOT_FOUND, 404);
  }

  if (!note.user) return note; // private note made by guest = accessible with link

  if (!note.private || note.user._id.toString() === userId) {
    return note; // private note made by user = accessible only by user
  } else {
    throw new NoteError(ERROR_UNAUTHORIZED, 403);
  }
};

const updateNote = async (
  id: string,
  userId: string | undefined,
  data: UpdateNoteData,
) => {
  const note = await Note.findById(id).populate("user", "_id username");
  if (!note) {
    throw new NoteError(ERROR_NOT_FOUND, 404);
  }

  if (note.user && note.user.toString() !== userId) {
    throw new NoteError(ERROR_UNAUTHORIZED, 403);
  }

  return await Note.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("user", "_id username");
};

const deleteNote = async (id: string, userId?: string) => {
  const note = await Note.findById(id);
  if (!note) {
    throw new NoteError(ERROR_NOT_FOUND, 404);
  }

  if (note.user && note.user.toString() !== userId) {
    throw new NoteError(ERROR_UNAUTHORIZED, 403);
  }

  return await note.deleteOne();
};

const getNotes = async (userId: string | undefined) => {
  const condition = userId
    ? {
        $or: [{ private: false }, { private: true, user: userId }],
      }
    : { private: false };

  const notes = await Note.find(condition)
    .populate("user", "_id username")
    .sort({ createdAt: -1 });

  return notes;
};

// ----------------------------------------- \\
// Controllers
// ----------------------------------------- \\
const get = async (req: Request, res: Response) => {
  try {
    const user = req.user?.id;
    const notes = await getNotes(user);
    res.json({ notes });
    logger.debug("Notes retrieved");
  } catch (err) {
    if (err instanceof NoteError) {
      logger.debug({ error: err.message }, "Failed to get notes");
      return res.status(err.statusCode).json({ msg: err.message });
    }
    logger.debug({ err }, "Failed to get notes");
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const note = await createNote({ ...req.body, userId: req.user?.id });
    res.status(201).json({ note });
    logger.debug({ note, ip: req.ip }, "Note created");
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      logger.debug({ ip: req.ip, error: err.message }, "Failed to create note");
      let msg = "";
      let nOfErrors: number = Object.keys(err.errors).length;
      if (nOfErrors > 1) {
        for (const e of Object.values(err.errors)) {
          msg += e.message + "; ";
        }
      } else {
        msg = Object.values(err.errors)[0].message;
      }
      return res.status(400).json({ msg });
    }
    if (err instanceof NoteError) {
      logger.debug({ ip: req.ip, error: err.message }, "Failed to create note");
      return res.status(err.statusCode).json({ msg: err.message });
    }
    logger.debug({ err }, "Failed to create note");
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const note = await getNoteById(req.params.id, req.user?.id);
    res.json({ note });
    logger.debug({ note: note.id, ip: req.ip }, "Note retrieved");
  } catch (err) {
    if (err instanceof NoteError) {
      logger.debug({ error: err.message }, "Failed to get note");
      return res.status(err.statusCode).json({ msg: err.message });
    }
    logger.debug({ err }, "Failed to get note");
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const note = await updateNote(req.params.id, req.user?.id, req.body);
    res.json({ note });
    logger.debug({ note, ip: req.ip }, "Note updated");
  } catch (err) {
    if (err instanceof NoteError) {
      logger.debug({ ip: req.ip, error: err.message }, "Failed to update note");
      return res.status(err.statusCode).json({ msg: err.message });
    }
    logger.debug({ err }, "Failed to update note");
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
};

const del = async (req: Request, res: Response) => {
  try {
    await deleteNote(req.params.id, req.user?.id);
    res.sendStatus(204);
    logger.debug({ ip: req.ip }, "Note deleted");
  } catch (err) {
    if (err instanceof NoteError) {
      logger.debug({ ip: req.ip, error: err.message }, "Failed to delete note");
      return res.status(err.statusCode).json({ msg: err.message });
    }
    logger.debug({ err }, "Failed to delete note");
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
};

// // ----------------------------------------- \\
// // Validators
// // ----------------------------------------- \\
// const createNoteSchema = z.object({
//   title: z
//     .string()
//     .min(TITLE_MIN_LENGTH, { message: TITLE_MIN_LENGTH_MSG })
//     .max(TITLE_MAX_LENGTH, { message: TITLE_MAX_LENGTH_MSG }),
//   desc: z
//     .string()
//     .min(DESCRIPTION_MIN_LENGTH, { message: DESCRIPTION_MIN_LENGTH_MSG })
//     .max(DESCRIPTION_MAX_LENGTH, { message: DESCRIPTION_MAX_LENGTH_MSG }),
//   private: z.boolean().default(false),
// });
//
// const updateNoteSchema = z.object({
//   title: z
//     .string()
//     .min(TITLE_MIN_LENGTH, { message: TITLE_MIN_LENGTH_MSG })
//     .max(TITLE_MAX_LENGTH, { message: TITLE_MAX_LENGTH_MSG })
//     .optional(),
//   desc: z
//     .string()
//     .min(DESCRIPTION_MIN_LENGTH, { message: DESCRIPTION_MIN_LENGTH_MSG })
//     .max(DESCRIPTION_MAX_LENGTH, { message: DESCRIPTION_MAX_LENGTH_MSG })
//     .optional(),
//   private: z.boolean().optional(),
// });

// ----------------------------------------- \\
// Routes
// ----------------------------------------- \\
const router = Router();

router.get("/", auth, get);
router.post("/", auth, create);
router.get("/:id", auth, getById);
router.patch("/:id", auth, update);
router.delete("/:id", auth, del);

export default router;
