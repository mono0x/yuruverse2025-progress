import { Item, RankItem } from "./types"

export function toRankItems(items: Item[]): RankItem[] {
  return items.map((item) => {
    const records = item.records
    const record = records[records.length - 1]
    const rankItem = {
      character: item.character,
      record: record,
    }
    return rankItem
  })
}
