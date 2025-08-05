export type Character = {
  id: string
  entry_number: number
  name: string
  country: string
  biko: string
  image_url: string
}

export type Record = {
  date: string
  rank: number
  point: number
}

export type Item = {
  character: Character
  records: Record[]
}

export enum RankChange {
  Up,
  Down,
  Stay,
}

export type RankItem = {
  character: Character
  record: Record
  rankChange?: RankChange
  plusPoint?: number
}
