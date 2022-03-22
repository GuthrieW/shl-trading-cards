import { useBuyPack } from '@pages/api/mutations'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { packs, packInfo } from '@constants/packs-map'
import BuyPackModal from '@components/modals/buy-pack-modal'
import useToast from '@hooks/use-toast'

const PackShop = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<packInfo>(null)

  const {
    buyPack,
    response: buyPackResponse,
    isLoading: buyBackIsLoading,
    isError: buyPackIsError,
    isSuccess: buyPackIsSuccess,
  } = useBuyPack()

  useToast({
    successText: 'Pack Bought',
    successDependencies: [buyPackIsSuccess],
    errorText: 'Error Buying Pack',
    errorDependencies: [buyPackIsError],
  })

  const handleSelectedPack = (pack: packInfo) => {
    setModalPack(pack)
    setShowModal(true)
  }

  const handleBuyPack = (packId) => {
    if (!buyBackIsLoading) {
      buyPack({ uid: getUidFromSession(), packType: packId })
    }
  }

  return (
    <div className="m-2">
      <h1>Pack Shop</h1>
      <div className="my-2 h-auto flex flex-row items-center justify-center">
        {packs.map((pack: packInfo, index: number) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <img
              onClick={() => handleSelectedPack(pack)}
              className="cursor-pointer h-96 mx-4 transition ease-linear hover:scale-105 shadow-none hover:shadow-xl"
              src={pack.imageUrl}
            />
          </div>
        ))}
      </div>
      {showModal && (
        <BuyPackModal
          onAccept={handleBuyPack}
          setShowModal={setShowModal}
          pack={modalPack}
        />
      )}
    </div>
  )
}

export default PackShop
