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
  Colors,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js"
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
  TimeScale,
  Colors
)

interface CharacterClientProps {
  item: Item
  maxPoints: number
  maxRank: number
}

export default function CharacterClient({
  item,
  maxPoints,
  maxRank,
}: CharacterClientProps) {
  const totalPoints = useMemo(() => {
    return item.records.map((record) => ({ x: record.date, y: record.point }))
  }, [item])

  const rankData = useMemo(() => {
    return item.records.map((record) => ({ x: record.date, y: record.rank }))
  }, [item])

  const data = useMemo(() => {
    return {
      datasets: [
        {
          type: "line" as const,
          label: "Total Points",
          yAxisID: "totalPoints",
          fill: false,
          tension: 0,
          data: totalPoints,
        },
        {
          type: "line" as const,
          label: "Rank",
          yAxisID: "rank",
          fill: false,
          tension: 0,
          data: rankData,
        },
      ],
    }
  }, [totalPoints, rankData])

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
                  min: 0,
                  max: Math.ceil(maxPoints / 10000) * 10000,
                  ticks: {
                    callback: (value) => {
                      return Number(value).toLocaleString()
                    },
                  },
                },
                rank: {
                  type: "linear",
                  position: "right",
                  grid: { display: false },
                  reverse: true,
                  min: 1,
                  max: maxRank,
                  ticks: {
                    callback: (value) => {
                      return Number(value).toLocaleString()
                    },
                  },
                },
              },
              plugins: {
                colors: {
                  forceOverride: true,
                },
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  )
}
