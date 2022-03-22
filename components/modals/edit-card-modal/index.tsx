import React from 'react'
import Modal from '../modal'
import EditCardForm from '../../forms/edit-card-form'

type EditCardModalProps = {
  cardData: any
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
    <img src="https://www.vosp.us/wp-content/uploads/Under.jpg" />
    {/* <EditCardForm
      cardData={cardData}
      onSubmit={onSubmit}
      setShowModal={setShowModal}
    /> */}
  </Modal>
)

export default EditCardModal
