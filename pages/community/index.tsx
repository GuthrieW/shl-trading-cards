import { PageWrapper } from '@components/common/PageWrapper'
import UserTables from '@components/tables/user-table'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse } from '@pages/api/v3'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

export default () => {
  const { session } = useSession()
  const [usernameSearch, setUsernameSearch] = useState<string>('')
  const [debouncedUsername] = useDebounce(usernameSearch, 500)

  const { payload } = query<ListResponse<UserData>>({
    queryKey: ['with-cards'],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/user/with-cards',
        headers: { Authorization: `Bearer ${session?.token}` },
        params: {
          username: debouncedUsername?.length >= 3 ? debouncedUsername : '',
        },
      }),
  })

  return (
    <PageWrapper>
      <p>Collect Home</p>
      <UserTables />
    </PageWrapper>
  )
}
