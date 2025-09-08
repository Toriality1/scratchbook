import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  FormGroup,
  FormControl,
  Card,
} from "@mui/material";
import { useNotes } from "../context/NotesContext";
import type { Note } from "../context/NotesContext";

export default function PostNote() {
  const { addNote } = useNotes();
  const [form, setForm] = useState({
    title: "",
    desc: "",
    isPrivate: false,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim()) return;

    const newNote: Omit<Note, "_id"> = {
      title: form.title,
      desc: form.desc,
      private: form.isPrivate,
    };

    addNote(newNote);
    setForm({ title: "", desc: "", isPrivate: false });
  };

  return (
    <Card
      elevation={3}
      component={"form"}
      onSubmit={onSubmit}
      sx={{
        bgcolor: "#eee",
        p: 4,
        display: "flex",
        gap: 2,
        flexDirection: "column",
        flex: "1",
        height: "100%",
        "& .MuiTextField-root": {
            bgcolor: "white"
        }
      }}
    >
      <TextField
        required
        name="title"
        label="Title"
        placeholder="Insert a title here..."
        value={form.title}
        onChange={onChange}
      />
      <TextField
        required
        name="desc"
        label="Description"
        multiline
        placeholder="Insert the text here..."
        value={form.desc}
        onChange={onChange}
        sx={{
          flex: "1",
          "& .MuiInputBase-root": {
            height: "100%",
            alignItems: "stretch",
          },
          "& .MuiInputBase-inputMultiline": {
            height: "100%",
            boxSizing: "border-box",
            overflow: "auto",
            resize: "none",
          },
        }}
      />

      <Grid container alignItems="center">
        <Grid>
          <Button variant="contained" type="submit">
            Create note
          </Button>
        </Grid>
        <Grid>
          <FormControlLabel
            control={
              <Checkbox
                name="isPrivate"
                checked={form.isPrivate}
                onChange={onChange}
                color="primary"
              />
            }
            label="Private"
            labelPlacement="start"
            sx={{ mb: "0.1rem" }}
          />
        </Grid>
      </Grid>
    </Card>
  );
}
