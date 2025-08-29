import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import theme from "./styles/styles";
import { loadUser } from "./store/actions/usersActions";

import Home from "./components/Home";
import ViewNote from "./components/ViewNote";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<ViewNote />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

