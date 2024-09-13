import { useSession } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRedirectIfNotAuthenticated = (
  redirectPath: string = '/login'
) => {
  const router = useRouter()
  const { loggedIn, isLoading } = useSession()

  useEffect(() => {
    if (!isLoading && !loggedIn) {
      router.replace(redirectPath)
    }
  }, [isLoading])
}
