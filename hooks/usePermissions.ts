import { GET } from '@constants/http-methods'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { CAN_RUN_SCRIPTS, RoleGroup, userGroups } from 'lib/constants'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

export type Permissions = {
  canRunScripts: boolean
  canIssuePacks: boolean
  canEditDonations: boolean
  canViewAllCards: boolean
  canSubmitCardRequests: boolean
  canClaimCards: boolean
  canEditCards: boolean
  canSubmitCards: boolean
  canProcessCards: boolean
}

const UNAUTHENTICATED_PERMISSIONS: Permissions = {
  canRunScripts: false,
  canIssuePacks: false,
  canEditDonations: false,
  canViewAllCards: false,
  canSubmitCardRequests: false,
  canClaimCards: false,
  canEditCards: false,
  canSubmitCards: false,
  canProcessCards: false,
} as const

export const usePermissions = (): {
  permissions: Partial<Permissions>
  groups?: (keyof Readonly<typeof userGroups>)[]
  loading: boolean
} => {
  const { session, loggedIn } = useSession()

  const { data, isLoading } = useQuery<{ data; isLoading }>({
    queryKey: ['userGroups', session?.token],
    queryFn: () =>
      axios({
        url: `api/v3/user/permissions`,
        method: GET,
      }),
    enabled: loggedIn,
  })

  const apiUserGroups: (typeof userGroups)[keyof typeof userGroups][] =
    data.data.groups

  const permissions = useMemo<Permissions>(() => {
    return {
      canRunScripts: checkUserHasPermission(apiUserGroups, CAN_RUN_SCRIPTS),
      canIssuePacks: checkUserHasPermission(apiUserGroups, CAN_RUN_SCRIPTS),
      canEditDonations: checkUserHasPermission(apiUserGroups, CAN_RUN_SCRIPTS),
      canViewAllCards: checkUserHasPermission(apiUserGroups, CAN_RUN_SCRIPTS),
      canSubmitCardRequests: checkUserHasPermission(
        apiUserGroups,
        CAN_RUN_SCRIPTS
      ),
      canClaimCards: checkUserHasPermission(apiUserGroups, CAN_RUN_SCRIPTS),
      canEditCards: checkUserHasPermission(apiUserGroups, CAN_RUN_SCRIPTS),
      canSubmitCards: checkUserHasPermission(apiUserGroups, CAN_RUN_SCRIPTS),
      canProcessCards: checkUserHasPermission(apiUserGroups, CAN_RUN_SCRIPTS),
    }
  }, [apiUserGroups])

  const groups = useMemo(() => {
    return data?.data.groups.flatMap(
      (group) =>
        (Object.keys(userGroups).find(
          (key) =>
            userGroups[key as keyof Readonly<typeof userGroups>] === group
        ) as keyof Readonly<typeof userGroups>) ?? []
    )
  }, [data?.data.groups])

  if (!loggedIn) {
    return {
      permissions: UNAUTHENTICATED_PERMISSIONS,
      groups: undefined,
      loading: true,
    }
  }

  return {
    permissions,
    groups,
    loading: isLoading,
  }
}

const checkUserHasPermission = (
  apiUserGroups: (typeof userGroups)[keyof typeof userGroups][],
  requiredPermission: RoleGroup
): boolean => {
  return apiUserGroups?.some((group) =>
    requiredPermission.map((role) => userGroups[role]).includes(group)
  )
}
