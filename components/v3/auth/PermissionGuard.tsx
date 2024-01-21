import { useSession } from '@hooks/useSession'
import { useCookie } from '@hooks/useCookie'
import { usePermissions, Permissions } from '@hooks/usePermissions'
import React from 'react'

export const PermissionGuard = ({
  userPermissions,
  children,
  fallback,
}: {
  userPermissions: keyof Permissions | (keyof Permissions)[]
  children: React.ReactNode
  fallback?: React.ReactElement | null
}) => {
  const { isLoggedIn } = useSession()
  const { permissions } = usePermissions()

  if (!isLoggedIn) {
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
