"use client"

import "chartjs-adapter-date-fns"

import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
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

import BarChartCell from "../../../components/BarChartCell"
import BarChartHeaderCell from "../../../components/BarChartHeaderCell"
import Header from "../../../components/Header"
import RankingTable from "../../../components/RankingTable"
import StyledCardHeader from "../../../components/StyledCardHeader"
import { Item } from "../../../types"
import { toRankItems } from "../../../utils"

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
interface PointsChartProps {
  data: any
}

const PointsChart: React.FC<PointsChartProps> = ({ data }) => {
  return (
    <Chart
      type="bar"
      width={"100%"}
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
            ticks: {
              display: false,
            },
          },
          y: {
            type: "linear",
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return Number(value).toLocaleString()
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
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
          title: {
            display: false,
          },
        },
      }}
    />
  )
}

interface RankChartProps {
  data: any
  minRank: number
  maxRank: number
}

const RankChart: React.FC<RankChartProps> = ({ data, minRank, maxRank }) => {
  return (
    <Chart
      type="bar"
      width={"100%"}
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
            ticks: {
              display: false,
            },
          },
          y: {
            type: "linear",
            reverse: true,
            min: minRank,
            max: maxRank,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                return Number(value).toLocaleString()
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
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
          title: {
            display: false,
          },
        },
      }}
    />
  )
}

interface PlusPointsChartProps {
  data: any
}

const PlusPointsChart: React.FC<PlusPointsChartProps> = ({ data }) => {
  return (
    <Chart
      type="bar"
      width={"100%"}
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
            ticks: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return Number(value).toLocaleString()
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
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
          title: {
            display: false,
          },
        },
      }}
    />
  )
}

interface HistoryTableProps {
  records: Array<{ date: string; rank: number; point: number }>
}

const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  const maxPoint = Math.max(...records.map((r) => r.point))
  const maxPlusPoint = Math.max(
    ...records.map((r, i) => {
      if (i === 0) return r.point
      const prev = records[i - 1]
      return r.point - (prev?.point ?? 0)
    })
  )

  return (
    <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Rank</TableCell>
            <TableCell align="right">
              <BarChartHeaderCell>Points</BarChartHeaderCell>
            </TableCell>
            <TableCell align="right">
              <BarChartHeaderCell>+</BarChartHeaderCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...records].reverse().map((record, index) => {
            const originalIndex = records.length - 1 - index
            const prevRecord =
              originalIndex > 0 ? records[originalIndex - 1] : null
            const plusPoint = prevRecord
              ? record.point - prevRecord.point
              : record.point

            return (
              <TableRow key={record.date}>
                <TableCell>{record.date}</TableCell>
                <TableCell align="right">
                  {record.rank.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  <BarChartCell
                    value={record.point}
                    maxValue={maxPoint}
                    color="rgba(54, 162, 235, 0.2)"
                  />
                </TableCell>
                <TableCell align="right">
                  <BarChartCell
                    value={plusPoint}
                    maxValue={maxPlusPoint}
                    color="rgba(75, 192, 192, 0.2)"
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

interface MyCardHeaderProps {
  title: string
  value: string
}

const MyCardHeader: React.FC<MyCardHeaderProps> = ({ title, value }) => {
  return (
    <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
      <Grid container alignItems="flex-start" justifyContent="space-between">
        <Grid>
          <Box
            sx={{
              fontSize: "1rem",
              lineHeight: 1,
            }}
          >
            {title}
          </Box>
        </Grid>
        <Grid>
          <Box sx={{ fontSize: "3rem", textAlign: "right", lineHeight: 1 }}>
            {value}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

interface CharacterClientProps {
  item: Item
  nearbyItems: Item[]
}

export default function CharacterClient({
  item,
  nearbyItems,
}: CharacterClientProps) {
  const recentRecords = item.records.slice(-7)

  const rankData = recentRecords.map((record) => ({
    x: record.date,
    y: record.rank,
  }))

  const rawMinRank = Math.min(...recentRecords.map((record) => record.rank))
  const rawMaxRank = Math.max(...recentRecords.map((record) => record.rank))

  const [minRank, maxRank] = [Math.max(1, rawMinRank - 1), rawMaxRank + 1]

  const plusPoints = recentRecords.map((record, index) => {
    if (index === 0) {
      return record.point
    }
    const prevRecord = item.records[index - 1]
    return record.point - (prevRecord?.point ?? 0)
  })

  const currentRecord = recentRecords[recentRecords.length - 1]
  const currentPoint = currentRecord?.point
  const currentRank = currentRecord?.rank
  const currentPlusPoint = plusPoints[plusPoints.length - 1]

  const pointsData = useMemo(() => {
    const totalPoints = item.records.map((record) => ({
      x: record.date,
      y: record.point,
    }))
    const datasets = [
      {
        type: "line" as const,
        label: item.character.name,
        fill: false,
        tension: 0,
        data: totalPoints,
        borderWidth: 3,
      },
    ]
    return { datasets }
  }, [item])

  const rankDataChart = useMemo(() => {
    const datasets = [
      {
        type: "line" as const,
        label: item.character.name,
        fill: false,
        tension: 0,
        data: rankData,
        borderWidth: 3,
      },
    ]
    return { datasets }
  }, [item, rankData])

  return (
    <div>
      <Header title={item.character.name} />

      <Container sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <MyCardHeader title="Rank" value={currentRank.toLocaleString()} />
              <CardContent>
                <RankChart
                  data={rankDataChart}
                  minRank={minRank}
                  maxRank={maxRank}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <MyCardHeader
                title="Points"
                value={currentPoint?.toLocaleString() || "0"}
              />
              <CardContent>
                <PointsChart data={pointsData} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <MyCardHeader
                title="+ Points"
                value={currentPlusPoint.toLocaleString()}
              />
              <CardContent>
                <PlusPointsChart
                  data={{
                    labels: item.records.map((record) => record.date),
                    datasets: [
                      {
                        label: "Plus Points",
                        data: plusPoints,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card variant="outlined">
              <StyledCardHeader title="Nearby Characters" />
              <CardContent>
                <RankingTable rankItems={toRankItems(nearbyItems)} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card variant="outlined">
              <StyledCardHeader title="History" />
              <CardContent>
                <HistoryTable records={item.records} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}
