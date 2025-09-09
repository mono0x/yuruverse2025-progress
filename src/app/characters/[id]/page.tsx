import { sortBy } from "es-toolkit"
import type { Metadata } from "next"

import getAll from "../../../getAll"
import { toRankItems } from "../../../utils"
import CharacterClient from "./CharacterClient"

interface CharacterPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const items = await getAll()
  return items.map((item) => ({
    id: item.character.id,
  }))
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params
  const items = await getAll()
  const item = items.find((item) => item.character.id === id)

  if (!item) {
    return {
      title: "Character Not Found | YuruVerse 2025 Progress",
    }
  }

  return {
    title: `${item.character.name} | YuruVerse 2025 Progress`,
    description: `${item.character.name} (${item.character.country}) の順位推移とポイント履歴`,
  }
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params
  const items = await getAll()
  const sorted = sortBy(items, [
    (item) =>
      item.records[item.records.length - 1].rank ?? Number.POSITIVE_INFINITY,
  ])
  const itemIndex = sorted.findIndex((item) => item.character.id === id)
  if (itemIndex === -1) {
    throw new Error(`Character with id ${id} not found`)
  }
  const item = sorted[itemIndex]

  const rawFirstIndex = itemIndex - 3
  const rawLastIndex = itemIndex + 3
  const roundedFirstIndex = Math.max(0, rawFirstIndex)
  const roundedLastIndex = Math.min(sorted.length - 1, rawLastIndex)
  const firstIndex = roundedFirstIndex - (rawLastIndex - roundedLastIndex)
  const lastIndex = roundedLastIndex + (roundedFirstIndex - rawFirstIndex)

  const nearbyItems = toRankItems(sorted.slice(firstIndex, lastIndex + 1))

  return <CharacterClient item={item} nearbyItems={nearbyItems} />
}
