import { red } from "@mui/material/colors"
import { createTheme } from "@mui/material/styles"
import { Roboto } from "next/font/google"

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
})

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
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
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px 4px 16px 4px",
        },
        sizeSmall: {
          padding: "6px 6px 6px 4px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 36,
        },
      },
    },
  },
})

export default theme
