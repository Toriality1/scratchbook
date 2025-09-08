import { colors } from "./colors";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          ${colors.background_css}
        }
      `,
    },
  },
  palette: {
    primary: {
      main: colors.primary,
    },
  },
});

export default theme;
