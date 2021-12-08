type Card = {
  cardID: number
  teamID: number
  playerID: number
  author_userID: number
  card_rarity: string
  player_name: string
  pullable: boolean
  approved: boolean
  image_url: string
  position: string
  overall: number
  skating?: number | null
  shooting?: number | null
  hands?: number | null
  checking?: number | null
  defense?: number | null
  high_shots?: number | null
  low_shots?: number | null
  quickness?: number | null
  control?: number | null
  conditioning?: number | null
}

type CardSet = {
  cardID: number
  setID: number
}

type Collection = {
  userID: number
  cardID: number
  quantity: number
}

type Set = {
  setID: number
  name: string
  description: string
}

type StartingLineup = {
  userID: number
  center: number
  rightwing: number
  leftwing: number
  rightdefense: number
  leftdefense: number
  goalie: number
}

// There is one record for each card involved in the trade
type Trade = {
  tradeID: number
  tradeAssetID: number
  fromID: number
  toID: number
  cardID: number
  trade_status: string
  create_date: Date
  update_data: Date
}

type User = {
  uid: number
  username: string
  avatar: string
  usergroup: number
  additionalgroups: string
  displaygroups: number
}

// type Card = {
//   playerName: string
//   team: string
//   rarity: 'Bronze' | 'Silver' | 'Gold' | 'Ruby' | 'Diamond'
//   position: 'C' | 'LW' | 'RW' | 'LD' | 'RD' | 'G'
//   overall: string
//   skating?: number
//   shooting?: number
//   hands?: number
//   checking?: number
//   defense?: number
//   highShots?: number
//   lowShots?: number
//   quickness?: number
//   control?: number
//   conditioning?: number
//   imageUrl: string
// }

type Rarity = {
  rarity: string
  imageUrl: string
  enabled: boolean
}
