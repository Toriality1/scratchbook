import {
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNotes } from "../context/NotesContext";
import Note from "./Note";

export default function NotesList() {
  const { notes, deleteNote, loading } = useNotes();

  if (loading) return <CircularProgress />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 4,
        maxHeight: "100vh",
        flex: "1",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
    >
      <Grid container spacing={3} rowSpacing={2}>
        {notes.map((note) => {
          return <Note key={note._id} note={note} deleteNote={deleteNote} />;
        })}
      </Grid>
    </Box>
  );
}
