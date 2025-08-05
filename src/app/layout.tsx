import CssBaseline from "@mui/material/CssBaseline"
import { Metadata, Viewport } from "next"
import { ReactNode } from "react"

import theme from "../theme"
import ThemeRegistry from "./ThemeRegistry"

export const metadata: Metadata = {
  title: "YuruVerse 2025 Progress",
  description: "Yuru-chara Grand Prix progress tracking",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content={theme.palette.primary.main} />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({
            token: "0bf71c871f7645c4b07c7fbae7450412",
          })}
        />
      </head>
      <body>
        <ThemeRegistry>
          <CssBaseline />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}
