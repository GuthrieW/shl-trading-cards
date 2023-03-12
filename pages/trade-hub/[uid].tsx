import useCreateTrade from '@pages/api/mutations/use-create-trade'
import { useGetCurrentUser, useGetUserCards } from '@pages/api/queries'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

const NewTrade = () => {
  const router = useRouter()
  const routeUid = parseInt(router.query.uid as string)

  const {
    user,
    isLoading: currentUserIsLoading,
    isError: currentUserIsError,
  } = useGetCurrentUser({})
  const {
    userCards,
    isLoading: userCardsIsLoading,
    isError: userCardsIsError,
  } = useGetUserCards({ uid: routeUid })
  const {
    createTrade,
    isSuccess: createTradeIsSuccess,
    isLoading: createTradeIsLoading,
    isError: createTradeIsError,
  } = useCreateTrade()

  return (
    <div>
      <NextSeo title="New Trade" />
      <p>New Trade</p>
    </div>
  )
}

export default NewTrade
