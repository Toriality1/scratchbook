import type { Note } from "./note.types";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

type ErrorMessage = { msg: string };

type ServerResponse<T> =
  | { ok: true; data: T }
  | { ok: false; data: ErrorMessage };

type CreateNoteResopnse = ServerResponse<{ note: Note }>;
type GetNotesResponse = ServerResponse<{ notes: Note[] }>;
type GetNoteByIdResponse = ServerResponse<{ note: Note }>;
type DeleteNoteResponse = ServerResponse<undefined>;

export async function getNotes(): Promise<GetNotesResponse> {
  try {
    const res = await fetch(ENDPOINT + "notes", {
      credentials: "include",
    });
    const data = await res.json();
    const ok = res.ok;
    return { ok, data };
  } catch (err) {
    console.log(err);
    return { ok: false, data: { msg: "Failed to fetch notes" } };
  }
}

export async function addNote(
  note: Omit<Note, "_id">,
): Promise<CreateNoteResopnse> {
  try {
    const res = await fetch(ENDPOINT + "notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(note),
    });
    const data = await res.json();
    const ok = res.ok;
    return { ok, data };
  } catch (err) {
    console.log(err);
    return { ok: false, data: { msg: "Failed to add note" } };
  }
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  try {
    const res = await fetch(ENDPOINT + `notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const ok = res.ok;
    if (!ok) throw new Error("Failed to delete note");
    return { ok, data: undefined };
  } catch (err) {
    console.log(err);
    return { ok: false, data: { msg: "Failed to delete note" } };
  }
}

export async function getNoteById(id: string): Promise<GetNoteByIdResponse> {
  try {
    const res = await fetch(ENDPOINT + `notes/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    const ok = res.ok;
    return { ok, data };
  } catch (err) {
    console.log(err);
    return { ok: false, data: { msg: "Failed to fetch note" } };
  }
}
