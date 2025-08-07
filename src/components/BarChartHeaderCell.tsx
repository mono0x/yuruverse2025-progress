"use client"

import { Box } from "@mui/material"

export type BarChartHeaderCellProps = {
  children: React.ReactNode
  align?: "left" | "right"
}

const BarChartHeaderCell: React.FC<BarChartHeaderCellProps> = ({
  children,
  align = "right",
}) => {
  return (
    <Box
      sx={{
        padding: "0 2px",
        textAlign: align,
      }}
    >
      {children}
    </Box>
  )
}

export default BarChartHeaderCell