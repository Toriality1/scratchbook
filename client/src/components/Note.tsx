import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NoteProps {
  note: {
    _id: string;
    title: string;
    desc: string;
    user: {
      _id: string;
      username: string;
    };
    private: boolean;
  };
  deleteNote: (id: string) => void;
}

export default function Note({ note, deleteNote }: NoteProps) {
  const { user } = useAuth();

  const desc =
    note.desc.length > 400 ? note.desc.slice(0, 400) + "..." : note.desc;

  const isOwner = note.user && note.user?._id === user?.id;

  return (
    <Card key={note._id} sx={{ minWidth: 200, maxWidth: 400 }}>
      <CardActionArea component={Link} to={`/notes/${note._id}`}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {note.title}
          </Typography>
          <Typography variant="body2">
            {desc}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}
      >
        <Typography
          variant="subtitle1"
          sx={{ ml: 1, fontStyle: "italic", fontFamily: "cursive" }}
        >
          {note.user ? "by " + note.user.username : "by <guest>"}
        </Typography>
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
