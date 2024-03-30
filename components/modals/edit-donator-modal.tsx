import Modal from './modal'

type EditDonatorModalProps = {
  setShowModal: Function
  onSubmit: Function
  uid: number
  username: string
  subscription: number
}

const EditDonatorModal = ({
  setShowModal,
  onSubmit,
  username,
  subscription,
  uid,
}: EditDonatorModalProps) => (
  <Modal setShowModal={setShowModal} title={'Edit Donator'} subtitle={username}>
    <EditDonatorForm
      onSubmit={onSubmit}
      uid={uid}
      subscription={subscription}
    />
  </Modal>
)

export default EditDonatorModal
