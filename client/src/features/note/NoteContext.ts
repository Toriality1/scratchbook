import { createContext, useContext } from "react";
import type { NotesContextType } from "./note.types";

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function useNotes(): NotesContextType {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within NotesProvider");
  return context;
}
