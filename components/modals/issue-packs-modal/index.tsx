import React from 'react'
import Modal from '../modal'
import Button from '@components/buttons/button'
import { User } from 'index'

type IssuePacksModalProps = {
  setShowModal: Function
  onIssuePack: Function
  user: User
}

const IssuePacksModal = ({
  setShowModal,
  onIssuePack,
  user,
}: IssuePacksModalProps) => (
  <Modal
    setShowModal={setShowModal}
    title="Issue Base Pack"
    subtitle={`${user.username} - ${user.uid}`}
  >
    <div className="flex items-center justify-end p-6">
      <Button
        disabled={false}
        className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
        onClick={() => setShowModal(false)}
      >
        Cancel
      </Button>
      <Button
        disabled={false}
        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        onClick={() => {
          onIssuePack()
          setShowModal(false)
        }}
      >
        Issue Base Pack
      </Button>
    </div>
  </Modal>
)

export default IssuePacksModal
