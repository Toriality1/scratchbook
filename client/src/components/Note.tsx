import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { useUser } from "../features/user/UserContext";
import type { Note } from "../features/note/note.types";
import { useState } from "react";

interface NoteProps {
  note: Note;
  deleteNote: (id: string) => Promise<void>;
}

export default function Note({ note, deleteNote }: NoteProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { userId } = useUser();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  const desc =
    note.desc.length > 400 ? note.desc.slice(0, 400) + "..." : note.desc;

  const isOwner = note.user && note.user?._id === userId;

  const noteFormattedDate = new Date(note.createdAt).toLocaleString();

  const DateDisplay = () => (
    <Typography
      variant="subtitle1"
      sx={{ ml: 1, fontStyle: "italic", fontFamily: "cursive" }}
    >
      {isSmallScreen ? noteFormattedDate : `Posted on ${noteFormattedDate}`}
    </Typography>
  );

  const UserDisplay = () => (
    <Typography
      variant="subtitle1"
      sx={{ ml: 1, fontStyle: "italic", fontFamily: "cursive" }}
    >
      {note.user ? "by " + note.user.username : "by <guest>"}
    </Typography>
  );

  return (
    <Card
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      key={note._id}
      sx={{
        opacity: note.private ? 0.5 : 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        component={Link}
        to={`/notes/${note._id}`}
        sx={{ flex: "1" }}
      >
        <CardContent>
          <Typography gutterBottom variant="h5">
            {note.title}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {desc.trim()}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {!isHovering ? <UserDisplay /> : <DateDisplay />}
        {isOwner && (
          <Button
            sx={{ p: 0.5, minWidth: 0 }}
            size="large"
            color="error"
            onClick={() => deleteNote(note._id)}
          >
            <DeleteIcon />
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
