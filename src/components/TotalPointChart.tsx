import { ChartPoint } from "chart.js"
import palette from "google-palette"
import { useMemo } from "react"
import { Line } from "react-chartjs-2"

import { Item } from "../types"

type Props = {
  items: Item[]
}

const TotalPointChart: React.FC<Props> = ({ items }) => {
  const colors = useMemo(() => {
    return palette("mpn65", items.length).map(hex => `#${hex}`)
  }, [items.length])

  const data = useMemo(() => {
    return {
      datasets: items.map((item, i) => ({
        label: item.character.name,
        borderColor: colors[i],
        fill: false,
        lineTension: 0,
        data: item.records.map(record => ({
          t: record.date,
          y: record.point,
        })),
      })),
    }
  }, [items, colors])

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                minUnit: "day",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: value => {
                  return value.toLocaleString()
                },
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              /* eslint-disable @typescript-eslint/no-non-null-assertion */
              const dataset = data!.datasets![item.datasetIndex!]!
              const name = dataset.label
              const value = (dataset.data![item.index!] as ChartPoint).y!
              /* eslint-enable */
              return `${name}: ${value.toLocaleString()}`
            },
          },
        },
      }}
    />
  )
}

export default TotalPointChart
