// View a specific trade, accept or decline if pending

import { Button, Image, SimpleGrid, useToast } from '@chakra-ui/react'
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

export default () => {
  const toast = useToast()
  const { session, loggedIn } = useSession()
  const router = useRouter()
  const tradeid = router.query.tradeid as string
  const queryClient = useQueryClient()
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
      router.push('/trades')
    },
    onError: () => {
      toast({
        title: 'Error Accepting Trade',
        ...errorToastOptions,
      })
    },
  })

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
      router.push('/trades')
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
      <div className="flex flex-row justify-between items-center">
        <p>Trade #{tradeid}</p>
        <AuthGuard>
          {!loggedInUserIsLoading && (
            <div>
              {loggedInUser?.uid && loggedInUser.uid == recipientUser?.uid && (
                <Button
                  disabled={isAccepting || isDeclining}
                  className="mx-1"
                  onClick={() => acceptTrade({ tradeID: tradeid })}
                >
                  Accept
                </Button>
              )}
              {loggedInUser?.uid &&
                (loggedInUser.uid == initiatorUser?.uid ||
                  loggedInUser?.uid == recipientUser?.uid) && (
                  <Button
                    disabled={isAccepting || isDeclining}
                    className="mx-1"
                    onClick={() => declineTrade({ tradeID: tradeid })}
                  >
                    Decline
                  </Button>
                )}
            </div>
          )}
        </AuthGuard>
      </div>

      <div className="flex flex-row">
        <div className="w-1/2 border-r">
          <p>{initiatorUser?.username}</p>
          <SimpleGrid columns={3} className="m-2">
            {initiatorCards.map((card) => (
              <div className="m-2" key={card.ownedcardid}>
                <Image
                  className="cursor-pointer"
                  src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                  fallback={
                    <div className="relative z-10">
                      <Image src="/cardback.png" />
                      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                    </div>
                  }
                />
              </div>
            ))}
          </SimpleGrid>
        </div>
        <div className="w-1/2">
          <p>{recipientUser?.username}</p>
          <SimpleGrid columns={3} className="m-2">
            {recipientCards.map((card) => (
              <div className="m-2" key={card.ownedcardid}>
                <Image
                  className="cursor-pointer"
                  src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                  fallback={
                    <div className="relative z-10">
                      <Image src="/cardback.png" />
                      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                    </div>
                  }
                />
              </div>
            ))}
          </SimpleGrid>
        </div>
      </div>
    </PageWrapper>
  )
}
