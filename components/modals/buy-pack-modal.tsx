import Button from '@components/buttons/button'
import { packInfo } from '@constants/packs-map'
import { warningToast } from '@utils/toasts'
import React from 'react'
import Modal from './modal'

type BuyPackModalProps = {
  onAccept: Function
  setShowModal: Function
  pack: packInfo
  limitReached: boolean
}

const BuyPackModal = ({
  onAccept,
  setShowModal,
  pack,
  limitReached,
}: BuyPackModalProps) => (
  <Modal
    setShowModal={setShowModal}
    title={`${pack.label} - ${pack.priceLabel}`}
    subtitle={pack.description}
  >
    <div className="flex flex-col justify-center items-center">
      <div className="w-1/2 flex flex-col justify-center items-center">
        <img className="select-none" src={pack.imageUrl} />
      </div>
      <div className="flex items-center justify-end p-6">
        <Button
          disabled={false}
          className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg select-none"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </Button>
        <Button
          disabled={false}
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 select-none"
          onClick={
            false
              ? () =>
                  warningToast({
                    warningText:
                      'You have already purchased 3 base packs today',
                  })
              : () => onAccept(pack.id)
          }
        >
          Buy Pack
        </Button>
      </div>
    </div>
  </Modal>
)

export default BuyPackModal
