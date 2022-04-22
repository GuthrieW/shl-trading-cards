import { useBuyPack } from '@pages/api/mutations'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useEffect, useState } from 'react'
import { packs, packInfo } from '@constants/packs-map'
import BuyPackModal from '@components/modals/buy-pack-modal'
import useToast, { warningToast } from '@hooks/use-toast'
import subscriptionOptions from '@constants/subscription-options'
import { useGetUser } from '@pages/api/queries'
import useUpdateSubscription from '@pages/api/mutations/use-update-subscription'
import { NextSeo } from 'next-seo'
import useGetPacksBoughtToday from '@pages/api/queries/use-get-packs-bought-today'
import {
  startOfTomorrow,
  intervalToDuration,
  formatDuration,
  startOfDay,
  add,
} from 'date-fns'
import { utcToZonedTime, getTimezoneOffset } from 'date-fns-tz'

const calculateTimeLeft = (): string => {
  const currentTime = new Date()
  const timeInMilliseconds = currentTime.valueOf()

  const tomorrow: Date = startOfTomorrow()
  const tomorrowInEst: Date = utcToZonedTime(tomorrow, 'America/New_York')
  const startOfTomorrowInEst: Date = startOfDay(tomorrowInEst)
  const startOfTomorrowInMilliseconds = startOfTomorrowInEst.valueOf()

  return formatDuration(
    intervalToDuration({
      start: timeInMilliseconds,
      end: startOfTomorrowInMilliseconds,
    }),
    {
      delimiter: ', ',
    }
  )
}

const PackShop = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<packInfo>(null)
  const [timeLeft, setTimeLeft] = useState<string>(calculateTimeLeft())

  const {
    user,
    isSuccess: getUserIsSuccess,
    isLoading: getUserIsLoading,
    isError: getUserIsError,
  } = useGetUser({
    uid: getUidFromSession(),
  })

  const {
    packsBoughtToday,
    isSuccess: packsBoughtTodayIsSuccess,
    isLoading: packsBoughtTodayIsLoading,
    isError: packsBoughtTodayIsError,
  } = useGetPacksBoughtToday({ uid: getUidFromSession() })

  const {
    buyPack,
    response: buyPackResponse,
    isLoading: buyBackIsLoading,
    isError: buyPackIsError,
    isSuccess: buyPackIsSuccess,
  } = useBuyPack()

  const {
    updateSubscription,
    response: updateSubscriptionResponse,
    isSuccess: updateSubscriptionIsSuccess,
    isLoading: updateSubscriptionIsLoading,
    isError: updateSubscriptionIsError,
  } = useUpdateSubscription()

  useToast({
    successText: 'Pack Bought',
    successDependencies: [buyPackIsSuccess],
    errorText: 'Error Purchasing Pack',
    errorDependencies: [buyPackIsError],
  })

  useToast({
    successText: 'Subscription Updated',
    successDependencies: [updateSubscriptionIsSuccess],
    errorText: 'Error Updating Subscription',
    errorDependencies: [updateSubscriptionIsError],
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearTimeout(timer)
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

  const handleUpdateSubscription = (event) => {
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
          <div>You can buy more in {timeLeft}</div>
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
