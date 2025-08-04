"use client"

import AnalyticsIcon from "@mui/icons-material/Analytics"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import PersonIcon from "@mui/icons-material/Person"
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import NextLink from "next/link"

import { RankItem } from "../types"

export type RankingTableProps = {
  rankItems: RankItem[]
}

const RankingTable: React.FC<RankingTableProps> = ({ rankItems }) => {
  const chartColors = [
    "rgb(54, 162, 235)", // Blue
    "rgb(255, 99, 132)", // Red
    "rgb(255, 159, 64)", // Orange
    "rgb(255, 205, 86)", // Yellow
    "rgb(75, 192, 192)", // Green
    "rgb(153, 102, 255)", // Purple
  ]

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankItems.map((item, index) => (
            <TableRow key={item.character.id}>
              <TableCell align="right" padding="none">
                {item.record.rank.toLocaleString()}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {index < chartColors.length && (
                    <FiberManualRecordIcon
                      sx={{
                        fontSize: "small",
                        color: chartColors[index],
                      }}
                    />
                  )}
                  {item.character.name}
                </Box>
              </TableCell>
              <TableCell align="right">
                {item.record.point.toLocaleString()}
              </TableCell>
              <TableCell align="center" padding="none">
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    component="a"
                    href={`https://yurugp.jp/characters/${item.character.id}`}
                    rel="noopener noreferrer"
                    aria-label="Profile"
                  >
                    <PersonIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    component={NextLink}
                    href={`/characters/${item.character.id}`}
                    aria-label="Detail"
                  >
                    <AnalyticsIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RankingTable
