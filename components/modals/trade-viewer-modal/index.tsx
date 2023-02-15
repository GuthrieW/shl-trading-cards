import Button from '@components/buttons/button'
import InfoCard from '@components/card/info-card'
import useAcceptTrade from '@pages/api/mutations/use-accept-trade'
import useDeclineTrade from '@pages/api/mutations/use-decline-trade'
import useGetTradeDetails from '@pages/api/queries/use-get-trade-details'
import React from 'react'
import Modal from '../modal'

type TradeViewerModalProps = {
  setShowModal: Function
  trade: Trade
  userId: number
}

const TradeViewerModal = ({
  userId,
  setShowModal,
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

  const myCards = tradeDetails.filter(
    (asset: TradeDetails) => asset.toID === userId
  )

  const theirCards = tradeDetails.filter(
    (asset: TradeDetails) => asset.toID !== userId
  )

  const isSentByMe = trade.initiatorid === userId
  return (
    <Modal
      setShowModal={setShowModal}
      title={'Trade Title'}
      subtitle={'Trade Subtitle'}
    >
      <div>
        <InfoCard className="w-full h-1/2 relative">
          {JSON.stringify({ myCards }, null, 2)}
        </InfoCard>
        <InfoCard className="w-full h-1/2 relative">
          {JSON.stringify({ theirCards }, null, 2)}
        </InfoCard>
      </div>
      <div className="w-full flex items-end justify-end">
        {isSentByMe && (
          <Button
            onClick={() => {
              alert('Trade accepted')
            }}
            type="button"
            disabled={false}
          >
            Accept
          </Button>
        )}
        <Button
          onClick={() => {
            alert('Trade cancelled')
          }}
          type="button"
          disabled={false}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default TradeViewerModal
