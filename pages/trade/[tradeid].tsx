import {
  Alert,
  AlertIcon,
  Badge,
  Button,
  SimpleGrid,
  Tooltip,
  useToast,
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

  const {
    initiatorCards,
    recipientCards,
  }: { initiatorCards: TradeDetails[]; recipientCards: TradeDetails[] } =
    useMemo(() => {
      if (tradeInformationIsLoading || tradeInformation.length === 0) {
        return { initiatorCards: [], recipientCards: [] }
      }

      const tempInitiatorCards = []
      const tempRecipientCards = []

      tradeInformation?.forEach((tradeDetail) => {
        if (tradeDetail.fromID == tradeDetail.initiatorID) {
          tempInitiatorCards.push(tradeDetail)
        } else {
          tempRecipientCards.push(tradeDetail)
        }
      })

      return {
        initiatorCards: tempInitiatorCards,
        recipientCards: tempRecipientCards,
      }
    }, [tradeInformation])

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
            title={initiatorUser?.username}
            cards={initiatorCards}
            loggedInID={loggedInUser?.uid}
          />
          <div className="flex items-center">
            <div className="h-full w-px bg-gray-200" />
          </div>
          <TradeSection
            title={recipientUser?.username}
            cards={recipientCards}
            loggedInID={loggedInUser?.uid}
          />
        </div>

        {/* Mobile View */}
        <div className="flex flex-col gap-6 sm:hidden">
          <TradeSection
            id="initiator-cards"
            title={initiatorUser?.username}
            cards={initiatorCards}
            loggedInID={loggedInUser?.uid}
          />
          <TradeSection
            id="recipient-cards"
            title={recipientUser?.username}
            cards={recipientCards}
            loggedInID={loggedInUser?.uid}
          />
        </div>
      </div>
    </PageWrapper>
  )
}

const TradeSection = ({
  id,
  title,
  cards,
  loggedInID = 0,
}: {
  id?: string
  title: string
  cards: TradeDetails[]
  loggedInID?: number
}) => {
  const { initiatorAlerts, recipientAlerts } = useMemo(() => {
    const initiatorLastCopy = new Set<number>()
    const initiatorAlreadyOwn = new Set<number>()
    const recipientLastCopy = new Set<number>()
    const recipientAlreadyOwn = new Set<number>()

    const cardQuantities = new Map<
      number,
      {
        initiatorTrading: number
        recipientTrading: number
        initiatorOwned: number
        recipientOwned: number
      }
    >()

    cards.forEach((card) => {
      const existing = cardQuantities.get(card.cardID)
      if (existing) {
        existing.initiatorTrading += card.initiatorID === card.fromID ? 1 : 0
        existing.recipientTrading += card.recipientID === card.fromID ? 1 : 0
      } else {
        cardQuantities.set(card.cardID, {
          initiatorTrading: card.initiatorID === card.fromID ? 1 : 0,
          recipientTrading: card.recipientID === card.fromID ? 1 : 0,
          initiatorOwned: card.initiator_quantity,
          recipientOwned: card.recipient_quantity,
        })
      }
    })
    console.log('cardQuantities', cardQuantities)

    cardQuantities.forEach((quantities, cardID) => {
      if (
        quantities.initiatorOwned > 0 &&
        quantities.initiatorOwned === quantities.initiatorTrading
      ) {
        initiatorLastCopy.add(cardID)
      }
      if (quantities.recipientTrading > 0 && quantities.initiatorOwned > 0) {
        initiatorAlreadyOwn.add(cardID)
      }

      if (
        quantities.recipientOwned > 0 &&
        quantities.recipientOwned === quantities.recipientTrading
      ) {
        recipientLastCopy.add(cardID)
      }
      if (quantities.initiatorTrading > 0 && quantities.recipientOwned > 0) {
        recipientAlreadyOwn.add(cardID)
      }
    })
    return {
      initiatorAlerts: initiatorLastCopy,
      recipientAlerts: {
        lastCopy: recipientLastCopy,
        alreadyOwn: recipientAlreadyOwn,
      },
    }
  }, [cards])

  return (
    <div
      id={id}
      className="flex-1 bg-primary rounded-xl shadow-lg overflow-hidden"
    >
      <div className="bg-primary shadow-sm">
        <div className="text-xl text-secondary text-center">{title} trades</div>
      </div>

      <SimpleGrid
        columns={{ base: 2, sm: 2, md: 3 }}
        spacing={4}
        className="p-6"
      >
        {cards.map((card) => (
          <div
            key={card.ownedcardid}
            className="relative group flex flex-col items-center transition-all duration-200 max-w-xs sm:max-w-sm aspect-[3/4]"
          >
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                alt={`Card`}
                loading="lazy"
                fill
                sizes="(max-width: 768px) 100vw, 256px"
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
              {loggedInID > 0 && card.trade_status === 'PENDING' && (
                <Tooltip label="# of card(s) you own" placement="top">
                  <Badge
                    position="absolute"
                    top="-2"
                    right="-2"
                    zIndex="10"
                    borderRadius="full"
                    px="2"
                    py="1"
                    fontSize="xs"
                    fontWeight="bold"
                    bg="teal.700"
                    color="white"
                    border="1px solid white"
                    boxShadow="0 0 4px rgba(0,0,0,0.4)"
                  >
                    {loggedInID === card.initiatorID
                      ? card.initiator_quantity
                      : card.recipient_quantity}
                  </Badge>
                </Tooltip>
              )}
            </div>
            {loggedInID > 0 && card.trade_status === 'PENDING' && (
              <>
                {loggedInID === card.initiatorID &&
                  initiatorAlerts.has(card.cardID) && (
                    <Alert
                      status="warning"
                      variant="subtle"
                      mt="2"
                      className="!bg-primary"
                    >
                      <AlertIcon boxSize="12px" mr="1" />
                      <span className="text-xs">
                        You are trading away your last copy
                      </span>
                    </Alert>
                  )}

                {loggedInID === card.recipientID &&
                  recipientAlerts.alreadyOwn.has(card.cardID) && (
                    <Alert
                      status="info"
                      variant="subtle"
                      mt="2"
                      className="!bg-primary"
                    >
                      <AlertIcon boxSize="12px" mr="1" />
                      <span className="text-xs">You already own this card</span>
                    </Alert>
                  )}

                {loggedInID !== card.recipientID &&
                  recipientAlerts.lastCopy.has(card.cardID) && (
                    <Alert
                      status="warning"
                      variant="subtle"
                      mt="2"
                      className="!bg-primary"
                    >
                      <AlertIcon boxSize="12px" mr="1" />
                      <span className="text-xs">
                        They are trading away their last copy
                      </span>
                    </Alert>
                  )}
              </>
            )}
          </div>
        ))}
      </SimpleGrid>
    </div>
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
