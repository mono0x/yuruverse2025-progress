import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { sortBy } from "es-toolkit"

import getAll from "../../getAll"
import { toRankItems } from "../../utils"

export default async function TablePage() {
  const items = await getAll()
  const sorted = sortBy(items, [
    (item) =>
      item.records[item.records.length - 1].rank ?? Number.POSITIVE_INFINITY,
  ])
  const rankItems = toRankItems(sorted.slice(0, 10))

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Total Points</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankItems.map((item) => (
            <TableRow key={item.character.id}>
              <TableCell align="right">
                {item.record.rank.toLocaleString()}
              </TableCell>
              <TableCell> {item.character.name} </TableCell>
              <TableCell align="right">
                {item.record.point.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
