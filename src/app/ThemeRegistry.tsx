"use client"

import { ThemeProvider } from "@mui/material/styles"
import type { ReactNode } from "react"

import theme from "../theme"

interface ThemeRegistryProps {
  children: ReactNode
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
