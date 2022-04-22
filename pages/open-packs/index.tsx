import OpenPackModal from '@components/modals/open-pack-modal'
import packsMap, { packInfo } from '@constants/packs-map'
import useToast, { warningToast } from '@hooks/use-toast'
import useOpenPack from '@pages/api/mutations/use-open-pack'
import { useGetUser } from '@pages/api/queries'
import useGetUserPacks from '@pages/api/queries/use-get-user-packs'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import Router from 'next/router'
import { NextSeo } from 'next-seo'

const OpenPacks = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<UserPack>(null)

  const {
    user,
    isSuccess: getCurrentUserIsSuccess,
    isLoading: getCurrentUserIsLoading,
    isError: getCurrentUserIsError,
  } = useGetUser({ uid: getUidFromSession() })

  const {
    userPacks,
    isSuccess: getUserPacksIsSuccess,
    isLoading: getUserPacksIsLoading,
    isError: getUserPacksIsError,
  } = useGetUserPacks({
    uid: getUidFromSession(),
  })

  const {
    openPack,
    response,
    isSuccess: useOpenPackIsSuccess,
    isLoading: useOpenPackIsLoading,
    isError: useOpenPackIsError,
  } = useOpenPack()

  useToast({
    successText: 'Pack Opened',
    successDependencies: [useOpenPackIsSuccess],
    errorText: 'Error Opening Pack',
    errorDependencies: [useOpenPackIsError],
  })

  const handleSelectedPack = (pack: UserPack) => {
    setModalPack(pack)
    setShowModal(true)
  }

  const handleOpenPack = (packID: number) => {
    if (useOpenPackIsLoading) {
      warningToast({
        warningText: `Bro chill we're still opening that pack`,
      })
      return
    }
    openPack({ packID: packID })
  }

  if (useOpenPackIsSuccess) {
    Router.push('/open-packs/last-pack')
  }

  if (
    getUserPacksIsLoading ||
    getUserPacksIsError ||
    getCurrentUserIsLoading ||
    getCurrentUserIsError
  ) {
    return null
  }

  return (
    <>
      <NextSeo title="Open Packs" />
      <div className="m-2">
        <h1 className="text-4xl text-center my-6">Open Packs</h1>
        {userPacks.length === 0 ? (
          <div className="text-center">
            <p className="text-xl">You don't have any packs to open.</p>
            <p className="text-xl">
              Go to the{' '}
              <a
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200 my-4"
                href="/pack-shop"
              >
                pack shop
              </a>{' '}
              to get some packs!
            </p>
          </div>
        ) : (
          <>
            <p>Number of packs: {userPacks.length}</p>
            <p>Subscribed: {user.subscription ? user.subscription : 'No'}</p>
            <div className="h-full flex flex-row items-center justify-start overflow-x-auto overflow-y-hidden">
              {userPacks.map((pack, index) => (
                <img
                  key={index}
                  onClick={() => handleSelectedPack(pack)}
                  className="select-none my-2 cursor-pointer h-96 mx-4 transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                  src={packsMap.base.imageUrl}
                />
              ))}
            </div>
          </>
        )}
        {showModal && (
          <OpenPackModal
            onAccept={handleOpenPack}
            setShowModal={setShowModal}
            pack={modalPack}
          />
        )}
      </div>
    </>
  )
}

export default OpenPacks
