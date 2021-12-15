import { groups } from '@utils/user-groups'

const hasRequiredPermisson = (requiredPermissions: number[], user: User) => {
  const perms = requiredPermissions.map((permission: number) => {
    return (
      user.displaygroup === permission ||
      (user.additionalgroups &&
        user.additionalgroups.includes(permission.toString()))
    )
  })

  return perms.includes(true)
}

export default hasRequiredPermisson
