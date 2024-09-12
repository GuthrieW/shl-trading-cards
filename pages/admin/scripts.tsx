import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'

export default () => {
  useRedirectIfNotAuthenticated('/')
  useRedirectIfNotAuthorized('/', {
    roles: ['TRADING_CARD_ADMIN'],
  })

  return <></>
}
