import { sortBy } from "es-toolkit"

import RankingView from "../components/RankingView"
import getAll from "../getAll"
import { toRankItems } from "../utils"

export default async function Page() {
  const items = await getAll()
  const sorted = sortBy(items, [
    (item) =>
      item.records[item.records.length - 1].rank ?? Number.POSITIVE_INFINITY,
  ])
  const props = {
    items: sorted,
    rankItems: toRankItems(sorted),
  }
  return <RankingView {...props} />
}
