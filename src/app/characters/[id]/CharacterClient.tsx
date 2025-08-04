"use client"

import "chartjs-adapter-date-fns"

import { Box, Container } from "@mui/material"
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
import RankingTable from "../../../components/RankingTable"
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

interface CharacterClientProps {
  item: Item
  maxPoints: number
  maxRank: number
  nearbyItems: Item[]
}

export default function CharacterClient({
  item,
  maxPoints,
  maxRank,
  nearbyItems,
}: CharacterClientProps) {
  const rankData = useMemo(() => {
    return item.records.map((record) => ({ x: record.date, y: record.rank }))
  }, [item])

  const data = useMemo(() => {
    const datasets = [
      ...nearbyItems.map((nearbyItem) => {
        const totalPoints = nearbyItem.records.map((record) => ({
          x: record.date,
          y: record.point,
        }))
        return {
          type: "line" as const,
          label: nearbyItem.character.name,
          yAxisID: "totalPoints",
          fill: false,
          tension: 0,
          data: totalPoints,
          borderWidth: nearbyItem.character.id === item.character.id ? 3 : 1,
        }
      }),
      {
        type: "line" as const,
        label: "Rank",
        yAxisID: "rank",
        fill: false,
        tension: 0,
        data: rankData,
        borderWidth: 3,
      },
    ]
    return { datasets }
  }, [item, rankData, nearbyItems])

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
              },
            }}
          />
        </Box>

        <Box>
          <RankingTable rankItems={toRankItems(nearbyItems)} />
        </Box>
      </Container>
    </div>
  )
}
