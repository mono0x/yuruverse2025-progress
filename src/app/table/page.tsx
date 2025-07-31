import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

import getAll from "../../getAll"
import { toRankItems } from "../../utils"

export default async function TablePage() {
  const items = await getAll()
  const sorted = [...items].sort(
    (a, b) =>
      a.records[a.records.length - 1].rank -
      b.records[b.records.length - 1].rank
  )
  const rankItems = toRankItems(sorted.slice(0, 10))

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
              <TableCell align="right">
                {item.plusPoint.toLocaleString()}
              </TableCell>
              <TableCell align="right">
                {item.behindPoint?.toLocaleString() ?? "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
