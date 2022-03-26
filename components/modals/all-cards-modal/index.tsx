import pathToCards from '@constants/path-to-cards'
import React from 'react'
import Modal from '../modal'

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
    {cardImage && <img src={`${pathToCards}${cardImage}`} />}
  </Modal>
)

export default AllCardsModal
