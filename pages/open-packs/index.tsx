import OpenPackModal from '@components/modals/open-pack-modal'
import packsMap, {
  basePackCovers,
  getBasePackCover,
  packCovers,
} from '@constants/packs-map'
import { warningToast } from '@utils/toasts'
import useOpenPack from '@pages/api/mutations/use-open-pack'
import useGetUser from '@pages/api/queries/use-get-user'
import useGetUserPacks from '@pages/api/queries/use-get-user-packs'
import getUidFromSession from '@utils/get-uid-from-session'
import React, { useMemo, useState } from 'react'
import Router from 'next/router'
import { NextSeo } from 'next-seo'
import { useResponsive } from '@hooks/useResponsive'

export type UserPackWithCover = UserPack & {
  cover: string
}

const OpenPacks = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<UserPackWithCover>(null)

  const { isMobile, isTablet } = useResponsive()
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

  const packsWithCovers: UserPackWithCover[] = useMemo(() => {
    return userPacks.map((pack) => ({ ...pack, cover: getBasePackCover() }))
  }, [userPacks])

  const {
    openPack,
    response,
    isSuccess: useOpenPackIsSuccess,
    isLoading: useOpenPackIsLoading,
    isError: useOpenPackIsError,
  } = useOpenPack()

  const handleSelectedPack = (pack: UserPackWithCover) => {
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
        {packsWithCovers.length === 0 ? (
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
            <p>Number of packs: {packsWithCovers.length}</p>
            <p>Subscribed: {user.subscription ? user.subscription : 'No'}</p>
            <div
              className={`grid ${
                isMobile
                  ? 'grid-cols-2'
                  : isTablet
                  ? 'grid-cols-3'
                  : 'grid-cols-5'
              }`}
            >
              {packsWithCovers.map((pack, index) => (
                <img
                  key={index}
                  onClick={() => handleSelectedPack(pack)}
                  className="select-none my-2 cursor-pointer h-96 mx-4 transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                  src={pack.cover}
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
