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
}

export type ListResponse<T> = {
  rows: T[]
  total: number
}

export type SortDirection = 'ASC' | 'DESC'
