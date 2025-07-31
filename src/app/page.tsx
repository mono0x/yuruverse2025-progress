import RankingView from "../components/RankingView"
import getAll from "../getAll"
import { Kind } from "../types"
import { getRankingViewProps } from "../utils"

const kind = Kind.LOCAL
const prefix = "/"

export default async function Page() {
  const pageNumber = 1
  const items = await getAll()
  const props = getRankingViewProps(items, kind, pageNumber, prefix)

  return <RankingView {...props} />
}
