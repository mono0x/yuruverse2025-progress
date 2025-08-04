import { sortBy } from "es-toolkit"

import getAll from "../../../getAll"
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
  const maxPoints = Math.max(
    ...sorted.flatMap((item) => item.records.map((record) => record.point))
  )
  const maxRank = sorted.length

  const rawFirstIndex = itemIndex - 2
  const rawLastIndex = itemIndex + 3
  const roundedFirstIndex = Math.max(0, rawFirstIndex)
  const roundedLastIndex = Math.min(sorted.length - 1, rawLastIndex)
  const firstIndex = roundedFirstIndex - (rawLastIndex - roundedLastIndex)
  const lastIndex = roundedLastIndex + (roundedFirstIndex - rawFirstIndex)

  const nearbyItems = sorted.slice(firstIndex, lastIndex + 1)

  return (
    <CharacterClient
      item={item}
      maxPoints={maxPoints}
      maxRank={maxRank}
      nearbyItems={nearbyItems}
    />
  )
}
