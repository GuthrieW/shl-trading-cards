import React from 'react'
import { packInfo } from '@constants/packs-map'
import Modal from '../modal'
import Button from '@components/buttons/button'

type OpenPackModalProps = {
  onAccept: Function
  setShowModal: Function
  pack: packInfo
}

const OpenPackModal = ({
  onAccept,
  setShowModal,
  pack,
}: OpenPackModalProps) => (
  <Modal
    setShowModal={setShowModal}
    title={pack.label}
    subtitle={pack.description}
  >
    <div className="flex flex-row justify-center items-center">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <img src={pack.imageUrl} />
      </div>
      <div className="flex items-center justify-end p-6">
        <Button
          disabled={false}
          className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
          onClick={() => setShowModal(false)}
        >
          Open Later
        </Button>
        <Button
          disabled={false}
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          onClick={() => onAccept(pack.id)}
        >
          Open Pack
        </Button>
      </div>
    </div>
  </Modal>
)

export default OpenPackModal
