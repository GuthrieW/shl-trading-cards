import { groups } from '@utils/user-groups'

const hasRequiredPermisson = (requiredPermissions, user: User) => {
  const permissions = []
  permissions.push(user.usergroup)
  if (user.additionalgroups) {
    if (user.additionalgroups.indexOf(groups.TradingCardAdmin.idAsString)) {
      permissions.push(groups.TradingCardAdmin.id)
    }

    if (user.additionalgroups.indexOf(groups.TradingCardTeam.idAsString)) {
      permissions.push(groups.TradingCardTeam.id)
    }
  }

  if (requiredPermissions.length === 0) {
    return true
  }

  return true
  // return requiredPermissions.some(
  //   (permission) => permissions.indexOf(permission) >= 0
  // )
}

export default hasRequiredPermisson
