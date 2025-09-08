import { useState, type FormEvent, type ChangeEvent } from "react";
import { Box, Modal, Button, Typography, TextField } from "@mui/material";

import { useAuth } from "../../context/AuthContext";

export default function LoginModal() {
  const { login } = useAuth();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggle = () => setOpen((prev) => !prev);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (username && password) {
      login(username, password);
      toggle();
    }
  };

  const handleChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  return (
    <>
      <Button variant="contained" onClick={toggle}>
        Log In
      </Button>
      <Modal open={open} onClose={toggle}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid black",
            boxShadow: 24,
            p: 5,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Log in
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                "& .MuiTextField-root": {
                  mb: 2,
                },
              }}
            >
              <TextField
                required
                name="username"
                label="Username"
                placeholder="Your username"
                value={username}
                onChange={handleChange(setUsername)}
              />
              <TextField
                required
                name="password"
                label="Password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={handleChange(setPassword)}
              />
              <Button variant="contained" type="submit">
                Log in
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
