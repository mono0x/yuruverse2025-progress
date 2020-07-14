import { GetStaticPaths, GetStaticProps } from "next"
import {
  Box,
  Link,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core"
import { useMemo } from "react"

import getAll from "../../src/getAll"
import { Item, Kind } from "../../src/types"
import { behind, plusPoint } from "../../src/utils"

type Props = {
  items: Item[]
}

const ChartApiPage: React.FC<Props> = props => {
  const { items } = props

  const oneRankHigher = useMemo(() => {
    return [
      null,
      ...items.slice(0, 9)
    ]
  }, [items])

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
          {items.map((item, i) => (
            <TableRow key={item.character.id}>
              <TableCell align="right">
                {item.records[item.records.length - 1].rank}
              </TableCell>
              <TableCell>
                {item.character.name}
              </TableCell>
              <TableCell align="right">
                {item.records[item.records.length - 1].point}
              </TableCell>
              <TableCell align="right">{plusPoint(item)}</TableCell>
              <TableCell align="right">
                {behind(item, oneRankHigher[i]) || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { kind: Kind.LOCAL } },
      { params: { kind: Kind.COMPANY } },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params = {} }) => {
  const items = await getAll()
  const filtered = items.filter(item => item.character.kind == params.kind)
  filtered.sort(
    (a, b) =>
      a.records[a.records.length - 1].rank -
      b.records[b.records.length - 1].rank
  )
  return {
    props: { items: filtered.slice(0, 10) },
  }
}

export default ChartApiPage
