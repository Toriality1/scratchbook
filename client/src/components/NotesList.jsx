import React, { useEffect } from "react";
import {
  CircularProgress,
  Typography,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getNotes, deleteNote } from "../store/actions/notesActions";

export default function NotesList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.notes);
  const user = useSelector((state) => state.users.user);

  useEffect(() => {
    dispatch(getNotes());
  }, [dispatch]);

  const renderNotes = () =>
    list
      .slice() // copy to avoid mutating state
      .reverse()
      .map((note) => {
        if (note.private) return null;

        const isOwner = user && note.user === user._id;
        const desc = note.desc.substring(0, 400);
        const truncated = note.desc.length > 400;

        return (
          <Grid key={note._id} item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                "& a": {
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": { fontWeight: "bold" },
                },
              }}
            >
              <Link to={note._id}>
                <Typography variant="h6">{note.title}</Typography>
                <Typography variant="body2">
                  {desc}
                  {truncated && (
                    <span style={{ fontStyle: "italic", color: "#b0b0b0" }}>
                      (...)
                    </span>
                  )}
                </Typography>
              </Link>

              {isOwner && (
                <Button
                  color="error"
                  size="small"
                  onClick={() => dispatch(deleteNote(note._id))}
                  sx={{ mt: 2 }}
                >
                  Delete note
                </Button>
              )}
            </Paper>
          </Grid>
        );
      });

  return (
    <>
      <Typography variant="h6" align="center" mb={2}>
        Most recent notes:
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "0 auto" }} />
      ) : (
        <Grid container spacing={3}>
          {renderNotes()}
        </Grid>
      )}
    </>
  );
}
