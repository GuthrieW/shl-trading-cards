import { Permissions, usePermissions } from '@hooks/usePermissions'
import { useSession } from 'contexts/AuthContext'

export const PermissionGuard = ({
  userPermissions,
  children,
  fallback,
}: {
  userPermissions: keyof Permissions | (keyof Permissions)[]
  children: React.ReactNode
  fallback?: React.ReactElement | null
}) => {
  const { loggedIn } = useSession()
  const { permissions, groups } = usePermissions()

  if (!loggedIn) {
    return null
  }

  if (typeof userPermissions === 'string') {
    return permissions[userPermissions] ? <>{children}</> : fallback ?? null
  }

  if (userPermissions.some((permission) => permissions[permission])) {
    return <>{children}</>
  }

  return fallback ?? null
}
