type Card = {
  imageUrl: string
  playerName: string
  rarity: string
}

type User = {
  userId: number
  username: string
  permissions: number[]
  cards: Card[]
}

type Rarity = {
  rarity: string
  imageUrl: string
  enabled: boolean
}
