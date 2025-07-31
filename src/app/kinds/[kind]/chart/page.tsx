import { Box } from "@mui/material"

import TotalPointChart from "../../../../components/TotalPointChart"
import getAll from "../../../../getAll"
import { Kind } from "../../../../types"

interface ChartPageProps {
  params: Promise<{
    kind: string
  }>
}

export async function generateStaticParams() {
  return [{ kind: Kind.LOCAL }, { kind: Kind.COMPANY }]
}

export default async function ChartPage({ params }: ChartPageProps) {
  const { kind } = await params
  const items = await getAll()
  const filtered = items.filter((item) => item.character.kind === kind)
  filtered.sort(
    (a, b) =>
      a.records[a.records.length - 1].rank -
      b.records[b.records.length - 1].rank
  )
  const topItems = filtered.slice(0, 10)

  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      <TotalPointChart items={topItems} />
    </Box>
  )
}
