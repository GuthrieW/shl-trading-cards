import { groups } from '@utils/user-groups'

const isAdminOrCardTeam = (user: User) => {
  if (user.usergroup) {
    if (
      user.usergroup === groups.TradingCardAdmin.id ||
      user.usergroup === groups.TradingCardTeam.id
    ) {
      return true
    }
  }

  if (user.additionalgroups) {
    if (
      user.additionalgroups.includes(groups.TradingCardAdmin.idAsString) ||
      user.additionalgroups.includes(groups.TradingCardTeam.idAsString)
    ) {
      return true
    }
  }

  return false
}

export default isAdminOrCardTeam
