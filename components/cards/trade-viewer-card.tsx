import Button from '@components/buttons/button'
import InfoCard from '@components/cards/info-card'
import TradingCard from '@components/images/trading-card'
import { useResponsive } from '@hooks/useResponsive'
import useAcceptTrade from '@pages/api/mutations/use-accept-trade'
import useDeclineTrade from '@pages/api/mutations/use-decline-trade'
import useGetTradeDetails from '@pages/api/queries/use-get-trade-details'
import React from 'react'

type TradeViewerCardProps = {
  trade: Trade
  closeTrade: Function
  userId: number
}

const TradeViewerCard = ({
  userId,
  closeTrade,
  trade,
}: TradeViewerCardProps) => {
  const { isMobile, isTablet } = useResponsive()
  const {
    acceptTrade,
    isSuccess: acceptTradeIsSuccess,
    isLoading: acceptTradeIsLoading,
  } = useAcceptTrade()
  const {
    declineTrade,
    isSuccess: declineTradeIsSuccess,
    isLoading: declineTradeIsLoading,
  } = useDeclineTrade()
  const { tradeDetails, isLoading } = useGetTradeDetails({
    id: trade.tradeid,
  })

  const myCards = tradeDetails.filter((asset) => asset.fromID === userId)
  const theirCards = tradeDetails.filter((asset) => asset.toID === userId)
  const isSentByMe = trade.initiatorid === userId

  if (acceptTradeIsSuccess || declineTradeIsSuccess) {
    closeTrade()
  }

  if (isLoading) return null

  return (
    <div className="flex flex-col">
      <div className="w-full flex items-end justify-start">
        {!isSentByMe && trade.trade_status === 'PENDING' && (
          <Button
            onClick={() => {
              acceptTrade({ id: trade.tradeid })
            }}
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            disabled={acceptTradeIsLoading || declineTradeIsLoading}
          >
            Accept
          </Button>
        )}
        {trade.trade_status === 'PENDING' && (
          <Button
            onClick={() => {
              declineTrade({ id: trade.tradeid, decliningUid: userId })
            }}
            className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
            type="button"
            disabled={acceptTradeIsLoading || declineTradeIsLoading}
          >
            {trade.initiatorid === userId ? 'Cancel' : 'Decline'}
          </Button>
        )}
      </div>
      <div className="h-1/2">
        <InfoCard className="p-1 m-1">
          <p className="font-semibold">You send:</p>
          <div
            className={`grid gap-3 ${
              isMobile
                ? 'grid-cols-2'
                : isTablet
                ? 'grid-cols-3'
                : 'grid-cols-5'
            }`}
          >
            {myCards.map((card) => (
              <TradingCard
                className="cursor-default"
                key={card.ownedcardid}
                source={card.image_url}
                rarity={null}
                playerName={null}
              />
            ))}
          </div>
        </InfoCard>
      </div>
      <div className="h-1/2">
        <InfoCard className="p-1 m-1 mb-2">
          <p className="font-semibold">They send:</p>
          <div
            className={`grid gap-3 ${
              isMobile
                ? 'grid-cols-2'
                : isTablet
                ? 'grid-cols-3'
                : 'grid-cols-5'
            }`}
          >
            {theirCards.map((card) => (
              <TradingCard
                className="cursor-default"
                key={card.ownedcardid}
                source={card.image_url}
                rarity={null}
                playerName={null}
              />
            ))}
          </div>
        </InfoCard>
      </div>
    </div>
  )
}

export default TradeViewerCard
