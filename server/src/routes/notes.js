import express from "express";
import chalk from "chalk";
import Note from "../models/Notes.js";
import User from "../models/Users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ private: "false" });
    res.json(notes);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.post("/", auth, async (req, res) => {
  const { title, desc, private: isPrivate } = req.body;
  const user = req.user.id;

  const newNote = new Note({ title, desc, private: isPrivate, user });

  try {
    const note = await newNote.save();
    console.log(`Note ID ${note.id} by user ${note.user} added!`);

    await User.updateOne({ _id: note.user }, { $push: { notes: note.id } });

    res.json(note);
  } catch (err) {
    console.log(err);
    res.status(400).json("Error: " + err);
  }
});

router.get("/id/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    res.json(note);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.delete("/id/:id", auth, async (req, res) => {
  try {
    const result = await Note.deleteOne({ _id: req.params.id });
    res.json(result);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.patch("/id/:id", auth, async (req, res) => {
  try {
    const result = await Note.updateOne({ _id: req.params.id }, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

router.get("/find_last", async (req, res) => {
  try {
    const notes = await Note.find({}).sort({ _id: -1 }).limit(1);
    res.json(notes);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

export default router;

