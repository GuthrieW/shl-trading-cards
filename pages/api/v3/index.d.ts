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

export type UserMostCards = {
  userID: number;
  uniqueCards: number;
  totalCards: number;
  username: string;
  avatar: string;
}

export type UserUniqueCollection = {
  userID: number
  card_rarity: string
  owned_count: number
}

export type SiteUniqueCards = {
  card_rarity: string
  total_count: number
}

export type UserCollection ={
  ownedCardID: number;
  userID: number;
  cardID: number;
  packID: number;
  imageURL: number;
}


export type UserPacks = {
  packID: string;
  userID: number;
  packType: string;
  opened: number;
  purchaseDate: string;
  openDate: string;
  source; string;
}

export type LatestCards = {
  ownedCardID: number;
  userID: number;
  cardID: string;
  packID: number;
  playerName: string;
  playerID: number;
  card_rarity: string;
  imageURL: number;
}

export type UserMostCards = {
  userID: number;
  uniqueCards: number;
  totalCards: number;
  username: string;
  avatar: string;
}

export type SortDirection = 'ASC' | 'DESC'
