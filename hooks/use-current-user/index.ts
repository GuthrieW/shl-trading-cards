import user from '@utils/test-data/user.json'

const useCurrentUser = () => {
  const { data, error } = { data: user.data[0], error: false }

  return {
    currentUser: data,
    isLoading: !data && !error,
    isError: error,
  }
}

export default useCurrentUser
