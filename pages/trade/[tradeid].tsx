// View a specific trade, accept or decline if pending

import { PageWrapper } from '@components/common/PageWrapper'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import axios from 'axios'
import { useRouter } from 'next/router'

export default () => {
  const router = useRouter()
  const tradeid = router.query.tradeid as string

  const { payload: tradeInformation, isLoading } = query({
    queryKey: ['trade', tradeid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/trades/${tradeid}`,
      }),
    enabled: !!tradeid,
  })

  return (
    <PageWrapper>
      <p>Trade #{tradeid}</p>
    </PageWrapper>
  )
}
