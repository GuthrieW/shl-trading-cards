import OpenPackModal from '@components/modals/open-pack-modal'
import packsMap, { packInfo } from '@constants/packs-map'
import useToast from '@hooks/use-toast'
import useOpenPack from '@pages/api/mutations/use-open-pack'
import { useGetUser } from '@pages/api/queries'
import useGetUserPacks from '@pages/api/queries/use-get-user-packs'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'
import Router from 'next/router'

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
    <div className="m-2">
      <h1>Open Packs</h1>
      <p>Number of packs: {userPacks.length}</p>
      <p>Subscribed: {user.subscription ? user.subscription : 'No'}</p>
      <div className="h-full flex flex-row items-center justify-start overflow-x-auto overflow-y-hidden">
        {userPacks.map((pack, index) => (
          <img
            key={index}
            onClick={() => handleSelectedPack(pack)}
            className="my-2 cursor-pointer h-96 mx-4 transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
            src={packsMap.base.imageUrl}
          />
        ))}
      </div>
      {showModal && (
        <OpenPackModal
          onAccept={handleOpenPack}
          setShowModal={setShowModal}
          pack={modalPack}
        />
      )}
    </div>
  )
}

export default OpenPacks
