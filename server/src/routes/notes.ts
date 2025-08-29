import { Router } from "express";
import {
  getPublicNotes,
  createNote,
  getNoteById,
  deleteNote,
  updateNote,
  getLastPublicNote,
} from "../controllers/noteController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", getPublicNotes);
router.post("/", auth, createNote);

router.get("/id/:id", auth, getNoteById);
router.delete("/id/:id", auth, deleteNote);
router.patch("/id/:id", auth, updateNote);

router.get("/find_last", getLastPublicNote);

export default router;
