import { GetStaticPaths, GetStaticProps } from "next"

import RankingView from "../../components/RankingView"
import getAll from "../../getAll"
import { Kind } from "../../types"
import { getRankingViewProps } from "../../utils"

const kind = Kind.LOCAL
const prefix = "/"
const rowsPerPage = 10

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await getAll()
  const filtered = items.filter(item => item.character.kind == kind)
  const pages = Math.ceil(filtered.length / rowsPerPage)
  const paths = Array.from(Array(pages + 1).keys())
    .slice(2) // skip 0 and 1
    .map(page => ({ params: { page: page.toString() } }))
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params = {} }) => {
  const { page } = params
  const pageNumber = parseInt(page as string, 10)

  const items = await getAll()
  return {
    props: getRankingViewProps(items, kind, pageNumber, prefix),
  }
}

export default RankingView
