type Card = {
  imageUrl: string
  playerName: string
  rarity: string
}

type User = {
  userId: number
  username: string
  isAdmin: boolean
  isProcessor: boolean
  isSubmitter: boolean
  cards: Card[]
}

type Rarity = {
  rarity: string
  imageUrl: string
  enabled: boolean
}
