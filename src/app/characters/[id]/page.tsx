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
  const item = items.find((item) => item.character.id === id)

  if (!item) {
    throw new Error(`Character with id ${id} not found`)
  }

  return <CharacterClient item={item} />
}
