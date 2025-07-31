"use client"

import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import NextLink from "next/link"

import Header from "../components/Header"
import Pager from "../components/Pager"
import TotalPointChart from "../components/TotalPointChart"
import { Item, Kind, RankItem } from "../types"

export type RankingViewProps = {
  kind: Kind
  items: Item[]
  rankItems: RankItem[]
  count: number
  page: number
  rowsPerPage: number
  prefix: string
}

const RankingView: React.FC<RankingViewProps> = (props) => {
  const { kind, items, rankItems, count, page, rowsPerPage, prefix } = props

  return (
    <div>
      <Header kind={kind} />

      <Container>
        <Box
          style={{
            position: "relative",
            width: "100%",
            height: "50vh",
          }}
        >
          <TotalPointChart items={items} />
        </Box>

        <Pager
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          prefix={prefix}
        />

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
                  <TableCell>
                    <NextLink href={`/characters/${item.character.id}`}>
                      {item.character.name}
                    </NextLink>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  )
}

export default RankingView
