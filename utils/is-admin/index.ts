import { groups } from '@utils/user-groups'
import { User } from 'index.d'

const isAdmin = (user: User) => {
  if (user.displaygroup) {
    if (user.displaygroup === groups.TradingCardAdmin.id) {
      return true
    }
  }

  if (user.additionalgroups) {
    if (user.additionalgroups.includes(groups.TradingCardAdmin.idAsString)) {
      return true
    }
  }

  return false
}

export default isAdmin
