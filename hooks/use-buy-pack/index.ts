import useSWR from 'swr'

const useBuyPack = (currentUser: User) => {
  const { data, error } = useSWR(() => ``)

  return {
    result: data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useBuyPack
