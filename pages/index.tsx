import { PageWrapper } from '@components/common/PageWrapper'
import DiscordWidget from '@components/widgets/DiscordWidget'
import axios from 'axios'
import config from 'lib/config'
import { NextPageContext } from 'next'
import { dehydrate, QueryClient } from 'react-query'
import { UserCollection, UserMostCards, ListResponse } from './api/v3'
import { query } from './api/database/query'
import { GET } from '@constants/http-methods'
import MostCardsTable from '@components/tables/MostCardsTable'
import { Carousel } from '@components/carousel/Carousel'
import { useMemo } from 'react'
import { useSession } from 'contexts/AuthContext'
import { UserData } from './api/v3/user'
import {
  Alert,
  AlertIcon,
  Badge,
  Button,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import NewestCards from '@components/tables/NewestCards'
import { HOME_CARDS_TABLE_NO_FILTER } from '@components/tables/tableBehaviorFlags'
import router from 'next/router'
import { BellIcon } from '@chakra-ui/icons'

export default () => {
  const { session, loggedIn, handleLogout } = useSession()

  const { payload, isLoading } = query<UserMostCards[]>({
    queryKey: ['most-cards'],
    queryFn: () =>
      axios({
        method: GET,
        data: { limit: 10 },
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

  const limitedCards = useMemo(
    () => (packs?.length ? packs.slice(0, 30) : []),
    [packs]
  )

  const { payload: latestCards, isLoading: isLoadingLatestCards } = query<
    ListResponse<Card>
  >({
    queryKey: ['cards'],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/cards',
        params: {
          limit: 15,
          date_approved: 'true',
          sortColumn: 'date_approved',
          sortDirection: 'DESC',
        },
      }),
  })

  return (
    <PageWrapper>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome to Ice Level {user?.username}
        </h1>

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
            Newest Cards
          </h2>
          <NewestCards
            data={latestCards}
            isLoading={isLoadingLatestCards}
            BehaviorFlag={HOME_CARDS_TABLE_NO_FILTER}
            uid={String(user?.uid)}
          />
          <Button
            mt={4}
            className="w-full bg-blue-500 !hover:bg-blue-600 hover:shadow-xl text-secondary font-bold py-2 px-4 rounded text-sm sm:text-xs"
            onClick={() => router.push('/community/new-cards')}
          >
            See All New Cards
          </Button>
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
