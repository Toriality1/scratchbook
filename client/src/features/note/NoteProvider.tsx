import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import * as funcs from "./note.funcs";
import type { Note } from "./note.types";
import { NotesContext } from "./NoteContext";

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    funcs.getNotes().then(({ ok, data }) => {
      if (!ok) {
        throw new Error(data.msg);
      }
      setNotes(data.notes);
      setLoading(false);
    });
  }, []);

  const addNote = async (note: Omit<Note, "_id">) => {
    funcs.addNote(note).then(({ ok, data }) => {
      if (!ok) {
        throw new Error(data.msg);
      }
      setNotes((prev) => [data.note, ...prev]);
    });
  };

  const deleteNote = async (id: string) => {
    funcs.deleteNote(id).then(({ ok, data }) => {
      if (!ok) {
        throw new Error(data.msg);
      }
      setNotes((prev) => prev.filter((note) => note._id !== id));
    });
  };

  const getNoteById = async (id: string) => {
    return funcs.getNoteById(id).then(({ok,data}) => {
      if (!ok) {
        throw new Error(data.msg);
      }
      return data.note
    });
  };

  return (
    <NotesContext.Provider
      value={{ notes, addNote, deleteNote, getNoteById, loading }}
    >
      {children}
    </NotesContext.Provider>
  );
}
