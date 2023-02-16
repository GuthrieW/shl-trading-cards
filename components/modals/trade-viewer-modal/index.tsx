import Button from '@components/buttons/button'
import InfoCard from '@components/card/info-card'
import pathToCards from '@constants/path-to-cards'
import useAcceptTrade from '@pages/api/mutations/use-accept-trade'
import useDeclineTrade from '@pages/api/mutations/use-decline-trade'
import useGetTradeDetails from '@pages/api/queries/use-get-trade-details'
import React from 'react'
import Modal from '../modal'

type TradeViewerModalProps = {
  closeModal: Function
  trade: Trade
  userId: number
}

const TradeViewerModal = ({
  userId,
  closeModal,
  trade,
}: TradeViewerModalProps) => {
  const {
    acceptTrade,
    isSuccess: acceptTradeIsSuccess,
    isLoading: acceptTradeIsLoading,
    isError: acceptTradeIsError,
  } = useAcceptTrade()
  const {
    declineTrade,
    isSuccess: declineTradeIsSuccess,
    isLoading: declineTradeIsLoading,
    isError: declineTradeIsError,
  } = useDeclineTrade()
  const { tradeDetails, isSuccess, isLoading, isError } = useGetTradeDetails({
    id: trade.tradeid,
  })

  const myCards = tradeDetails.filter((asset) => asset.toID === userId)
  const theirCards = tradeDetails.filter((asset) => asset.toID !== userId)
  const isSentByMe = trade.initiatorid === userId

  if (acceptTradeIsSuccess || declineTradeIsSuccess) {
    closeModal()
  }

  if (isLoading) return null

  return (
    <Modal
      setShowModal={() => {
        closeModal()
      }}
      title={'Trade Title'}
      subtitle={'Trade Subtitle'}
    >
      <div>
        <div className="w-full h-1/2 relative">
          <p>You send:</p>
          <InfoCard className="flex flex-row p-1 m-1">
            {myCards.map((card) => (
              <img
                key={card.ownedcardid}
                className="w-full h-full rounded-sm mx-1"
                src={`${pathToCards}${card.image_url}`}
                alt={String(card.cardID)}
                loading="lazy"
              />
            ))}
          </InfoCard>
        </div>
        <div className="w-full h-1/2 relative">
          <p>They send:</p>
          <InfoCard className="flex flex-row p-1 m-1 mb-2">
            {theirCards.map((card) => (
              <img
                key={card.ownedcardid}
                className="w-full h-full rounded-sm mx-1"
                src={`${pathToCards}${card.image_url}`}
                alt={String(card.cardID)}
                loading="lazy"
              />
            ))}
          </InfoCard>
        </div>
      </div>
      <div className="w-full flex items-end justify-end">
        {isSentByMe && (
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
        <Button
          onClick={() => {
            declineTrade({ id: trade.tradeid })
          }}
          className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
          type="button"
          disabled={acceptTradeIsLoading || declineTradeIsLoading}
        >
          Decline
        </Button>
      </div>
    </Modal>
  )
}

export default TradeViewerModal
