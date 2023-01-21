import React from 'react'
import Modal from '../modal'

type TradeViewerModalProps = {
  setShowModal: Function
  trade: Trade
}

const TradeViewerModal = ({ setShowModal, trade }: TradeViewerModalProps) => {
  // const {} = useAcceptTrade({})
  // const {} = useDeclineTrade({})

  return (
    <Modal
      setShowModal={setShowModal}
      title={'Trade Title'}
      subtitle={'Trade Subtitle'}
    >
      <div></div>
    </Modal>
  )
}

export default TradeViewerModal
