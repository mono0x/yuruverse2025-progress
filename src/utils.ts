import { type Item, RankChange, type RankItem } from "./types"

export function toRankItems(items: Item[]): RankItem[] {
  return items.map((item) => {
    const records = item.records
    const record = records[records.length - 1]
    const prevRecord = records[records.length - 2]
    const rankChange =
      prevRecord != null
        ? record.rank < prevRecord.rank
          ? RankChange.Up
          : record.rank > prevRecord.rank
            ? RankChange.Down
            : RankChange.Stay
        : undefined
    const plusPoint =
      prevRecord != null ? record.point - prevRecord.point : undefined

    const rankItem = {
      character: item.character,
      point: record.point,
      rank: record.rank,
      rankChange,
      plusPoint,
    }
    return rankItem
  })
}
