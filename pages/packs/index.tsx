import OpenPackModal from '@components/modals/OpenPackModal'
import { packService } from 'services/packService'
import useOpenPack from '@pages/api/mutations/use-open-pack'
import React, { useMemo, useState, KeyboardEvent } from 'react'
import Router from 'next/router'
import { NextSeo } from 'next-seo'
import { UserPacks } from '@pages/api/v3'
import { PageWrapper } from '@components/common/PageWrapper'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import axios from 'axios'
import { Skeleton, SimpleGrid, useToast } from '@chakra-ui/react'
import { UserData } from '@pages/api/v3/user'
import { useSession } from 'contexts/AuthContext'
import { warningToastOptions } from '@utils/toast'

export type UserPackWithCover = UserPacks & {
  cover: string
}

const OpenPacks = () => {
  const toast = useToast()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<UserPackWithCover>(null)
  const { session, loggedIn } = useSession()

  const { payload: user, isLoading: userIDLoading } = query<UserData>({
    queryKey: ['baseUser', session?.token],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/user',
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    enabled: loggedIn,
  })

  const { payload: packs, isLoading: packsLoading } = query<UserPacks[]>({
    queryKey: ['packs', String(user?.uid)],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/packs/${user?.uid}`,
      }),
    enabled: !!user?.uid,
  })

  const packsWithCovers: UserPackWithCover[] = useMemo(() => {
    if (!packs) return []
    return packs.map((pack) => ({
      ...pack,
      cover: packService.basePackCover(),
    }))
  }, [packs])

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
      toast({
        title: 'Already opening a pack',
        description: `Bro chill we're still opening that pack`,
        ...warningToastOptions,
      })
      return
    }
    openPack({ packID: packID })
  }

  const handleKeyPress = (
    event: KeyboardEvent<HTMLButtonElement>,
    pack: UserPackWithCover
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelectedPack(pack)
    }
  }

  if (useOpenPackIsSuccess) {
    Router.push('/packs/last-pack')
  }

  if (userIDLoading || packsLoading) {
    return (
      <PageWrapper>
        <NextSeo title="Open Packs" />
        <Skeleton height="20px" width="200px" mb={4} />
        <SimpleGrid columns={3} spacing={4}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height="200px" />
          ))}
        </SimpleGrid>
      </PageWrapper>
    )
  }

  return (
    <>
      <PageWrapper>
        <NextSeo title="Open Packs" />
        <div className="m-2">
          <h1 className="text-4xl text-center my-6">Open Packs</h1>
          {packsWithCovers.length === 0 ? (
            <div className="text-center" role="alert">
              <p className="text-xl">You don't have any packs to open.</p>
              <p className="text-xl">
                Go to the{' '}
                <a
                  className="text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 my-4"
                  href="/shop"
                >
                  pack shop
                </a>{' '}
                to get some packs!
              </p>
            </div>
          ) : (
            <>
              <p id="pack-count">Number of packs: {packsWithCovers.length}</p>
              <div 
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
                role="grid"
                aria-labelledby="pack-count"
              >
                {packsWithCovers.map((pack, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectedPack(pack)}
                    onKeyDown={(e) => handleKeyPress(e, pack)}
                    className="my-2 mx-4 p-0 border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
                    aria-label={`Open pack ${index + 1} of ${packsWithCovers.length}`}
                  >
                    <img
                      className="select-none h-96 w-full object-contain transition ease-linear group-hover:scale-105 group-hover:shadow-xl group-focus:scale-105 group-focus:shadow-xl"
                      src={pack.cover}
                      alt={`Trading card pack ${index + 1}`}
                      role="presentation"
                    />
                  </button>
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
      </PageWrapper>
    </>
  )
}

export default OpenPacks