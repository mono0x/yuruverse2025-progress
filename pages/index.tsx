import {
  Box,
  Container,
  FormControl,
  InputLabel,
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
import { GetStaticProps } from "next"
import NextLink from "next/link"
import { useMemo, useState } from "react"

import Header from "../components/Header"
import TotalPointChart from "../components/TotalPointChart"
import getAll from "../src/getAll"
import { Item, Kind } from "../src/types"
import { behind, plusPoint } from "../src/utils"

type Props = {
  items: Item[]
}

const IndexPage: React.FC<Props> = props => {
  const { items } = props

  const [kind, setKind] = useState<Kind>(Kind.LOCAL)

  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  const filtered = useMemo(() => {
    const filtered = items.filter(item => item.character.kind == kind)
    filtered.sort(
      (a, b) =>
        a.records[a.records.length - 1].rank -
        b.records[b.records.length - 1].rank
    )
    return filtered
  }, [items, kind])

  const paginated = useMemo(() => {
    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [filtered, page, rowsPerPage])

  const oneRankHigher = useMemo(() => {
    if (page == 0) {
      return [
        undefined,
        ...filtered.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage - 1
        ),
      ]
    }
    return filtered.slice(
      page * rowsPerPage - 1,
      page * rowsPerPage + rowsPerPage - 1
    )
  }, [filtered, page, rowsPerPage])

  return (
    <div>
      <Header />

      <Container>
        <Box>
          <FormControl>
            <InputLabel id="kind-select-label">Kind</InputLabel>
            <Select
              labelId="kind-select-label"
              id="kind-select"
              value={kind}
              onChange={e => {
                setKind(e.target.value as Kind)
                setPage(0)
              }}
            >
              <MenuItem value={Kind.LOCAL}>ご当地</MenuItem>
              <MenuItem value={Kind.COMPANY}>企業・その他</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box
          style={{
            position: "relative",
            width: "100%",
            height: "50vh",
          }}
        >
          <TotalPointChart items={paginated} />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {tablePagination({
                  count: filtered.length,
                  page: page,
                  rowsPerPage: rowsPerPage,
                  setPage: setPage,
                })}
              </TableRow>
              <TableRow>
                <TableCell align="right">Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Total Points</TableCell>
                <TableCell align="right">+ Points</TableCell>
                <TableCell align="right">Behind</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((item, i) => (
                <TableRow key={item.character.id}>
                  <TableCell align="right">
                    {item.records[item.records.length - 1].rank}
                  </TableCell>
                  <TableCell>
                    <Link
                      component={NextLink}
                      href="/characters/[id]"
                      as={`/characters/${item.character.id}`}
                    >
                      {item.character.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    {item.records[item.records.length - 1].point}
                  </TableCell>
                  <TableCell align="right">{plusPoint(item)}</TableCell>
                  <TableCell align="right">
                    {behind(item, oneRankHigher[i]) ?? "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                {tablePagination({
                  count: filtered.length,
                  page: page,
                  rowsPerPage: rowsPerPage,
                  setPage: setPage,
                })}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
    </div>
  )
}

function tablePagination({
  count,
  page,
  rowsPerPage,
  setPage,
}: {
  count: number
  page: number
  rowsPerPage: number
  setPage: (newPage: number) => void
}): JSX.Element {
  return (
    <TablePagination
      count={count}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[]}
      page={page}
      onChangePage={(_, newPage) => setPage(newPage)}
    />
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const items = await getAll()
  return {
    props: {
      items,
    },
  }
}

export default IndexPage
