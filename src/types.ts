export type Character = {
  id: string
  entry_number: number
  name: string
  country: string
  biko: string
  image_url: string
}

export type RawRecord = {
  date: string
  rank: number
  point: number
}

export type Record = RawRecord & {
  plusRank: number
  plusPoint: number
  consecutive: boolean
}

export type RawItem = {
  character: Character
  records: RawRecord[]
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
  point: number
  rank: number
  rankChange?: RankChange
  plusPoint: number
  plusRank: number
  plusRankChange?: RankChange
}
