import { useQuery } from 'react-query'
import { useSession } from './useSession'
import { useMemo } from 'react'
import axios from 'axios'
import { GET } from '@constants/http-methods'
import { group } from 'console'
import { userGroups } from 'lib/userGroups'

export type Permissions = {
  canSeeAdminPage: boolean
  canEditCards: boolean
}

const UNAUTHENTICATED_PERMISSIONS: Permissions = {
  canSeeAdminPage: false,
  canEditCards: false,
}

const fetchPermissions = (sessionToken: string, isLoggedIn: boolean) =>
  useQuery<{ uid: number; groups: number[] }>({
    queryKey: ['fetchPermissions', sessionToken],
    queryFn: async () =>
      await axios({
        method: GET,
        url: `/api/v3/user/${sessionToken}`,
        headers: { Authorization: `Bearer ${sessionToken}` },
      }),
    enabled: isLoggedIn,
  })

export const usePermissions = (): {
  permissions: Partial<Permissions>
  loading: boolean
} => {
  const { isLoggedIn, isLoading: sessionIsLoading, session } = useSession()
  const { data, isLoading: permissionsIsLoading } = fetchPermissions(
    session?.token,
    isLoggedIn
  )

  const permissions = useMemo(
    (): Permissions => ({
      canSeeAdminPage: data?.groups.some((group) =>
        [].map((role) => userGroups[role]).includes(group)
      ),
      canEditCards: data?.groups.some((group) =>
        [].map((role) => userGroups[role]).includes(group)
      ),
    }),
    [data?.groups]
  )

  if (!isLoggedIn) {
    return {
      permissions: UNAUTHENTICATED_PERMISSIONS,
      loading: sessionIsLoading || permissionsIsLoading,
    }
  }

  return {
    permissions,
    loading: sessionIsLoading || permissionsIsLoading,
  }
}
