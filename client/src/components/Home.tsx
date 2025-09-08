import CreateNote from "./PostNote";
import NotesList from "./NotesList";
import { Grid } from "@mui/material";
import Layout from "./Layout";

export default function Home() {
  return (
    <Layout>
      <Grid sx={{ flex: "1" }} container spacing={2}>
        <Grid size={7}>
          <NotesList />
        </Grid>
        <Grid size={5}>
          <CreateNote />
        </Grid>
      </Grid>
    </Layout>
  );
}
