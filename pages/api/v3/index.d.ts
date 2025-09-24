export type ApiResponse<T> =
  | {
      status: 'success'
      payload: T
      message?: null
    }
  | {
      status: 'error' | 'logout'
      payload?: null
      message: string
    }

export type ListTotal = {
  total: number
  totalOwned?: number
}

export type ListResponse<T> = {
  rows: T[]
  total: number
  totalOwned?: number
}

export type CardMakerInfo = {
  userID: number
  username: string
  date_approved: string
}

export type UserMostCards = {
  userID: number
  uniqueCards: number
  totalCards: number
  username: string
  avatar: string
}

export type UserUniqueCollection = {
  userID: number
  username: string
  card_rarity: string
  owned_count: number
  rarity_rank: number
}

export type SiteUniqueCards = {
  card_rarity: string
  total_count: number
}

export type UserCollection = {
  ownedCardID: number
  userID: number
  username?: string
  cardID: number
  packID: number
  imageURL?: number
  total?: number
}

export type UserPacks = {
  packID: string
  userID: number
  packType: string
  opened: number
  purchaseDate: string
  openDate: string
  source
  string
}

export type Rarities = {
  card_rarity: string
}

export type SubType = {
  sub_type: string
}

export type LatestCards = {
  ownedCardID: number
  userID: number
  cardID: number
  packID: number
  playerName: string
  playerID: number
  card_rarity: string
  imageURL: string
}

export type UserMostCards = {
  userID: number
  uniqueCards: number
  totalCards: number
  username: string
  avatar: string
}

export type binders = {
  binderID: number
  userID: number
  username: string
  binder_name: string
  binder_desc: string
}

export type binderCards = {
  binderID: number
  ownedCardID: number
  position: number
  cardID: number
  userID?: number
  player_name: string
  teamID: number
  playerID: number
  card_rarity: string
  image_url: string
  overall: number
  season: number
}

export type Team = {
  id: number
  season: number
  league: number
  conference: number
  division: number
  name: string
  nameDetails: { first: string; second: string }
  abbreviation: string
  location: string
  colors: { primary: string; secondary: string; text: string }
  stats: {
    wins: number
    losses: number
    overtimeLosses: number
    shootoutWins: number
    shootoutLosses: number
    points: number
    goalsFor: number
    goalsAgainst: number
    winPercent: number
  }
}

export type SortDirection = 'ASC' | 'DESC'
