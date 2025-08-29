import { useState } from "react";
import {
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { postNote } from "../store/actions/notesActions";

export default function PostNote() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);

  const [form, setForm] = useState({
    title: "",
    desc: "",
    isPrivate: false,
  });

  const onChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim()) return;

    const note = {
      title: form.title,
      desc: form.desc,
      private: form.isPrivate,
    };
    dispatch(postNote(note));

    // reset form
    setForm({ title: "", desc: "", isPrivate: false });
  };

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", mb: 4 }}>
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
            rows={6}
            placeholder="Insert the text here..."
            value={form.desc}
            onChange={onChange}
            sx={{ mt: 2 }}
          />
        </Box>

        <Grid container alignItems="center" mb={3}>
          <Grid item>
            <Button variant="contained" type="submit">
              Create note
            </Button>
          </Grid>
          <Grid item>
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
      </form>
    </div>
  );
}
