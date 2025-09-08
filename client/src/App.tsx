import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import theme from "./styles/styles";

import { AuthProvider } from "./context/AuthContext";
import { NotesProvider } from "./context/NotesContext";

import Home from "./components/Home";
import ViewNote from "./components/ViewNote";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/notes/:id" element={<ViewNote />} />
            </Routes>
          </BrowserRouter>
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
