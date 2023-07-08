import React from 'react'
import Modal from './modal'
import TradingCard from '@components/images/trading-card'

type AllCardsModalProps = {
  setShowModal: Function
  cardID: number
  cardName: string
  cardImage: string
}

const AllCardsModal = ({
  setShowModal,
  cardID,
  cardName,
  cardImage,
}: AllCardsModalProps) => (
  <Modal
    setShowModal={setShowModal}
    title={'View Card'}
    subtitle={`${cardName} - ${cardID}`}
  >
    {cardImage && (
      <TradingCard source={cardImage} rarity={null} playerName={cardName} />
      // <img className="rounded-sm" src={`${pathToCards}${cardImage}`} />
    )}
  </Modal>
)

export default AllCardsModal
