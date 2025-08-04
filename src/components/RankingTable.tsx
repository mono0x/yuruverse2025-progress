"use client"

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import NextLink from "next/link"

import { RankItem } from "../types"

export type RankingTableProps = {
  rankItems: RankItem[]
}

const RankingTable: React.FC<RankingTableProps> = ({ rankItems }) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Total Points</TableCell>
            <TableCell align="right">+ Points</TableCell>
            <TableCell align="right">Behind</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankItems.map((item) => (
            <TableRow key={item.character.id}>
              <TableCell align="right">
                {item.record.rank.toLocaleString()}
              </TableCell>
              <TableCell>
                <a
                  href={`https://yurugp.jp/characters/${item.character.id}`}
                  rel="noopener noreferrer"
                >
                  {item.character.name}
                </a>
              </TableCell>
              <TableCell align="right">
                {item.record.point.toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {item.plusPoint.toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {item.behindPoint?.toLocaleString() ?? "-"}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  component={NextLink}
                  href={`/characters/${item.character.id}`}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RankingTable
