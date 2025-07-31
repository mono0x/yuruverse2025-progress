import RankingView from "../components/RankingView"
import getAll from "../getAll"
import { getRankingViewProps } from "../utils"

const prefix = "/"

export default async function Page() {
  const pageNumber = 1
  const items = await getAll()
  const props = getRankingViewProps(items, pageNumber, prefix)

  return <RankingView {...props} />
}
