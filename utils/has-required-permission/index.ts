import { groups } from '@utils/user-groups'

const hasRequiredPermisson = (requiredPermissions, user: User) => {
  const permissions = []
  permissions.push(user.usergroup)
  if (user.additionalgroups.includes(groups.TradingCardTeam.idAsString)) {
    permissions.push(groups.TradingCardTeam.id)
  }

  if (requiredPermissions.length === 0) {
    return true
  }

  return requiredPermissions.some(
    (permission) => permissions.indexOf(permission) >= 0
  )
}

export default hasRequiredPermisson
