import palette from "google-palette"
import { useMemo } from "react"
import { Line } from "react-chartjs-2"

import { Item } from "../src/types"

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
              beginAtZero: true,
            },
          ],
        },
      }}
    />
  )
}

export default TotalPointChart
