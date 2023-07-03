import useBuyPack from '@pages/api/mutations/use-buy-pack'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import { packs, PackInfo } from '@constants/packs-map'
import BuyPackModal from '@components/modals/buy-pack-modal'
import { warningToast } from '@utils/toasts'
import subscriptionOptions from '@constants/subscription-options'
import useGetUser from '@pages/api/queries/use-get-user'
import useUpdateSubscription from '@pages/api/mutations/use-update-subscription'
import { NextSeo } from 'next-seo'
import useGetPacksBoughtToday from '@pages/api/queries/use-get-packs-bought-today'

const PackShop = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<PackInfo>(null)

  const {
    user,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: getUidFromSession(),
  })
  const {
    packsBoughtToday,
    isLoading: packsBoughtTodayIsLoading,
    isError: packsBoughtTodayIsError,
  } = useGetPacksBoughtToday({ uid: getUidFromSession() })
  const { buyPack, isLoading: buyBackIsLoading } = useBuyPack()
  const { updateSubscription } = useUpdateSubscription()

  const handleSelectedPack = (pack: PackInfo): void => {
    setModalPack(pack)
    setShowModal(true)
  }

  const handleBuyPack = (packId): void => {
    if (buyBackIsLoading) {
      warningToast({ warningText: 'Already buying a pack' })
      return
    }
    buyPack({ uid: getUidFromSession(), packType: packId })
    setModalPack(null)
    setShowModal(false)
  }

  const handleUpdateSubscription = (event): void => {
    updateSubscription({
      uid: getUidFromSession(),
      subscriptionAmount: event.target.value,
    })
  }

  if (
    getUserIsLoading ||
    getUserIsError ||
    packsBoughtTodayIsLoading ||
    packsBoughtTodayIsError
  ) {
    return null
  }

  return (
    <>
      <NextSeo title="Pack Shop" />
      <div className="m-2">
        <h1 className="text-4xl text-center mt-6">Pack Shop</h1>
        <div className="flex flex-col justify-center text-center mb-6">
          <div>Max 3 packs per day</div>
          <div>A new set of packs can be purchased at midnight EST</div>
        </div>
        <div className="lg:w-3/4 lg:m-auto flex flex-row justify-start items-center">
          <h1>Base Pack Subscription</h1>
          <select
            className="m-2"
            value={user.subscription}
            onChange={handleUpdateSubscription}
          >
            {subscriptionOptions.map((subscriptionOption, index) => (
              <option key={index} value={subscriptionOption.value}>
                {subscriptionOption.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3">
          {packs.map((pack: PackInfo, index: number) => (
            <div className="my-2 h-auto flex flex-col items-center justify-center">
              <img
                onClick={() => handleSelectedPack(pack)}
                className="cursor-pointer h-96 mx-4 transition ease-linear hover:scale-105 shadow-none hover:shadow-xl"
                src={pack.imageUrl}
              />
              <div className="text-center">
                <h1 className="text-2xl">{pack.label} Pack</h1>
                <h2 className="text-xl">
                  Price: ${new Intl.NumberFormat().format(pack.price)}
                </h2>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <BuyPackModal
            onAccept={handleBuyPack}
            setShowModal={setShowModal}
            pack={modalPack}
            limitReached={packsBoughtToday > 3}
          />
        )}
      </div>
    </>
  )
}

export default PackShop
