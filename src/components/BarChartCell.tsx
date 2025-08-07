"use client"

import { Box } from "@mui/material"

export type BarChartCellProps = {
  value: number
  maxValue: number
  color: string
  align?: "left" | "right"
}

const BarChartCell: React.FC<BarChartCellProps> = ({
  value,
  maxValue,
  color,
  align = "right",
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        padding: "0 2px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%`,
          backgroundColor: color,
          borderRadius: "2px",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {value.toLocaleString()}
      </Box>
    </Box>
  )
}

export default BarChartCell
