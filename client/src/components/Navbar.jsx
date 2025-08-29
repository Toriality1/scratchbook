import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import LoginModal from "./Auth/LoginModal";
import Logout from "./Auth/Logout";
import RegisterModal from "./Auth/RegisterModal";

export default function Navbar() {
  const { isAuthenticated } = useSelector((state) => state.users);

  return (
    <AppBar
      position="static"
      sx={{
        alignItems: "center",
        minHeight: "100%",
        boxShadow: "none",
        padding: 0,
      }}
    >
      <Toolbar sx={{ width: "90%" }}>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          component={Link}
          to="/"
        >
          ScratchBook
        </Typography>

        {isAuthenticated ? <Logout /> : <><RegisterModal /><LoginModal /></>}
      </Toolbar>
    </AppBar>
  );
}

