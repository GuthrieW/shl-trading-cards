import React from 'react'
import Modal from './modal'
import EditCardForm from '../forms/edit-card-form'

type EditCardModalProps = {
  cardData: Card
  setShowModal: Function
  onSubmit: Function
  cardID: number
  cardName: string
}

const EditCardModal = ({
  cardData,
  setShowModal,
  onSubmit,
  cardID,
  cardName,
}: EditCardModalProps) => (
  <Modal
    setShowModal={setShowModal}
    title={'Edit Card'}
    subtitle={`${cardName} - ${cardID}`}
  >
    <EditCardForm
      card={cardData}
      onSubmit={onSubmit}
      setShowModal={setShowModal}
    />
  </Modal>
)

export default EditCardModal
