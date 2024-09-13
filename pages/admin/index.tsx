import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'
import { NextSeo } from 'next-seo'

export default () => {
  useRedirectIfNotAuthenticated()
  useRedirectIfNotAuthorized({
    roles: ['TRADING_CARD_ADMIN', 'TRADING_CARD_TEAM'],
  })

  return (
    <>
      <NextSeo title="Admin" />
      <div className="w-1/2"></div>
      <div className="w-1/2"></div>
    </>
  )
}
