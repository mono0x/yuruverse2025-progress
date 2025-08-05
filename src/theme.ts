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
  components: {
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down("sm")]: {
            paddingLeft: 8,
            paddingRight: 8,
          },
        }),
      },
    },
  },
})

export default theme
