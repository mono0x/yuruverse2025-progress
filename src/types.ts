export const Kind = {
  LOCAL: "LOCAL",
  COMPANY: "COMPANY",
} as const

export type Kind = typeof Kind[keyof typeof Kind]

export type Character = {
  id: string
  kind: Kind
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
