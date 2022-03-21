import OpenPackModal from '@components/modals/open-pack-modal'
import packsMap, { packInfo, packs } from '@constants/packs-map'
import useOpenPack from '@pages/api/mutations/use-open-pack'
import useGetUserPacks from '@pages/api/queries/use-get-user-packs'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useState } from 'react'

const OpenPacks = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<packInfo>(null)

  const {
    userPacks,
    isLoading: getUserPacksIsLoading,
    isError: getUserPacksIsError,
  } = useGetUserPacks({
    uid: getUidFromSession(),
  })
  const {
    openPack,
    response,
    isLoading: useOpenPackIsLoading,
    isError: useOpenPackIsError,
  } = useOpenPack()

  const handleSelectedPack = () => {
    setModalPack(packsMap.base)
    setShowModal(true)
  }

  const handleOpenPack = (packId) => {
    openPack({ uid: getUidFromSession(), packType: packId })
  }

  if (getUserPacksIsLoading || getUserPacksIsError) {
    return null
  }

  return (
    <div className="m-2">
      <h1>Open Packs</h1>
      <p>Number of packs: {userPacks.base_quantity}</p>
      <p>Subscribed: {userPacks.subscribed}</p>
      <div className="h-full flex flex-row items-center justify-start overflow-x-auto overflow-y-hidden">
        {Array.from(Array(userPacks.base_quantity)).map((x, index) => (
          <img
            key={index}
            onClick={() => handleSelectedPack()}
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
