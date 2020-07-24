import { RankingViewProps } from "./components/RankingView"
import { Item, Kind, RankItem } from "./types"

export function toRankItems(items: Item[]): RankItem[] {
  let higher: RankItem | null = null
  return items.map(item => {
    const records = item.records
    const record = records[records.length - 1]
    const rankItem = {
      character: item.character,
      record: record,
      plusPoint:
        records[records.length - 1].point -
        (records.length >= 2 ? records[records.length - 2].point : 0),
      behindPoint: higher != null ? higher.record.point - record.point : null,
    }
    higher = rankItem
    return rankItem
  })
}

const rowsPerPage = 10

export function getRankingViewProps(
  items: Item[],
  kind: Kind,
  page: number,
  prefix: string
): RankingViewProps {
  const filtered = items.filter(item => item.character.kind == kind)
  filtered.sort(
    (a, b) =>
      a.records[a.records.length - 1].rank -
      b.records[b.records.length - 1].rank
  )
  return {
    kind: kind,
    items: filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    rankItems: toRankItems(filtered).slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    ),
    page: page,
    rowsPerPage: rowsPerPage,
    count: filtered.length,
    prefix: prefix,
  }
}
