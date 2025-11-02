import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Link,
  SimpleGrid,
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { AuthGuard } from '@components/auth/AuthGuard'
import { PageWrapper } from '@components/common/PageWrapper'
import { GET, POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { query } from '@pages/api/database/query'
import { UserData } from '@pages/api/v3/user'
import { errorToastOptions, successToastOptions } from '@utils/toast'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { GetServerSideProps } from 'next'
import { formatDateTime } from '@utils/formatDateTime'
import { useEffect, useState } from 'react'
import { IconButton } from '@chakra-ui/react'
import { ChevronRightIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import ImageWithFallback from '@components/images/ImageWithFallback'
import TradeSection from '@components/trades/TradeSection'

export default ({ tradeid }: { tradeid: string }) => {
  const toast = useToast()
  const { session, loggedIn } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isVisible, setIsVisible] = useState(false)
  const tradeResolutionEffectedQueries: string[] = [
    'trade',
    'trades',
    'user-unique-cards',
    'collection',
  ]

  const { mutateAsync: acceptTrade, isLoading: isAccepting } = mutation<
    void,
    { tradeID: string }
  >({
    mutationFn: () =>
      axios({
        url: `/api/v3/trades/accept/${tradeid}`,
        method: POST,
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(tradeResolutionEffectedQueries)
      toast({
        title: 'Trade Accepted',
        ...successToastOptions,
      })
      router.push('/trade')
    },
    onError: () => {
      toast({
        title: 'Error Accepting Trade',
        ...errorToastOptions,
      })
    },
  })

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const { mutateAsync: declineTrade, isLoading: isDeclining } = mutation<
    void,
    { tradeID: string }
  >({
    mutationFn: () =>
      axios({
        url: `/api/v3/trades/decline/${tradeid}`,
        method: POST,
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(tradeResolutionEffectedQueries)
      toast({
        title: 'Trade Declined',
        ...successToastOptions,
      })
      router.push('/trade')
    },
    onError: () => {
      toast({
        title: 'Error Declining Trade',
        ...errorToastOptions,
      })
    },
  })

  const { payload: tradeInformation, isLoading: tradeInformationIsLoading } =
    query<TradeDetails[]>({
      queryKey: ['trade', tradeid],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/trades/${tradeid}`,
        }),
      enabled: !!tradeid,
    })

  const { payload: cardsInTrades, isLoading: cardsInTradesLoading } = query<
    DuplicateCardsIntrades[]
  >({
    queryKey: ['check-pending-trades', tradeid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/trades/checkPendingTrades?id=${tradeid}&userID=${session?.userId}&cards=${tradeInformation
          ?.map((card) => card.cardID)
          .join(',')}`,
      }),
    enabled: !!tradeid && !!tradeInformation && tradeInformation.length > 0,
  })

  const {
    initiatorCards,
    initiatorCardsInfo,
    recipientCards,
    recipientCardsInfo,
  }: {
    initiatorCards: TradeDetails[]
    initiatorCardsInfo: Record<string, number>
    recipientCards: TradeDetails[]
    recipientCardsInfo: Record<string, number>
  } = useMemo(() => {
    if (tradeInformationIsLoading || tradeInformation.length === 0) {
      return {
        initiatorCards: [],
        recipientCards: [],
        initiatorCardsInfo: {},
        recipientCardsInfo: {},
      }
    }

    const tempInitiatorCards = []
    const tempRecipientCards = []
    const tempInitiatorCounts: Record<string, number> = {}
    const tempRecipientCounts: Record<string, number> = {}

    tradeInformation?.forEach((tradeDetail) => {
      if (tradeDetail.fromID == tradeDetail.initiatorID) {
        tempInitiatorCards.push(tradeDetail)
        tempInitiatorCounts[tradeDetail.card_rarity] =
          (tempInitiatorCounts[tradeDetail.card_rarity] || 0) + 1
      } else {
        tempRecipientCards.push(tradeDetail)
        tempRecipientCounts[tradeDetail.card_rarity] =
          (tempRecipientCounts[tradeDetail.card_rarity] || 0) + 1
      }
    })

    return {
      initiatorCards: tempInitiatorCards,
      recipientCards: tempRecipientCards,
      initiatorCardsInfo: tempInitiatorCounts,
      recipientCardsInfo: tempRecipientCounts,
    }
  }, [tradeInformation, tradeInformationIsLoading])

  const { payload: loggedInUser, isLoading: loggedInUserIsLoading } =
    query<UserData>({
      queryKey: ['baseUser', session?.token],
      queryFn: () =>
        axios({
          method: GET,
          url: '/api/v3/user',
          headers: { Authorization: `Bearer ${session?.token}` },
        }),
      enabled: loggedIn,
    })

  const { payload: initiatorUser } = query<UserData>({
    queryKey: ['user', initiatorCards[0]?.fromID],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/user/${initiatorCards[0]?.fromID}`,
      }),
    enabled: initiatorCards.length > 0,
  })

  const { payload: recipientUser } = query<UserData>({
    queryKey: ['user', recipientCards[0]?.fromID],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/user/${recipientCards[0]?.fromID}`,
      }),
    enabled: recipientCards.length > 0,
  })

  return (
    <PageWrapper>
      <Breadcrumb
        spacing="4px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/trade?tab=view-trade">Trade</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Current Trade</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {isVisible && (
        <IconButton
          aria-label="Scroll to top"
          icon={<ChevronUpIcon />}
          size="sm"
          colorScheme="teal"
          onClick={scrollToTop}
          position="fixed"
          bottom="10"
          right="4"
          zIndex="1000"
        />
      )}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-secondary">
                Trade #{tradeid}
              </h1>
              {!tradeInformationIsLoading &&
                tradeInformation[0]?.trade_status && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full">
                    <Badge
                      variant="outline"
                      colorScheme={
                        tradeInformation[0].trade_status === 'COMPLETE'
                          ? 'green'
                          : tradeInformation[0].trade_status === 'PENDING'
                            ? 'yellow'
                            : 'red'
                      }
                    >
                      {tradeInformation[0].trade_status}
                    </Badge>
                  </span>
                )}
            </div>
            {!tradeInformationIsLoading && tradeInformation[0]?.create_date && (
              <p className="text-sm text-secondary">
                Trade Date: {formatDateTime(tradeInformation[0].create_date)}
              </p>
            )}
          </div>

          <AuthGuard>
            {!loggedInUserIsLoading &&
              !tradeInformationIsLoading &&
              tradeInformation[0]?.trade_status === 'PENDING' && (
                <div className="flex gap-3">
                  {loggedInUser?.uid &&
                    loggedInUser.uid == recipientUser?.uid && (
                      <Button
                        isDisabled={isAccepting || isDeclining}
                        colorScheme="green"
                        size={['md', 'lg']}
                        onClick={() => acceptTrade({ tradeID: tradeid })}
                        _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
                        transition="all 0.2s"
                        width={['full', 'auto']}
                      >
                        Accept Trade
                      </Button>
                    )}
                  {loggedInUser?.uid &&
                    (loggedInUser.uid == initiatorUser?.uid ||
                      loggedInUser?.uid == recipientUser?.uid) && (
                      <Button
                        isDisabled={isAccepting || isDeclining}
                        colorScheme="red"
                        variant="outline"
                        size={['md', 'lg']}
                        onClick={() => declineTrade({ tradeID: tradeid })}
                        _hover={{ bg: 'red.50' }}
                        width={['full', 'auto']}
                      >
                        Decline Trade
                      </Button>
                    )}
                </div>
              )}
          </AuthGuard>
        </div>

        <div className="hidden sm:flex gap-8">
          <TradeSection
            title={recipientUser?.username}
            cards={initiatorCards}
            cardsInfo={initiatorCardsInfo}
            cardsInTrades={cardsInTrades}
            cardsInTradesLoading={cardsInTradesLoading}
            loggedInID={loggedInUser?.uid}
          />
          <div className="flex items-center">
            <div className="h-full w-px bg-gray-200" />
          </div>
          <TradeSection
            title={initiatorUser?.username}
            cards={recipientCards}
            cardsInfo={recipientCardsInfo}
            cardsInTrades={cardsInTrades}
            cardsInTradesLoading={cardsInTradesLoading}
            loggedInID={loggedInUser?.uid}
          />
        </div>

        {/* Mobile View */}
        <div className="flex flex-col gap-6 sm:hidden">
          <TradeSection
            id="initiator-cards"
            title={recipientUser?.username}
            cards={initiatorCards}
            cardsInfo={initiatorCardsInfo}
            cardsInTrades={cardsInTrades}
            cardsInTradesLoading={cardsInTradesLoading}
            loggedInID={loggedInUser?.uid}
          />
          <TradeSection
            id="recipient-cards"
            title={initiatorUser?.username}
            cards={recipientCards}
            cardsInfo={recipientCardsInfo}
            cardsInTrades={cardsInTrades}
            cardsInTradesLoading={cardsInTradesLoading}
            loggedInID={loggedInUser?.uid}
          />
        </div>
      </div>
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { tradeid } = query

  return {
    props: {
      tradeid,
    },
  }
}
