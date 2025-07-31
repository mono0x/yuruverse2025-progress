import RankingView from "../../components/RankingView"
import getAll from "../../getAll"
import { Kind } from "../../types"
import { getRankingViewProps } from "../../utils"

const kind = Kind.COMPANY
const prefix = "/company/"

export default async function CompanyPage() {
  const pageNumber = 1
  const items = await getAll()
  const props = getRankingViewProps(items, kind, pageNumber, prefix)

  return <RankingView {...props} />
}
