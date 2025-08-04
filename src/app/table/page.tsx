import { sortBy } from "es-toolkit"

import RankingTable from "../../components/RankingTable"
import getAll from "../../getAll"
import { toRankItems } from "../../utils"

export default async function TablePage() {
  const items = await getAll()
  const sorted = sortBy(items, [
    (item) =>
      item.records[item.records.length - 1].rank ?? Number.POSITIVE_INFINITY,
  ])
  const rankItems = toRankItems(sorted.slice(0, 10))

  return <RankingTable rankItems={rankItems} showIcons={false} />
}
