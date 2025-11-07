import { useMemo } from 'react'
import { TradeSummaryBox } from './TradeSummaryBox'
import TradeCardSection from './TradeCardsSection'
import { Skeleton, SkeletonText } from '@chakra-ui/react'

const PendingTradeSection = ({
  title,
  cards,
  cardsInfo,
  cardsInTrades,
  cardsInTradesLoading,
  loggedInID = 0,
}: {
  title: string
  cards: TradeDetails[]
  cardsInfo?: Record<string, number>
  cardsInTrades: DuplicateCardsIntrades[]
  cardsInTradesLoading: boolean
  loggedInID?: number
}) => {
  const isViewingMyCards = useMemo(
    () => cards.length > 0 && loggedInID > 0 && loggedInID === cards[0].fromID,
    [cards, loggedInID]
  )

  const isViewingPartnerCards = useMemo(
    () => cards.length > 0 && loggedInID > 0 && loggedInID !== cards[0].fromID,
    [cards, loggedInID]
  )

  const { cardQuantitiesMap, tradingAwayLastCopy, alreadyOwnCards } =
    useMemo(() => {
      const cardQuantities = new Map<
        number,
        {
          initiatorTrading: number
          recipientTrading: number
          initiatorOwned: number
          recipientOwned: number
        }
      >()

      cards.forEach((card) => {
        const existing = cardQuantities.get(card.cardID)
        if (existing) {
          existing.initiatorTrading += card.initiatorID === card.fromID ? 1 : 0
          existing.recipientTrading += card.recipientID === card.fromID ? 1 : 0
          existing.initiatorOwned += card.initiator_quantity ?? 0
          existing.recipientOwned += card.recipient_quantity ?? 0
        } else {
          cardQuantities.set(card.cardID, {
            initiatorTrading: card.initiatorID === card.fromID ? 1 : 0,
            recipientTrading: card.recipientID === card.fromID ? 1 : 0,
            initiatorOwned: card.initiator_quantity,
            recipientOwned: card.recipient_quantity,
          })
        }
      })

      const lastCopySet = new Set<number>()
      const alreadyOwnSet = new Set<number>()

      const cardsFromInitiator =
        cards.length > 0 && cards[0].fromID === cards[0].initiatorID
      const cardsFromRecipient =
        cards.length > 0 && cards[0].fromID === cards[0].recipientID

      cardQuantities.forEach((quantities, cardID) => {
        if (isViewingMyCards && cardsFromInitiator) {
          // viewing my cards and I am the initiator
          if (
            quantities.initiatorOwned > 0 &&
            quantities.initiatorOwned === quantities.initiatorTrading
          ) {
            lastCopySet.add(cardID)
          }
        }
        if (isViewingMyCards && cardsFromRecipient) {
          // viewing my cards and I am the recipient
          if (
            quantities.recipientOwned > 0 &&
            quantities.recipientOwned === quantities.recipientTrading
          ) {
            lastCopySet.add(cardID)
          }
        }
        if (isViewingPartnerCards && cardsFromInitiator) {
          // viewing trading partners cards and they are the initiator
          if (
            quantities.initiatorOwned > 0 &&
            quantities.initiatorOwned === quantities.initiatorTrading
          ) {
            lastCopySet.add(cardID)
          }
          if (quantities.recipientOwned > 0) {
            alreadyOwnSet.add(cardID)
          }
        }
        if (isViewingPartnerCards && cardsFromRecipient) {
          // viewing trading partners cards and they are the recipient
          if (
            quantities.recipientOwned > 0 &&
            quantities.recipientOwned === quantities.recipientTrading
          ) {
            lastCopySet.add(cardID)
          }
          if (quantities.initiatorOwned > 0) {
            alreadyOwnSet.add(cardID)
          }
        }
      })

      return {
        cardQuantitiesMap: cardQuantities,
        tradingAwayLastCopy: lastCopySet,
        alreadyOwnCards: alreadyOwnSet,
      }
    }, [cards, isViewingPartnerCards, isViewingMyCards])

  const shouldShowCardsInTrades = useMemo(
    () => loggedInID > 0 && cards.length > 0 && cards[0].fromID === loggedInID,
    [loggedInID, cards]
  )

  const cardsInOtherTradesMap = useMemo(() => {
    const map = new Map<number, Set<number>>()
    if (!cardsInTrades) return map

    cardsInTrades.forEach((item) => {
      if (!map.has(item.cardID)) {
        map.set(item.cardID, new Set())
      }
      map.get(item.cardID)?.add(item.tradeID)
    })
    return map
  }, [cardsInTrades])

  const cardQuantities = useMemo(() => {
    const quantities: Record<number, number> = {}
    cardQuantitiesMap.forEach((quantities_data, cardID) => {
      const cardsFromInitiator =
        cards.length > 0 && cards[0].fromID === cards[0].initiatorID

      if (isViewingMyCards) {
        quantities[cardID] = cardsFromInitiator
          ? quantities_data.initiatorOwned
          : quantities_data.recipientOwned
      } else {
        quantities[cardID] = cardsFromInitiator
          ? quantities_data.recipientOwned
          : quantities_data.initiatorOwned
      }
    })
    return quantities
  }, [cardQuantitiesMap, isViewingMyCards, cards])

  const totalCards = useMemo(() => {
    if (!cardsInfo) return 0
    return Object.values(cardsInfo).reduce((a, b) => a + b, 0)
  }, [cardsInfo])

  return (
    <div className="flex-1">
      {cardsInTradesLoading ?? (
        <div className="flex-1">
          <Skeleton height="100px" borderRadius="md" mb={4} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height="200px" borderRadius="md" />
            ))}
          </div>
        </div>
      )}
      <TradeSummaryBox
        title="Total Cards:"
        totalCards={totalCards}
        cardsByRarity={cardsInfo || {}}
      />

      <TradeCardSection
        title={`${title} acquires`}
        cards={cards}
        cardQuantities={cardQuantities}
        showLastCopyWarning={tradingAwayLastCopy.size > 0}
        showAlreadyOwnWarning={
          isViewingPartnerCards && alreadyOwnCards.size > 0
        }
        alreadyOwnCards={isViewingPartnerCards ? alreadyOwnCards : undefined}
        isMyCardsSection={isViewingMyCards}
        cardsInOtherTradesMap={
          shouldShowCardsInTrades ? cardsInOtherTradesMap : undefined
        }
        isTradeComplete={cards[0]?.trade_status === 'COMPLETE'}
      />
    </div>
  )
}

export default PendingTradeSection
