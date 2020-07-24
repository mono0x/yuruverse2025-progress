import { Box } from "@material-ui/core"
import { GetStaticPaths, GetStaticProps } from "next"

import TotalPointChart from "../../../components/TotalPointChart"
import getAll from "../../../getAll"
import { Item, Kind } from "../../../types"

type Props = {
  items: Item[]
}

const ChartApiPage: React.FC<Props> = props => {
  const { items } = props

  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      <TotalPointChart items={items} />
    </Box>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { kind: Kind.LOCAL } },
      { params: { kind: Kind.COMPANY } },
    ],
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params = {} }) => {
  const items = await getAll()
  const filtered = items.filter(item => item.character.kind == params.kind)
  filtered.sort(
    (a, b) =>
      a.records[a.records.length - 1].rank -
      b.records[b.records.length - 1].rank
  )
  return {
    props: { items: filtered.slice(0, 10) },
  }
}

export default ChartApiPage
