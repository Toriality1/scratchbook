import { CircularProgress, Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { useNotes } from "../features/note/NoteContext";
import Note from "./Note";

export default function NotesList() {
  const { notes, deleteNote, loading } = useNotes();

  if (loading)
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Masonry columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3 }} spacing={2} sequential >
        {notes.map((note) => {
          return <Note key={note._id} note={note} deleteNote={deleteNote} />;
        })}
      </Masonry>
    </Box>
  );
}
