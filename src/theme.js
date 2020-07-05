import { red } from "@material-ui/core/colors"
import { createMuiTheme } from "@material-ui/core/styles"

// Create a theme instance.
const theme = createMuiTheme({
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
        padding: "16px 8px 16px 8px",
      },
      sizeSmall: {
        padding: "6px 12px 6px 8px",
      },
    },
  },
})

export default theme
