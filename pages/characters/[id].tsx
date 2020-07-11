import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import palette from "google-palette"
import { GetStaticPaths, GetStaticProps } from "next"
import { useMemo } from "react"
import { Bar } from "react-chartjs-2"

import Header from "../../components/Header"
import getAll from "../../src/getAll"
import { Item } from "../../src/types"

type Props = {
  item: Item
}

const CharacterPage: React.FC<Props> = props => {
  const { item } = props

  const colors = useMemo(() => {
    return palette("mpn65", 2).map(hex => `#${hex}`)
  }, [])

  const totalPoints = useMemo(() => {
    return item.records.map(record => ({ x: record.date, y: record.point }))
  }, [item])

  const plusPoints = useMemo(() => {
    const records = item.records
    return records.flatMap((_, i) => {
      if (i === 0) {
        return [{ x: records[i].date, y: records[i].point }]
      }
      const days =
        (new Date(records[i].date).getTime() -
          new Date(records[i - 1].date).getTime()) /
        86400000
      return Array.from(Array(days).keys()).map(j => {
        const date = new Date(records[i - 1].date)
        date.setDate(date.getDate() + j + 1)
        return {
          x: `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")}`,
          y: (records[i].point - records[i - 1].point) / days,
        }
      })
    })
  }, [item])

  const data = useMemo(() => {
    return {
      datasets: [
        {
          type: "line",
          label: "Total Points",
          yAxisID: "totalPoints",
          borderColor: colors[0],
          fill: false,
          lineTension: 0,
          data: totalPoints,
        },
        {
          type: "bar",
          label: "+ Points",
          yAxisID: "plusPoints",
          backgroundColor: `${colors[1]}88`,
          data: plusPoints,
        },
      ],
    }
  }, [totalPoints, plusPoints, colors])

  return (
    <div>
      <Header title={item.character.name} />

      <Container>
        <Box
          style={{
            position: "relative",
            width: "100%",
            height: "50vh",
          }}
        >
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                xAxes: [
                  {
                    type: "time",
                    time: {
                      unit: "day",
                    },
                  },
                ],
                yAxes: [
                  {
                    id: "totalPoints",
                    beginAtZero: true,
                    position: "left",
                  },
                  {
                    id: "plusPoints",
                    beginAtZero: true,
                    position: "right",
                    gridLines: { display: false },
                  },
                ],
              },
            }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Rank</TableCell>
                <TableCell align="right">Total Points</TableCell>
                <TableCell align="right">+ Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {item.records.map((record, i) => (
                <TableRow key={record.date}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell align="right">{record.rank}</TableCell>
                  <TableCell align="right">{record.point}</TableCell>
                  <TableCell align="right">
                    {i > 0
                      ? record.point - item.records[i - 1].point
                      : record.point}
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

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await getAll()
  const paths = items.map(item => ({ params: { id: item.character.id } }))
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const items = await getAll()
  const item = items.find(item => item.character.id === params.id)
  return {
    props: { item: item },
  }
}

export default CharacterPage
