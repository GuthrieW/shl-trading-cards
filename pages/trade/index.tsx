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
  const [resetTradeCards, setResetTradeCards] = useState<boolean>(false)

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
    } else {
      setTradePartnerUid(null)
    }
    if (cardID && typeof cardID === 'string') {
      setCardID(parseInt(cardID))
    } else {
      setCardID(null)
    }
  }, [router.query])

  const handleResetTradeCards = () => {
    setResetTradeCards(true)
  }

  return (
    <PageWrapper>
      <p>Trade Home</p>
      <Button onClick={tradesDrawer.onOpen}>My Trades</Button>
      <Autocomplete
        label="Trade Partner"
        onSelect={(newValue) => {
          setTradePartnerUid(parseInt(newValue))
          handleResetTradeCards() 
        }}
      />
      {loggedInUser && tradePartnerUid && (
        <NewTrade
          loggedInUser={loggedInUser}
          tradePartnerUid={String(tradePartnerUid)}
          cardID={cardID}
          resetTradeCards={resetTradeCards}
          setResetTradeCards={setResetTradeCards}
        />
      )}
      <TradesDrawer
        onClose={tradesDrawer.onClose}
        isOpen={tradesDrawer.isOpen}
      />
    </PageWrapper>
  )
}
