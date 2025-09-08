import fs from "node:fs/promises"
import path from "node:path"

import { differenceInCalendarDays } from "date-fns"
import { orderBy, uniq } from "es-toolkit"

import type { Item, RawItem, Record } from "./types"

type DayDataItem = {
  characterId: string
  plusPoint: number
  date: string
}

const getAllDates = (items: RawItem[]): string[] => {
  const records = items.flatMap((item) => item.records)
  const dates = records.map((r) => r.date)
  return uniq(dates).sort()
}

const enhanceRecord = (
  record: RawItem["records"][number],
  idx: number,
  records: RawItem["records"],
): Omit<Record, "plusRank"> => ({
  ...record,
  plusPoint: idx > 0 ? record.point - records[idx - 1].point : record.point,
  consecutive:
    idx > 0
      ? differenceInCalendarDays(
          new Date(record.date),
          new Date(records[idx - 1].date),
        ) === 1
      : false,
})

const createDayData = (items: RawItem[], date: string): DayDataItem[] => {
  const dayDataWithNulls = items.map((item) => {
    const record = item.records.find((r) => r.date === date)
    const idx = record ? item.records.indexOf(record) : -1
    return record
      ? {
          characterId: item.character.id,
          plusPoint:
            idx > 0 ? record.point - item.records[idx - 1].point : record.point,
          date,
        }
      : null
  })
  const dayData = dayDataWithNulls.filter(Boolean) as DayDataItem[]
  return orderBy(dayData, ["plusPoint"], ["desc"])
}

const calculateRankingsFromData = (
  dayData: DayDataItem[],
): Map<string, number> => {
  const result = dayData.reduce(
    (acc, item, i) => {
      const rank =
        i > 0 && dayData[i - 1].plusPoint !== item.plusPoint
          ? i + 1
          : acc.currentRank
      acc.rankings.set(item.characterId, rank)
      acc.currentRank = rank
      return acc
    },
    { rankings: new Map<string, number>(), currentRank: 1 },
  )
  return result.rankings
}

function enhanceRecords(rawItems: RawItem[]): Item[] {
  const dates = getAllDates(rawItems)

  return rawItems.map((targetItem) => {
    const enhancedRecords = targetItem.records.map((record, idx) =>
      enhanceRecord(record, idx, targetItem.records),
    )

    const dailyRankings = dates.map((date) => ({
      date,
      rankings: calculateRankingsFromData(createDayData(rawItems, date)),
    }))

    const records = enhancedRecords.map((record) => {
      const dayRanking = dailyRankings.find((d) => d.date === record.date)
      const plusRank = dayRanking?.rankings.get(targetItem.character.id)
      if (plusRank == null) {
        throw new Error("must not happen")
      }
      return { ...record, plusRank }
    })

    return {
      character: targetItem.character,
      records,
    }
  })
}

export default async function getAll(): Promise<Item[]> {
  const data = await fs.readFile(
    path.join(process.cwd(), "public", "all.json"),
    "utf8",
  )
  const rawItems: RawItem[] = JSON.parse(data)
  return enhanceRecords(rawItems)
}
