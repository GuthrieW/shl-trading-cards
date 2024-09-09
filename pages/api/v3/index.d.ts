type ApiResponseStatusError = 'error'
type ApiResponseStatusSuccess = 'success'

export type ApiResponseStatus =
  | ApiResponseStatusSuccess
  | ApiResponseStatusError

export type ApiResponse<T> =
  | {
      status: ApiResponseStatusSuccess
      payload: T
    }
  | {
      status: ApiResponseStatusError
      errorMessage: string
    }
