import RankingView from "../components/RankingView"
import getAll from "../getAll"
import { toRankItems } from "../utils"

export default async function Page() {
  const items = await getAll()
  const maxPoints = Math.max(
    ...items.flatMap((item) => item.records.map((record) => record.point))
  )
  const sorted = [...items].sort(
    (a, b) =>
      a.records[a.records.length - 1].rank -
      b.records[b.records.length - 1].rank
  )
  const props = {
    items: sorted,
    rankItems: toRankItems(sorted),
    maxPoints: maxPoints,
    showPager: false,
  }
  return <RankingView {...props} />
}
