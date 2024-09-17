import {
  MutationFunction,
  UseMutateAsyncFunction,
  UseMutateFunction,
  useMutation,
} from 'react-query'

type MutationResponse<D, V> = {
  mutate: UseMutateFunction<D, unknown, V, unknown>
  mutateAsync: UseMutateAsyncFunction<D, unknown, V, unknown>
  isLoading: boolean
  isError: boolean
}

const LOADING_MUTATION: MutationResponse<null, null> = {
  mutate: undefined,
  mutateAsync: undefined,
  isLoading: true,
  isError: false,
}

export const mutation = <D, V>({
  mutationFn,
  onSuccess,
  onError,
}: {
  mutationFn: MutationFunction<any, V>
  onSuccess?: (data) => void
  onError?: (data) => void
}): MutationResponse<D, V> => {
  const { mutate, mutateAsync, isLoading, isError } = useMutation(mutationFn, {
    onSuccess,
    onError,
  })

  if (isLoading) {
    return LOADING_MUTATION
  }

  return {
    mutate,
    mutateAsync,
    isLoading,
    isError,
  }
}
