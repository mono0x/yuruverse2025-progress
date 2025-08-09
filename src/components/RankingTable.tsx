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
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import NextLink from "next/link"

import { RankChange, type RankItem } from "../types"
import BarChartCell from "./BarChartCell"
import BarChartHeaderCell from "./BarChartHeaderCell"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}))

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
    "rgb(201, 203, 207)", // Grey
  ]

  const maxPoints = Math.max(...rankItems.map((item) => item.record.point))
  const maxPlusPoints = Math.max(
    ...rankItems.map((item) => item.plusPoint ?? 0),
  )

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell />
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">
              <BarChartHeaderCell>Points</BarChartHeaderCell>
            </StyledTableCell>
            <StyledTableCell align="right">
              <BarChartHeaderCell>+</BarChartHeaderCell>
            </StyledTableCell>
            {showIcons && <StyledTableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {rankItems.map((item, index) => (
            <TableRow key={item.character.id}>
              <StyledTableCell align="right">
                {item.record.rank.toLocaleString()}
              </StyledTableCell>
              <StyledTableCell align="center">
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
              </StyledTableCell>
              <StyledTableCell>
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
              </StyledTableCell>
              <StyledTableCell align="right">
                <BarChartCell
                  value={item.record.point}
                  maxValue={maxPoints}
                  color="rgba(54, 162, 235, 0.2)"
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                {item.plusPoint != null ? (
                  <BarChartCell
                    value={item.plusPoint}
                    maxValue={maxPlusPoints}
                    color="rgba(75, 192, 192, 0.2)"
                  />
                ) : (
                  <RemoveIcon sx={{ fontSize: "small", color: "gray" }} />
                )}
              </StyledTableCell>
              {showIcons && (
                <StyledTableCell align="center">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
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
                </StyledTableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RankingTable
