import { Skeleton } from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'

export default () => {
  const { isCheckingAuthentication } = useRedirectIfNotAuthenticated()
  const { isCheckingAuthorization } = useRedirectIfNotAuthorized({
    roles: ['TRADING_CARD_ADMIN', 'TRADING_CARD_TEAM'],
  })

  return (
    <PageWrapper className="h-full flex flex-col justify-center items-center w-11/12 md:w-3/4">
      <Skeleton
        isLoaded={!isCheckingAuthentication || !isCheckingAuthorization}
      ></Skeleton>
    </PageWrapper>
  )
}
