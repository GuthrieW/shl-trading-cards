import React from 'react'
import Modal from '../modal'
import EditCardForm from '../../forms/edit-card-form'

type EditCardModalProps = {
  cardData: any
  setShowModal: Function
  onSubmit: Function
}

const EditCardModal = ({
  cardData,
  setShowModal,
  onSubmit,
}: EditCardModalProps) => (
  <Modal setShowModal={setShowModal} title="Edit Card">
    <EditCardForm
      cardData={cardData}
      onSubmit={onSubmit}
      setShowModal={setShowModal}
    />
  </Modal>
)

export default EditCardModal
