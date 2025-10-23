import { useQuery } from 'react-query'
import { ApiResponse } from '../v3'
import axios, { AxiosResponse } from 'axios'

type QueryResponse<T> = ApiResponse<T> & {
  refetch: () => void
  isLoading: boolean
  isError: boolean
}

const LOADING_RESPONSE: QueryResponse<null> = {
  status: undefined,
  payload: undefined,
  message: undefined,
  refetch: () => {},
  isLoading: true,
  isError: false,
} as const

export const defaultAxios = axios.create()
export const indexAxios = axios.create({
  baseURL: 'https://index.simulationhockey.com',
})

export const query = <T>({
  queryKey,
  queryFn,
  enabled,
}: {
  queryKey: string | string[]
  queryFn: () => Promise<AxiosResponse<any, any>>
  enabled?: boolean
}): QueryResponse<T> => {
  const { data, isLoading, isError, refetch } = useQuery<{ data: any }>({
    queryKey,
    queryFn,
    enabled,
  })

  if (isLoading) return LOADING_RESPONSE

  const responseData = data?.data

  if (
    responseData &&
    typeof responseData === 'object' &&
    'status' in responseData
  ) {
    return {
      status: responseData.status,
      payload: responseData.status === 'success' ? responseData.payload : null,
      message: responseData.status === 'success' ? null : responseData.message,
      refetch,
      isLoading,
      isError,
    }
  } else {
    // return status for index responses
    return {
      status: responseData ? 'error' : 'error',
      payload: responseData || null,
      message: responseData ? null : 'No data received',
      refetch,
      isLoading,
      isError,
    }
  }
}
