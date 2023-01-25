import InfoCard from '@components/card/info-card'
import useAcceptTrade from '@pages/api/mutations/use-accept-trade'
import useDeclineTrade from '@pages/api/mutations/use-decline-trade'
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

  const isTradeSentByUser = trade.toID === userId

  return (
    <Modal
      setShowModal={setShowModal}
      title={'Trade Title'}
      subtitle={'Trade Subtitle'}
    >
      <div>
        <InfoCard className="w-full h-1/2 relative">{}</InfoCard>
        <InfoCard className="w-full h-1/2 relative">{}</InfoCard>
      </div>
      <div></div>
    </Modal>
  )
}

export default TradeViewerModal
