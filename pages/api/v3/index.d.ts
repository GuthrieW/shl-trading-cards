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
