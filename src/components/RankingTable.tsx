"use client"

import AnalyticsIcon from "@mui/icons-material/Analytics"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import PersonIcon from "@mui/icons-material/Person"
import RemoveIcon from "@mui/icons-material/Remove"
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

import { RankChange, RankItem } from "../types"

export type RankingTableProps = {
  rankItems: RankItem[]
  showIcons?: boolean
}

const RankingTable: React.FC<RankingTableProps> = ({
  rankItems,
  showIcons = true,
}) => {
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
            <TableCell />
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell align="right">+</TableCell>
            {showIcons && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rankItems.map((item, index) => (
            <TableRow key={item.character.id}>
              <TableCell align="right" padding="none">
                {item.record.rank.toLocaleString()}
              </TableCell>
              <TableCell align="center" padding="none">
                {item.rankChange === RankChange.Up ? (
                  <ArrowUpwardIcon
                    sx={{ fontSize: "small", color: "rgb(75, 192, 192)" }}
                  />
                ) : item.rankChange === RankChange.Down ? (
                  <ArrowDownwardIcon
                    sx={{ fontSize: "small", color: "rgb(255, 99, 132)" }}
                  />
                ) : (
                  <RemoveIcon sx={{ fontSize: "small", color: "gray" }} />
                )}
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
              <TableCell align="right">
                {item.plusPoint != null ? (
                  item.plusPoint.toLocaleString()
                ) : (
                  <RemoveIcon sx={{ fontSize: "small", color: "gray" }} />
                )}
              </TableCell>
              {showIcons && (
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
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RankingTable
