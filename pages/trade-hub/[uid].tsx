import Button from '@components/buttons/button'
import CollectionGrid from '@components/grids/collection-grid'
import TradeGrid from '@components/grids/trade-grid'
import pathToCards from '@constants/path-to-cards'
import useCreateTrade, {
  TradeAsset,
} from '@pages/api/mutations/use-create-trade'
import {
  useGetCurrentUser,
  useGetUser,
  useGetUserCards,
} from '@pages/api/queries'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useState } from 'react'

const NewTrade = () => {
  const router = useRouter()
  const routeUid = parseInt(router.query.uid as string)
  const currentUserId = getUidFromSession()
  const [currentUserTrading, setCurrentUserTrading] = useState<
    CollectionCard[]
  >([])
  const [otherUserTrading, setOtherUserTrading] = useState<CollectionCard[]>([])

  if (routeUid === currentUserId) {
    return <p>You cannot trade with yourself</p>
  }

  const {
    user: currentUserDetails,
    isLoading: currentUserIsLoading,
    isError: currentUserIsError,
  } = useGetCurrentUser({})
  // need to create a new query that uses collection instead of this query
  // just select all cards owned by a user on the collection table
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
  // need to create a new query that uses collection instead of this query
  // just select all cards owned by a user on the collection table
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

  const onAddCardToTrade = (
    cardToToggle: CollectionCard,
    isCurrentUser: boolean
  ) => {
    if (isCurrentUser) {
      setCurrentUserTrading([...currentUserTrading, cardToToggle])
    } else {
      setOtherUserTrading([...otherUserTrading, cardToToggle])
    }
  }

  const onRemoveCardFromTrade = (
    cardToToggle: CollectionCard,
    isCurrentUser: boolean
  ) => {
    console.log('removing')
    if (isCurrentUser) {
      const newArr = currentUserTrading.filter(
        (card) => card.cardID !== cardToToggle.cardID
      )
      setCurrentUserTrading(newArr)
    } else {
      const newArr = otherUserTrading.filter(
        (card) => card.cardID !== cardToToggle.cardID
      )
      setOtherUserTrading(newArr)
    }
  }

  return (
    <div>
      <NextSeo title="New Trade" />
      <div className="flex flex-col">
        <div className="flex flex-row justify-between mr-1">
          <p>New Trade</p>
          <Button
            disabled={
              !(currentUserTrading.length > 0 && otherUserTrading.length > 0)
            }
            onClick={() => {
              const tradeAssets: TradeAsset[] = []
              currentUserTrading.forEach((card) => {
                tradeAssets.push({
                  ownedCardId: String(card.cardID),
                  toId: String(otherUserDetails.uid),
                  fromId: String(currentUserDetails.uid),
                })
              })
              otherUserTrading.forEach((card) => {
                tradeAssets.push({
                  ownedCardId: String(card.cardID),
                  toId: String(otherUserDetails.uid),
                  fromId: String(currentUserDetails.uid),
                })
              })

              createTrade({
                initiatorId: currentUserDetails.uid,
                recipientId: otherUserDetails.uid,
                tradeAssets,
              })
            }}
          >
            Submit Trade
          </Button>
        </div>
        <div className="flex flex-row">
          <div className="w-1/2">
            <p>{currentUserDetails.username} trades:</p>
            <div className="w-full grid grid-cols-3 gap-4">
              {currentUserTrading.map((card, index) => (
                <div
                  className="relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                  key={index}
                  onClick={() => onRemoveCardFromTrade(card, true)}
                >
                  <img
                    className="w-full h-full cursor-pointer rounded-sm"
                    src={`${pathToCards}${card.image_url}`}
                    alt={card.player_name}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <p>{currentUserDetails.username}'s collection:</p>
            <TradeGrid
              gridData={currentUserCards.filter(
                (card) => !currentUserTrading.includes(card)
              )}
              onSelect={onAddCardToTrade}
              isCurrentUser={true}
            />
          </div>
          <div className="w-1/2">
            <p>{otherUserDetails.username} trades:</p>
            <div className="w-full grid grid-cols-3 gap-4">
              {otherUserTrading.map((card, index) => (
                <div
                  className="relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                  key={index}
                  onClick={() => onRemoveCardFromTrade(card, false)}
                >
                  <img
                    className="w-full h-full cursor-pointer rounded-sm"
                    src={`${pathToCards}${card.image_url}`}
                    alt={card.player_name}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <p>{otherUserDetails.username}'s collection:</p>
            <TradeGrid
              gridData={otherUserCards.filter(
                (card) => !otherUserTrading.includes(card)
              )}
              onSelect={onAddCardToTrade}
              isCurrentUser={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTrade
