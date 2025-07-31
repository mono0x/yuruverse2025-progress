"use client"

import "chartjs-adapter-date-fns"

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
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js"
import palette from "google-palette"
import { useMemo } from "react"
import { Chart } from "react-chartjs-2"

import Header from "../../../components/Header"
import { Item } from "../../../types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

interface CharacterClientProps {
  item: Item
}

export default function CharacterClient({ item }: CharacterClientProps) {
  const colors = useMemo(() => {
    return palette("mpn65", 2).map((hex) => `#${hex}`)
  }, [])

  const totalPoints = useMemo(() => {
    return item.records.map((record) => ({ x: record.date, y: record.point }))
  }, [item])

  const plusPoints = useMemo(() => {
    const records = item.records.filter((item) => item.date <= "2020-09-15")
    return records.flatMap((_, i) => {
      if (i === 0) {
        return [{ x: records[i].date, y: records[i].point }]
      }
      const days =
        (new Date(records[i].date).getTime() -
          new Date(records[i - 1].date).getTime()) /
        86400000
      return Array.from(Array(days).keys()).map((j) => {
        const date = new Date(records[i - 1].date)
        date.setDate(date.getDate() + j + 1)
        return {
          x: ((date) => {
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, "0")
            const day = date.getDate().toString().padStart(2, "0")
            return `${year}-${month}-${day}`
          })(date),
          y: (records[i].point - records[i - 1].point) / days,
        }
      })
    })
  }, [item])

  const data = useMemo(() => {
    return {
      datasets: [
        {
          type: "line" as const,
          label: "Total Points",
          yAxisID: "totalPoints",
          borderColor: colors[0],
          fill: false,
          tension: 0,
          data: totalPoints,
        },
        {
          type: "bar" as const,
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
          <Chart
            type="bar"
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: "day",
                  },
                },
                totalPoints: {
                  type: "linear",
                  position: "left",
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => {
                      return Number(value).toLocaleString()
                    },
                  },
                },
                plusPoints: {
                  type: "linear",
                  position: "right",
                  grid: { display: false },
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => {
                      return Number(value).toLocaleString()
                    },
                  },
                },
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.dataset.label || ""
                      const value = context.parsed.y
                      return `${label}: ${value.toLocaleString()}`
                    },
                  },
                },
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
                  <TableCell align="right">
                    {record.rank.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {record.point.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {(i > 0
                      ? record.point - item.records[i - 1].point
                      : record.point
                    ).toLocaleString()}
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
