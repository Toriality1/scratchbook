import { Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();

  return (
    <Button variant="contained" onClick={logout}>
      Log out
    </Button>
  );
}

