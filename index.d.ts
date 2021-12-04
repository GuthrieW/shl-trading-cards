type Card = {
  playerName: string
  team: string
  rarity: 'Bronze' | 'Silver' | 'Gold' | 'Ruby' | 'Diamond'
  position: 'C' | 'LW' | 'RW' | 'LD' | 'RD' | 'G'
  overall: string
  skating?: number
  shooting?: number
  hands?: number
  checking?: number
  defense?: number
  highShots?: number
  lowShots?: number
  quickness?: number
  control?: number
  conditioning?: number
  imageUrl: string
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

type MyBbUser = {
  uid: number
  username: string
  password: string
  salt: string
  loginkey: string
  email: string
  postnum: number
  threadnum: number
  avatar: string
  avatardimensions: string
  avatartype: string
}
