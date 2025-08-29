import { z } from "zod";
import Note from "../models/Note.js";
import { getAuthUser } from "../utils/auth.js";
import type { Request, Response } from "express";

const createNoteSchema = z.object({
  title: z.string().min(3).max(100),
  desc: z.string().min(3).max(1024),
  private: z.boolean().default(false),
});

const updateNoteSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  desc: z.string().min(3).max(1024).optional(),
  private: z.boolean().optional(),
});

export const getPublicNotes = async (_req: Request, res: Response) => {
  try {
    const notes = await Note.find({ private: false }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Get public notes error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const createNote = async (req: Request, res: Response) => {
  const result = createNoteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      msg: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  const { title, desc, private: isPrivate } = result.data;
  const userId = getAuthUser(req).userId;

  try {
    const newNote = new Note({ title, desc, private: isPrivate, user: userId });
    const savedNote = await newNote.save();
    console.log(`Note ID ${savedNote.id} by user ${userId} created!`);
    res.status(201).json(savedNote);
  } catch (err) {
    console.error("Create note error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  const userId = getAuthUser(req).userId;
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (!note.private || note.user.toString() === userId) {
      return res.json(note);
    } else {
      return res.status(403).json({ msg: "Access denied" });
    }
  } catch (err) {
    console.error("Get note error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const userId = getAuthUser(req).userId;
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.user.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await note.deleteOne();
    res.json({ msg: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  const userId = getAuthUser(req).userId;
  const { id } = req.params;

  const result = updateNoteSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      msg: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ msg: "Note not found" });
    }

    if (note.user.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const updatedNote = await Note.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    });

    res.json(updatedNote);
  } catch (err) {
    console.error("Update note error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getLastPublicNote = async (_req: Request, res: Response) => {
  try {
    const note = await Note.findOne({ private: false }).sort({ _id: -1 });
    if (!note) {
      return res.status(404).json({ msg: "No public notes found" });
    }
    res.json(note);
  } catch (err) {
    console.error("Find last note error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
