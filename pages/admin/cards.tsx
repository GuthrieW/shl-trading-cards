import {
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import { GET } from '@constants/http-methods'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'
import { query } from '@pages/api/database/query'
import axios from 'axios'

export default () => {
  const { isCheckingAuthentication } = useRedirectIfNotAuthenticated()
  const { isCheckingAuthorization } = useRedirectIfNotAuthorized({
    roles: ['TRADING_CARD_ADMIN', 'TRADING_CARD_TEAM'],
  })

  const LOADING_TABLE_DATA = {
    cards: Array.from({ length: 10 }, (_, index) => ({})),
  }

  const { payload, isLoading, refetch } = query<{
    cards: Card[]
    total: number
  }>({
    queryKey: 'cards',
    queryFn: () =>
      axios({
        method: GET,
        url: '',
        params: {},
      }),
  })

  return (
    <PageWrapper className="h-full flex flex-col justify-center items-center w-11/12 md:w-3/4">
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {(isLoading ? LOADING_TABLE_DATA : payload.cards).map((card) => (
              <Tr key={card.id}>
                <Skeleton isLoaded={!isLoading}>
                  <Td>{}</Td>
                </Skeleton>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </PageWrapper>
  )
}
