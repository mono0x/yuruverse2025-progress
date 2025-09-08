"use client"

import AnalyticsIcon from "@mui/icons-material/Analytics"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import RemoveIcon from "@mui/icons-material/Remove"
import {
  Button,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

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
  const maxPoints = Math.max(...rankItems.map((item) => item.point))
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
          </TableRow>
        </TableHead>
        <TableBody>
          {rankItems.map((item) => (
            <TableRow key={item.character.id}>
              <StyledTableCell align="right">
                {item.rank.toLocaleString()}
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
                {showIcons ? (
                  <Button
                    href={`/characters/${item.character.id}/`}
                    size="small"
                    endIcon={<AnalyticsIcon fontSize="small" />}
                  >
                    {item.character.name}
                  </Button>
                ) : (
                  item.character.name
                )}
              </StyledTableCell>
              <StyledTableCell align="right">
                <BarChartCell
                  value={item.point}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RankingTable
