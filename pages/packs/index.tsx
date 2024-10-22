import OpenPackModal from '@components/modals/OpenPackModal'
import { packService } from 'services/packService'
import useOpenPack from '@pages/api/mutations/use-open-pack'
import React, { useMemo, useState } from 'react'
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
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
      </PageWrapper>
    </>
  )
}

export default OpenPacks
