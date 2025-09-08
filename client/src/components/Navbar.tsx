import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  Container,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./Auth/LoginModal";
import Logout from "./Auth/Logout";
import RegisterModal from "./Auth/RegisterModal";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const authActions = isAuthenticated ? (
    <Logout />
  ) : (
    <>
      <RegisterModal />
      <LoginModal />
    </>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        ScratchBook
      </Typography>
      <Divider />
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {authActions}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar component="nav" position="static" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={Link}
              to={"/"}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexGrow: 1,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <img src="/logo.png" alt="logo" width={32} height={32} />
              <Typography
                variant="h6"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                ScratchBook
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
              {authActions}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          anchor="left"
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
}
