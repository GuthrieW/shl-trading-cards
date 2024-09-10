import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'

export default function () {
  useRedirectIfNotAuthenticated('/')
  useRedirectIfNotAuthorized('/', {
    roles: ['TRADING_CARD_ADMIN', 'TRADING_CARD_TEAM'],
  })

  return <></>
}
