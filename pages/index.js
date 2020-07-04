import { useMemo, useState } from "react"
import fs from "fs"
import path from "path"
import { Select, MenuItem } from "@material-ui/core"
import { Line } from "react-chartjs-2"
import palette from "google-palette"

export default function IndexPage(props) {
  const { items } = props

  const [kind, setKind] = useState("LOCAL")

  const filtered = useMemo(() => {
    const filtered = items.filter(item => item.character.kind == kind)
    filtered.sort(
      (a, b) =>
        b.records[b.records.length - 1].point -
        a.records[a.records.length - 1].point
    )
    return filtered.slice(0, 10)
  }, [items, kind])

  const dates = useMemo(() => {
    const dates = new Set()
    filtered
      .flatMap(item => item.records.map(record => record.date))
      .forEach(date => dates.add(date))
    return Array.from(dates)
  }, [filtered])

  const data = useMemo(() => {
    const colors = palette("mpn65", filtered.length).map(hex => `#${hex}`)
    return {
      labels: dates,
      datasets: filtered.map((item, i) => ({
        label: item.character.name,
        borderColor: colors[i],
        fill: false,
        data: item.records.map(record => ({
          t: record.date,
          y: record.point,
        })),
      })),
      options: {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
              },
            },
          ],
        },
      },
    }
  }, [filtered, dates])

  return (
    <div>
      <Select value={kind} onChange={e => setKind(e.target.value)}>
        <MenuItem value="LOCAL">ご当地</MenuItem>
        <MenuItem value="COMPANY">企業・その他</MenuItem>
      </Select>
      <Line data={data} />
    </div>
  )
}

export function getStaticProps() {
  const data = fs.readFileSync(
    path.join(process.cwd(), "public", "all.json"),
    "utf8"
  )
  const items = JSON.parse(data)
  return {
    props: {
      items,
    },
  }
}
