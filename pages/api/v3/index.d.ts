export type ApiResponse<T> =
  | {
      status: 'success'
      payload: T
    }
  | {
      status: 'error' | 'logout'
      message: string
    }
