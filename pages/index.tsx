import { PageWrapper } from '@components/common/PageWrapper'
import DiscordWidget from '@components/widgets/DiscordWidget'
import axios from 'axios'
import config from 'lib/config'
import { NextPageContext } from 'next'
import { dehydrate, QueryClient } from 'react-query'
import {
  UserCollection,
  UserPacks,
  UserMostCards,
  ListResponse,
} from './api/v3'
import { query } from './api/database/query'
import { GET } from '@constants/http-methods'
import MostCardsTable from '@components/tables/MostCardsTable'
import { Carousel } from '@components/carousel/Carousel'
import { useMemo } from 'react'
import { TradeCard } from './api/v3/trades/collection/[uid]'
import { useSession } from 'contexts/AuthContext'
import { UserData } from './api/v3/user'
import { Alert, AlertIcon, Link } from '@chakra-ui/react'

export default () => {
  const { session, loggedIn, handleLogout } = useSession()

  const { payload, isLoading } = query<UserMostCards[]>({
    queryKey: ['most-cards'],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/user/most-cards`,
      }),
  })

  const { payload: packs, isLoading: packsLoading } = query<UserCollection[]>({
    queryKey: ['last-five-packs'],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/cards/last-five-packs`,
      }),
  })

  const { payload: user, isLoading: isLoadingUser } = query<UserData>({
    queryKey: ['baseUser', session?.token],
    queryFn: () =>
      axios({
        url: '/api/v3/user',
        method: GET,
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    enabled: loggedIn,
  })

  const { payload: pendingTrades, isLoading: isLoadingPendingTrades } = query<
    ListResponse<TradeCard>
  >({
    queryKey: ['pending-trades', String(user?.uid)],
    queryFn: () =>
      axios({
        method: 'GET',
        url: `/api/v3/trades?username=${user?.uid}&status=PENDING`,
      }),
    enabled: !!user?.uid,
  })

  const limitedCards = useMemo(
    () => (packs?.length ? packs.slice(0, 30) : []),
    [packs]
  )
  return (
    <PageWrapper>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Ice Level {user && `${user.username}`}
        </h1>
        {user && pendingTrades?.total > 0 && (
          <Alert className="text-black text-xl" status="info">
            <AlertIcon />
            <Link href={`/trade`}>
              Welcome back {user.username}, you have {pendingTrades.total}{' '}
              pending trades{' '}
            </Link>
          </Alert>
        )}

        <div>
          <Carousel cards={limitedCards} isLoading={packsLoading} />
        </div>
        <div className="bg-primary shadow-md rounded-lg p-6">
          <h2 className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
            Most Cards Collected
          </h2>
          <MostCardsTable data={payload} isLoading={isLoading} />
        </div>
        <div className="bg-primary shadow-md rounded-lg p-6">
          <h2 className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
            Join Our Community
          </h2>
          <DiscordWidget />
        </div>
      </div>
    </PageWrapper>
  )
}

export async function getServerSideProps({ req }: NextPageContext) {
  const queryClient = new QueryClient()
  const userId = req?.headers.cookie?.replace(`${config.userIDCookieName}=`, '')

  if (userId) {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
  }

  return { props: {} }
}
