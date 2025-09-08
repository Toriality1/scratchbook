import { Box } from "@mui/material";
import Navbar from "./Navbar";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ display: "flex", flexDirection: "column", flex: "1" }}>
        {children}
      </Box>
    </Box>
  );
}
