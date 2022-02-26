import { groups } from '@utils/user-groups'

const isAdmin = (user: User) => {
  if (user.displaygroup) {
    if (user.displaygroup === groups.TradingCardAdmin.id) {
      return true
    }
  }

  if (user.additionalgroups) {
    if (user.additionalgroups.includes(groups.TradingCardAdmin.label)) {
      return true
    }
  }

  return false
}

export default isAdmin
