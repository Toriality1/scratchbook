import { Button } from "@mui/material";
import { useUser } from "../../features/user/UserContext";

export default function Logout() {
  const { logout } = useUser();

  return (
    <Button variant="contained" onClick={logout}>
      Log out
    </Button>
  );
}

