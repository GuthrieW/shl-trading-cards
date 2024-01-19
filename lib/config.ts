import { userGroups } from './userGroups'

export default {
  roleNameByUserGroup: {
    [userGroups.TRADING_CARD_ADMIN]: 'Trading Card Admin',
    [userGroups.TRADING_CARD_TEAM]: 'Trading Card Team',
  },
  defaultUserRole: 'User' as const,
  userIDCookieName: 'userid',
  userRoleCookieName: 'role',
}
