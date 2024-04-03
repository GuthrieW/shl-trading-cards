import EditDonatorForm from '@components/forms/edit-donator-form'
import Modal from './modal'
import useGetDonationUser from '@pages/api/queries/use-get-donation-user'
import { PropagateLoader } from 'react-spinners'

type EditDonatorModalProps = {
  setShowModal: Function
  uid: number
  username: string
}

const EditDonatorModal = ({
  setShowModal,
  username,
  uid,
}: EditDonatorModalProps) => {
  const { donationUser, isSuccess, isLoading, isError } = useGetDonationUser({
    uid,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <PropagateLoader />
      </div>
    )
  }
  return (
    <Modal
      setShowModal={setShowModal}
      title={'Edit Donator'}
      subtitle={username}
    >
      <EditDonatorForm
        setShowModal={setShowModal}
        donator={{ uid, subscription: donationUser?.subscription || 0 }}
      />
    </Modal>
  )
}
export default EditDonatorModal
