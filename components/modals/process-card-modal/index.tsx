import React from 'react'
import Modal from '../modal'
import Button from '@components/buttons/button'
import pathToCards from '@constants/path-to-cards'

type ProcessCardModalProps = {
  setShowModal: Function
  onAccept: Function
  onDeny: Function
  card: Card
}

const ProcessCardModal = ({
  setShowModal,
  onAccept,
  onDeny,
  card,
}: ProcessCardModalProps) => (
  <Modal
    setShowModal={setShowModal}
    title="Process Card"
    subtitle={`${card.player_name} - ${card.cardID}`}
  >
    <div className="flex flex-col items-center justify-end">
      <div className="flex justify-center items-center m-6">
        <img className="rounded-sm" src={`${pathToCards}${card.image_url}`} />
      </div>
      <div>
        <Button
          disabled={false}
          className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
          onClick={() => {
            onDeny()
            setShowModal(false)
          }}
        >
          Deny Card
        </Button>
        <Button
          disabled={false}
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          onClick={() => {
            onAccept()
            setShowModal(false)
          }}
        >
          Accept Card
        </Button>
      </div>
    </div>
  </Modal>
)

export default ProcessCardModal
