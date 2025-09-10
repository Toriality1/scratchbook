import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";

import { useUser } from "../../features/user/UserContext";

// simple regex to disallow special chars in username
const forbiddenChars = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

export default function RegisterModal() {
  const { register } = useUser();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setInvalid(!!value.match(forbiddenChars));
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (invalid) return;

    if (username && password) {
      register(username, password); // treat registration as an authenticated state
      toggle(); // close modal
    }
  };

  return (
    <>
      <Button variant="contained" onClick={toggle}>
        Register
      </Button>
      <Modal
        open={open}
        onClose={toggle}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
            Register a new user
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
                error={invalid}
                helperText={invalid ? "Invalid username" : undefined}
                required
                name="username"
                label="Username"
                placeholder="Create a username"
                value={username}
                onChange={handleChangeUsername}
              />
              <TextField
                required
                name="password"
                label="Password"
                type="password"
                placeholder="Enter a password"
                value={password}
                onChange={handleChangePassword}
              />
              <Button variant="contained" type="submit">
                Register
              </Button>
            </Box>
          </form>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account? Log in instead.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
