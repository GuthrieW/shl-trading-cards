import { useSession } from 'contexts/AuthContext'
import { Badge, Card, CardBody, CardHeader, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { query } from '@pages/api/database/query'
import { UserData } from '@pages/api/v3/user'
import { GET } from '@constants/http-methods'

export const TradeCard = ({ trade }: { trade: Trade }) => {
  const { session } = useSession()
  const router = useRouter()
  const otherUserId =
    trade.initiatorID === parseInt(session?.userId)
      ? trade.recipientID
      : trade.initiatorID

  const { payload, isLoading } = query<UserData>({
    queryKey: ['user', String(otherUserId)],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/user/${otherUserId}`,
      }),
  })

  return (
    <Card
      className="cursor-pointer hover:bg-secondary transition-colors"
      key={trade?.tradeID}
      onClick={() => router.push(`/trade/${trade.tradeID}`)}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <CardHeader>
            #{trade?.tradeID} - {payload.username}
          </CardHeader>
          <CardBody>
            <div className="flex flex-row justify-between items-center">
              <Badge
                variant="outline"
                colorScheme={
                  trade.trade_status === 'COMPLETE'
                    ? 'green'
                    : trade.trade_status === 'PENDING'
                      ? 'yellow'
                      : 'red'
                }
              >
                {trade.trade_status}
              </Badge>
            </div>
          </CardBody>
        </>
      )}
    </Card>
  )
}
