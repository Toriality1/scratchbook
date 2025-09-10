import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, CircularProgress, Container } from "@mui/material";
import Layout from "./Layout";
import { useNotes } from "../features/note/NoteContext";
import { useUser } from "../features/user/UserContext";
import type { Note } from "../features/note/note.types";

export default function ViewNote() {
  const { id } = useParams();
  const { getNoteById, deleteNote } = useNotes();
  const { isAuthenticated, userId } = useUser();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const n = await getNoteById(id ?? "");
      setNote(n ?? null);
      setLoading(false);
    };
    fetchNote();
  }, [id, getNoteById]);

  const handleDelete = () => {
    if (note?._id) {
      deleteNote(note._id);
    }
  };

  if (loading) return <CircularProgress />;

  if (!note)
    return <Typography sx={{ m: "2.5em 10%" }}>Note not found</Typography>;

  return (
    <Layout>
      <Container
        component={"article"}
        sx={{ mt: 4, width: "70ch", whiteSpace: "pre-wrap" }}
      >
        <Typography gutterBottom variant="h5">
          {note.title}
        </Typography>
        <Typography>{note.desc}</Typography>

        {isAuthenticated && note.user?._id === userId && (
          <Link to="/" onClick={handleDelete}>
            <Typography
              variant="body2"
              sx={{
                mt: 5,
                color: "red",
                "&:hover": { fontWeight: "bold", cursor: "pointer" },
              }}
            >
              Delete note
            </Typography>
          </Link>
        )}
      </Container>
    </Layout>
  );
}
