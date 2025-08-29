import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./Navbar";
import { viewNote, deleteNote } from "../store/actions/notesActions";

export default function ViewNote() {
  const { id } = useParams(); // ✅ cleaner than slicing pathname
  const dispatch = useDispatch();

  const { selected, loading } = useSelector((state) => state.notes);
  const user = useSelector((state) => state.users.user);

  useEffect(() => {
    if (id) dispatch(viewNote(id));
  }, [id, dispatch]);

  const handleDelete = () => {
    if (selected?._id) {
      dispatch(deleteNote(selected._id));
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <CircularProgress />
      ) : (
        selected && (
          <Box sx={{ m: "2.5em 10%", whiteSpace: "pre-line" }}>
            <Typography variant="h6">{selected.title}</Typography>
            <Typography>{selected.desc}</Typography>

            {user && selected.user === user._id && (
              <Link to="/" onClick={handleDelete}>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 5,
                    color: "red",
                    "&:hover": {
                      fontWeight: "bold",
                      cursor: "pointer",
                    },
                  }}
                >
                  Delete note
                </Typography>
              </Link>
            )}
          </Box>
        )
      )}
    </>
  );
}
