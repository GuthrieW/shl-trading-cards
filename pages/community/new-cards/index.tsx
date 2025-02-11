import { PageWrapper } from '@components/common/PageWrapper'
import axios from 'axios'
import config from 'lib/config'
import { ListResponse } from '../../api/v3'
import { query } from '../../api/database/query'
import { GET } from '@constants/http-methods'
import NewestCards from '@components/tables/NewestCards'
import { CARDS_TABLE } from '@components/tables/tableBehaviorFlags'
import { useCookie } from '@hooks/useCookie'

export default () => {
  const [uid] = useCookie(config.userIDCookieName)
  const { payload: latestCards, isLoading: isLoadingLatestCards } = query<
    ListResponse<Card>
  >({
    queryKey: ['cards'],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/cards',
        params: {
          limit: 200,
          date_approved: 'true',
          sortColumn: 'date_approved',
          sortDirection: 'DESC',
        },
      }),
  })
  return (
    <PageWrapper>
      <div className="bg-primary shadow-md rounded-lg p-6">
        <h2 className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
          Newest 200 Cards Created
        </h2>
        <NewestCards
          data={latestCards}
          isLoading={isLoadingLatestCards}
          BehaviorFlag={CARDS_TABLE}
          uid={uid}
        />
      </div>
    </PageWrapper>
  )
}
