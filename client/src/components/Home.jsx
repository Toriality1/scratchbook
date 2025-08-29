import React from "react";
import Navbar from "./Navbar";
import CreateNote from "./PostNote";
import NotesList from "./NotesList";
import Box from "@mui/material/Box";

export default function Home() {
  return (
    <>
      <Navbar />
      <Box sx={{ m: "2.5em 10%" }}>
        <CreateNote />
        <NotesList />
      </Box>
    </>
  );
}

