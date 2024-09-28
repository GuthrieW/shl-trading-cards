import { Button, useDisclosure } from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import TradesDrawer from '@components/drawers/TradesDrawer'
import Autocomplete from '@components/forms/Autocomplete'
import NewTrade from '@components/trades/NewTrade'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default () => {
  const { session, loggedIn } = useSession()
  const tradesDrawer = useDisclosure()
  const router = useRouter()

  const [tradePartnerUid, setTradePartnerUid] = useState<number>(null)
  const [cardID, setCardID] = useState<number | null>(null)

  const { payload: loggedInUser } = query<UserData>({
    queryKey: ['baseUser', session?.token],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/user',
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    enabled: loggedIn,
  })

  useEffect(() => {
    const { partnerId, cardID } = router.query
    if (partnerId && typeof partnerId === 'string') {
      setTradePartnerUid(parseInt(partnerId))
    }
    if (cardID && typeof cardID === 'string') {
      setCardID(parseInt(cardID))
    }
  }, [router.query])
  return (
    <PageWrapper>
      <p>Trade Home</p>
      <Button onClick={tradesDrawer.onOpen}>My Trades</Button>
      <Autocomplete
        label="Trade Partner"
        onSelect={(newValue) => {
          setTradePartnerUid(parseInt(newValue))
        }}
      />
      {loggedInUser && tradePartnerUid && (
        <NewTrade
          loggedInUser={loggedInUser}
          tradePartnerUid={String(tradePartnerUid)}
          cardID={cardID}
        />
      )}
      <TradesDrawer
        onClose={tradesDrawer.onClose}
        isOpen={tradesDrawer.isOpen}
      />
    </PageWrapper>
  )
}
