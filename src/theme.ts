import { red } from "@material-ui/core/colors"
import { createTheme } from "@material-ui/core/styles"

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        padding: "16px 4px 16px 4px",
      },
      sizeSmall: {
        padding: "6px 6px 6px 4px",
      },
    },
    MuiTypography: {
      h1: {
        fontSize: 36,
      },
    },
  },
})

export default theme
