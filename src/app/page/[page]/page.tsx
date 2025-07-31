import RankingView from "../../../components/RankingView"
import getAll from "../../../getAll"
import { Kind } from "../../../types"
import { getRankingViewProps } from "../../../utils"

const kind = Kind.LOCAL
const prefix = "/"
const rowsPerPage = 10

interface PageProps {
  params: Promise<{
    page: string
  }>
}

export async function generateStaticParams() {
  const items = await getAll()
  const filtered = items.filter((item) => item.character.kind === kind)
  const pages = Math.ceil(filtered.length / rowsPerPage)

  return Array.from(Array(pages + 1).keys())
    .slice(2) // skip 0 and 1
    .map((page) => ({
      page: page.toString(),
    }))
}

export default async function PagePaginated({ params }: PageProps) {
  const { page } = await params
  const pageNumber = parseInt(page, 10)
  const items = await getAll()
  const props = getRankingViewProps(items, kind, pageNumber, prefix)

  return <RankingView {...props} />
}
