import { QueryClient } from 'react-query'

export const invalidateQueries = (
  queryClient: QueryClient,
  queryKeys: string[]
): void => {
  queryKeys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }))
}
