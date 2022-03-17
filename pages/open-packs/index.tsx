import useOpenPack from '@pages/api/mutations/use-open-pack'
import useGetUserPacks from '@pages/api/queries/use-get-user-packs'
import getUidFromSession from '@utils/get-uid-from-session'
import React from 'react'

const OpenPacks = () => {
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

  const handleOpenPack = (packId) => {
    openPack({ uid: getUidFromSession(), packType: packId })
  }

  if (getUserPacksIsLoading || getUserPacksIsError) {
    return null
  }

  return (
    <div className="m-2">
      <h1>Open Packs</h1>
      <p>Number of packs: {userPacks.quantity}</p>
      <p>Subscribed: {userPacks.subscribed}</p>
    </div>
  )
}

export default OpenPacks
