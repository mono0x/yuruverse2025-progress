import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { GetStaticPaths, GetStaticProps } from "next"

import getAll from "../../../getAll"
import { Kind, RankItem } from "../../../types"
import { toRankItems } from "../../../utils"

type Props = {
  rankItems: RankItem[]
}

const ChartApiPage: React.FC<Props> = (props) => {
  const { rankItems } = props

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
  const rankItems = await getAll()
  const filtered = rankItems.filter(
    (item) => item.character.kind == params.kind
  )
  filtered.sort(
    (a, b) =>
      a.records[a.records.length - 1].rank -
      b.records[b.records.length - 1].rank
  )
  return {
    props: { rankItems: toRankItems(filtered.slice(0, 10)) },
  }
}

export default ChartApiPage
