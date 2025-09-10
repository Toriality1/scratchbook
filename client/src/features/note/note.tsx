import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await fetch(ENDPOINT + "notes", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data: Note[] = await res.json();
        setNotes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const addNote = async (note: Omit<Note, "_id">) => {
    try {
      const res = await fetch(ENDPOINT + "notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error("Failed to add note");
      const newNote: Note = await res.json();
      setNotes((prev) => [newNote, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(ENDPOINT + `notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getNoteById = (id: string) => notes.find((note) => note._id === id);

  return (
    <NotesContext.Provider
      value={{ notes, addNote, deleteNote, getNoteById, loading }}
    >
      {children}
    </NotesContext.Provider>
  );
}

