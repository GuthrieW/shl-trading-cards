export type MyBbUser = {
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

export type TradingCardUser = {
  uid: number
}

export type Card = {
  id: number
  playerName: string
  playerTeam: string
  rarity: string
  imageUrl: string
  cardCreator: string
  submissionDate: Date
  approved: boolean
  currentRotation: boolean
}
