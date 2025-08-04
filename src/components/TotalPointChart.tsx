"use client"

import "chartjs-adapter-date-fns"

import { Step } from "@mui/material"
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
import { max } from "date-fns"
import { useMemo } from "react"
import { Line } from "react-chartjs-2"

import { Item } from "../types"

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Colors
)

type Props = {
  items: Item[]
  maxPoints: number
}

const TotalPointChart: React.FC<Props> = ({ items, maxPoints }) => {
  const data = useMemo(() => {
    return {
      datasets: items.map((item) => ({
        label: item.character.name,
        fill: false,
        tension: 0,
        data: item.records.map((record) => ({
          x: record.date,
          y: record.point,
        })),
      })),
    }
  }, [items])

  return (
    <Line
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
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return Number(value).toLocaleString()
              },
            },
            min: 0,
            max: Math.ceil(maxPoints / 10000) * 10000,
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
  )
}

export default TotalPointChart
