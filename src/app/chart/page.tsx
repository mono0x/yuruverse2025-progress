import { Box } from "@mui/material"
import { sortBy } from "es-toolkit"

import TotalPointChart from "../../components/TotalPointChart"
import getAll from "../../getAll"

export default async function ChartPage() {
  const items = await getAll()
  const sorted = sortBy(items, [
    (item) =>
      item.records[item.records.length - 1].rank ?? Number.POSITIVE_INFINITY,
  ])
  const topItems = sorted.slice(0, 6)
  const maxPoints = Math.max(
    ...topItems.flatMap((item) => item.records.map((record) => record.point))
  )

  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      <TotalPointChart items={topItems} maxPoints={maxPoints} />
    </Box>
  )
}
