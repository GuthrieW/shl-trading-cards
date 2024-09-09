import { usePermissions } from '@hooks/usePermissions'
import { useSession } from 'contexts/AuthContext'
import { userGroups } from 'lib/constants'

export const RoleGuard = ({
  userRoles,
  children,
  fallback,
}: {
  userRoles:
    | keyof Readonly<typeof userGroups>
    | (keyof Readonly<typeof userGroups>)[]
  children: React.ReactNode
  fallback?: React.ReactElement | null
}) => {
  const { loggedIn } = useSession()
  const { groups } = usePermissions()

  if (!loggedIn) {
    return null
  }

  if (typeof userRoles === 'string') {
    return groups?.includes(userRoles) ? <>{children}</> : fallback ?? null
  }

  if (userRoles.some((role) => groups?.includes(role))) {
    return <>{children}</>
  }

  return fallback ?? null
}
