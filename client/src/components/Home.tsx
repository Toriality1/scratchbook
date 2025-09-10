import CreateNote from "./PostNote";
import NotesList from "./NotesList";
import { Box, Grid } from "@mui/material";
import Layout from "./Layout";

export default function Home() {
  return (
    <Layout>
      <Grid
        container
        direction={{
          xs: "column",
          md: "row",
        }}
        sx={{
          flex: "1",
          display: "flex",
          minHeight: 0,
          height: "100%",
        }}
      >
        <Box
          sx={{
            overflowY: "scroll",
            scrollbarWidth: "none",
            maxHeight: {
              xs: "60vh",
              md: "90vh",
            },
            p: {
              xs: 1,
              md: 2,
            },
            width: {
              xs: "100%",
              md: "60%",
            },
          }}
        >
          <NotesList />
        </Box>
        <Box sx={{ display: "flex", flex: "1" }}>
          <CreateNote />
        </Box>
      </Grid>
    </Layout>
  );
}
