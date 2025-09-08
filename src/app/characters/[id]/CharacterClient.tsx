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
  BarController,
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  LineController,
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
import type { Item, RankItem } from "../../../types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Colors,
)
interface PointsChartProps {
  data: ChartData<"line", { x: string; y: number }[]>
}

const PointsChart: React.FC<PointsChartProps> = ({ data }) => {
  return (
    <Chart
      type="line"
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
        elements: {
          point: {
            radius: 0,
            hoverRadius: 4,
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
  data: ChartData<"line", { x: string; y: number }[]>
  minRank: number
  maxRank: number
}

const RankChart: React.FC<RankChartProps> = ({ data, minRank, maxRank }) => {
  return (
    <Chart
      type="line"
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
        elements: {
          point: {
            radius: 0,
            hoverRadius: 4,
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
  data: ChartData<"bar", Array<{ x: string; y: number | null }>, string>
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
            stacked: true,
          },
          y: {
            beginAtZero: true,
            stacked: true,
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
  records: Array<{
    date: string
    rank: number
    point: number
    plusPoint: number
    plusRank: number
  }>
}

const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  const maxPoint = Math.max(...records.map((r) => r.point))
  const maxPlusPoint = Math.max(...records.map((r) => r.plusPoint))

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
            <TableCell align="right">+ Rank</TableCell>
            <TableCell align="right">
              <BarChartHeaderCell>+</BarChartHeaderCell>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...records].reverse().map((record) => (
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
                {record.plusRank.toLocaleString()}
              </TableCell>
              <TableCell align="right">
                <BarChartCell
                  value={record.plusPoint}
                  maxValue={maxPlusPoint}
                  color="rgba(75, 192, 192, 0.2)"
                />
              </TableCell>
            </TableRow>
          ))}
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
  nearbyItems: RankItem[]
}

export default function CharacterClient({
  item,
  nearbyItems,
}: CharacterClientProps) {
  const rankData = item.records.map((record) => ({
    x: record.date,
    y: record.rank,
  }))

  const rawMinRank = Math.min(...item.records.map((record) => record.rank))
  const rawMaxRank = Math.max(...item.records.map((record) => record.rank))

  const [minRank, maxRank] = [Math.max(1, rawMinRank - 1), rawMaxRank + 1]

  const currentRecord = item.records[item.records.length - 1]
  const currentPoint = currentRecord?.point
  const currentRank = currentRecord?.rank
  const currentPlusPoint = currentRecord?.plusPoint

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

  const plusPointsData = useMemo(() => {
    const consecutiveData = item.records
      .filter((record) => record.consecutive)
      .map((record) => ({ x: record.date, y: record.plusPoint }))

    const gapData = item.records
      .filter((record) => !record.consecutive)
      .map((record) => ({ x: record.date, y: record.plusPoint }))

    return {
      labels: item.records.map((record) => record.date),
      datasets: [
        {
          label: "ゆるナビ投票",
          data: consecutiveData,
        },
        {
          label: "ゆるナビ投票+ふるさと応援投票",
          data: gapData,
        },
      ],
    }
  }, [item.records])

  const plusPointsRankData = useMemo(() => {
    const ranks = item.records.map((record) => ({
      x: record.date,
      y: record.plusRank,
    }))

    let minRank = Number.MAX_VALUE
    let maxRank = 1

    ranks.forEach(({ y }) => {
      minRank = Math.min(minRank, y)
      maxRank = Math.max(maxRank, y)
    })

    return {
      chartData: {
        datasets: [
          {
            type: "line" as const,
            label: item.character.name,
            fill: false,
            tension: 0,
            data: ranks,
            borderWidth: 3,
          },
        ],
      },
      minRank: Math.max(1, minRank - 1),
      maxRank: maxRank + 1,
    }
  }, [item.character.name, item.records])

  return (
    <div>
      <Header title={item.character.name} />

      <Container sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <MyCardHeader
                title="+ Rank"
                value={
                  plusPointsRankData.chartData.datasets[0]?.data.length > 0
                    ? plusPointsRankData.chartData.datasets[0].data[
                        plusPointsRankData.chartData.datasets[0].data.length - 1
                      ].y.toLocaleString()
                    : "-"
                }
              />
              <CardContent>
                <RankChart
                  data={plusPointsRankData.chartData}
                  minRank={plusPointsRankData.minRank}
                  maxRank={plusPointsRankData.maxRank}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <MyCardHeader
                title="+ Points"
                value={currentPlusPoint.toLocaleString()}
              />
              <CardContent>
                <PlusPointsChart data={plusPointsData} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card variant="outlined">
              <StyledCardHeader title="Nearby Characters" />
              <CardContent>
                <RankingTable rankItems={nearbyItems} />
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
