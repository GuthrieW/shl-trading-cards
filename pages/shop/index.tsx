import { PageWrapper } from '@components/common/PageWrapper'
import useBuyPack from '@pages/api/mutations/use-buy-pack'
import React, { useEffect, useMemo, useState } from 'react'
import { packService, PackInfo } from 'services/packService'
import BuyPackModal from '@components/modals/BuyPackModal'
import subscriptionOptions from '@constants/subscription-options'
import useUpdateSubscription from '@pages/api/mutations/use-update-subscription'
import { NextSeo } from 'next-seo'
import { GET } from '@constants/http-methods'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { DailySettingsData } from '@pages/api/v3/settings/daily'
import { query } from '@pages/api/database/query'
import {
  Button,
  Heading,
  Select,
  SimpleGrid,
  Skeleton,
  VStack,
  Image as ChakraImage,
  useToast,
} from '@chakra-ui/react'
import { successToastOptions, warningToastOptions } from '@utils/toast'
import { TimeUntilMidnight } from '@utils/time-until-midnight'
import router from 'next/router'
import RarityInfoButton from '@components/common/RarityInfoButton'

export type PackInfoWithCover = PackInfo & {
  cover: string
}

const PackShop = () => {
  const toast = useToast()
  const { session, loggedIn } = useSession()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalPack, setModalPack] = useState<PackInfoWithCover>(null)
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true)
  const [, setSubscriptionValue] = useState<number>(0)
  const { buyPack, isLoading: buyBackIsLoading } = useBuyPack()
  const { updateSubscription } = useUpdateSubscription()

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

  useEffect(() => {
    if (!userIDLoading && user?.uid) {
      setIsUserLoading(false)
    }
  }, [userIDLoading, user])

  const { payload: dailySubscription, isLoading: dailySubscriptionLoading } =
    query<DailySettingsData>({
      queryKey: ['daily-subscription', String(user?.uid)],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/settings/daily?userID=${user?.uid}`,
        }),
      enabled: !!user?.uid,
    })

  useEffect(() => {
    if (dailySubscription && dailySubscription.subscription > 0) {
      setSubscriptionValue(dailySubscription[0]?.subscription || 0)
    }
  }, [dailySubscription])

  const packsWithCovers: PackInfoWithCover[] = useMemo(() => {
    return Object.values(packService.packs).map((pack) => {
      const typedPack = pack as PackInfo
      if (typedPack.id === 'base' || typedPack.id === 'ruby') {
        return { ...typedPack, cover: packService.basePackCover() }
      }
      return { ...typedPack, cover: typedPack.imageUrl || '' }
    })
  }, [])

  const handleSelectedPack = (pack: PackInfoWithCover): void => {
    if (!loggedIn) {
      toast({
        title: 'Log in to purchase packs',
        ...warningToastOptions,
      })
      return
    }
    setModalPack(pack)
    setShowModal(true)
  }

  const handleBuyPack = (packId): void => {
    if (buyBackIsLoading) {
      toast({
        title: 'Already buying a pack',
        description: `Calm down man`,
        ...warningToastOptions,
      })
      return
    }
    buyPack({ uid: user.uid, packType: packId })
    setModalPack(null)
    setShowModal(false)
  }

  const subscriptionValue = useMemo(() => {
    return dailySubscription?.[0]?.subscription ?? 0
  }, [dailySubscription])

  const handleUpdateSubscription = (event): void => {
    const newSubscription = parseInt(event.target.value)
    if (user?.uid) {
      updateSubscription({
        uid: user.uid,
        subscriptionAmount: newSubscription,
      })
      toast({
        title: `Updated subscription to ${newSubscription}`,
        ...successToastOptions,
      })
      setSubscriptionValue(newSubscription)
    }
  }

  return (
    <PageWrapper>
      <NextSeo title="Pack Shop" />
      <div className="m-2">
        <h1 className="text-4xl text-center mt-6">Pack Shop</h1>
        <div className="flex flex-col justify-center text-center mb-6">
          <div>Max 3 base packs per day and 1 ruby pack per day</div>
          <div>A new set of packs can be purchased at midnight EST</div>
          <span className="text-lg font-bold">
            Time until next reset: {TimeUntilMidnight()}
          </span>
        </div>

        {loggedIn && (
          <>
            {userIDLoading || dailySubscriptionLoading ? (
              <Skeleton h="100px" w="75%" m="auto" />
            ) : (
              <div className="lg:w-3/4 lg:m-auto flex flex-col items-center bg-primary text-secondary p-4 rounded-lg shadow-md">
                <h1 className="text-xl font-semibold mb-2">
                  Base Pack Subscription
                </h1>
                <Select
                  className="cursor-pointer w-full sm:w-auto border-grey800 border rounded px-3 py-2 !bg-secondary"
                  value={subscriptionValue}
                  onChange={handleUpdateSubscription}
                  w="200px"
                >
                  {subscriptionOptions.map((subscriptionOption, index) => (
                    <option
                      key={index}
                      value={subscriptionOption.value}
                      className="!bg-primary !text-secondary"
                    >
                      {subscriptionOption.label}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </>
        )}
        <SimpleGrid columns={[1, 2, 3]} spacing={8} mt={8}>
          {packsWithCovers.map((pack: PackInfoWithCover, index: number) => (
            <VStack
              key={index}
              spacing={4}
              align="center"
              className="bg-primary text-secondary 0 p-4 rounded-lg shadow-md border-2 border-secondary"
            >
              <ChakraImage
                src={pack.cover}
                alt={`${pack.label} Pack`}
                className="cursor-pointer transition-transform  duration-300 ease-in-out hover:scale-105"
                onClick={() => handleSelectedPack(pack)}
                objectFit="cover"
                height="75%"
                width="75%"
              />
              <Heading as="h2" size="lg">
                {pack.label} Pack
                <RarityInfoButton packID={pack?.id} />
              </Heading>
              <div className='fontSize="xl'>
                Price: ${new Intl.NumberFormat().format(pack.price)}
              </div>
              {loggedIn ? (
                <Button
                  colorScheme="blue"
                  onClick={() => handleSelectedPack(pack)}
                >
                  Buy Pack
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => router.push('/login')}
                >
                  Sign in to purchase packs
                </Button>
              )}
            </VStack>
          ))}
        </SimpleGrid>

        {showModal && (
          <BuyPackModal
            onAccept={handleBuyPack}
            isOpen={true}
            onClose={() => setShowModal(false)}
            pack={modalPack}
          />
        )}
      </div>
    </PageWrapper>
  )
}

export default PackShop
