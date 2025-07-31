"use client"

import "chartjs-adapter-date-fns"

import {
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
import { Line } from "react-chartjs-2"

import { Item } from "../types"

ChartJS.register(
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
}

const TotalPointChart: React.FC<Props> = ({ items }) => {
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
