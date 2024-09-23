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

export type UserUniqueCollection = {
  userID: number
  card_rarity: string
  owned_count: number
}

export type SiteUniqueCards = {
  card_rarity: string
  total_count: number
}

export type SortDirection = 'ASC' | 'DESC'
