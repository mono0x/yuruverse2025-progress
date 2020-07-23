import { Item } from "./types"

export function behind(item: Item, oneRankHigher?: Item): number | undefined {
  if (!oneRankHigher) {
    return
  }
  return (
    oneRankHigher.records[oneRankHigher.records.length - 1].point -
    item.records[item.records.length - 1].point
  )
}

export function plusPoint(item: Item): number {
  if (item.records.length == 1) {
    return item.records[0].point
  }
  return (
    item.records[item.records.length - 1].point -
    item.records[item.records.length - 2].point
  )
}
