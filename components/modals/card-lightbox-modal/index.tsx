import pathToCards from '@constants/path-to-cards'
import React from 'react'
import Modal from '../modal'

type CardLightBoxModalProps = {
  setShowModal: Function
  cardName: string
  cardImage: string
}

const CardLightBoxModal = ({
  setShowModal,
  cardName,
  cardImage,
}: CardLightBoxModalProps) => (
  <Modal setShowModal={setShowModal}>
    {cardImage && (
      <img
        className="w-full h-full rounded-sm shadow-lg"
        style={{ boxShadow: '0px 0px 32px 25px rgba(0, 0, 0, 0.9) ' }}
        alt={cardName}
        src={`${pathToCards}${cardImage}`}
      />
    )}
  </Modal>
)

export default CardLightBoxModal
