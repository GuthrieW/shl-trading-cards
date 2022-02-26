import { groups } from '@utils/user-groups'

const isAdminOrCardTeam = (user: User) => {
  if (user.displaygroup) {
    if (
      user.displaygroup === groups.TradingCardAdmin.id ||
      user.displaygroup === groups.TradingCardTeam.id
    ) {
      return true
    }
  }

  if (user.additionalgroups) {
    if (
      user.additionalgroups.includes(groups.TradingCardAdmin.label) ||
      user.additionalgroups.includes(groups.TradingCardTeam.label)
    ) {
      return true
    }
  }

  return false
}

export default isAdminOrCardTeam
