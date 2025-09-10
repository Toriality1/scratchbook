export type Note = {
  _id: string;
  title: string;
  desc: string;
  user: {
    _id: string;
    username: string;
  };
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NotesContextType = {
  notes: Note[];
  addNote: (note: Omit<Note, "_id">) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNoteById: (id: string) => Promise<Note | null>;
  loading: boolean;
};
