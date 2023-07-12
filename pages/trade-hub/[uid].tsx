import Button from '@components/buttons/button'
import TradeGrid from '@components/grids/trade-grid'
import useCreateTrade, {
  TradeAsset,
} from '@pages/api/mutations/use-create-trade'
import useGetUser from '@pages/api/queries/use-get-user'
import useGetCurrentUser from '@pages/api/queries/use-get-current-user'
import useGetUserCardsForTrades from '@pages/api/queries/use-get-user-cards-for-trades'
import getUidFromSession from '@utils/get-uid-from-session'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import Router from 'next/router'
import TradingCard from '@components/images/trading-card'
import { warningToast } from '@utils/toasts'

const CollectionLayout = ({ username, children }) => (
  <div className="flex flex-col">
    <h1 className="flex self-center text-lg font-medium">
      {username}'s collection
    </h1>
    <>{children}</>
  </div>
)

const NewTrade = () => {
  const [currentUserTrading, setCurrentUserTrading] = useState<TradeCard[]>([])
  const [otherUserTrading, setOtherUserTrading] = useState<TradeCard[]>([])
  const [collectionToView, toggleCollectionViewer] = useState<boolean>(false)
  const routeUid = parseInt(Router.query.uid as string)
  const currentUserId = getUidFromSession()

  if (routeUid === currentUserId) {
    Router.push('/trade-hub')
    return null
  }

  const {
    user: currentUserDetails,
    isLoading: currentUserIsLoading,
    isError: currentUserIsError,
  } = useGetCurrentUser({})
  const {
    userCardsForTrades: currentUserCards,
    isLoading: currentUserCardsIsLoading,
    isError: currentUserCardsIsError,
  } = useGetUserCardsForTrades({ uid: currentUserId })
  const {
    user: otherUserDetails,
    isLoading: otherUserIsLoading,
    isError: otherUserIsError,
  } = useGetUser({ uid: routeUid })
  const {
    userCardsForTrades: otherUserCards,
    isLoading: otherUserCardsIsLoading,
    isError: otherUserCardsIsError,
  } = useGetUserCardsForTrades({ uid: routeUid })
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
    return null
  }

  const onAddCardToTrade = (
    cardToToggle: TradeCard,
    isCurrentUser: boolean
  ): void => {
    if (isCurrentUser) {
      if (currentUserTrading.length === 10) {
        warningToast({ warningText: 'Cannot trade more than 10 cards' })
        return
      }
      setCurrentUserTrading([...currentUserTrading, cardToToggle])
    } else {
      if (otherUserTrading.length === 10) {
        warningToast({ warningText: 'Cannot trade more than 10 cards' })
        return
      }
      setOtherUserTrading([...otherUserTrading, cardToToggle])
    }
  }

  const onRemoveCardFromTrade = (
    cardToToggle: TradeCard,
    isCurrentUser: boolean
  ): void => {
    isCurrentUser
      ? setCurrentUserTrading(
          currentUserTrading.filter(
            (card: TradeCard) => card.ownedCardID !== cardToToggle.ownedCardID
          )
        )
      : setOtherUserTrading(
          otherUserTrading.filter(
            (card: TradeCard) => card.ownedCardID !== cardToToggle.ownedCardID
          )
        )
  }

  if (createTradeIsSuccess) {
    Router.push('/trade-hub')
    return null
  }

  return (
    <div>
      <NextSeo title="New Trade" />
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex-col w-1/5 h-screen m-1 border-r">
            <div className="h-1/3 overflow-auto">
              <p>
                {currentUserDetails.username} trades{' '}
                {`(${currentUserTrading.length})`}:
              </p>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
                {currentUserTrading.map((card, index) => (
                  <div
                    className="relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                    key={index}
                    onClick={() => onRemoveCardFromTrade(card, true)}
                  >
                    <TradingCard
                      className="w-full h-full cursor-pointer rounded-sm"
                      source={card.image_url}
                      rarity={card.card_rarity}
                      playerName={card.player_name}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-1/3 overflow-auto">
              <p>
                {otherUserDetails.username} trades{' '}
                {`(${otherUserTrading.length})`}:
              </p>
              <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
                {otherUserTrading.map((card, index) => (
                  <div
                    className="relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                    key={index}
                    onClick={() => onRemoveCardFromTrade(card, false)}
                  >
                    <TradingCard
                      source={card.image_url}
                      rarity={card.card_rarity}
                      playerName={card.player_name}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-1/3 flex flex-col justify-center mx-1 bottom-0">
              <Button
                disabled={
                  createTradeIsLoading ||
                  !(
                    currentUserTrading.length > 0 && otherUserTrading.length > 0
                  )
                }
                onClick={() => {
                  const tradeAssets: TradeAsset[] = []
                  currentUserTrading.forEach((card) => {
                    tradeAssets.push({
                      ownedCardId: String(card.ownedCardID),
                      toId: String(otherUserDetails.uid),
                      fromId: String(currentUserDetails.uid),
                    })
                  })
                  otherUserTrading.forEach((card) => {
                    tradeAssets.push({
                      ownedCardId: String(card.ownedCardID),
                      toId: String(currentUserDetails.uid),
                      fromId: String(otherUserDetails.uid),
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
          </div>
          <div className="w-4/5 m-1">
            <Button
              disabled={createTradeIsLoading}
              onClick={() => toggleCollectionViewer(!collectionToView)}
            >
              Swap to{' '}
              {collectionToView
                ? otherUserDetails.username
                : currentUserDetails.username}
              's collection
            </Button>
            {collectionToView && (
              <CollectionLayout username={currentUserDetails.username}>
                <TradeGrid
                  gridData={currentUserCards.filter(
                    (card) => !currentUserTrading.includes(card)
                  )}
                  onSelect={onAddCardToTrade}
                  isCurrentUser={true}
                />
              </CollectionLayout>
            )}
            {!collectionToView && (
              <CollectionLayout username={otherUserDetails.username}>
                <TradeGrid
                  gridData={otherUserCards.filter(
                    (card) => !otherUserTrading.includes(card)
                  )}
                  onSelect={onAddCardToTrade}
                  isCurrentUser={false}
                />
              </CollectionLayout>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTrade
