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
import { Skeleton, SimpleGrid, useToast, Select, Badge } from '@chakra-ui/react'
import { UserData } from '@pages/api/v3/user'
import { useSession } from 'contexts/AuthContext'
import { errorToastOptions, warningToastOptions } from '@utils/toast'

export type UserPackWithCover = UserPacks & {
  cover: string
}

const getPackCover = (pack: UserPacks): string => {
  if (pack.packType === 'base') {
    return packService.basePackCover()
  } else if (pack.packType === 'ruby') {
    return packService.rubyPackCover()
  }
  return packService.basePackCover() // fallback to base pack cover
}

const OpenPacks = () => {
  const toast = useToast()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<UserPackWithCover>(null)
  const [selectedPackType, setSelectedPackType] = useState<string>('all')
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

  const packsWithCovers = useMemo(() => {
    if (!packs) return []
    return packs.map((pack) => ({
      ...pack,
      cover: getPackCover(pack),
    }))
  }, [packs])

  const packCounts = useMemo(() => {
    const counts = { base: 0, ruby: 0, total: 0 }
    if (!packsWithCovers) return counts

    return packsWithCovers.reduce((acc, pack) => {
      if (pack.packType === 'base') acc.base++
      if (pack.packType === 'ruby') acc.ruby++
      acc.total = acc.base + acc.ruby
      return acc
    }, counts)
  }, [packsWithCovers])

  const filteredPacks = useMemo(() => {
    if (!packsWithCovers) return []
    if (selectedPackType === 'all') return packsWithCovers
    return packsWithCovers.filter((pack) => pack.packType === selectedPackType)
  }, [packsWithCovers, selectedPackType])

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
    Router.push(`/packs/last-pack?type=${modalPack.packType}`)
  }

  React.useEffect(() => {
    if (useOpenPackIsError) {
      toast({
        title: 'Pack Opening Error',
        description: 'Unable to open the pack. Please try again.',
        ...errorToastOptions,
      })
    }
  }, [useOpenPackIsError])

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
                  className="text-link hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 my-4"
                  href="/shop"
                >
                  pack shop
                </a>{' '}
                to get some packs!
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="flex gap-4 mb-4">
                  <div className="text-sm md:text-base">Filter by:</div>
                  <Select
                    value={selectedPackType}
                    onChange={(e) => setSelectedPackType(e.target.value)}
                    className="w-40"
                  >
                    <option className="!bg-primary !text-secondary" value="all">
                      All
                    </option>
                    <option
                      className="!bg-primary !text-secondary"
                      value="base"
                    >
                      Base
                    </option>
                    <option
                      className="!bg-primary !text-secondary"
                      value="ruby"
                    >
                      Ruby
                    </option>
                  </Select>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 lg:gap-6 text-md">
                  <Badge>Base Packs: {packCounts.base}</Badge>
                  <Badge className="!bg-red200 !text-black">
                    Ruby Packs: {packCounts.ruby}
                  </Badge>
                </div>
              </div>
              <div
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
                role="grid"
                aria-labelledby="pack-count"
              >
                {filteredPacks.map((pack, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectedPack(pack)}
                    onKeyDown={(e) => handleKeyPress(e, pack)}
                    className="my-2 mx-4 p-0 border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
                    aria-label={`Open ${pack.packType} pack ${index + 1} of ${
                      filteredPacks.length
                    }`}
                  >
                    <img
                      className="select-none h-96 w-full object-contain transition ease-linear group-hover:scale-105 group-hover:shadow-xl group-focus:scale-105 group-focus:shadow-xl"
                      src={pack.cover}
                      alt={`${pack.packType} trading card pack ${index + 1}`}
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
              onError={useOpenPackIsError}
            />
          )}
        </div>
      </PageWrapper>
    </>
  )
}

export default OpenPacks
