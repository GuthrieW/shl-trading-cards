import useCreateTrade from '@pages/api/mutations/use-create-trade'
import {
  useGetCurrentUser,
  useGetUser,
  useGetUserCards,
} from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

const NewTrade = () => {
  const router = useRouter()
  const routeUid = parseInt(router.query.uid as string)
  const currentUserId = getUidFromSession()

  if (routeUid === currentUserId) {
    return <p>You cannot trade with yourself</p>
  }

  const {
    user: currentUserDetails,
    isLoading: currentUserIsLoading,
    isError: currentUserIsError,
  } = useGetCurrentUser({})
  const {
    userCards: currentUserCards,
    isLoading: currentUserCardsIsLoading,
    isError: currentUserCardsIsError,
  } = useGetUserCards({ uid: currentUserId })
  const {
    user: otherUserDetails,
    isLoading: otherUserIsLoading,
    isError: otherUserIsError,
  } = useGetUser({ uid: routeUid })
  const {
    userCards: otherUserCards,
    isLoading: otherUserCardsIsLoading,
    isError: otherUserCardsIsError,
  } = useGetUserCards({ uid: routeUid })
  const {
    createTrade,
    isSuccess: createTradeIsSuccess,
    isLoading: createTradeIsLoading,
    isError: createTradeIsError,
  } = useCreateTrade()

  if (
    currentUserIsLoading ||
    currentUserIsError ||
    currentUserCardsIsLoading ||
    currentUserCardsIsError ||
    otherUserIsLoading ||
    otherUserIsError ||
    otherUserCardsIsLoading ||
    otherUserCardsIsError
  ) {
    return <p>Something bad happened</p>
  }

  return (
    <div>
      <NextSeo title="New Trade" />
      <div className="flex flex-row">
        <p>New Trade</p>
        <div>
          <p>You trade:</p>
          {JSON.stringify(currentUserDetails, null, 2)}
        </div>
        <div>
          <p>They trade:</p>
          {JSON.stringify(otherUserDetails, null, 2)}
        </div>
      </div>
    </div>
  )
}

export default NewTrade
