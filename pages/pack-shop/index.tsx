import { useBuyPack } from '@pages/api/mutations'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { packs, packInfo } from '@constants/packs-map'
import BuyPackModal from '@components/modals/buy-pack-modal'
import useToast, { warningToast } from '@hooks/use-toast'
import { useGetUser } from '@pages/api/queries'
import Button from '@components/buttons/button'

const PackShop = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<packInfo>(null)

  const {
    user,
    isSuccess: getCurrentUserIsSuccess,
    isLoading: getCurrentUserIsLoading,
    isError: getCurrentUserIsError,
  } = useGetUser({ uid: getUidFromSession() })

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
    if (buyBackIsLoading) {
      warningToast({ warningText: 'Already buying a pack' })
      return
    }
    buyPack({ uid: getUidFromSession(), packType: packId })
    setModalPack(null)
    setShowModal(false)
  }

  if (getCurrentUserIsLoading || getCurrentUserIsError) {
    return null
  }

  const subscriptionOptions = [
    {
      value: 0,
      label: 0,
    },
    {
      value: 1,
      label: 1,
    },
    {
      value: 2,
      label: 2,
    },
    {
      value: 3,
      label: 3,
    },
  ]

  return (
    <div className="m-2">
      <h1>Pack Shop</h1>
      <select>
        {subscriptionOptions.map((subOption, index) => (
          <option key={index} value={subOption.value}>
            {subOption.label}
          </option>
        ))}
      </select>
      <Button
        disabled={false}
        onClick={() => {
          alert("This isn't implemented yet")
        }}
      >
        Update Subscription
      </Button>
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
