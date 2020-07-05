import {
  AppBar,
  Container,
  FormHelperText,
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
  Typography,
} from "@material-ui/core"
import fs from "fs"
import palette from "google-palette"
import path from "path"
import { useMemo, useState } from "react"
import { Line } from "react-chartjs-2"

export default function IndexPage(props) {
  const { items } = props

  const [kind, setKind] = useState("LOCAL")

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)

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
    if (page === 0) {
      return [
        null,
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

  const dates = useMemo(() => {
    const dates = new Set()
    paginated
      .flatMap(item => item.records.map(record => record.date))
      .forEach(date => dates.add(date))
    return Array.from(dates)
  }, [paginated])

  const data = useMemo(() => {
    const colors = palette("mpn65", paginated.length).map(hex => `#${hex}`)
    return {
      labels: dates,
      datasets: paginated.map((item, i) => ({
        label: item.character.name,
        borderColor: colors[i],
        fill: false,
        data: item.records.map(record => ({
          t: record.date,
          y: record.point,
        })),
      })),
      options: {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
            },
          ],
        },
      },
    }
  }, [paginated, dates])

  return (
    <Container disableGutters={true} maxWidth={false}>
      <AppBar position="static">
        <Typography variant="h6">YuruGP 2020 Progress</Typography>
      </AppBar>
      <Select
        value={kind}
        onChange={e => {
          setKind(e.target.value)
          setPage(0)
        }}
      >
        <MenuItem value="LOCAL">ご当地</MenuItem>
        <MenuItem value="COMPANY">企業・その他</MenuItem>
      </Select>
      <FormHelperText>Filter</FormHelperText>
      <Line data={data} />
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
            {paginated.map((item, i) => (
              <TableRow key={item.character.id}>
                <TableCell align="right">
                  {item.records[item.records.length - 1].rank}
                </TableCell>
                <TableCell>{item.character.name}</TableCell>
                <TableCell align="right">
                  {item.records[item.records.length - 1].point}
                </TableCell>
                <TableCell align="right">
                  {item.records.length >= 2
                    ? item.records[item.records.length - 1].point -
                      item.records[item.records.length - 2].point
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  {oneRankHigher[i] !== null
                    ? oneRankHigher[i].records[
                        oneRankHigher[i].records.length - 1
                      ].point - item.records[item.records.length - 1].point
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={filtered.length}
                rowsPerPageOptions={[10, 25, 50]}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangeRowsPerPage={e => {
                  setRowsPerPage(e.target.value)
                  setPage(0)
                }}
                onChangePage={(_, newPage) => setPage(newPage)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  )
}

export function getStaticProps() {
  const data = fs.readFileSync(
    path.join(process.cwd(), "public", "all.json"),
    "utf8"
  )
  const items = JSON.parse(data)
  return {
    props: {
      items,
    },
  }
}
