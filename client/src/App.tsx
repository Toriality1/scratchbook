import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import theme from "./styles/styles";

import { UserProvider } from "./features/user/UserProvider";
import { NotesProvider } from "./features/note/NoteProvider";

import Home from "./components/Home";
import ViewNote from "./components/ViewNote";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <NotesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notes/:id" element={<ViewNote />} />
            </Routes>
          </BrowserRouter>
        </NotesProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
