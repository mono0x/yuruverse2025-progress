import { Item, RankItem } from "./types"

export function toRankItems(items: Item[]): RankItem[] {
  let higher: RankItem | null = null
  return items.map((item) => {
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
