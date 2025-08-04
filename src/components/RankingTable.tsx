"use client"

import AnalyticsIcon from "@mui/icons-material/Analytics"
import PersonIcon from "@mui/icons-material/Person"
import {
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
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Points</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankItems.map((item) => (
            <TableRow key={item.character.id}>
              <TableCell align="right">
                {item.record.rank.toLocaleString()}
              </TableCell>
              <TableCell>{item.character.name}</TableCell>
              <TableCell align="right">
                {item.record.point.toLocaleString()}
              </TableCell>
              <TableCell align="center">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RankingTable
