type ApiResponse<T> = {
  status: 'error' | 'success'
  payload: T
}
